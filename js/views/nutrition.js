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

/* Renderização da visualização de Nutrição & Micronutrientes */
RENDER.nutrition = function(){
  const u = state.user, has = u.weight && u.height && u.age;
  const auto = calcNutrition(), custom = state.nutrition.custom;
  const kcalTarget = custom ? custom.p*4 + custom.c*4 + custom.f*9 : (auto ? auto.kcal : 0);
  const P = custom ? custom.p : (auto ? auto.p : 0);
  const C = custom ? custom.c : (auto ? auto.c : 0);
  const F = custom ? custom.f : (auto ? auto.f : 0);

  // Refeições de hoje
  const startOfDay = new Date(); startOfDay.setHours(0,0,0,0);
  const todayMeals = (state.nutrition.meals || []).filter(function(m){
    return m.at >= startOfDay.getTime();
  });

  const consumedKcal = todayMeals.reduce(function(s, m){ return s + (m.kcal || 0); }, 0);
  const consumedP = todayMeals.reduce(function(s, m){ return s + (m.p || 0); }, 0);
  const consumedC = todayMeals.reduce(function(s, m){ return s + (m.c || 0); }, 0);
  const consumedF = todayMeals.reduce(function(s, m){ return s + (m.f || 0); }, 0);

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
      '<input type="range" min="60" max="300" step="5" value="' + custom.p + '" data-inp="macro-p" class="mt8">' +
      '<div class="lbl mt14" style="color:#60a5fa">Carboidrato · <span class="num" id="mg-c">' + custom.c + 'g</span></div>' +
      '<input type="range" min="50" max="500" step="10" value="' + custom.c + '" data-inp="macro-c" class="mt8">' +
      '<div class="lbl mt14" style="color:#fbbf24">Gordura · <span class="num" id="mg-f">' + custom.f + 'g</span></div>' +
      '<input type="range" min="20" max="150" step="5" value="' + custom.f + '" data-inp="macro-f" class="mt8">' +
      '<div class="rowline mt14"><span class="mut">Meta Calórica Diária</span><b class="num" id="nutr-total" style="color:var(--acc)">' + fmtN(kcalTarget) + ' kcal</b></div></div>';
  }

  // Lista de refeições registradas
  const mealRows = todayMeals.map(function(m, idx){
    return '<div class="wrow" style="padding:12px 14px;margin-bottom:8px">' +
      '<div style="flex:1">' +
      '<div class="rowline"><b>' + esc(m.name || 'Refeição') + '</b>' +
      '<span class="num" style="color:var(--acc);font-weight:700">' + fmtN(m.kcal) + ' kcal</span></div>' +
      '<div class="mut mt8" style="font-size:12px">' +
      'P: <b style="color:#38bdf8">' + m.p + 'g</b> · C: <b style="color:#60a5fa">' + m.c + 'g</b> · G: <b style="color:#fbbf24">' + m.f + 'g</b>' +
      (m.fiber ? ' · Fibras: ' + m.fiber + 'g' : '') +
      '</div>' +
      '<div class="dim mt8" style="font-size:11.5px">' + esc(m.text) + '</div>' +
      '</div>' +
      '<button class="iconbtn ripple" style="width:34px;height:34px;color:var(--bad)" data-act="nutr-meal-del" data-arg="' + m.id + '" aria-label="Remover">' + icon('trash') + '</button>' +
      '</div>';
  }).join('');

  // Grid de micronutrientes
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

  const container = document.querySelector('.view[data-view="nutrition"]');
  container.innerHTML =
    '<div class="eyebrow rise">Combustível & Performance</div>' +
    '<div class="h-display h1 mt8 rise" style="--d:60ms">NUTRIÇÃO &<br>MICRONUTRIENTES</div>' +

    // CARD PRINCIPAL: IA CONTADOR DE MACROS & MICROS
    '<div class="card acc mt20 rise" style="--d:100ms">' +
    '<div class="rowline">' +
    '<div><div class="lbl" style="display:flex;align-items:center;gap:7px;color:var(--acc)"><span class="dot-live"></span>IA Nutricionista (Gemini)</div>' +
    '<b style="font-size:16px;display:block;margin-top:4px">Contador Inteligente de Alimentos</b></div>' +
    '<div style="width:40px;height:40px;border-radius:12px;background:rgba(56,189,248,.15);color:var(--acc);display:flex;align-items:center;justify-content:center">' + icon('brain') + '</div>' +
    '</div>' +
    '<p class="mut mt8" style="font-size:13px;line-height:1.5">' +
    'Descreva o que você comeu. A IA calcula calorias, macronutrientes e os micronutrientes essenciais (ferro, zinco, magnésio, vitaminas):</p>' +
    '<textarea class="fld mt14" id="nutr-ai-input" placeholder="Ex.: 3 ovos mexidos, 150g de filé de frango grelhado, 100g de arroz e 1 maçã..."></textarea>' +
    '<div class="rowline mt8" style="gap:6px;flex-wrap:wrap">' +
    '<button class="chip ripple" data-act="nutr-chip" data-arg="3 ovos mexidos, 2 fatias de pão integral e 1 banana">Café fit</button>' +
    '<button class="chip ripple" data-act="nutr-chip" data-arg="150g de peito de frango, 120g de arroz branco e 80g de brócolis">Almoço anabólico</button>' +
    '<button class="chip ripple" data-act="nutr-chip" data-arg="30g de whey protein, 1 banana, 40g de aveia e 200ml de leite">Shake pós-treino</button>' +
    '</div>' +
    '<button class="btn btn-pri ripple mt14" style="width:100%" data-act="nutr-ai-analyze" id="nutr-ai-btn">' +
    icon('spark') + ' Analisar Alimento com IA</button>' +
    '<div id="nutr-ai-result" class="mt14"></div>' +
    '</div>' +

    // CONSUMO DE HOJE & MICRONUTRIENTES
    '<div class="card mt20 rise" style="--d:140ms">' +
    '<div class="rowline">' +
    '<div class="lbl">Consumo de Hoje</div>' +
    '<b class="num" style="color:var(--acc);font-size:17px">' + fmtN(consumedKcal) + (kcalTarget ? ' / ' + fmtN(kcalTarget) + ' kcal' : ' kcal') + '</b>' +
    '</div>' +
    '<div class="split3 mt14" style="text-align:center">' +
    '<div style="background:rgba(56,189,248,.08);padding:10px;border-radius:11px;border:1px solid rgba(56,189,248,.25)">' +
    '<b class="num" style="color:#38bdf8;font-size:20px">' + fmtN(consumedP) + 'g</b><div class="lbl mt8" style="font-size:10px">Proteína</div></div>' +
    '<div style="background:rgba(96,165,250,.08);padding:10px;border-radius:11px;border:1px solid rgba(96,165,250,.25)">' +
    '<b class="num" style="color:#60a5fa;font-size:20px">' + fmtN(consumedC) + 'g</b><div class="lbl mt8" style="font-size:10px">Carbo</div></div>' +
    '<div style="background:rgba(251,191,36,.08);padding:10px;border-radius:11px;border:1px solid rgba(251,191,36,.25)">' +
    '<b class="num" style="color:#fbbf24;font-size:20px">' + fmtN(consumedF) + 'g</b><div class="lbl mt8" style="font-size:10px">Gordura</div></div>' +
    '</div>' +

    '<div class="lbl mt20" style="color:var(--acc)">Micronutrientes Essenciais (Progresso Diário / IDR)</div>' +
    '<div class="micro-grid mt14">' + microGridHTML + '</div>' +
    '</div>' +

    // DIÁRIO DE REFEIÇÕES DE HOJE
    '<div class="mt20 rise" style="--d:170ms">' +
    '<div class="rowline"><div class="lbl">Diário de Refeições (' + todayMeals.length + ')</div>' +
    (todayMeals.length ? '<button class="btn btn-sm btn-ghost ripple" data-act="nutr-meals-clear">' + icon('trash') + ' Limpar dia</button>' : '') + '</div>' +
    '<div class="stack mt14">' + (mealRows || '<div class="empty">Nenhuma refeição registrada hoje. Use o analisador da IA acima para registrar.</div>') + '</div>' +
    '</div>' +

    // METAS DE TMB / TDEE & MACROS
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
      '<div><b class="num" style="color:#38bdf8;font-family:var(--fd);font-size:22px">' + fmtN(P) + 'g</b><div class="lbl mt8">Proteína</div></div>' +
      '<div><b class="num" style="color:#60a5fa;font-family:var(--fd);font-size:22px">' + fmtN(C) + 'g</b><div class="lbl mt8">Carbo</div></div>' +
      '<div><b class="num" style="color:#fbbf24;font-family:var(--fd);font-size:22px">' + fmtN(F) + 'g</b><div class="lbl mt8">Gordura</div></div></div>' +
      macroSliders
      :
      '<div class="empty mt14">Preencha seu peso, altura, idade e sexo em Perfil para calcular TMB e TDEE.<br><br>' +
      '<button class="btn btn-pri ripple" data-act="prof-edit">' + icon('user') + ' Configurar meu perfil</button></div>'
    ) +
    '</div>';

  if(has){
    requestAnimationFrame(function(){
      const cv = document.getElementById('donut-cv');
      if(cv) drawDonut(cv, [{k:'p',v:P},{k:'c',v:C},{k:'f',v:F}], fmtN(kcalTarget), 'kcal / dia');
    });
  }
};

/* Execução da Análise de Refeição pela IA */
async function runNutritionAIAnalysis(){
  const input = document.getElementById('nutr-ai-input');
  const btn = document.getElementById('nutr-ai-btn');
  const resEl = document.getElementById('nutr-ai-result');
  if(!input || !input.value.trim()) return toast('Descreva o que você comeu para a IA analisar.', 'bad');

  if(btn){
    btn.disabled = true;
    btn.innerHTML = icon('sync', 'spin') + ' IA calculando macros & micronutrientes...';
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
      '<span class="num" style="font-size:18px;font-weight:700">' + fmtN(analysis.kcal) + ' kcal</span></div>' +
      '<div class="split3 mt14" style="text-align:center">' +
      '<div style="background:rgba(56,189,248,.1);padding:8px;border-radius:9px"><b class="num" style="color:#38bdf8">' + analysis.p + 'g</b><div class="dim" style="font-size:11px">Proteína</div></div>' +
      '<div style="background:rgba(96,165,250,.1);padding:8px;border-radius:9px"><b class="num" style="color:#60a5fa">' + analysis.c + 'g</b><div class="dim" style="font-size:11px">Carbo</div></div>' +
      '<div style="background:rgba(251,191,36,.1);padding:8px;border-radius:9px"><b class="num" style="color:#fbbf24">' + analysis.f + 'g</b><div class="dim" style="font-size:11px">Gordura</div></div>' +
      '</div>' +
      '<div class="lbl mt14" style="color:var(--mut)">Micronutrientes Chave Detectados</div>' +
      '<div class="rowline mt8" style="gap:6px;flex-wrap:wrap">' +
      '<span class="chip">Ferro: ' + analysis.iron + 'mg</span>' +
      '<span class="chip">Zinco: ' + analysis.zinc + 'mg</span>' +
      '<span class="chip">Cálcio: ' + analysis.calcium + 'mg</span>' +
      '<span class="chip">Magnésio: ' + analysis.magnesium + 'mg</span>' +
      '<span class="chip">Vit. C: ' + analysis.vitC + 'mg</span>' +
      '<span class="chip">Vit. B12: ' + analysis.vitB12 + 'mcg</span>' +
      (analysis.fiber ? '<span class="chip">Fibras: ' + analysis.fiber + 'g</span>' : '') +
      '</div>' +
      (analysis.tip ? '<p class="mut mt14" style="font-size:12.5px;line-height:1.5;background:rgba(10,15,29,.5);padding:10px 12px;border-radius:10px"><b style="color:var(--acc)">Dica da IA:</b> ' + esc(analysis.tip) + '</p>' : '') +
      '<button class="btn btn-pri ripple mt14" style="width:100%" data-act="nutr-meal-save">' +
      icon('plus') + ' Adicionar ao Diário de Hoje</button>' +
      '</div>';
  }
}

function saveLastAnalysisToDiary(){
  if(!state.nutrition.lastAnalysis) return;
  state.nutrition.meals = state.nutrition.meals || [];
  state.nutrition.meals.unshift(state.nutrition.lastAnalysis);
  state.nutrition.lastAnalysis = null;
  save();
  toast('Refeição registrada no diário com sucesso!', 'ok', 'apple');
  RENDER.nutrition();
}
