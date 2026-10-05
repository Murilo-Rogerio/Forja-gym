let aiDraft = null, aiBusy = false;

async function geminiCall(prompt, wantJson){
  const key = state.settings.gemini;
  if(!key) return null;
  const models = ['gemini-2.5-flash','gemini-2.0-flash'];
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
function localGeneratePlan(goal, days, place, level){
  const splits = {
    '2':[['Superiores','Upper'],['Inferiores','Lower']],
    '3':[['Peito, Ombros, Tríceps','Costas e Bíceps','Pernas Completo']],
    '4':[['Peito e Tríceps','Costas e Bíceps','Pernas Completo','Ombros e Core']],
    '5':[['Peito e Tríceps','Costas e Bíceps','Pernas A','Ombros e Core','Pernas B']],
    '6':[['Peito e Tríceps','Costas e Bíceps','Pernas A','Ombros e Core','Pernas B','Full Body']]
  };
  const groupsByDay = {
    'Peito, Ombros, Tríceps':['Peito','Ombros','Braços'], 'Costas e Bíceps':['Costas','Braços'],
    'Pernas Completo':['Pernas','Pernas','Core'], 'Peito e Tríceps':['Peito','Braços'],
    'Ombros e Core':['Ombros','Core','Ombros'], 'Pernas A':['Pernas','Pernas','Core'],
    'Pernas B':['Pernas','Pernas','Core'], 'Superiores':['Peito','Costas','Ombros'],
    'Inferiores':['Pernas','Pernas','Core'], 'Full Body':['Peito','Costas','Pernas']
  };
  const cfg = { forca:{ reps:[3,6], rest:180, sets:5 }, hipertrofia:{ reps:[8,12], rest:90, sets:4 }, emagrecimento:{ reps:[12,15], rest:60, sets:3 }, condicionamento:{ reps:[15,20], rest:45, sets:3 } };
  const c = cfg[goal] || cfg.hipertrofia;
  const names = splits[String(Math.min(6, Math.max(2, days)))] || splits['3'];
  const letters = 'ABCDEF';
  const out = [];
  names[0].forEach(function(dayName, i){
    const groups = groupsByDay[dayName] || ['Peito'];
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
function coachSuggestionFor(exId, targetReps){
  const h = historyOf(exId);
  if(!h.length) return null;
  const last = h[h.length-1];
  const rpe = Math.round(last.rpe);
  if(rpe <= 7) return { w: +(last.w + 2.5).toFixed(1), reps: targetReps || last.r, kind:'up',
    why: 'Última: '+fmtN(last.w)+'kg × '+last.r+' @RPE '+rpe+' — com folga. Hora de subir a carga.' };
  if(rpe === 8) return { w: last.w, reps: Math.min(12, last.r+1), kind:'hold',
    why: 'Última: '+fmtN(last.w)+'kg × '+last.r+' @RPE '+rpe+'. Manteve a carga e caça +1 repetição.' };
  if(last.r < (targetReps || 8)) return { w: +(Math.max(2.5, last.w-2.5)).toFixed(1), reps: targetReps || last.r, kind:'down',
    why: 'Última: '+fmtN(last.w)+'kg × '+last.r+' @RPE '+rpe+' — perto do limite. Recupere a base com carga menor.' };
  return { w: last.w, reps: targetReps || last.r, kind:'hold',
    why: 'Última: '+fmtN(last.w)+'kg × '+last.r+' @RPE '+rpe+'. Repita com foco em execução impecável.' };
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
      out.push({ ex: ex, plan: l3.length+' sessões parado em '+fmtN(w)+'kg × '+r+
        '. Plano: deload para '+fmtN(deload)+'kg por 2 sessões e retome '+fmtN(w)+'kg caçando '+(r+1)+' reps.' +
        (alt ? ' Alternativa: troque por '+alt.name+' por 3–4 semanas.' : '') });
    }
  }
  return out;
}
function dailyInsight(){
  const wk = weeklyStats();
  if(state.logs.length === 0) return 'Conclua seu primeiro treino para eu começar a analisar sua progressão.';
  if(wk.count === 0) return 'Nenhum treino esta semana. A constância é o que constrói força — bora.';
  const recent = state.logs.slice().sort(function(a,b){ return b.date-a.date; }).slice(0,2);
  const withPR = recent.find(function(l){ return l.prCount > 0; });
  if(withPR) return 'Você bateu '+withPR.prCount+' PR'+(withPR.prCount>1?'s':'')+' na última sessão ('+fmtKg(withPR.volume)+' movimentados). O momentum é seu — mantém.';
  const w = suggestedWorkout();
  if(w && w.ex[0]){
    const s = coachSuggestionFor(w.ex[0].exId, w.ex[0].sets && w.ex[0].sets[0] ? w.ex[0].sets[0].reps : 10);
    if(s){
      const nm = libById(w.ex[0].exId);
      return 'Hoje ('+w.name+'): '+(nm?nm.name:'exercício')+' — recomendo '+suggestText(s)+'.';
    }
  }
  return wk.count+' treino'+(wk.count>1?'s':'')+' esta semana, '+fmtKg(wk.volume)+' de volume. Sólido.';
}
function historySummaryForAI(){
  const since = Date.now() - 21*86400000;
  const lines = [];
  const ids = [...new Set(state.logs.filter(function(l){ return l.date >= since; }).flatMap(function(l){ return l.ex.map(function(e){ return e.exId; }); }))];
  for(const id of ids){
    const h = historyOf(id).filter(function(x){ return x.date >= since; });
    if(h.length < 2) continue;
    const lib = libById(id);
    const s = h.map(function(x){ return fmtDate(x.date)+' '+fmtN(x.w)+'kg×'+x.r+'@'+Math.round(x.rpe); }).join('; ');
    lines.push('- ' + (lib?lib.name:'ex') + ': ' + s);
  }
  return lines.slice(0, 25).join('\n');
}