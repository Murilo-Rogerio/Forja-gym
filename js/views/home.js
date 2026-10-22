function greetWord(){
  const h = new Date().getHours();
  return h < 12 ? 'BOM DIA,' : h < 18 ? 'BOA TARDE,' : 'BOA NOITE,';
}

RENDER.home = function(){
  const u = state.user, li = levelInfo(u.xp), wk = weeklyStats();
  const streak = weekStreak(), w = suggestedWorkout();
  const spark = [];
  for(let i=13; i>=0; i--){
    const d = new Date(); d.setDate(d.getDate()-i); d.setHours(23,59,59,999);
    spark.push((state.logs||[]).filter(function(l){ return l.date <= d.getTime() && l.date > d.getTime()-86400000; })
      .reduce(function(s,l){ return s+l.volume; },0));
  }
  const today = new Date().toLocaleDateString('pt-BR',{weekday:'short',day:'numeric',month:'short'}).toUpperCase();

  let heroCard = '';
  if(w){
    heroCard = '<div class="card acc tap rise" style="--d:120ms" data-act="w-start" data-arg="' + w.id + '">' +
      '<div class="rowline"><div><div class="lbl" style="color:var(--acc)">Treino sugerido para hoje</div>' +
      '<div class="h-display h2 mt8">' + esc(w.name) + '</div>' +
      '<div class="mut mt8" style="font-size:13px">' + w.ex.length + ' exercícios · ' +
      w.ex.reduce(function(s,e){ return s + e.sets.length; },0) + ' séries (cargas em branco)</div></div>' +
      '<div style="width:54px;height:54px;border-radius:16px;background:var(--acc);color:#04121f;display:flex;align-items:center;justify-content:center;box-shadow:0 0 18px rgba(56,189,248,.4)">' +
      icon('play') + '</div></div></div>';
  } else {
    heroCard = '<div class="card mt14 rise" style="text-align:center;padding:28px 18px">' +
      '<b style="font-size:17px;font-family:var(--fd);letter-spacing:.5px;text-transform:uppercase">Nenhuma ficha ativa ainda</b>' +
      '<p class="mut mt8" style="font-size:13px;line-height:1.5">Crie sua própria ficha ou deixe a IA gerar uma rotina sob medida para seu objetivo.</p>' +
      '<div class="rowline mt14" style="justify-content:center;gap:8px">' +
      '<button class="btn btn-pri ripple" data-act="w-new">' + icon('plus') + ' Criar Ficha</button>' +
      '<button class="btn btn-ai ripple" data-act="ai-open">' + icon('wand') + ' Gerar com IA</button>' +
      '</div></div>';
  }

  let aiCard = '';
  if(state.logs && state.logs.length){
    aiCard = '<div class="card mt14 rise" style="--d:190ms;display:flex;gap:14px;align-items:center">' +
      '<div style="width:42px;height:42px;border-radius:12px;background:rgba(56,189,248,.12);color:var(--acc);display:flex;align-items:center;justify-content:center;flex:none">' + icon('brain') + '</div>' +
      '<div style="flex:1"><div class="lbl" style="display:flex;align-items:center;gap:7px"><span class="dot-live"></span>AI Coach</div>' +
      '<p class="mt8" style="font-size:13.5px;line-height:1.5">' + esc(dailyInsight()) + '</p></div>' +
      '<button class="iconbtn ripple" data-act="coach-open" aria-label="Abrir AI Coach">' + icon('fwd') + '</button></div>';
  } else {
    aiCard = '<div class="card acc mt14 rise" style="--d:190ms;display:flex;gap:14px;align-items:center;cursor:pointer" data-act="ai-open">' +
      '<div style="width:42px;height:42px;border-radius:12px;background:rgba(56,189,248,.15);color:var(--acc);display:flex;align-items:center;justify-content:center;flex:none">' + icon('wand') + '</div>' +
      '<div style="flex:1"><div class="lbl" style="display:flex;align-items:center;gap:7px;color:var(--acc)"><span class="dot-live"></span>Assistente IA de Treinos (Gemini)</div>' +
      '<p class="mt8" style="font-size:13.5px;line-height:1.4">Deseja criar um treino novo do seu jeito? Toque para a IA montar seu programa personalizado.</p></div>' +
      '<span class="chip ai">' + icon('spark') + ' Abrir IA</span></div>';
  }

  let sparkBlock = '';
  if(state.logs && state.logs.length){
    sparkBlock = '<div class="mt20 rise" style="--d:260ms"><div class="rowline"><div class="lbl">Últimos 14 dias</div>' +
      '<span class="dim num" style="font-size:12px">' + fmtKg(spark.reduce(function(a,b){ return a+b; },0)) + '</span></div>' +
      '<div class="chartwrap mt8"><canvas class="chart" id="spark-cv" data-h="64"></canvas></div></div>';
  }

  let recent = '';
  if(state.logs && state.logs.length){
    recent = '<div class="mt20 rise" style="--d:320ms"><div class="lbl">Sessões recentes</div>' +
      state.logs.slice().sort(function(a,b){ return b.date-a.date; }).slice(0,3).map(function(l){
        const prTxt = l.prCount ? ' · <span style="color:var(--acc)">' + l.prCount + ' PR' + (l.prCount>1?'s':'') + '</span>' : '';
        return '<button class="wrow ripple" data-act="log-detail" data-arg="' + l.id + '" style="width:100%;text-align:left">' +
          '<div class="wsplit">' + esc(splitTag(l.name)) + '</div>' +
          '<div style="flex:1"><b style="font-family:var(--fd);font-size:16px;letter-spacing:.5px;text-transform:uppercase">' + esc(l.name) + '</b>' +
          '<div class="mut" style="font-size:12.5px;margin-top:2px">' + fmtDate(l.date) + ' · ' + fmtKg(l.volume) + prTxt + '</div></div>' +
          icon('fwd') + '</button>';
      }).join('') + '</div>';
  } else {
    recent = '<div class="card mt20 rise" style="--d:280ms;text-align:center;padding:22px 18px">' +
      '<div class="lbl" style="color:var(--mut)">Registro Real de Cargas</div>' +
      '<p class="mut mt8" style="font-size:13px;line-height:1.5">Conclua sua primeira sessão na academia para começar a computar sua curva de força real, histórico e conquistas.</p>' +
      '</div>';
  }

  document.querySelector('.view[data-view="home"]').innerHTML =
    '<div class="rowline rise"><div class="eyebrow">' + esc(today) + '</div>' +
    '<div class="chip"><span class="num">' + icon('bolt2') + '</span>NÍVEL ' + li.lvl + '</div></div>' +
    '<div class="rowline mt14 rise" style="--d:60ms;align-items:flex-start"><div>' +
    '<div class="h-display h1">' + greetWord() + '<br>' + esc(u.name || 'ATLETA').toUpperCase() + '</div>' +
    '<div class="mt8" style="display:flex;align-items:center;gap:10px">' +
    '<div class="xpbar" style="width:150px"><i style="width:' + (li.cur/li.need*100).toFixed(1) + '%"></i></div>' +
    '<span class="lbl num" style="letter-spacing:1px">' + fmtN(li.cur) + '/' + fmtN(li.need) + ' XP</span></div></div>' +
    '<div style="width:54px;height:54px;border-radius:16px;border:1px solid rgba(56,189,248,.35);background:var(--acc-deep);color:var(--acc);display:flex;align-items:center;justify-content:center;font-family:var(--fd);font-weight:700;font-size:20px;letter-spacing:1px">' + esc(initialsOf(u.name)) + '</div></div>' +
    '<div class="mt28 rise" style="--d:90ms"><div class="hero-num" id="hero-vol">' + fmtKg(0) + '</div>' +
    '<div class="lbl mt8" style="display:flex;align-items:center;gap:8px">' + icon('dumbbell') + ' Volume esta semana</div></div>' +
    '<div class="statband rise" style="--d:90ms"><div><b class="num">' + wk.count + '</b><span>Treinos/sem</span></div>' +
    '<div><b class="num">' + streak + '</b><span>Semanas seguidas</span></div>' +
    '<div><b class="num">' + prCount() + '</b><span>PRs totais</span></div></div>' +
    heroCard + aiCard + sparkBlock + recent;

  animateNumber(document.getElementById('hero-vol'), wk.volume, 900, function(v){ return fmtKg(v); });
  if(state.logs && state.logs.length){
    requestAnimationFrame(function(){ const cv = document.getElementById('spark-cv'); if(cv) drawSpark(cv, spark); });
  }
};
