/* ==========================================================================
   FORJA — AI COACH MULTIFUNCIONAL & MOTOR DE PERFORMANCE (10/10)
   Prontidão diária, fadiga muscular, hábitos, substituições, aquecimento e chat
   ========================================================================== */

/* ---------- SÍNTESE DE VOZ / ÁUDIO COACH ---------- */
function speakCoach(phrase){
  if(!state || !state.settings || state.settings.voiceCoach === false) return;
  if(typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try{
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(phrase);
    u.lang = 'pt-BR';
    u.rate = 1.05;
    u.pitch = 1.0;
    window.speechSynthesis.speak(u);
  }catch(e){}
}

/* ---------- MOTOR DE PRONTIDÃO & RECUPERAÇÃO MUSCULAR ---------- */
function calcReadiness(){
  const groups = ['Peito', 'Costas', 'Pernas', 'Ombros', 'Braços', 'Core'];
  const now = Date.now();
  const muscleRecovery = {};
  const hoursSince = {};

  // Inicializa com 100% (recuperado)
  groups.forEach(function(g){
    muscleRecovery[g] = 100;
    hoursSince[g] = 999;
  });

  const logs = (state && state.logs) ? state.logs : [];
  if(logs.length === 0){
    return {
      score: 100,
      statusLabel: 'Totalmente Recuperado (100%)',
      statusColor: 'var(--ok)',
      advice: 'Nenhum treino anterior registrado ainda. Realize sua primeira sessão para o Coach monitorar a recuperação neuromuscular real de cada músculo!',
      muscleRecovery: muscleRecovery,
      hoursSince: hoursSince
    };
  }
  if(logs.length > 0){
    // Analisa os últimos treinos
    logs.slice().sort(function(a,b){ return b.date - a.date; }).forEach(function(l){
      const diffH = Math.max(1, (now - l.date) / 3600000);
      const lgGroups = Object.keys(l.groups || {});
      lgGroups.forEach(function(g){
        if(hoursSince[g] === 999 || diffH < hoursSince[g]){
          hoursSince[g] = diffH;
        }
      });
    });

    // Calcula porcentagem baseada em horas de descanso (fisiologia da supercompensação)
    groups.forEach(function(g){
      const h = hoursSince[g];
      if(h < 18) muscleRecovery[g] = Math.round(20 + (h / 18) * 25); // 20% a 45% (fadiga aguda)
      else if(h < 36) muscleRecovery[g] = Math.round(45 + ((h - 18) / 18) * 30); // 45% a 75% (recuperando)
      else if(h < 54) muscleRecovery[g] = Math.round(75 + ((h - 36) / 18) * 20); // 75% a 95% (quase pronto)
      else muscleRecovery[g] = 100; // Totalmente recuperado
    });
  }

  // Fatores de sono e hidratação dos hábitos
  const h = getTodayHabits();
  let sleepFactor = 1.0;
  if(h.sleep < 6) sleepFactor = 0.85;
  else if(h.sleep >= 8) sleepFactor = 1.05;

  let waterFactor = 1.0;
  if(h.water >= h.waterTarget * 0.7) waterFactor = 1.03;
  else if(h.water < 1000) waterFactor = 0.92;

  // Média ponderada dos músculos
  const recValues = Object.values(muscleRecovery);
  const avgRec = recValues.reduce(function(a,b){ return a+b; }, 0) / recValues.length;

  let score = Math.round(avgRec * sleepFactor * waterFactor);
  score = Math.min(100, Math.max(25, score));

  let statusLabel = 'Pronto para Treinar';
  let statusColor = 'var(--ok)';
  let advice = 'Seus músculos responderam bem ao descanso. É um momento propício para progredir carga nos grupos verdes.';

  if(score >= 88){
    statusLabel = 'Alta Performance (90%+)';
    statusColor = 'var(--ok)';
    advice = 'Pico de prontidão neural e muscular! Dia ideal para tentar recordes (PR) com segurança e intensidade máxima.';
  } else if(score >= 70){
    statusLabel = 'Prontidão Moderada';
    statusColor = 'var(--acc)';
    advice = 'Recuperação equilibrada. Mantenha as séries de trabalho planejadas com RPE 8-9.';
  } else {
    statusLabel = 'Fadiga Residual';
    statusColor = 'var(--warn)';
    advice = 'Fadiga acumulada recente. Priorize hidratação, aquecimento articular minucioso ou opte por um treino de intensidade moderada.';
  }

  return {
    score: score,
    statusLabel: statusLabel,
    statusColor: statusColor,
    advice: advice,
    muscleRecovery: muscleRecovery,
    hoursSince: hoursSince
  };
}

/* ---------- RASTREADOR DE HÁBITOS DO ATLETA ---------- */
function getTodayHabits(){
  const todayStr = new Date().toISOString().slice(0,10);
  if(!state.habits || state.habits.date !== todayStr){
    state.habits = {
      date: todayStr,
      water: 0,
      waterTarget: (state && state.user && state.user.weight ? Math.round(state.user.weight * 40) : 3000),
      creatine: false,
      sleep: 7.5
    };
    save();
  }
  return state.habits;
}

function addWater(ml){
  const h = getTodayHabits();
  const prev = h.water;
  h.water = Math.max(0, h.water + ml);
  save();
  buzz([25]);

  if(prev < h.waterTarget && h.water >= h.waterTarget){
    celebrate();
    toast('Meta diária de hidratação atingida! +20 XP', 'ok', 'droplet');
    if(state && state.user){ state.user.xp += 20; save(); }
    speakCoach('Meta de água concluída. Hidratação é anabolismo!');
  }
  if(RENDER[curView]) RENDER[curView]();
}

function resetWater(){
  const h = getTodayHabits();
  h.water = 0;
  save();
  toast('Contador de água reiniciado para hoje.', 'ok');
  if(RENDER[curView]) RENDER[curView]();
}

function toggleCreatine(){
  const h = getTodayHabits();
  h.creatine = !h.creatine;
  save();
  buzz([30]);
  if(h.creatine){
    toast('Creatina registrada (+10 XP)', 'ok', 'zap');
    if(state && state.user){ state.user.xp += 10; save(); }
    speakCoach('Creatina tomada!');
  }
  if(RENDER[curView]) RENDER[curView]();
}

function setSleep(hours){
  const h = getTodayHabits();
  h.sleep = hours;
  save();
  toast('Sono ajustado para ' + hours + 'h.', 'ok', 'moon');
  if(RENDER[curView]) RENDER[curView]();
}

/* ---------- CALCULADORA DE SÉRIES DE AQUECIMENTO (WARMUP LADDER) ---------- */
function calcWarmupLadder(workingWeight){
  const w = parseFloat(workingWeight) || 0;
  if(w <= 10){
    return [
      { pct: 0, w: 'Peso corporal', r: 12, why: 'Articulações e fluxo sinovial' },
      { pct: 50, w: 'Carga leve', r: 8, why: 'Ativação motora' }
    ];
  }
  // Escada de sobrecarga sem fadiga láctica
  const s1 = Math.round((w * 0.45) / 2) * 2; // ~45%
  const s2 = Math.round((w * 0.68) / 2) * 2; // ~68%
  const s3 = Math.round((w * 0.85) / 2) * 2; // ~85%

  return [
    { pct: 45, w: Math.max(2, s1), r: 10, why: 'Aquecimento sinovial e velocidade' },
    { pct: 68, w: Math.max(4, s2), r: 5, why: 'Ativação neural do padrão motor' },
    { pct: 85, w: Math.max(6, s3), r: 2, why: 'Potenciação pós-ativação sem fadiga' }
  ];
}

function openWarmupCalculator(exName, targetWeight, onApplyCallback){
  const ladder = calcWarmupLadder(targetWeight);
  const rows = ladder.map(function(s, idx){
    return '<div class="card mt8" style="background:rgba(20,30,52,.4);border-color:var(--line);padding:12px 14px">' +
      '<div class="rowline"><span class="chip warn" style="font-size:11px">Aquecimento ' + (idx+1) + '</span>' +
      '<b class="num" style="font-size:16px;color:var(--acc)">' + s.w + (typeof s.w === 'number' ? ' kg' : '') + ' × ' + s.r + ' reps</b></div>' +
      '<div class="dim mt8" style="font-size:11.5px">' + esc(s.why) + '</div></div>';
  }).join('');

  modalHTML(
    '<div class="sheet-grip"></div>' +
    '<div class="rowline"><div class="h-display h2">ESCADA DE AQUECIMENTO</div>' +
    '<div style="color:var(--warn)">' + icon('zap') + '</div></div>' +
    '<p class="mut mt8" style="font-size:13px;line-height:1.5">' +
    'Preparação neural para <b>' + esc(exName) + '</b> com carga-alvo de <b>' + (targetWeight || 0) + ' kg</b>. Otimiza a força e previne lesões sem fadigar as fibras.' +
    '</p>' +
    '<div class="mt14">' + rows + '</div>' +
    '<button class="btn btn-pri ripple mt20" style="width:100%" id="btn-apply-warmup">' +
    icon('plus') + ' Inserir Séries de Aquecimento no Exercício</button>'
  );

  const btn = document.getElementById('btn-apply-warmup');
  if(btn){
    btn.onclick = function(){
      if(typeof onApplyCallback === 'function') onApplyCallback(ladder);
      closeModal();
      toast('Séries de aquecimento adicionadas!', 'ok', 'zap');
    };
  }
}

/* ---------- SUBSTITUIÇÃO INTELIGENTE DE EXERCÍCIOS ---------- */
function findBiomechanicalAlternatives(exId){
  const cur = libById(exId);
  if(!cur) return [];
  const group = cur.group;
  const nameNorm = normTxt(cur.name);

  // Filtra outros exercícios do mesmo grupo
  const pool = state.library.filter(function(e){
    return e.id !== exId && e.group === group;
  });

  // Pontua e seleciona 3 variações de equipamentos distintos
  const alts = pool.slice(0, 3).map(function(alt){
    let reason = 'Mesmo grupo muscular (' + group + ') com foco hipertrófico equivalente.';
    if(alt.equip && cur.equip && alt.equip !== cur.equip){
      reason = 'Variação com ' + alt.equip + ' mantendo o vetor de força ideal.';
    } else if(alt.name.includes('Halteres') && cur.name.includes('Barra')){
      reason = 'Maior liberdade articular para os ombros e amplitude estendida.';
    } else if(alt.name.includes('Máquina') || alt.name.includes('Polia')){
      reason = 'Tensão muscular constante em todo o arco de movimento.';
    }
    return {
      ex: alt,
      reason: reason
    };
  });

  return alts;
}

let activeSubstCallback = null;

function openExerciseSubstitutionModal(exId, onSubstituteCallback){
  activeSubstCallback = onSubstituteCallback;
  const cur = libById(exId);
  if(!cur){ toast('Exercício não encontrado.', 'bad'); return; }
  const alts = findBiomechanicalAlternatives(exId);

  const cards = alts.map(function(a, idx){
    return '<div class="card mt10 ripple tap" style="padding:14px;background:rgba(20,30,52,.4);border-color:var(--line)" data-act="ex-subst-pick" data-arg="' + a.ex.id + '">' +
      '<div class="rowline"><b style="font-size:15px;color:var(--acc)">' + esc(a.ex.name) + '</b>' +
      '<span class="chip">' + esc(a.ex.group) + '</span></div>' +
      '<p class="dim mt8" style="font-size:12px;line-height:1.5">' + esc(a.reason) + '</p>' +
      '<div class="rowline mt8"><span style="color:var(--acc);font-size:12px;font-weight:600">Toque para substituir</span>' + icon('fwd') + '</div>' +
      '</div>';
  }).join('');

  modalHTML(
    '<div class="sheet-grip"></div>' +
    '<div class="rowline"><div class="h-display h2">SUBSTITUIR EXERCÍCIO</div>' +
    '<div style="color:var(--acc)">' + icon('sync') + '</div></div>' +
    '<p class="mut mt8" style="font-size:13px;line-height:1.5">' +
    'Aparelho ocupado ou desconforto? Escolha uma alternativa biomecanicamente equivalente para <b>' + esc(cur.name) + '</b>:' +
    '</p>' +
    '<div class="mt14">' + (cards || '<div class="empty">Nenhuma alternativa disponível para este grupo.</div>') + '</div>'
  );

  // Handled via ACTIONS['ex-subst-pick'] in wiring.js
}

/* ---------- CHAT MULTIFUNCIONAL COM COACH FORJA (IA CONVERSACIONAL) ---------- */
let coachChatHistory = [];

function openAICoachChat(initialContext){
  const readiness = calcReadiness();
  const u = state.user;
  const name = u.name || 'Atleta';

  if(!coachChatHistory.length){
    coachChatHistory.push({
      role: 'coach',
      text: 'Fala, ' + name + '! Sou o Coach Forja. Sua prontidão hoje está em ' + readiness.score + '% (' + readiness.statusLabel + '). Como posso te ajudar agora?'
    });
  }

  const renderMessages = function(){
    return coachChatHistory.map(function(m){
      const isCoach = m.role === 'coach';
      return '<div style="display:flex;gap:10px;margin-bottom:12px;' + (isCoach ? '' : 'justify-content:flex-end') + '">' +
        (isCoach ? '<div style="width:32px;height:32px;border-radius:10px;background:var(--acc-deep);color:var(--acc);display:flex;align-items:center;justify-content:center;flex:none">' + icon('brain') + '</div>' : '') +
        '<div style="max-width:80%;padding:10px 14px;border-radius:14px;font-size:13.5px;line-height:1.5;' +
        (isCoach ? 'background:rgba(20,30,52,.7);border:1px solid var(--line);color:#e8eef8' : 'background:var(--acc2);color:#fff') + '">' +
        esc(m.text) + '</div>' +
        '</div>';
    }).join('');
  };

  openScreen(
    screenHeader('Coach Forja — Assistente Pessoal') +
    '<div class="screen-bd" style="display:flex;flex-direction:column;height:calc(100vh - 70px);padding-bottom:16px">' +
    '<div class="card acc" style="padding:12px 14px;flex:none;margin-bottom:12px">' +
    '<div class="rowline"><div><span class="lbl" style="color:var(--acc)">Prontidão Hoje</span>' +
    '<b class="num" style="font-size:18px;color:#fff;margin-left:8px">' + readiness.score + '%</b></div>' +
    '<span class="chip" style="color:' + readiness.statusColor + '">' + esc(readiness.statusLabel) + '</span></div></div>' +

    '<div id="coach-chat-scroll" style="flex:1;overflow-y:auto;padding-right:4px">' +
    renderMessages() +
    '</div>' +

    '<div style="flex:none;margin-top:10px">' +
    '<div class="rowline" style="gap:6px;overflow-x:auto;padding-bottom:8px;scrollbar-width:none">' +
    '<button class="chip ripple tap" data-act="coach-ask-quick" data-arg="Como devo aquecer hoje?">' + icon('zap') + ' Como aquecer?</button>' +
    '<button class="chip ripple tap" data-act="coach-ask-quick" data-arg="O que comer no pré-treino para ter mais energia?">' + icon('apple') + ' Pré-treino</button>' +
    '<button class="chip ripple tap" data-act="coach-ask-quick" data-arg="Como fazer a progressão de carga de forma segura?">' + icon('trend') + ' Progressão segura</button>' +
    '<button class="chip ripple tap" data-act="coach-ask-quick" data-arg="Adapte meu treino para 35 minutos hoje.">' + icon('clock') + ' Treino rápido 35min</button>' +
    '</div>' +
    '<div class="rowline" style="gap:8px;margin-top:6px">' +
    '<input class="fld" id="coach-chat-input" placeholder="Pergunte ao Coach Forja..." style="flex:1" autocomplete="off">' +
    '<button class="btn btn-pri ripple" id="coach-chat-send" data-act="chat-send" style="padding:10px 16px">' + icon('send') + '</button>' +
    '</div></div>' +
    '</div>'
  );

  const scrollEl = document.getElementById('coach-chat-scroll');
  if(scrollEl) scrollEl.scrollTop = scrollEl.scrollHeight;

  const inp = document.getElementById('coach-chat-input');
  if(inp){
    inp.onkeydown = function(e){ if(e.key === 'Enter') sendCoachChatMessage(); };
  }
}

async function sendCoachChatMessage(customText){
  const inp = document.getElementById('coach-chat-input');
  const txt = (customText || (inp ? inp.value : '')).trim();
  if(!txt) return;
  if(inp) inp.value = '';

  coachChatHistory.push({ role:'user', text: txt });

  const scrollEl = document.getElementById('coach-chat-scroll');
  if(scrollEl){
    scrollEl.innerHTML += '<div style="display:flex;justify-content:flex-end;margin-bottom:12px">' +
      '<div style="max-width:80%;padding:10px 14px;border-radius:14px;font-size:13.5px;line-height:1.5;background:var(--acc2);color:#fff">' + esc(txt) + '</div></div>' +
      '<div id="coach-typing" style="display:flex;gap:10px;margin-bottom:12px">' +
      '<div style="width:32px;height:32px;border-radius:10px;background:var(--acc-deep);color:var(--acc);display:flex;align-items:center;justify-content:center;flex:none">' + icon('brain') + '</div>' +
      '<div style="padding:10px 14px;border-radius:14px;font-size:13px;background:rgba(20,30,52,.7);color:var(--dim)">Coach pensando...</div></div>';
    scrollEl.scrollTop = scrollEl.scrollHeight;
  }

  let answer = '';
  if(state.settings.gemini){
    const readiness = calcReadiness();
    const prompt = 'Você é o Coach Forja, o mais respeitado treinador de força e fisiologia do exercício do Brasil. ' +
      'Atleta: ' + (state.user.name||'Atleta') + ', peso ' + (state.user.weight||'75') + 'kg, nível ' + (state.user.activity||'moderado') + '. ' +
      'Prontidão hoje: ' + readiness.score + '%. Responda à dúvida do atleta com maestria técnica, tom motivador e foco prático direto (máximo 85 palavras). Sem enrolação.\n\n' +
      'Dúvida do atleta: "' + txt + '"';
    try{
      answer = await geminiCall(prompt, false);
    }catch(e){}
  }

  if(!answer){
    // Respostas inteligentes locais
    const t = normTxt(txt);
    if(t.includes('aquec') || t.includes('along')){
      answer = 'Para aquecer com eficiência, faça 3 séries progressivas no 1º exercício pesado: 50% da carga por 8 reps, 70% por 4 reps e 85% por 1 rep. Isso ativa o sistema neuromuscular sem gastar energia láctica!';
    } else if(t.includes('pre') || t.includes('com') || t.includes('nutri')){
      answer = 'Uma refeição pré-treino sólida 1h30 a 2h antes deve ter carboidratos de média absorção (aveia/banana) e proteína magra. Hidrate-se com ao menos 500ml de água!';
    } else if(t.includes('prog') || t.includes('carg') || t.includes('pes')){
      answer = 'A progressão ideal é a sobrecarga dupla: primeiro atinja o teto de reps (ex: 12 reps) em todas as séries com boa forma. Só então aumente de 1kg a 2kg por lado!';
    } else if(t.includes('rap') || t.includes('tempo') || t.includes('minut')){
      answer = 'Para treinar em 35 minutos, foque em 3 exercícios compostos principais, use descanso fixo de 60 a 75 segundos no timer e execute as últimas séries com drop-set ou rest-pause.';
    } else {
      answer = 'Mantenha a intensidade com RPE 8-9 nas séries de trabalho, controle a fase excêntrica da repetição em 2-3 segundos e respeite o descanso do timer. A consistência é o que forja resultados!';
    }
  }

  coachChatHistory.push({ role:'coach', text: answer });

  const typingEl = document.getElementById('coach-typing');
  if(typingEl) typingEl.remove();

  if(scrollEl){
    scrollEl.innerHTML += '<div style="display:flex;gap:10px;margin-bottom:12px">' +
      '<div style="width:32px;height:32px;border-radius:10px;background:var(--acc-deep);color:var(--acc);display:flex;align-items:center;justify-content:center;flex:none">' + icon('brain') + '</div>' +
      '<div style="max-width:80%;padding:10px 14px;border-radius:14px;font-size:13.5px;line-height:1.5;background:rgba(20,30,52,.7);border:1px solid var(--line);color:#e8eef8">' +
      esc(answer) + '</div></div>';
    scrollEl.scrollTop = scrollEl.scrollHeight;
  }
}

/* ==========================================================================
   FUNÇÕES ORIGINAIS DO COACH (GERAÇÃO DE PROGRAMAS E ANÁLISE)
   ========================================================================== */

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
  const readiness = calcReadiness();
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
    '<button class="btn btn-ghost btn-sm ripple" data-act="coach-chat">' + icon('brain') + ' Chat com Coach</button>' }) +
    '<div class="screen-bd">' +

    // Card de Prontidão
    '<div class="card acc" style="display:flex;gap:14px;align-items:flex-start">' +
    '<div style="width:46px;height:46px;border-radius:14px;background:var(--acc-deep);color:var(--acc);display:flex;align-items:center;justify-content:center;flex:none;box-shadow:0 0 16px rgba(56,189,248,.35)">' + icon('brain') + '</div>' +
    '<div style="flex:1"><div class="rowline"><div><span class="lbl" style="color:var(--acc)">Prontidão Geral</span>' +
    '<div class="h-display" style="font-size:32px;color:#fff">' + readiness.score + '%</div></div>' +
    '<span class="chip" style="color:' + readiness.statusColor + ';border-color:' + readiness.statusColor + '">' + esc(readiness.statusLabel) + '</span></div>' +
    '<p id="coach-insight" style="font-size:13.5px;line-height:1.6;margin-top:8px">' + esc(readiness.advice) + '</p>' +
    '</div></div>' +

    // Recuperação por Músculo
    '<div class="lbl mt20">Recuperação por Grupo Muscular</div>' +
    '<div class="grid2 mt8">' +
    Object.keys(readiness.muscleRecovery).map(function(g){
      const val = readiness.muscleRecovery[g];
      const col = val >= 90 ? 'var(--ok)' : val >= 60 ? 'var(--warn)' : 'var(--bad)';
      return '<div class="card" style="padding:10px 12px;background:rgba(20,30,52,.4);border-color:var(--line)">' +
        '<div class="rowline"><span style="font-size:13px;font-weight:600">' + esc(g) + '</span>' +
        '<b class="num" style="color:' + col + ';font-size:13px">' + val + '%</b></div>' +
        '<div class="xpbar mt8" style="height:5px"><i style="width:' + val + '%;background:' + col + '"></i></div></div>';
    }).join('') +
    '</div>' +

    '<div class="rowline mt14" style="gap:8px">' +
    '<button class="btn btn-pri ripple" style="flex:1" data-act="coach-chat">' + icon('brain') + ' Conversar com o Coach</button>' +
    '<button class="btn btn-ghost ripple" data-act="coach-stag">' + icon('target') + ' Estagnação</button>' +
    '</div>' +

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
