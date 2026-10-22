function greetWord(){
  const h = new Date().getHours();
  return h < 12 ? 'BOM DIA,' : h < 18 ? 'BOA TARDE,' : 'BOA NOITE,';
}

RENDER.home = function(){
  const u = state.user, li = levelInfo(u.xp), wk = weeklyStats();
  const streak = weekStreak(), w = suggestedWorkout();
  const readiness = typeof calcReadiness === 'function' ? calcReadiness() : { score: 90, statusLabel: 'Pronto', statusColor: 'var(--ok)', advice: 'Treino liberado.', muscleRecovery: {} };
  const habits = typeof getTodayHabits === 'function' ? getTodayHabits() : { water: 0, waterTarget: 3000, creatine: false, sleep: 7.5 };

  const spark = [];
  for(let i=13; i>=0; i--){
    const d = new Date(); d.setDate(d.getDate()-i); d.setHours(23,59,59,999);
    spark.push((state.logs||[]).filter(function(l){ return l.date <= d.getTime() && l.date > d.getTime()-86400000; })
      .reduce(function(s,l){ return s+l.volume; },0));
  }
  const today = new Date().toLocaleDateString('pt-BR',{weekday:'short',day:'numeric',month:'short'}).toUpperCase();

  // 1. Hero Card do Treino Sugerido
  let heroCard = '';
  if(w){
    heroCard = '<div class="card acc tap rise mt14" style="--d:120ms" data-act="w-start" data-arg="' + w.id + '">' +
      '<div class="rowline"><div><div class="lbl" style="color:var(--acc)">Treino sugerido para hoje</div>' +
      '<div class="h-display h2 mt8">' + esc(w.name) + '</div>' +
      '<div class="mut mt8" style="font-size:13px">' + w.ex.length + ' exercícios · ' +
      w.ex.reduce(function(s,e){ return s + e.sets.length; },0) + ' séries</div></div>' +
      '<div style="width:54px;height:54px;border-radius:16px;background:var(--acc);color:#04121f;display:flex;align-items:center;justify-content:center;box-shadow:0 0 18px rgba(56,189,248,.4)">' +
      icon('play') + '</div></div></div>' +
      '<div class="rowline mt8 rise" style="--d:140ms;gap:8px">' +
      '<button class="btn btn-ghost btn-sm ripple" style="flex:1" data-act="w-quick">' + icon('play') + ' Treino Livre</button>' +
      '<button class="btn btn-ghost btn-sm ripple" style="flex:1" data-act="nav" data-arg="workouts">' + icon('dumbbell') + ' Minhas Fichas</button>' +
      '</div>';
  } else {
    heroCard = '<div class="card mt14 rise" style="text-align:center;padding:26px 18px">' +
      '<b style="font-size:17px;font-family:var(--fd);letter-spacing:.5px;text-transform:uppercase">Monte ou Inicie um Treino</b>' +
      '<p class="mut mt8" style="font-size:13px;line-height:1.5">Inicie um treino livre, use os modelos prontos (PPL, Upper/Lower, ABC) ou peça à IA para forjar um programa sob medida.</p>' +
      '<div class="rowline mt14" style="justify-content:center;gap:8px;flex-wrap:wrap">' +
      '<button class="btn btn-pri ripple" data-act="w-quick">' + icon('play') + ' Iniciar Treino Livre</button>' +
      '<button class="btn btn-ghost ripple" data-act="w-new">' + icon('plus') + ' Criar Treino</button>' +
      '<button class="btn btn-ghost ripple" data-act="nav" data-arg="workouts">' + icon('bolt2') + ' Ver Modelos</button>' +
      '<button class="btn btn-ai ripple" data-act="ai-open">' + icon('wand') + ' Gerar com IA</button>' +
      '</div></div>';
  }

  // 2. Card de Prontidão & Coach Forja (10/10)
  const recoveryPills = Object.keys(readiness.muscleRecovery || {}).map(function(g){
    const v = readiness.muscleRecovery[g];
    const dotCol = v >= 90 ? 'var(--ok)' : v >= 60 ? 'var(--warn)' : 'var(--bad)';
    return '<span class="chip" style="font-size:11px;padding:3px 8px;gap:5px"><i style="width:6px;height:6px;border-radius:50%;background:' + dotCol + ';display:inline-block"></i>' + esc(g) + ' ' + v + '%</span>';
  }).join(' ');

  const coachReadinessCard =
    '<div class="card acc mt14 rise" style="--d:160ms;padding:16px;background:radial-gradient(ellipse at top right, rgba(56,189,248,.12), transparent 70%), rgba(15,23,42,.65)">' +
    '<div class="rowline"><div style="display:flex;align-items:center;gap:12px">' +
    '<div style="width:48px;height:48px;border-radius:14px;background:var(--acc-deep);color:var(--acc);display:flex;align-items:center;justify-content:center;box-shadow:0 0 16px rgba(56,189,248,.35)">' +
    icon('brain') + '</div>' +
    '<div><div class="lbl" style="color:var(--acc)">Coach Forja · Prontidão Diária</div>' +
    '<div class="rowline mt4" style="gap:8px"><b class="num" style="font-size:24px;color:#fff">' + readiness.score + '%</b>' +
    '<span class="chip" style="color:' + readiness.statusColor + ';border-color:' + readiness.statusColor + ';font-size:11.5px">' + esc(readiness.statusLabel) + '</span></div>' +
    '</div></div>' +
    '<button class="btn btn-pri btn-sm ripple" data-act="coach-chat" style="padding:8px 12px">' + icon('spark') + ' Chat Coach</button>' +
    '</div>' +
    '<p class="mut mt12" style="font-size:13px;line-height:1.55">' + esc(readiness.advice) + '</p>' +
    (recoveryPills ? '<div class="rowline mt12" style="gap:6px;flex-wrap:wrap">' + recoveryPills + '</div>' : '') +
    '</div>';

  // 3. Rastreador de Hábitos do Atleta (Água, Creatina, Sono)
  const waterPct = Math.min(100, Math.round((habits.water / habits.waterTarget) * 100));
  const athleteHabitsCard =
    '<div class="card mt14 rise" style="--d:180ms;padding:16px">' +
    '<div class="rowline"><div class="lbl">Rotina do Atleta (Hoje)</div>' +
    '<span class="dim" style="font-size:12px">Constância = Resultados</span></div>' +

    // Hidratação
    '<div class="mt12">' +
    '<div class="rowline"><span style="display:flex;align-items:center;gap:8px;font-size:13.5px;font-weight:600">' +
    icon('droplet') + ' Hidratação</span>' +
    '<b class="num" style="font-size:14px;color:var(--acc)">' + (habits.water/1000).toFixed(2) + 'L / ' + (habits.waterTarget/1000).toFixed(1) + 'L (' + waterPct + '%)</b></div>' +
    '<div class="xpbar mt8" style="height:7px"><i style="width:' + waterPct + '%;background:var(--acc);box-shadow:0 0 10px rgba(56,189,248,.6)"></i></div>' +
    '<div class="rowline mt8" style="gap:6px">' +
    '<button class="chip ripple tap" data-act="habit-water-add" data-arg="250" style="flex:1;justify-content:center">+250ml</button>' +
    '<button class="chip ripple tap" data-act="habit-water-add" data-arg="500" style="flex:1;justify-content:center">+500ml</button>' +
    '<button class="chip ripple tap" data-act="habit-water-reset" style="padding:4px 8px" aria-label="Zerar">' + icon('trash') + '</button>' +
    '</div></div>' +

    // Creatina & Sono
    '<div class="split2 mt14" style="gap:10px">' +
    '<button class="card ripple tap ' + (habits.creatine ? 'acc' : '') + '" data-act="habit-creatine" style="margin:0;padding:10px 12px;display:flex;align-items:center;gap:10px;text-align:left;border-color:' + (habits.creatine ? 'var(--ok)' : 'var(--line)') + '">' +
    '<div style="width:32px;height:32px;border-radius:10px;background:' + (habits.creatine ? 'rgba(52,211,153,.2)' : 'rgba(148,163,184,.1)') + ';color:' + (habits.creatine ? 'var(--ok)' : 'var(--dim)') + ';display:flex;align-items:center;justify-content:center;flex:none">' +
    icon(habits.creatine ? 'check' : 'zap') + '</div>' +
    '<div><b style="font-size:13px;display:block">Creatina</b>' +
    '<span class="dim" style="font-size:11px">' + (habits.creatine ? 'Tomada hoje' : 'Pendente (+10XP)') + '</span></div></button>' +

    '<div class="card" style="margin:0;padding:10px 12px;display:flex;align-items:center;gap:10px">' +
    '<div style="width:32px;height:32px;border-radius:10px;background:rgba(148,163,184,.1);color:var(--dim);display:flex;align-items:center;justify-content:center;flex:none">' +
    icon('moon') + '</div>' +
    '<div style="flex:1"><span class="dim" style="font-size:11px;display:block">Sono</span>' +
    '<select class="fld" style="padding:2px 6px;height:28px;font-size:12px;margin-top:2px" data-chg="habit-sleep">' +
    [5, 6, 7, 7.5, 8, 8.5, 9, 10].map(function(s){ return '<option value="' + s + '"' + (habits.sleep === s ? ' selected' : '') + '>' + s + ' horas</option>'; }).join('') +
    '</select></div></div>' +
    '</div></div>';

  // 4. Sparkline de Tonelagem
  let sparkBlock = '';
  if(state.logs && state.logs.length){
    sparkBlock = '<div class="mt20 rise" style="--d:240ms"><div class="rowline"><div class="lbl">Evolução de Carga (14 dias)</div>' +
      '<span class="dim num" style="font-size:12px">' + fmtKg(spark.reduce(function(a,b){ return a+b; },0)) + '</span></div>' +
      '<div class="chartwrap mt8"><canvas class="chart" id="spark-cv" data-h="64"></canvas></div></div>';
  }

  // 5. Sessões Recentes
  let recent = '';
  if(state.logs && state.logs.length){
    recent = '<div class="mt20 rise" style="--d:280ms"><div class="lbl">Sessões recentes</div>' +
      state.logs.slice().sort(function(a,b){ return b.date-a.date; }).slice(0,3).map(function(l){
        const prTxt = l.prCount ? ' · <span style="color:var(--acc)">' + l.prCount + ' PR' + (l.prCount>1?'s':'') + '</span>' : '';
        return '<button class="wrow ripple" data-act="log-detail" data-arg="' + l.id + '" style="width:100%;text-align:left">' +
          '<div class="wsplit">' + esc(splitTag(l.name)) + '</div>' +
          '<div style="flex:1"><b style="font-family:var(--fd);font-size:16px;letter-spacing:.5px;text-transform:uppercase">' + esc(l.name) + '</b>' +
          '<div class="mut" style="font-size:12.5px;margin-top:2px">' + fmtDate(l.date) + ' · ' + fmtKg(l.volume) + prTxt + '</div></div>' +
          icon('fwd') + '</button>';
      }).join('') + '</div>';
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

    coachReadinessCard +
    heroCard +
    athleteHabitsCard +
    sparkBlock +
    recent;

  animateNumber(document.getElementById('hero-vol'), wk.volume, 900, function(v){ return fmtKg(v); });
  if(state.logs && state.logs.length){
    requestAnimationFrame(function(){ const cv = document.getElementById('spark-cv'); if(cv) drawSpark(cv, spark); });
  }
};
