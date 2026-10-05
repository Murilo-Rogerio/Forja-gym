function openAIScreen(){
  aiDraft = null;
  openScreen(screenHeader('Assistente IA') +
    '<div class="screen-bd">' +
    '<div class="card acc" style="display:flex;gap:14px;align-items:center">' +
    '<div style="width:46px;height:46px;border-radius:14px;background:rgba(56,189,248,.12);color:var(--acc);display:flex;align-items:center;justify-content:center;flex:none">' + icon('wand') + '</div>' +
    '<div><b style="font-family:var(--fd);font-size:17px;letter-spacing:.5px;text-transform:uppercase;color:var(--acc)">Montador de programa</b>' +
    '<div class="mut mt8" style="font-size:12.5px">' + (state.settings.gemini ? 'Gemini conectado — geração inteligente' : 'Sem chave Gemini — uso o gerador local inteligente') + '</div></div></div>' +
    '<label class="flabel lbl">Objetivo</label>' +
    '<select class="fld" id="ai-goal"><option value="hipertrofia">Hipertrofia</option><option value="forca">Força</option><option value="emagrecimento">Emagrecimento</option><option value="condicionamento">Condicionamento</option></select>' +
    '<div class="split2 mt8"><div><label class="flabel lbl">Treinos por semana</label>' +
    '<select class="fld" id="ai-days"><option>2</option><option selected>3</option><option>4</option><option>5</option><option>6</option></select></div>' +
    '<div><label class="flabel lbl">Nível</label>' +
    '<select class="fld" id="ai-level"><option>Iniciante</option><option selected>Intermediário</option><option>Avançado</option></select></div></div>' +
    '<label class="flabel lbl">Onde você treina</label>' +
    '<select class="fld" id="ai-place"><option>Academia completa</option><option>Academia com halteres e máquinas</option><option>Casa, sem equipamentos</option></select>' +
    '<label class="flabel lbl">Observações (lesões, preferências, equipamentos)</label>' +
    '<textarea class="fld" id="ai-notes" placeholder="Ex.: ombro direito sensível, prefiro barra livre, tenho rack e halteres até 30kg"></textarea>' +
    '<button class="btn btn-pri ripple mt20" style="width:100%" id="ai-gen-btn" data-act="ai-gen">' + icon('spark') + ' Gerar meu programa</button>' +
    '<div class="mt20 stack" id="ai-result"></div></div>');
}
async function aiGenerate(){
  if(aiBusy) return;
  aiBusy = true;
  const btn = document.getElementById('ai-gen-btn');
  if(btn){ btn.disabled = true; btn.innerHTML = icon('sync','spin') + ' Forjando seu programa...'; }
  const goal = document.getElementById('ai-goal').value, days = document.getElementById('ai-days').value;
  const level = document.getElementById('ai-level').value, place = document.getElementById('ai-place').value;
  const notes = (document.getElementById('ai-notes').value||'').trim();
  let plan = null, usedAI = false;
  if(state.settings.gemini){
    const prompt = 'Você é um personal trainer elite. Monte um programa de treino e responda SOMENTE com JSON válido, sem texto extra, exatamente neste formato:\n' +
      '{"programa":[{"nome":"Treino A — ...","divisao":"ABC","exercicios":[{"nome":"Supino Reto com Barra","grupo":"Peito","series":[{"tipo":"work","reps":10}],"descanso":90,"rpe":8}]}]}\n' +
      'Contexto: objetivo ' + goal + '; ' + days + ' treinos por semana; nível ' + level + '; local: ' + place + '; observações: ' + (notes || 'nenhuma') + '.\n' +
      'Regras: ' + days + ' treinos no array "programa". Cada treino com 4-6 exercícios com nomes comuns em português. "grupo" deve ser um de: Peito, Costas, Pernas, Ombros, Braços, Core. ' +
      '"tipo" por série: "work" (válida), "prep" (preparatória) ou "warm" (aquecimento leve). Inclua 1-2 séries de aquecimento no primeiro exercício pesado de cada treino. ' +
      '"reps" entre 1 e 20. "descanso" em segundos entre 30 e 300. Respeite as observações do usuário.';
    const raw = await geminiCall(prompt, true);
    if(raw){ plan = normalizeAIPlan(extractJSON(raw)); usedAI = !!plan; }
  }
  if(!plan) plan = localGeneratePlan(goal, parseInt(days,10), place, level);
  aiDraft = plan;
  aiBusy = false;
  if(btn){ btn.disabled = false; btn.innerHTML = icon('spark') + ' Gerar novamente'; }
  if(!usedAI && state.settings.gemini) toast('Gemini não respondeu — usei o gerador local.', 'ai');
  renderAIDraft(usedAI);
  save();
}
function renderAIDraft(usedAI){
  const el = document.getElementById('ai-result');
  if(!el || !aiDraft) return;
  const cards = aiDraft.map(function(f, i){
    const exRows = f.ex.map(function(x){
      const lib = libById(x.exId);
      const sets = x.sets.map(function(st){
        const m = TYPE_META[st.type] || TYPE_META.work;
        return '<span class="chip ' + m.cls + '" style="font-size:11px;padding:3px 8px">' + m.l + '·' + st.reps + '</span>';
      }).join(' ');
      return '<div class="kv"><span class="mut" style="font-size:13px">' + esc(lib?lib.name:'?') + '</span>' +
        '<span style="text-align:right"><span style="font-size:12px;color:var(--dim)">' + x.sets.length + ' séries · ' + x.rest + 's · @' + x.rpe + '</span><br>' + sets + '</span></div>';
    }).join('');
    return '<div class="card rise" style="--d:' + (i*70) + 'ms"><b style="font-family:var(--fd);font-size:16px;letter-spacing:.5px;text-transform:uppercase">' + esc(f.name) + '</b>' +
      '<div class="lbl mt8">' + esc(f.split) + ' · ' + f.ex.length + ' exercícios</div><div class="mt14">' + exRows + '</div></div>';
  }).join('');
  el.innerHTML = '<div class="eyebrow">' + (usedAI ? 'Gerado pelo Gemini' : 'Gerado localmente') + '</div>' +
    '<div class="mt14 stack">' + cards + '</div>' +
    '<button class="btn btn-pri ripple mt20" style="width:100%" data-act="ai-saveplan">' + icon('check') + ' Salvar programa completo</button>' +
    '<div class="typeleg mt14"><span><i style="background:rgba(56,189,248,.5)"></i>Válida</span><span><i style="background:rgba(251,191,36,.5)"></i>Preparatória</span><span><i style="background:rgba(148,163,184,.4)"></i>Aquecimento</span></div>';
}
function aiSavePlan(){
  if(!aiDraft) return;
  aiDraft.forEach(function(f){ state.workouts.push({ id: uid(), name: f.name, split: f.split, ex: f.ex }); });
  save();
  const sc = document.getElementById('stack').lastElementChild;
  if(sc) sc.remove();
  toast(aiDraft.length + ' fichas salvas no seu programa.', 'ok');
  go('workouts');
}
function openCoach(){
  const w = suggestedWorkout();
  const suggCards = (w ? w.ex : []).map(function(x){
    const s = coachSuggestionFor(x.exId, x.sets[0] ? x.sets[0].reps : 10);
    if(!s) return '';
    const lib = libById(x.exId);
    const kindChip = s.kind === 'up'
      ? '<span class="chip" style="color:var(--ok);border-color:rgba(52,211,153,.35)">progredir</span>'
      : s.kind === 'down'
      ? '<span class="chip" style="color:var(--warn);border-color:rgba(251,191,36,.35)">recuperar</span>'
      : '<span class="chip">consolidar</span>';
    return '<div class="excard"><b style="font-size:15px">' + esc(lib?lib.name:'Exercício') + '</b>' +
      '<div class="mut mt8" style="font-size:12.5px;line-height:1.5">' + esc(s.why) + '</div>' +
      '<div class="rowline mt14"><span class="chip ai" style="font-size:13.5px">' + icon('spark') + ' ' + suggestText(s) + '</span>' + kindChip + '</div></div>';
  }).join('');
  openScreen(screenHeader('AI Coach', { right:
    '<button class="btn btn-ghost btn-sm ripple" data-act="coach-stag">' + icon('target') + ' Estagnação</button>' }) +
    '<div class="screen-bd">' +
    '<div class="card acc" style="display:flex;gap:14px;align-items:flex-start">' +
    '<div style="width:42px;height:42px;border-radius:13px;background:rgba(56,189,248,.1);color:var(--acc);display:flex;align-items:center;justify-content:center;flex:none">' + icon('brain') + '</div>' +
    '<div><p id="coach-insight" style="font-size:13.5px;line-height:1.6">' + esc(dailyInsight()) + '</p>' +
    '<p class="dim mt8" style="font-size:12px;line-height:1.5">Análise local das suas últimas 3 semanas — funciona offline.</p>' +
    (state.settings.gemini ? '<button class="btn btn-pri btn-sm ripple mt14" data-act="coach-ai">' + icon('wand') + ' Análise completa com Gemini</button>' : '') +
    '</div></div>' +
    (w ? '<div class="lbl mt20">Recomendações para ' + esc(w.name) + ' (hoje)</div>' +
      '<div class="stack mt14">' + (suggCards || '<div class="empty">Sem histórico suficiente para este treino ainda.</div>') + '</div>' : '') +
    '<div id="stag-zone"></div></div>');
  renderStagInto(document.getElementById('stag-zone'), stagnationAnalysis());
}
function renderStagInto(zone, stag){
  if(!zone) return;
  let html = '<div class="lbl mt20">Análise de estagnação</div>';
  if(!stag.length){
    html += '<div class="card mt14" style="border-color:rgba(52,211,153,.3)"><div class="rowline">' +
      '<span style="color:var(--ok)">' + icon('check') + '</span>' +
      '<p style="font-size:13.5px;line-height:1.5">Nenhuma estagnação detectada: nenhum exercício parou de progredir por 3+ sessões seguidas. Siga o plano.</p></div></div>';
  } else {
    html += stag.map(function(s){
      return '<div class="excard mt14" style="border-color:rgba(251,191,36,.35)"><div class="rowline">' +
        '<div style="flex:1"><b style="font-size:15px">' + esc(s.ex.name) + '</b>' +
        '<div class="lbl mt8" style="color:var(--warn)">estagnado · ' + esc(s.ex.group) + '</div></div>' + icon('target') + '</div>' +
        '<p class="mut mt14" style="font-size:13px;line-height:1.6">' + esc(s.plan) + '</p></div>';
    }).join('');
  }
  zone.innerHTML = html;
}
async function coachGemini(){
  const summary = historySummaryForAI();
  if(!summary){ toast('Histórico insuficiente para a IA analisar.', 'bad'); return; }
  toast('Gemini analisando seu histórico...', 'ai');
  const prompt = 'Você é um coach de força e hipertrofia direto e técnico, brasileiro. Analise o histórico de treino abaixo (últimas 3 semanas, formato data carga×reps@RPE) e responda em português, no máximo 140 palavras, com: 1) diagnóstico da progressão; 2) duas recomendações concretas de carga/reps para a próxima semana; 3) se houver estagnação (mesma carga e reps repetidas), sugerir deload de 10% ou troca de exercício. Sem saudações, direto ao ponto.\n\nHISTÓRICO:\n' + summary;
  const res = await geminiCall(prompt, false);
  const el = document.getElementById('coach-insight');
  if(res && el){
    el.textContent = res;
    toast('Análise do Gemini pronta.', 'ai', 'wand');
  } else {
    toast('Gemini não respondeu. Verifique a chave nas configurações.', 'bad');
  }
}
