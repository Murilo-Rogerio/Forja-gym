let aiDraft = null, aiBusy = false;

/* Chamada oficial à API Gemini */
async function geminiCall(prompt, wantJson){
  const key = state.settings.gemini;
  if(!key) return null;
  const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
  for(const m of models){
    try{
      const body = { contents:[{ parts:[{ text: prompt }] }] };
      if(wantJson) body.generationConfig = { responseMimeType:'application/json', temperature:.7 };
      const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models/'+m+':generateContent?key='+encodeURIComponent(key),
        { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
      if(!r.ok) continue;
      const d = await r.json();
      const parts = d && d.candidates && d.candidates[0] && d.candidates[0].content && d.candidates[0].content.parts;
      const t = parts ? parts.map(function(p){ return p.text || ''; }).join('') : '';
      if(t) return t;
    }catch(e){}
  }
  return null;
}

function extractJSON(text){
  if(!text) return null;
  const t = text.trim().replace(/```json|```/g, '');
  try{ return JSON.parse(t); }catch(e){}
  const a = t.indexOf('{'), b = t.lastIndexOf('}');
  if(a >= 0 && b > a){ try{ return JSON.parse(t.slice(a, b+1)); }catch(e){} }
  const a2 = t.indexOf('['), b2 = t.lastIndexOf(']');
  if(a2 >= 0 && b2 > a2){ try{ return JSON.parse(t.slice(a2, b2+1)); }catch(e){} }
  return null;
}

function matchExercise(name, group){
  const n = normTxt(name);
  if(!n) return null;
  let best = null;
  for(const e of state.library){
    const en = normTxt(e.name);
    if(en === n) return e;
    if(en.includes(n) || n.includes(en)){
      if(!best || e.name.length < best.name.length) best = e;
    }
  }
  if(best) return best;
  const valid = ['Peito','Costas','Pernas','Ombros','Braços','Core'];
  const g = valid.includes(group) ? group : 'Braços';
  const custom = { id:'ex-c-'+uid(), name: String(name).slice(0,60), group: g, custom: true };
  state.library.push(custom);
  return custom;
}

/* Normalização de plano gerado por IA */
function normalizeAIPlan(raw){
  const arr = Array.isArray(raw && raw.programa) ? raw.programa : (Array.isArray(raw) ? raw : null);
  if(!arr) return null;
  const out = [];
  for(const f of arr.slice(0, 8)){
    const name = String(f.nome || f.name || '').slice(0, 60).trim();
    if(!name) continue;
    const exs = [];
    const list = Array.isArray(f.exercicios || f.exercises) ? (f.exercicios || f.exercises) : [];
    for(const ex of list.slice(0, 8)){
      const lib = matchExercise(ex.nome || ex.name || '', ex.grupo || ex.group || '');
      if(!lib) continue;
      const sets = [];
      const rawSets = Array.isArray(ex.series || ex.sets) ? (ex.series || ex.sets) : [];
      for(const st of rawSets.slice(0, 8)){
        const type = ['work','prep','warm'].includes(st.tipo || st.type) ? (st.tipo || st.type) : 'work';
        const reps = Math.min(30, Math.max(1, parseInt(st.reps || st.repsTarget || 10, 10) || 10));
        sets.push({ type: type, reps: reps });
      }
      if(!sets.length) sets.push({ type:'work', reps: 10 });
      const rest = Math.min(300, Math.max(15, parseInt(ex.descanso || ex.rest || 90, 10) || 90));
      const rpe = Math.min(10, Math.max(5, parseInt(ex.rpe || 8, 10) || 8));
      if(!exs.some(function(x){ return x.exId === lib.id; })) exs.push({ exId: lib.id, rpe: rpe, rest: rest, sets: sets });
    }
    if(exs.length) out.push({ id: null, name: name, split: String(f.divisao || f.split || 'Livre').slice(0,20), ex: exs });
  }
  return out.length ? out : null;
}

/* Gerador local de programa (offline-first) */
function localGeneratePlan(goal, days, place, level){
  const splits = {
    '2':[['Superiores','Upper'],['Inferiores','Lower']],
    '3':[['Peito, Ombros, Tríceps','Costas e Bíceps','Pernas Completo']],
    '4':[['Peito e Tríceps','Costas e Bíceps','Pernas Completo','Ombros e Core']],
    '5':[['Peito e Tríceps','Costas e Bíceps','Pernas A','Ombros e Core','Pernas B']],
    '6':[['Peito e Tríceps','Costas e Bíceps','Pernas A','Ombros e Core','Pernas B','Full Body']]
  };
  const groupsByDay = {
    'Peito, Ombros, Tríceps':['Peito','Ombros','Braços'],
    'Costas e Bíceps':['Costas','Braços'],
    'Pernas Completo':['Pernas','Pernas','Core'],
    'Peito e Tríceps':['Peito','Braços'],
    'Ombros e Core':['Ombros','Core'],
    'Pernas A':['Pernas','Core'],
    'Pernas B':['Pernas','Core'],
    'Superiores':['Peito','Costas','Ombros','Braços'],
    'Inferiores':['Pernas','Pernas','Core'],
    'Full Body':['Peito','Costas','Pernas','Ombros']
  };
  const cfg = {
    forca:{ reps:[3,6], rest:180, sets:4 },
    hipertrofia:{ reps:[8,12], rest:90, sets:4 },
    emagrecimento:{ reps:[12,15], rest:60, sets:3 },
    condicionamento:{ reps:[15,20], rest:45, sets:3 }
  };
  const c = cfg[goal] || cfg.hipertrofia;
  const names = splits[String(Math.min(6, Math.max(2, days)))] || splits['3'];
  const letters = 'ABCDEF';
  const out = [];

  names[0].forEach(function(dayName, i){
    const groups = groupsByDay[dayName] || ['Peito','Braços'];
    const used = [], exs = [];
    groups.forEach(function(g){
      const pool = state.library.filter(function(e){ return e.group === g && !used.includes(e.id); });
      pool.slice(0, 2).forEach(function(lib, k){
        used.push(lib.id);
        const sets = [];
        if(exs.length === 0 && k === 0) sets.push({ type:'warm', reps: Math.min(20, c.reps[1]+4) });
        for(let s=0; s<c.sets; s++) sets.push({ type:'work', reps: c.reps[0] + Math.round(Math.random()*(c.reps[1]-c.reps[0])) });
        exs.push({ exId: lib.id, rpe: 8, rest: c.rest, sets: sets });
      });
    });
    out.push({ id: null, name: 'Treino ' + letters[i] + ' — ' + dayName, split: 'Auto', ex: exs.slice(0, 6) });
  });
  return out;
}

/* Sugestão de exercícios com IA para uma ficha no editor */
async function aiSuggestForWorkout(workoutName, currentExIds, userPrompt){
  const curLibs = currentExIds.map(libById).filter(Boolean);
  const curNames = curLibs.map(function(e){ return e.name + ' (' + e.group + ')'; }).join(', ');
  
  if(state.settings.gemini){
    const prompt = 'Você é um treinador de elite especialista em musculação e biomecânica. ' +
      'O atleta está montando a ficha: "' + (workoutName || 'Meu Treino') + '".\n' +
      'Exercícios já adicionados: ' + (curNames || 'nenhum até agora') + '.\n' +
      'Pedido do atleta: "' + (userPrompt || 'Sugira exercícios complementares ideais para fechar este treino com perfeição') + '".\n' +
      'Responda SOMENTE em JSON válido com esta estrutura exata:\n' +
      '{"nomeFicha":"Treino sugerido","exercicios":[{"nome":"Nome do Exercicio","grupo":"Peito|Costas|Pernas|Ombros|Braços|Core","series":[{"tipo":"warm","reps":15},{"tipo":"work","reps":10},{"tipo":"work","reps":10},{"tipo":"work","reps":10}],"descanso":90,"rpe":8,"motivo":"Explicação curta"}]}\n' +
      'Regras: Sugira de 3 a 5 exercícios que complementem o volume e ângulos musculares. ' +
      '"tipo" de série pode ser "warm" (aquecimento), "prep" (preparatória) ou "work" (válida). ' +
      '"grupo" deve ser exatamente um de: Peito, Costas, Pernas, Ombros, Braços, Core. Nomes em português brasileiro.';
    
    try{
      const raw = await geminiCall(prompt, true);
      const res = extractJSON(raw);
      if(res && Array.isArray(res.exercicios) && res.exercicios.length){
        const outEx = [];
        for(const ex of res.exercicios){
          const lib = matchExercise(ex.nome, ex.grupo);
          if(!lib) continue;
          const sets = [];
          const rawSets = Array.isArray(ex.series) ? ex.series : [];
          for(const st of rawSets){
            const type = ['work','prep','warm'].includes(st.tipo) ? st.tipo : 'work';
            sets.push({ type: type, reps: Math.min(30, Math.max(1, parseInt(st.reps||10, 10))) });
          }
          if(!sets.length){
            sets.push({ type:'warm', reps:15 });
            sets.push({ type:'work', reps:10 });
            sets.push({ type:'work', reps:10 });
          }
          outEx.push({
            exId: lib.id,
            rpe: Math.min(10, Math.max(5, parseInt(ex.rpe||8, 10))),
            rest: Math.min(300, Math.max(30, parseInt(ex.descanso||90, 10))),
            sets: sets,
            motivo: ex.motivo || ''
          });
        }
        if(outEx.length){
          return { name: res.nomeFicha || workoutName, exercises: outEx, isAI: true };
        }
      }
    }catch(e){}
  }

  // Fallback Inteligente Local
  const lowerName = (workoutName + ' ' + (userPrompt||'')).toLowerCase();
  let targetGroup = 'Peito';
  if(lowerName.includes('costa') || lowerName.includes('dorsal') || lowerName.includes('pull')) targetGroup = 'Costas';
  else if(lowerName.includes('perna') || lowerName.includes('leg') || lowerName.includes('inferior') || lowerName.includes('gluteo')) targetGroup = 'Pernas';
  else if(lowerName.includes('ombro') || lowerName.includes('deltoide')) targetGroup = 'Ombros';
  else if(lowerName.includes('braço') || lowerName.includes('biceps') || lowerName.includes('triceps')) targetGroup = 'Braços';
  else if(lowerName.includes('core') || lowerName.includes('abs') || lowerName.includes('abdomen')) targetGroup = 'Core';

  const pool = state.library.filter(function(e){ return e.group === targetGroup && !currentExIds.includes(e.id); });
  const chosen = pool.slice(0, 4);
  const outEx = chosen.map(function(lib, idx){
    const sets = [];
    if(idx === 0) sets.push({ type:'warm', reps:15 });
    sets.push({ type:'work', reps:10 });
    sets.push({ type:'work', reps:10 });
    sets.push({ type:'work', reps:10 });
    return {
      exId: lib.id,
      rpe: 8,
      rest: targetGroup === 'Pernas' ? 120 : 90,
      sets: sets,
      motivo: 'Exercício de alta ativação biomecânica para ' + lib.group
    };
  });

  return { name: workoutName || ('Treino de ' + targetGroup), exercises: outEx, isAI: false };
}

/* Coach Progressivo & Sobrecarga */
function coachSuggestionFor(exId, targetReps){
  const h = historyOf(exId);
  if(!h.length) return null;
  const last = h[h.length-1];
  const rpe = Math.round(last.rpe);
  if(rpe <= 7) return { w: +(last.w + 2.5).toFixed(1), reps: targetReps || last.r, kind:'up',
    why: 'Última: '+fmtN(last.w)+'kg × '+last.r+' @RPE '+rpe+' — execução com folga. Hora de subir a carga.' };
  if(rpe === 8) return { w: last.w, reps: Math.min(12, last.r+1), kind:'hold',
    why: 'Última: '+fmtN(last.w)+'kg × '+last.r+' @RPE '+rpe+'. Mantenha o peso e caça +1 repetição limpa.' };
  if(last.r < (targetReps || 8)) return { w: +(Math.max(2.5, last.w-2.5)).toFixed(1), reps: targetReps || last.r, kind:'down',
    why: 'Última: '+fmtN(last.w)+'kg × '+last.r+' @RPE '+rpe+' — perto do limite. Recupere a base com carga menor.' };
  return { w: last.w, reps: targetReps || last.r, kind:'hold',
    why: 'Última: '+fmtN(last.w)+'kg × '+last.r+' @RPE '+rpe+'. Repita com foco em cadência e execução impecável.' };
}
function suggestText(s){ return s ? fmtN(s.w) + ' kg × ' + s.reps + ' reps' : ''; }

function stagnationAnalysis(){
  const out = [];
  for(const ex of state.library){
    const h = historyOf(ex.id);
    if(h.length < 3) continue;
    const l3 = h.slice(-3);
    const flat = l3.every(function(x){ return x.w === l3[0].w && x.r === l3[0].r; });
    const noGain = Math.max.apply(null, l3.map(function(x){ return x.e; })) <= l3[0].e + .5;
    if(flat && noGain){
      const w = l3[0].w, r = l3[0].r;
      const deload = Math.max(2.5, Math.round(w*.9/2.5)*2.5);
      const alt = state.library.find(function(a){ return a.group === ex.group && a.id !== ex.id; });
      out.push({ ex: ex, plan: l3.length+' sessões com '+fmtN(w)+'kg × '+r+
        '. Plano: deload para '+fmtN(deload)+'kg por 2 sessões e retome '+fmtN(w)+'kg buscando '+(r+1)+' reps.' +
        (alt ? ' Alternativa: varie para '+alt.name+' por 3–4 semanas.' : '') });
    }
  }
  return out;
}

function dailyInsight(){
  const wk = weeklyStats();
  if(state.logs.length === 0) return 'Conclua seu primeiro treino para a IA começar a calcular sua progressão de cargas.';
  if(wk.count === 0) return 'Nenhum treino registrado esta semana. A constância é o que constrói um físico forjado.';
  const recent = state.logs.slice().sort(function(a,b){ return b.date-a.date; }).slice(0,2);
  const withPR = recent.find(function(l){ return l.prCount > 0; });
  if(withPR) return 'Você bateu '+withPR.prCount+' PR'+(withPR.prCount>1?'s':'')+' na última sessão ('+fmtKg(withPR.volume)+' movimentados). Excelente momentum!';
  const w = suggestedWorkout();
  if(w && w.ex[0]){
    const s = coachSuggestionFor(w.ex[0].exId, w.ex[0].sets && w.ex[0].sets[0] ? w.ex[0].sets[0].reps : 10);
    if(s){
      const nm = libById(w.ex[0].exId);
      return 'Hoje ('+w.name+'): '+(nm?nm.name:'exercício')+' — recomendo '+suggestText(s)+'.';
    }
  }
  return wk.count+' treino'+(wk.count>1?'s':'')+' esta semana, '+fmtKg(wk.volume)+' de tonelagem acumulada. Mantenha o ritmo!';
}

/* ==============================================================
   MÓDULO DE IA PARA CONTAGEM DE MACROS & MICRONUTRIENTES
   ============================================================== */

const RDA_TARGETS = {
  fiber: { name:'Fibras', unit:'g', target:30 },
  iron: { name:'Ferro', unit:'mg', target:14 },
  zinc: { name:'Zinco', unit:'mg', target:11 },
  calcium: { name:'Cálcio', unit:'mg', target:1000 },
  magnesium: { name:'Magnésio', unit:'mg', target:400 },
  potassium: { name:'Potássio', unit:'mg', target:3500 },
  sodium: { name:'Sódio', unit:'mg', target:2000 },
  vitC: { name:'Vitamina C', unit:'mg', target:90 },
  vitD: { name:'Vitamina D', unit:'mcg', target:15 },
  vitB12: { name:'Vitamina B12', unit:'mcg', target:2.4 }
};

/* Analisador de Alimentos & Micronutrientes */
async function analyzeMealWithAI(mealDescription){
  const text = (mealDescription || '').trim();
  if(!text) return null;

  if(state.settings.gemini){
    const prompt = 'Você é um nutricionista esportivo de elite. Analise os alimentos e quantidades descritos nesta refeição:\n' +
      '"' + text + '"\n\n' +
      'Estime com precisão calórica e de micronutrientes. Responda SOMENTE com JSON válido sem texto adicional:\n' +
      '{\n' +
      '  "mealName": "Nome curto da refeição",\n' +
      '  "kcal": 650,\n' +
      '  "p": 45,\n' +
      '  "c": 60,\n' +
      '  "f": 20,\n' +
      '  "fiber": 7.5,\n' +
      '  "iron": 4.2,\n' +
      '  "zinc": 3.5,\n' +
      '  "calcium": 250,\n' +
      '  "magnesium": 95,\n' +
      '  "potassium": 750,\n' +
      '  "sodium": 520,\n' +
      '  "vitC": 25,\n' +
      '  "vitD": 1.5,\n' +
      '  "vitB12": 1.8,\n' +
      '  "tip": "Dica nutricional concisa de sinergia alimentar e absorção para recuperação muscular."\n' +
      '}\n' +
      'Valores numéricos de macros em gramas (g). Ferro, Zinco, Vitamina C em mg; Cálcio, Magnésio, Potássio, Sódio em mg; Vitamina D e B12 em mcg.';
    
    try{
      const raw = await geminiCall(prompt, true);
      const res = extractJSON(raw);
      if(res && res.kcal){
        return {
          id: uid(),
          at: Date.now(),
          text: text,
          name: res.mealName || 'Refeição Analisada',
          kcal: Math.round(res.kcal),
          p: Math.round(res.p || 0),
          c: Math.round(res.c || 0),
          f: Math.round(res.f || 0),
          fiber: +(res.fiber || 0).toFixed(1),
          iron: +(res.iron || 0).toFixed(1),
          zinc: +(res.zinc || 0).toFixed(1),
          calcium: Math.round(res.calcium || 0),
          magnesium: Math.round(res.magnesium || 0),
          potassium: Math.round(res.potassium || 0),
          sodium: Math.round(res.sodium || 0),
          vitC: Math.round(res.vitC || 0),
          vitD: +(res.vitD || 0).toFixed(1),
          vitB12: +(res.vitB12 || 0).toFixed(1),
          tip: res.tip || 'Boa refeição para recuperação muscular e síntese proteica.',
          isAI: true
        };
      }
    }catch(e){}
  }

  // Analisador Local Offline com Dicionário de Alimentos Comuns
  return localEstimateMeal(text);
}

/* Estimativa Nutricional Local Offline */
function localEstimateMeal(text){
  const t = normTxt(text);
  let kcal = 0, p = 0, c = 0, f = 0, fiber = 0;
  let iron = 0, zinc = 0, calcium = 0, magnesium = 0, potassium = 0, sodium = 0, vitC = 0, vitD = 0, vitB12 = 0;

  const FOODS = [
    { k:['ovo','ovos'], kcal:75, p:6.5, c:0.6, f:5.2, iron:0.9, zinc:0.6, calcium:28, mag:6, pot:69, sod:70, vc:0, vd:1.1, vb12:0.6 },
    { k:['frango','peito de frango','file de frango'], kcal:165, p:31, c:0, f:3.6, iron:1, zinc:1, calcium:15, mag:29, pot:256, sod:74, vc:0, vd:0.1, vb12:0.3 },
    { k:['arroz','arroz branco','arroz integral'], kcal:130, p:2.7, c:28, f:0.3, fiber:1.2, iron:0.8, zinc:0.8, calcium:10, mag:25, pot:55, sod:2, vc:0, vd:0, vb12:0 },
    { k:['feijao','feijao preto','feijao carioca'], kcal:140, p:8.5, c:24, f:0.8, fiber:7.5, iron:2.8, zinc:1.2, calcium:46, mag:60, pot:420, sod:10, vc:1, vd:0, vb12:0 },
    { k:['whey','proteina em po','shake'], kcal:120, p:24, c:3, f:1.5, iron:0.5, zinc:0.8, calcium:150, mag:35, pot:160, sod:90, vc:0, vd:0.3, vb12:1.2 },
    { k:['banana'], kcal:105, p:1.3, c:27, f:0.3, fiber:3.1, iron:0.3, zinc:0.2, calcium:6, mag:32, pot:422, sod:1, vc:10, vd:0, vb12:0 },
    { k:['aveia','flocos de aveia'], kcal:150, p:5, c:27, f:2.5, fiber:4, iron:1.9, zinc:1.4, calcium:20, mag:56, pot:140, sod:2, vc:0, vd:0, vb12:0 },
    { k:['carne','patinho','carne moida'], kcal:210, p:28, c:0, f:10, iron:2.6, zinc:4.8, calcium:12, mag:24, pot:340, sod:65, vc:0, vd:0.2, vb12:2.1 },
    { k:['pao','pao integral','torrada'], kcal:130, p:5, c:24, f:1.8, fiber:2.5, iron:1.2, zinc:0.7, calcium:40, mag:22, pot:75, sod:220, vc:0, vd:0, vb12:0 },
    { k:['leite','iogurte'], kcal:110, p:6.5, c:9.5, f:3.2, iron:0.1, zinc:0.8, calcium:240, mag:24, pot:300, sod:105, vc:1, vd:1.5, vb12:0.9 },
    { k:['maca','pera'], kcal:72, p:0.4, c:19, f:0.2, fiber:3.3, iron:0.2, zinc:0.1, calcium:8, mag:7, pot:145, sod:1, vc:6, vd:0, vb12:0 },
    { k:['brocolis','salada','alface'], kcal:45, p:3.2, c:7, f:0.5, fiber:3.5, iron:1, zinc:0.5, calcium:60, mag:30, pot:310, sod:30, vc:65, vd:0, vb12:0 }
  ];

  let matched = 0;
  for(const food of FOODS){
    for(const key of food.k){
      if(t.includes(key)){
        matched++;
        // Multiplicador baseado em quantidade mencionada
        let mult = 1;
        const re = new RegExp('(\\d+)\\s*(?:g|gramas|ml|ovos|unidades)?\\s*(?:de)?\\s*' + key);
        const m = t.match(re);
        if(m && m[1]){
          const q = parseFloat(m[1]);
          if(q > 20) mult = q / 100;
          else if(q > 0) mult = q;
        }
        kcal += food.kcal * mult;
        p += food.p * mult;
        c += food.c * mult;
        f += food.f * mult;
        fiber += (food.fiber || 0) * mult;
        iron += (food.iron || 0) * mult;
        zinc += (food.zinc || 0) * mult;
        calcium += (food.calcium || 0) * mult;
        magnesium += (food.mag || 0) * mult;
        potassium += (food.pot || 0) * mult;
        sodium += (food.sod || 0) * mult;
        vitC += (food.vc || 0) * mult;
        vitD += (food.vd || 0) * mult;
        vitB12 += (food.vb12 || 0) * mult;
        break;
      }
    }
  }

  if(!matched){
    // Estimativa média genérica
    kcal = 450; p = 30; c = 45; f = 15; fiber = 4;
    iron = 2.5; zinc = 2; calcium = 120; magnesium = 60; potassium = 450; sodium = 380;
    vitC = 12; vitD = 0.5; vitB12 = 1.0;
  }

  return {
    id: uid(),
    at: Date.now(),
    text: text,
    name: text.slice(0, 35) + (text.length > 35 ? '...' : ''),
    kcal: Math.round(kcal),
    p: Math.round(p),
    c: Math.round(c),
    f: Math.round(f),
    fiber: +fiber.toFixed(1),
    iron: +iron.toFixed(1),
    zinc: +zinc.toFixed(1),
    calcium: Math.round(calcium),
    magnesium: Math.round(magnesium),
    potassium: Math.round(potassium),
    sodium: Math.round(sodium),
    vitC: Math.round(vitC),
    vitD: +vitD.toFixed(1),
    vitB12: +vitB12.toFixed(1),
    tip: 'Estimativa calculada localmente. Conecte sua chave Gemini em Perfil para análise nutricional de alta precisão.',
    isAI: false
  };
}
