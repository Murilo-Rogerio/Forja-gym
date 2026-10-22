let nutrTab = 'ai'; // 'ai' ou 'manual'
let showMicros = false;

function activityLabel(a){
  return {
    sedentario: 'Sedentário (pouco ou nenhum exercício)',
    leve: 'Levemente ativo (1–3 dias/semana)',
    moderado: 'Moderadamente ativo (3–5 dias/semana)',
    intenso: 'Muito ativo (6–7 dias/semana)',
    atleta: 'Atleta / Trabalho físico pesado'
  }[a] || a;
}

function goalLabel(g){
  return { cut: 'Cutting (Perda de gordura)', manter: 'Manutenção', bulk: 'Bulking (Ganho de massa)' }[g] || g;
}

function calcNutrition(){
  const u = state.user;
  if(!u.weight || !u.height || !u.age) return null;
  const tmb = Math.round(10*u.weight + 6.25*u.height - 5*u.age + (u.sex==='m' ? 5 : -161));
  const f = { sedentario:1.2, leve:1.375, moderado:1.55, intenso:1.725, atleta:1.9 }[u.activity] || 1.55;
  const tdee = Math.round(tmb*f);
  const kcal = Math.round(tdee * ({ cut:.8, manter:1, bulk:1.15 }[u.goal] || 1));
  const p = Math.round(u.weight * 2);
  const fat = Math.round(kcal * .25 / 9);
  const c = Math.max(0, Math.round((kcal - p*4 - fat*9) / 4));
  return { tmb: tmb, tdee: tdee, kcal: kcal, p: p, c: c, f: fat };
}

/* Renderização da visualização de Nutrição & Contador de Macronutrientes */
RENDER.nutrition = function(){
  const u = state.user, has = u.weight && u.height && u.age;
  const auto = calcNutrition(), custom = state.nutrition.custom;
  const kcalTarget = custom ? custom.p*4 + custom.c*4 + custom.f*9 : (auto ? auto.kcal : 2200);
  const targetP = custom ? custom.p : (auto ? auto.p : 150);
  const targetC = custom ? custom.c : (auto ? auto.c : 250);
  const targetF = custom ? custom.f : (auto ? auto.f : 65);

  // Refeições de hoje
  const startOfDay = new Date(); startOfDay.setHours(0,0,0,0);
  const todayMeals = (state.nutrition.meals || []).filter(function(m){
    return m.at >= startOfDay.getTime();
  });

  const consumedKcal = todayMeals.reduce(function(s, m){ return s + (m.kcal || 0); }, 0);
  const consumedP = todayMeals.reduce(function(s, m){ return s + (m.p || 0); }, 0);
  const consumedC = todayMeals.reduce(function(s, m){ return s + (m.c || 0); }, 0);
  const consumedF = todayMeals.reduce(function(s, m){ return s + (m.f || 0); }, 0);

  const remKcal = Math.max(0, kcalTarget - consumedKcal);
  const pctKcal = Math.min(100, Math.round((consumedKcal / Math.max(1, kcalTarget)) * 100));

  const pctP = Math.min(100, Math.round((consumedP / Math.max(1, targetP)) * 100));
  const pctC = Math.min(100, Math.round((consumedC / Math.max(1, targetC)) * 100));
  const pctF = Math.min(100, Math.round((consumedF / Math.max(1, targetF)) * 100));

  // Totais de micronutrientes consumidos hoje
  const todayMicros = {
    fiber: todayMeals.reduce(function(s, m){ return s + (m.fiber || 0); }, 0),
    iron: todayMeals.reduce(function(s, m){ return s + (m.iron || 0); }, 0),
    zinc: todayMeals.reduce(function(s, m){ return s + (m.zinc || 0); }, 0),
    calcium: todayMeals.reduce(function(s, m){ return s + (m.calcium || 0); }, 0),
    magnesium: todayMeals.reduce(function(s, m){ return s + (m.magnesium || 0); }, 0),
    potassium: todayMeals.reduce(function(s, m){ return s + (m.potassium || 0); }, 0),
    sodium: todayMeals.reduce(function(s, m){ return s + (m.sodium || 0); }, 0),
    vitC: todayMeals.reduce(function(s, m){ return s + (m.vitC || 0); }, 0),
    vitD: todayMeals.reduce(function(s, m){ return s + (m.vitD || 0); }, 0),
    vitB12: todayMeals.reduce(function(s, m){ return s + (m.vitB12 || 0); }, 0)
  };

  let macroSliders = '';
  if(custom){
    macroSliders = '<div class="card mt20">' +
      '<div class="lbl" style="color:#38bdf8">Proteína · <span class="num" id="mg-p">' + custom.p + 'g</span></div>' +
      '<input type="range" min="60" max="350" step="5" value="' + custom.p + '" data-inp="macro-p" class="mt8">' +
      '<div class="lbl mt14" style="color:#60a5fa">Carboidrato · <span class="num" id="mg-c">' + custom.c + 'g</span></div>' +
      '<input type="range" min="50" max="550" step="10" value="' + custom.c + '" data-inp="macro-c" class="mt8">' +
      '<div class="lbl mt14" style="color:#fbbf24">Gordura · <span class="num" id="mg-f">' + custom.f + 'g</span></div>' +
      '<input type="range" min="20" max="180" step="5" value="' + custom.f + '" data-inp="macro-f" class="mt8">' +
      '<div class="rowline mt14"><span class="mut">Meta Calórica Diária</span><b class="num" id="nutr-total" style="color:var(--acc)">' + fmtN(kcalTarget) + ' kcal</b></div></div>';
  }

  // Lista de refeições registradas hoje
  const mealRows = todayMeals.map(function(m){
    const timeStr = m.at ? new Date(m.at).toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' }) : '';
    return '<div class="wrow" style="padding:12px 14px;margin-bottom:8px">' +
      '<div style="flex:1">' +
      '<div class="rowline"><b>' + esc(m.name || 'Refeição') + '</b>' +
      '<span class="num" style="color:var(--acc);font-weight:700">' + fmtN(m.kcal) + ' kcal</span></div>' +
      '<div class="rowline mt8" style="gap:8px;font-size:12.5px">' +
      '<span>P: <b style="color:#38bdf8">' + m.p + 'g</b></span>' +
      '<span>C: <b style="color:#60a5fa">' + m.c + 'g</b></span>' +
      '<span>G: <b style="color:#fbbf24">' + m.f + 'g</b></span>' +
      (timeStr ? '<span class="dim ml-auto" style="font-size:11px">' + timeStr + '</span>' : '') +
      '</div>' +
      (m.text ? '<div class="dim mt8" style="font-size:11.5px">' + esc(m.text) + '</div>' : '') +
      '</div>' +
      '<button class="iconbtn ripple" style="width:34px;height:34px;color:var(--bad);flex:none;margin-left:6px" data-act="nutr-meal-del" data-arg="' + m.id + '" aria-label="Remover">' + icon('trash') + '</button>' +
      '</div>';
  }).join('');

  // Formulário de Registro (IA vs Manual)
  let loggingPanel = '';
  if(nutrTab === 'ai'){
    loggingPanel =
      '<div class="card acc mt14 rise" style="--d:100ms">' +
      '<div class="rowline">' +
      '<div><div class="lbl" style="display:flex;align-items:center;gap:7px;color:var(--acc)"><span class="dot-live"></span>IA Nutricionista (Gemini)</div>' +
      '<b style="font-size:15.5px;display:block;margin-top:4px">Contador Inteligente por Descrição</b></div>' +
      '<div style="width:40px;height:40px;border-radius:12px;background:rgba(56,189,248,.15);color:var(--acc);display:flex;align-items:center;justify-content:center">' + icon('brain') + '</div>' +
      '</div>' +
      '<p class="mut mt8" style="font-size:13px;line-height:1.5">' +
      'Descreva sua refeição em linguagem natural. A IA calcula automaticamente as Calorias, Proteínas, Carboidratos e Gorduras:</p>' +
      '<textarea class="fld mt14" id="nutr-ai-input" placeholder="Ex.: 200g de peito de frango grelhado, 150g de arroz branco e 1 colher de sopa de azeite..." style="min-height:75px"></textarea>' +
      '<div class="rowline mt8" style="gap:6px;flex-wrap:wrap">' +
      '<button class="chip ripple" data-act="nutr-chip" data-arg="3 ovos mexidos, 2 fatias de pão integral e 1 banana">Café proteico</button>' +
      '<button class="chip ripple" data-act="nutr-chip" data-arg="180g de filé de frango, 150g de arroz e salada">Almoço clássico</button>' +
      '<button class="chip ripple" data-act="nutr-chip" data-arg="30g de whey protein, 1 banana, 40g de aveia e 200ml de leite">Shake pós-treino</button>' +
      '</div>' +
      '<button class="btn btn-pri ripple mt14" style="width:100%" data-act="nutr-ai-analyze" id="nutr-ai-btn">' +
      icon('spark') + ' Calcular Macros com IA</button>' +
      '<label class="btn btn-ghost ripple mt10" style="width:100%;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px">' +
      icon('camera') + ' Escanear Prato com Câmera (IA Vision)' +
      '<input type="file" accept="image/*" style="display:none" data-chg="nutr-scan-photo"></label>' +
      '<div id="nutr-ai-result" class="mt14"></div>' +
      '</div>';
  } else {
    loggingPanel =
      '<div class="card mt14 rise" style="--d:100ms">' +
      '<div class="rowline">' +
      '<div class="lbl">Lançamento Manual Rápido</div>' +
      '<span class="dim" style="font-size:12px">Preencha os valores</span>' +
      '</div>' +
      '<label class="flabel lbl mt8">Nome da Refeição</label>' +
      '<input class="fld mt8" id="nutr-man-name" placeholder="Ex.: Almoço, Lanche da tarde, Jantar..." maxlength="40">' +
      '<div class="split2 mt14">' +
      '<div><label class="flabel lbl">Calorias (Kcal) *</label>' +
      '<input class="fld mt8 num" id="nutr-man-kcal" type="number" inputmode="numeric" placeholder="550"></div>' +
      '<div><label class="flabel lbl" style="color:#38bdf8">Proteínas (g) *</label>' +
      '<input class="fld mt8 num" id="nutr-man-p" type="number" inputmode="numeric" placeholder="45"></div>' +
      '</div>' +
      '<div class="split2 mt14">' +
      '<div><label class="flabel lbl" style="color:#60a5fa">Carboidratos (g) *</label>' +
      '<input class="fld mt8 num" id="nutr-man-c" type="number" inputmode="numeric" placeholder="60"></div>' +
      '<div><label class="flabel lbl" style="color:#fbbf24">Gorduras (g) *</label>' +
      '<input class="fld mt8 num" id="nutr-man-f" type="number" inputmode="numeric" placeholder="15"></div>' +
      '</div>' +
      '<button class="btn btn-pri ripple mt20" style="width:100%" data-act="nutr-man-save">' +
      icon('plus') + ' Adicionar Refeição ao Diário</button>' +
      '</div>';
  }

  // Grid opcional de Micronutrientes (IDR)
  let microsSection = '';
  if(showMicros){
    const microKeys = Object.keys(RDA_TARGETS);
    const microGridHTML = microKeys.map(function(k){
      const meta = RDA_TARGETS[k];
      const val = todayMicros[k] || 0;
      const pct = Math.min(100, Math.round((val / meta.target) * 100));
      const cls = pct >= 80 ? 'ok' : pct >= 40 ? 'warn' : '';
      return '<div class="micro-item">' +
        '<div class="top"><span class="nm">' + meta.name + '</span>' +
        '<span class="val">' + (val % 1 === 0 ? val : val.toFixed(1)) + '<small class="dim" style="font-size:10px">/' + meta.target + meta.unit + '</small></span></div>' +
        '<div class="micro-track"><div class="micro-fill ' + cls + '" style="width:' + pct + '%"></div></div>' +
        '</div>';
    }).join('');

    microsSection =
      '<div class="card mt20 rise">' +
      '<div class="rowline"><div class="lbl" style="color:var(--acc)">Micronutrientes & Vitaminas (IDR)</div>' +
      '<button class="btn btn-ghost btn-sm ripple" data-act="nutr-toggle-micros">Ocultar</button></div>' +
      '<div class="micro-grid mt14">' + microGridHTML + '</div></div>';
  }

  const container = document.querySelector('.view[data-view="nutrition"]');
  container.innerHTML =
    '<div class="eyebrow rise">Combustível & Nutrição</div>' +
    '<div class="h-display h1 mt8 rise" style="--d:60ms">CONTADOR DE<br>MACROS & KCAL</div>' +

    // CARD PRINCIPAL: RESUMO DE KCAL & MACROS COM BARRAS DE PROGRESSO
    '<div class="macro-ring-card mt20 rise" style="--d:80ms">' +
    '<div class="rowline">' +
    '<div><div class="lbl" style="color:var(--mut)">Calorias de Hoje</div>' +
    '<b class="num" style="font-size:28px;color:#fff;font-family:var(--fd)">' + fmtN(consumedKcal) + '</b>' +
    '<span class="dim" style="font-size:15px;margin-left:4px">/ ' + fmtN(kcalTarget) + ' kcal</span></div>' +
    '<div style="text-align:right">' +
    (consumedKcal >= kcalTarget
      ? '<span class="chip ok">' + icon('check') + ' Meta Batida!</span>'
      : '<span class="chip" style="font-size:12px;color:var(--acc)">Restam ' + fmtN(remKcal) + ' kcal</span>') +
    '</div></div>' +

    // Barra geral de calorias
    '<div class="macro-bar-track mt14" style="height:8px"><div class="macro-bar-fill" style="width:' + pctKcal + '%;background:linear-gradient(90deg,#2563eb,#38bdf8)"></div></div>' +

    // 3 Cards dos Macronutrientes (Proteínas, Carboidratos e Gorduras)
    '<div class="split3 mt20" style="gap:10px">' +
    '<div class="macro-box p">' +
    '<div class="macro-box-title" style="color:#38bdf8">Proteínas</div>' +
    '<div class="macro-box-val" style="color:#38bdf8">' + fmtN(consumedP) + '<small style="font-size:13px;color:var(--dim)">/' + targetP + 'g</small></div>' +
    '<div class="macro-bar-track"><div class="macro-bar-fill" style="width:' + pctP + '%;background:#38bdf8"></div></div>' +
    '<div class="macro-box-sub">' + Math.max(0, targetP - consumedP) + 'g restantes</div>' +
    '</div>' +

    '<div class="macro-box c">' +
    '<div class="macro-box-title" style="color:#60a5fa">Carboidratos</div>' +
    '<div class="macro-box-val" style="color:#60a5fa">' + fmtN(consumedC) + '<small style="font-size:13px;color:var(--dim)">/' + targetC + 'g</small></div>' +
    '<div class="macro-bar-track"><div class="macro-bar-fill" style="width:' + pctC + '%;background:#60a5fa"></div></div>' +
    '<div class="macro-box-sub">' + Math.max(0, targetC - consumedC) + 'g restantes</div>' +
    '</div>' +

    '<div class="macro-box f">' +
    '<div class="macro-box-title" style="color:#fbbf24">Gorduras</div>' +
    '<div class="macro-box-val" style="color:#fbbf24">' + fmtN(consumedF) + '<small style="font-size:13px;color:var(--dim)">/' + targetF + 'g</small></div>' +
    '<div class="macro-bar-track"><div class="macro-bar-fill" style="width:' + pctF + '%;background:#fbbf24"></div></div>' +
    '<div class="macro-box-sub">' + Math.max(0, targetF - consumedF) + 'g restantes</div>' +
    '</div>' +
    '</div>' +
    '</div>' +

    // REGISTRO DE REFEIÇÃO: TABS (IA GEMINI vs MANUAL)
    '<div class="mt20">' +
    '<div class="tab-strip">' +
    '<button class="' + (nutrTab === 'ai' ? 'on' : '') + '" data-act="nutr-tab" data-arg="ai">' + icon('spark') + ' Contador com IA (Gemini)</button>' +
    '<button class="' + (nutrTab === 'manual' ? 'on' : '') + '" data-act="nutr-tab" data-arg="manual">' + icon('pencil') + ' Lançamento Manual</button>' +
    '</div>' +
    loggingPanel +
    '</div>' +

    // BANCO RÁPIDO DE ALIMENTOS
    '<div class="mt20 rise">' +
    '<div class="lbl">Adicionar Rápido (1-Toque)</div>' +
    '<div class="rowline mt8" style="gap:6px;overflow-x:auto;padding-bottom:6px;scrollbar-width:none">' +
    '<button class="chip ripple tap" data-act="nutr-quick-add" data-arg="frango">🍗 Frango 150g (46g P)</button>' +
    '<button class="chip ripple tap" data-act="nutr-quick-add" data-arg="ovos">🍳 3 Ovos (19g P)</button>' +
    '<button class="chip ripple tap" data-act="nutr-quick-add" data-arg="arroz_feijao">🍚 Arroz + Feijão</button>' +
    '<button class="chip ripple tap" data-act="nutr-quick-add" data-arg="whey">🥛 Whey 30g (24g P)</button>' +
    '<button class="chip ripple tap" data-act="nutr-quick-add" data-arg="banana_aveia">🍌 Banana + Aveia</button>' +
    '</div></div>' +

    // DIÁRIO DE REFEIÇÕES DE HOJE
    '<div class="mt24 rise" style="--d:170ms">' +
    '<div class="rowline"><div class="lbl">Diário de Refeições (' + todayMeals.length + ')</div>' +
    (todayMeals.length ? '<button class="btn btn-sm btn-ghost ripple" data-act="nutr-meals-clear">' + icon('trash') + ' Limpar dia</button>' : '') + '</div>' +
    '<div class="stack mt14">' + (mealRows || '<div class="empty">Nenhuma refeição registrada hoje. Use o contador da IA acima ou o lançamento manual para registrar seus macros.</div>') + '</div>' +
    '</div>' +

    // BOTÃO PARA VER MICRONUTRIENTES (OPCIONAL)
    (!showMicros ?
      '<button class="btn btn-ghost ripple mt20" style="width:100%" data-act="nutr-toggle-micros">' +
      icon('brain') + ' 🔬 Consultar Micronutrientes (Ferro, Zinco, Cálcio, Vitaminas)</button>'
      : microsSection) +

    // METAS DE TMB / TDEE & DISTRIBUIÇÃO DE MACROS
    '<div class="card mt28 rise" style="--d:200ms">' +
    '<div class="lbl">Metas Metabólicas & TDEE</div>' +
    (has ?
      '<div class="kv mt8"><span class="mut">Taxa Metabólica Basal (TMB)</span><b class="num">' + fmtN(auto.tmb) + ' kcal</b></div>' +
      '<div class="kv"><span class="mut">Gasto Energético Total (TDEE)</span><b class="num">' + fmtN(auto.tdee) + ' kcal</b></div>' +
      '<div class="kv"><span class="mut">Meta Recomendada (' + goalLabel(u.goal) + ')</span><b class="num" style="color:var(--acc)">' + fmtN(auto.kcal) + ' kcal/dia</b></div>' +
      '<div class="rowline mt14"><div class="lbl">Distribuição de Macros</div><div class="rowline" style="gap:6px">' +
      '<button class="chip ripple ' + (!custom ? 'on' : '') + '" data-act="nutr-mode" data-arg="auto">Automática</button>' +
      '<button class="chip ripple ' + (custom ? 'on' : '') + '" data-act="nutr-mode" data-arg="custom">Manual</button></div></div>' +
      '<div class="donutwrap mt14"><canvas class="chart" id="donut-cv" data-h="190"></canvas></div>' +
      '<div class="split3 mt8" style="text-align:center">' +
      '<div><b class="num" style="color:#38bdf8;font-family:var(--fd);font-size:22px">' + fmtN(targetP) + 'g</b><div class="lbl mt8">Proteína</div></div>' +
      '<div><b class="num" style="color:#60a5fa;font-family:var(--fd);font-size:22px">' + fmtN(targetC) + 'g</b><div class="lbl mt8">Carbo</div></div>' +
      '<div><b class="num" style="color:#fbbf24;font-family:var(--fd);font-size:22px">' + fmtN(targetF) + 'g</b><div class="lbl mt8">Gordura</div></div></div>' +
      macroSliders
      :
      '<div class="empty mt14">Preencha seu peso, altura, idade e sexo em Perfil para calcular TMB e TDEE.<br><br>' +
      '<button class="btn btn-pri ripple" data-act="prof-edit">' + icon('user') + ' Configurar meu perfil</button></div>'
    ) +
    '</div>';

  if(has){
    requestAnimationFrame(function(){
      const cv = document.getElementById('donut-cv');
      if(cv) drawDonut(cv, [{k:'p',v:targetP},{k:'c',v:targetC},{k:'f',v:targetF}], fmtN(kcalTarget), 'kcal / dia');
    });
  }
};

/* Alternar visualização de micronutrientes */
function toggleMicros(){
  showMicros = !showMicros;
  RENDER.nutrition();
}

/* Execução da Análise de Refeição pela IA */
async function runNutritionAIAnalysis(){
  const input = document.getElementById('nutr-ai-input');
  const btn = document.getElementById('nutr-ai-btn');
  const resEl = document.getElementById('nutr-ai-result');
  if(!input || !input.value.trim()) return toast('Descreva o que você comeu para a IA analisar.', 'bad');

  if(btn){
    btn.disabled = true;
    btn.innerHTML = icon('sync', 'spin') + ' IA calculando macros & calorias...';
  }

  const analysis = await analyzeMealWithAI(input.value.trim());

  if(btn){
    btn.disabled = false;
    btn.innerHTML = icon('spark') + ' Analisar Outro Alimento com IA';
  }

  if(!analysis){
    if(resEl) resEl.innerHTML = '<div class="empty">Não foi possível analisar esta refeição. Tente detalhar melhor.</div>';
    return;
  }

  state.nutrition.lastAnalysis = analysis;

  if(resEl){
    resEl.innerHTML =
      '<div class="card acc newpop mt14">' +
      '<div class="rowline">' +
      '<b style="font-size:16px;color:var(--acc)">' + esc(analysis.name) + '</b>' +
      '<span class="num" style="font-size:20px;font-weight:700;color:#fff">' + fmtN(analysis.kcal) + ' kcal</span></div>' +
      '<div class="split3 mt14" style="text-align:center">' +
      '<div style="background:rgba(56,189,248,.1);padding:10px;border-radius:10px"><b class="num" style="color:#38bdf8;font-size:18px">' + analysis.p + 'g</b><div class="dim mt8" style="font-size:11px">Proteína</div></div>' +
      '<div style="background:rgba(96,165,250,.1);padding:10px;border-radius:10px"><b class="num" style="color:#60a5fa;font-size:18px">' + analysis.c + 'g</b><div class="dim mt8" style="font-size:11px">Carbo</div></div>' +
      '<div style="background:rgba(251,191,36,.1);padding:10px;border-radius:10px"><b class="num" style="color:#fbbf24;font-size:18px">' + analysis.f + 'g</b><div class="dim mt8" style="font-size:11px">Gordura</div></div>' +
      '</div>' +
      (analysis.tip ? '<p class="mut mt14" style="font-size:12.5px;line-height:1.5;background:rgba(10,15,29,.5);padding:10px 12px;border-radius:10px"><b style="color:var(--acc)">Dica:</b> ' + esc(analysis.tip) + '</p>' : '') +
      '<button class="btn btn-pri ripple mt14" style="width:100%" data-act="nutr-meal-save">' +
      icon('plus') + ' Adicionar ao Diário de Hoje</button>' +
      '</div>';
  }
}

/* Salva análise da IA no diário */
function saveLastAnalysisToDiary(){
  if(!state.nutrition.lastAnalysis) return;
  state.nutrition.meals = state.nutrition.meals || [];
  state.nutrition.meals.unshift(state.nutrition.lastAnalysis);
  state.nutrition.lastAnalysis = null;
  save();
  toast('Refeição registrada no diário com sucesso!', 'ok', 'apple');
  RENDER.nutrition();
}

/* Salva lançamento manual direto no diário */
function saveManualMeal(){
  const nameEl = document.getElementById('nutr-man-name');
  const kcalEl = document.getElementById('nutr-man-kcal');
  const pEl = document.getElementById('nutr-man-p');
  const cEl = document.getElementById('nutr-man-c');
  const fEl = document.getElementById('nutr-man-f');

  const kcal = parseNum(kcalEl ? kcalEl.value : 0);
  const p = parseNum(pEl ? pEl.value : 0);
  const c = parseNum(cEl ? cEl.value : 0);
  const f = parseNum(fEl ? fEl.value : 0);
  const name = (nameEl && nameEl.value.trim()) || 'Refeição Manual';

  if(!kcal && !p && !c && !f){
    toast('Preencha os valores de calorias ou macronutrientes.', 'bad');
    return;
  }

  // Se informou macros mas não kcal, calcula kcal = 4*p + 4*c + 9*f
  const finalKcal = kcal > 0 ? kcal : Math.round(p*4 + c*4 + f*9);

  const meal = {
    id: uid(),
    name: name,
    text: p + 'g P · ' + c + 'g C · ' + f + 'g G',
    kcal: finalKcal,
    p: p,
    c: c,
    f: f,
    fiber: 0,
    at: Date.now()
  };

  state.nutrition.meals = state.nutrition.meals || [];
  state.nutrition.meals.unshift(meal);
  save();
  toast('Refeição "' + name + '" adicionada aos macros de hoje!', 'ok', 'check');
  RENDER.nutrition();
}

/* Adição rápida de alimentos padrão */
function quickAddFood(type){
  const foods = {
    frango: { name: 'Peito de Frango Grelhado (150g)', kcal: 247, p: 46, c: 0, f: 5, fiber: 0, text: '150g filé de peito de frango grelhado' },
    ovos: { name: '3 Ovos Cozidos / Mexidos', kcal: 225, p: 19, c: 2, f: 16, fiber: 0, text: '3 unidades de ovos inteiros' },
    arroz_feijao: { name: 'Arroz Branco + Feijão Carioca (200g)', kcal: 270, p: 11, c: 52, f: 1.5, fiber: 8, text: '120g arroz + 80g feijão' },
    whey: { name: 'Dose de Whey Protein (30g)', kcal: 120, p: 24, c: 3, f: 1.5, fiber: 0, text: '1 scoop de 30g com água' },
    banana_aveia: { name: 'Banana Prata com Aveia em Flocos', kcal: 255, p: 6.5, c: 54, f: 3, fiber: 7, text: '1 banana + 40g aveia' }
  };
  const f = foods[type];
  if(!f) return;
  const meal = Object.assign({ id: uid(), at: Date.now() }, f);
  state.nutrition.meals = state.nutrition.meals || [];
  state.nutrition.meals.unshift(meal);
  save();
  buzz([25]);
  toast('"' + f.name + '" adicionado aos macros!', 'ok', 'apple');
  RENDER.nutrition();
}

/* Escaneamento e análise de foto de refeição */
function handleMealPhotoUpload(file){
  if(!file) return;
  const reader = new FileReader();
  modalHTML(
    '<div class="sheet-grip"></div>' +
    '<div class="rowline"><div class="h-display h2">VISÃO COMPUTACIONAL IA</div>' +
    '<div style="color:var(--acc)">' + icon('camera') + '</div></div>' +
    '<div class="card mt14" style="text-align:center;padding:24px 16px">' +
    '<div style="width:50px;height:50px;border-radius:16px;background:var(--acc-deep);color:var(--acc);margin:0 auto 12px;display:flex;align-items:center;justify-content:center">' +
    icon('sync', 'spin') + '</div>' +
    '<b style="font-size:16px">Escaneando Prato e Alimentos...</b>' +
    '<p class="mut mt8" style="font-size:13px">Identificando porções, gramatura, macronutrientes e micronutrientes com Gemini Vision.</p>' +
    '</div>'
  );

  reader.onload = async function(evt){
    try{
      const dataUrl = evt.target.result;
      const base64 = dataUrl.split(',')[1];
      const mime = file.type || 'image/jpeg';
      const analysis = await analyzeMealPhotoWithAI(base64, mime);

      modalHTML(
        '<div class="sheet-grip"></div>' +
        '<div class="rowline"><div class="h-display h2">PRATO ESCANEADO</div>' +
        '<div style="color:var(--ok)">' + icon('check') + '</div></div>' +
        '<div class="card acc mt14">' +
        '<div class="rowline">' +
        '<b style="font-size:16px;color:var(--acc)">' + esc(analysis.name) + '</b>' +
        '<span class="num" style="font-size:22px;font-weight:700;color:#fff">' + fmtN(analysis.kcal) + ' kcal</span></div>' +
        (analysis.items && analysis.items.length ?
          '<div class="dim mt8" style="font-size:12px;line-height:1.5">Alimentos identificados: ' + esc(analysis.items.join(', ')) + '</div>' : '') +
        '<div class="split3 mt14" style="text-align:center">' +
        '<div style="background:rgba(56,189,248,.1);padding:10px;border-radius:10px"><b class="num" style="color:#38bdf8;font-size:18px">' + analysis.p + 'g</b><div class="dim mt8" style="font-size:11px">Proteína</div></div>' +
        '<div style="background:rgba(96,165,250,.1);padding:10px;border-radius:10px"><b class="num" style="color:#60a5fa;font-size:18px">' + analysis.c + 'g</b><div class="dim mt8" style="font-size:11px">Carbo</div></div>' +
        '<div style="background:rgba(251,191,36,.1);padding:10px;border-radius:10px"><b class="num" style="color:#fbbf24;font-size:18px">' + analysis.f + 'g</b><div class="dim mt8" style="font-size:11px">Gordura</div></div>' +
        '</div>' +
        (analysis.tip ? '<p class="mut mt14" style="font-size:12.5px;line-height:1.5;background:rgba(10,15,29,.5);padding:10px 12px;border-radius:10px"><b style="color:var(--acc)">Dica:</b> ' + esc(analysis.tip) + '</p>' : '') +
        '<button class="btn btn-pri ripple mt14" style="width:100%" id="btn-save-scanned-meal">' +
        icon('plus') + ' Confirmar e Adicionar aos Macros de Hoje</button>' +
        '</div>'
      );

      const saveBtn = document.getElementById('btn-save-scanned-meal');
      if(saveBtn){
        saveBtn.onclick = function(){
          state.nutrition.meals = state.nutrition.meals || [];
          state.nutrition.meals.unshift(analysis);
          save();
          closeModal();
          toast('Prato fotografado registrado com sucesso!', 'ok', 'apple');
          RENDER.nutrition();
        };
      }
    }catch(err){
      closeModal();
      toast('Erro ao processar imagem.', 'bad');
    }
  };
  reader.readAsDataURL(file);
}
