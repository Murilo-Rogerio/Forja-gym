function activityLabel(a){
  return { sedentario:'Sedentário', leve:'Levemente ativo', moderado:'Moderadamente ativo',
    intenso:'Muito ativo', atleta:'Atleta' }[a] || a;
}
function goalLabel(g){ return { cut:'Cutting', manter:'Manutenção', bulk:'Bulking' }[g] || g; }
function calcNutrition(){
  const u = state.user;
  if(!u.weight || !u.height || !u.age) return null;
  const tmb = Math.round(10*u.weight + 6.25*u.height - 5*u.age + (u.sex==='m' ? 5 : -161));
  const f = { sedentario:1.2, leve:1.375, moderado:1.55, intenso:1.725, atleta:1.9 }[u.activity] || 1.55;
  const tdee = Math.round(tmb*f);
  const kcal = Math.round(tdee * ({ cut:.8, manter:1, bulk:1.15 }[u.goal] || 1));
  const p = Math.round(u.weight*2);
  const fat = Math.round(kcal*.25/9);
  const c = Math.max(0, Math.round((kcal - p*4 - fat*9)/4));
  return { tmb: tmb, tdee: tdee, kcal: kcal, p: p, c: c, f: fat };
}

RENDER.nutrition = function(){
  const u = state.user, has = u.weight && u.height && u.age;
  const auto = calcNutrition(), custom = state.nutrition.custom;
  const kcal = custom ? custom.p*4 + custom.c*4 + custom.f*9 : (auto ? auto.kcal : 0);
  const P = custom ? custom.p : (auto?auto.p:0), C = custom ? custom.c : (auto?auto.c:0), F = custom ? custom.f : (auto?auto.f:0);
  let body = '';
  if(!has){
    body = '<div class="empty mt20">Preencha seu perfil (peso, altura, idade e sexo) para calcular TMB e TDEE.<br><br>' +
      '<button class="btn btn-pri ripple" data-act="prof-edit">' + icon('user') + ' Preencher perfil</button></div>';
  } else {
    let macroBlock = '';
    if(custom){
      macroBlock = '<div class="card mt20">' +
        '<div class="lbl" style="color:#38bdf8">Proteína · <span class="num" id="mg-p">' + custom.p + 'g</span></div>' +
        '<input type="range" min="60" max="300" step="5" value="' + custom.p + '" data-inp="macro-p" class="mt8">' +
        '<div class="lbl mt14" style="color:#60a5fa">Carboidrato · <span class="num" id="mg-c">' + custom.c + 'g</span></div>' +
        '<input type="range" min="50" max="500" step="10" value="' + custom.c + '" data-inp="macro-c" class="mt8">' +
        '<div class="lbl mt14" style="color:#fbbf24">Gordura · <span class="num" id="mg-f">' + custom.f + 'g</span></div>' +
        '<input type="range" min="20" max="150" step="5" value="' + custom.f + '" data-inp="macro-f" class="mt8">' +
        '<div class="rowline mt14"><span class="mut">Total calórico</span><b class="num" id="nutr-total" style="color:var(--acc)">' + fmtN(kcal) + ' kcal</b></div></div>';
    } else {
      macroBlock = '<p class="mut mt14" style="font-size:13px;line-height:1.6">Distribuição automática: <b style="color:#38bdf8">' + fmtN(P) + 'g</b> de proteína (2g/kg), ' +
        '<b style="color:#fbbf24">' + fmtN(F) + 'g</b> de gordura (25% das kcal) e o restante em <b style="color:#60a5fa">' + fmtN(C) + 'g</b> de carboidrato.</p>';
    }
    body = '<div class="card mt20 rise"><div class="kv"><span class="mut">TMB (Mifflin-St Jeor)</span><b class="num">' + fmtN(auto.tmb) + ' kcal</b></div>' +
      '<div class="kv"><span class="mut">TDEE (' + esc(activityLabel(u.activity)) + ')</span><b class="num">' + fmtN(auto.tdee) + ' kcal</b></div>' +
      '<div class="kv"><span class="mut">Objetivo (' + goalLabel(u.goal) + ')</span><b class="num" style="color:var(--acc)">' + fmtN(auto.kcal) + ' kcal/dia</b></div></div>' +
      '<div class="mt20 rise" style="--d:80ms"><div class="rowline"><div class="lbl">Meta de macros</div><div class="rowline" style="gap:6px">' +
      '<button class="chip ripple ' + (!custom?'on':'') + '" data-act="nutr-mode" data-arg="auto">Automática</button>' +
      '<button class="chip ripple ' + (custom?'on':'') + '" data-act="nutr-mode" data-arg="custom">Personalizada</button></div></div>' +
      '<div class="donutwrap mt14"><canvas class="chart" id="donut-cv" data-h="190"></canvas></div>' +
      '<div class="split3 mt8" style="text-align:center">' +
      '<div><b class="num" style="color:#38bdf8;font-family:var(--fd);font-size:22px">' + fmtN(P) + 'g</b><div class="lbl mt8">Proteína</div></div>' +
      '<div><b class="num" style="color:#60a5fa;font-family:var(--fd);font-size:22px">' + fmtN(C) + 'g</b><div class="lbl mt8">Carbo</div></div>' +
      '<div><b class="num" style="color:#fbbf24;font-family:var(--fd);font-size:22px">' + fmtN(F) + 'g</b><div class="lbl mt8">Gordura</div></div></div>' +
      macroBlock + '</div>';
  }
  document.querySelector('.view[data-view="nutrition"]').innerHTML =
    '<div class="eyebrow rise">Combustível</div><div class="h-display h1 mt8 rise" style="--d:60ms">NUTRIÇÃO<br>& MACROS</div>' + body;
  if(has){
    requestAnimationFrame(function(){
      const cv = document.getElementById('donut-cv');
      if(cv) drawDonut(cv, [{k:'p',v:P},{k:'c',v:C},{k:'f',v:F}], fmtN(kcal), 'kcal / dia');
    });
  }
};
