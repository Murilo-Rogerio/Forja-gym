let activeScreenEl = null, acTick = 0;

function startSession(workoutId){
  const w = state.workouts.find(function(x){ return x.id === workoutId; });
  if(!w) return;
  if(active){ toast('Você já tem um treino em andamento.', 'bad'); openActiveScreen(); return; }
  if(!w.ex.length){ toast('Esta ficha não tem exercícios. Edite-a antes.', 'bad'); return; }
  active = {
    workoutId: w.id, name: w.name, startedAt: Date.now(),
    baseline: JSON.parse(JSON.stringify(state.records)),
    ex: w.ex.map(function(x){
      const last = historyOf(x.exId).slice(-1)[0];
      return { exId: x.exId, rest: x.rest || 90,
        sets: x.sets.map(function(t){
          return { type: t.type || 'work', rpe: x.rpe || 8, w: last ? last.w : '', r: last ? last.r : t.reps, done: false };
        }) };
    })
  };
  state.active = active; save();
  openActiveScreen();
  toast('Treino iniciado. Vamos construir.', 'ok', 'flame');
}
function startAcTicker(){
  stopAcTicker();
  acTick = setInterval(function(){
    const el = document.getElementById('ac-elapsed');
    if(el && active) el.textContent = fmtDur(Date.now() - active.startedAt);
  }, 10000);
}
function stopAcTicker(){ if(acTick){ clearInterval(acTick); acTick = 0; } }
function openActiveScreen(){
  if(!active) return;
  if(activeScreenEl && activeScreenEl.isConnected){
    activeScreenEl.style.display = '';
    renderActiveInto(activeScreenEl);
  } else {
    activeScreenEl = openScreen('');
    renderActiveInto(activeScreenEl);
  }
  document.getElementById('trainpill').classList.remove('on');
  startAcTicker();
}
function minimizeActive(){
  if(!activeScreenEl) return;
  activeScreenEl.style.display = 'none';
  const tp = document.getElementById('trainpill');
  tp.innerHTML = icon('dumbbell') + ' Voltar ao treino';
  tp.classList.add('on');
}
function renderActiveInto(el){
  if(!active || !el) return;
  const bd = el.querySelector('.screen-bd');
  const top = bd ? bd.scrollTop : 0;
  const total = active.ex.reduce(function(s,e){ return s + e.sets.length; },0);
  const done = active.ex.reduce(function(s,e){ return s + e.sets.filter(function(x){ return x.done; }).length; },0);
  const elapsed = Date.now() - active.startedAt;
  const cards = active.ex.map(function(ex, i){
    const lib = libById(ex.exId) || { name:'Exercício removido', group:'—' };
    const last = historyOf(ex.exId).slice(-1)[0];
    const sugg = coachSuggestionFor(ex.exId, ex.sets[0] ? ex.sets[0].r : 10);
    const allDone = ex.sets.length > 0 && ex.sets.every(function(s){ return s.done; });
    const lastTxt = last ? ' · último: <b class="num" style="color:var(--txt)">' + fmtN(last.w) + 'kg × ' + last.r + '</b>' : '';
    const suggHTML = sugg
      ? '<div class="rowline mt14" style="gap:8px"><span class="chip ai">' + icon('spark') + ' IA: ' + suggestText(sugg) + '</span>' +
        '<button class="btn btn-ghost btn-sm ripple" data-act="ac-apply-suggest" data-arg="' + i + '">Aplicar</button></div>'
      : '';
    const setRows = ex.sets.map(function(s, j){
      const m = TYPE_META[s.type] || TYPE_META.work;
      return '<div class="setrow"><span class="setno">S' + (j+1) + '</span>' +
        '<button class="stbtn ' + m.cls + ' ripple" data-act="ac-set-type" data-arg="' + i + ':' + j + '" title="' + m.full + '">' + m.l + '</button>' +
        '<div class="setfield">' +
        '<button data-act="ac-adj" data-arg="w:' + i + ':' + j + ':-1" aria-label="Menos carga">' + icon('minus') + '</button>' +
        '<input type="number" inputmode="decimal" step="2.5" min="0" placeholder="kg" value="' + s.w + '" data-inp="set-w" data-ex="' + i + '" data-set="' + j + '">' +
        '<span>kg</span></div><span class="xmark">×</span>' +
        '<div class="setfield">' +
        '<button data-act="ac-adj" data-arg="r:' + i + ':' + j + ':-1" aria-label="Menos repetições">' + icon('minus') + '</button>' +
        '<input type="number" inputmode="numeric" step="1" min="0" placeholder="reps" value="' + s.r + '" data-inp="set-r" data-ex="' + i + '" data-set="' + j + '">' +
        '<span>rep</span></div>' +
        '<button class="setchk ' + (s.done?'on':'') + '" data-act="ac-toggle-set" data-arg="' + i + ':' + j + '" aria-label="Concluir série">' +
        '<svg class="ic" viewBox="0 0 24 24"><path class="p" d="M5 12.5l4.5 4.5L19 7"/></svg></button></div>';
    }).join('');
    return '<div class="excard ' + (allDone?'acc':'') + '" id="exc-' + i + '">' +
      '<div class="rowline"><div style="flex:1;min-width:0"><b style="font-size:15.5px">' + esc(lib.name) + '</b>' +
      '<div class="mut mt8" style="font-size:12px">' + ex.sets.length + ' séries · @RPE ' + (ex.sets[0]?ex.sets[0].rpe:8) + lastTxt + '</div></div>' +
      '<button class="chip ripple num" data-act="ac-rest" data-arg="' + i + '">' + icon('clock') + ' ' + ex.rest + 's</button></div>' +
      suggHTML + '<div class="mt14">' + setRows + '</div></div>';
  }).join('');
  el.innerHTML =
    '<div class="screen-hd">' +
    '<button class="iconbtn ripple" data-act="ac-minimize" aria-label="Minimizar">' + icon('down') + '</button>' +
    '<div style="flex:1;min-width:0"><div class="t" style="line-height:1.15">' + esc(active.name) + '</div>' +
    '<div class="rowline mt8" style="gap:10px">' +
    '<span class="lbl" style="display:flex;align-items:center;gap:5px;letter-spacing:1px">' + icon('clock') +
    '<span class="num" id="ac-elapsed">' + fmtDur(elapsed) + '</span></span>' +
    '<div class="progressline"><i style="width:' + (done/Math.max(1,total)*100).toFixed(0) + '%"></i></div>' +
    '<span class="lbl num" style="letter-spacing:1px">' + done + '/' + total + '</span></div></div>' +
    '<button class="btn btn-pri btn-sm ripple" data-act="ac-finish">Concluir</button></div>' +
    '<div class="screen-bd">' +
    '<div class="typeleg" style="margin:0 0 12px"><span><i style="background:rgba(56,189,248,.5)"></i>Válida</span><span><i style="background:rgba(251,191,36,.5)"></i>Preparatória</span><span><i style="background:rgba(148,163,184,.4)"></i>Aquecimento</span><span>toque no selo para trocar</span></div>' +
    cards +
    '<button class="btn btn-danger ripple mt8" style="width:100%" data-act="ac-cancel">Abandonar treino</button></div>';
  const bd2 = el.querySelector('.screen-bd');
  if(bd2) bd2.scrollTop = top;
}
function toggleSet(i, j){
  if(!active) return;
  const ex = active.ex[i]; if(!ex) return;
  const s = ex.sets[j]; if(!s) return;
  if(!s.done && (parseNum(s.w) <= 0 || parseNum(s.r) <= 0)){ toast('Preencha carga e repetições da série.', 'bad'); return; }
  s.done = !s.done;
  let isPR = false;
  if(s.done){
    const w = parseNum(s.w), r = parseNum(s.r);
    const base = active.baseline[ex.exId];
    if(s.type === 'work' && (!base || e1RM(w,r) > base.best)) isPR = true;
    const isLast = i === active.ex.length-1 && j === ex.sets.length-1;
    if(!isLast && ex.rest > 0) Timer.start(ex.rest);
  }
  state.active = active; save();
  renderActiveInto(activeScreenEl);
  if(isPR){
    const card = document.getElementById('exc-' + i);
    if(card){
      card.classList.add('prflash');
      const rc = card.getBoundingClientRect();
      burst(rc.left + rc.width/2, rc.top + 40, 34);
      shockwave(rc.left + rc.width/2, rc.top + 40);
    }
    beep(1046, .12); buzz([80]);
    const lib = libById(ex.exId);
    toast('NOVO PR — ' + (lib?lib.name:'exercício') + ': ' + fmtN(parseNum(s.w)) + 'kg × ' + parseNum(s.r), 'ai', 'trophy');
  }
}
function finishSession(){
  if(!active) return;
  const setsDone = active.ex.reduce(function(s,e){ return s + e.sets.filter(function(x){ return x.done; }).length; },0);
  if(!setsDone){ toast('Marque ao menos uma série concluída.', 'bad'); return; }
  const beforeLvl = levelInfo(state.user.xp).lvl;
  let volume = 0, totalReps = 0;
  const groups = {};
  const loggedEx = active.ex.map(function(ex){
    const sets = ex.sets.filter(function(s){ return s.done; })
      .map(function(s){ return { w: parseNum(s.w), r: parseNum(s.r), rpe: s.rpe||8, type: s.type||'work', done: true }; });
    return { exId: ex.exId, sets: sets };
  });
  for(const e of loggedEx){
    const lib = libById(e.exId);
    const g = lib ? lib.group : 'Outros';
    for(const s of e.sets){
      if(s.type !== 'warm'){ volume += s.w*s.r; totalReps += s.r; groups[g] = (groups[g]||0) + s.w*s.r; }
    }
  }
  const prList = [];
  for(const e of loggedEx){
    const work = e.sets.filter(function(s){ return s.type === 'work'; });
    const top = work.slice().sort(function(a,b){ return e1RM(b.w,b.r) - e1RM(a.w,a.r); })[0];
    if(!top) continue;
    const base = active.baseline[e.exId];
    const est = e1RM(top.w, top.r);
    if(!base || est > base.best){
      prList.push(e.exId);
      state.records[e.exId] = { best: est, w: top.w, r: top.r, date: Date.now() };
    }
  }
  const duration = Date.now() - active.startedAt;
  const xpEarned = 40 + Math.floor(volume/500)*5 + prList.length*25 + (duration > 30*60000 ? 10 : 0);
  state.user.xp += xpEarned;
  const log = { id: uid(), workoutId: active.workoutId, name: active.name, date: Date.now(),
    duration: duration, volume: volume, xpEarned: xpEarned, prCount: prList.length,
    setsDone: setsDone, totalReps: totalReps, groups: groups, ex: loggedEx };
  state.logs.push(log);
  state.active = null; active = null;
  stopAcTicker();
  if(activeScreenEl){ activeScreenEl.remove(); activeScreenEl = null; }
  document.getElementById('trainpill').classList.remove('on');
  Timer.stop(); Timer.closeFull();
  const news = checkAchievements(false);
  save();
  openReport(log, xpEarned, beforeLvl, prList, news);
}
function openReport(log, xpEarned, beforeLvl, prList, news){
  const afterLvl = levelInfo(state.user.xp);
  postLogRef = log;
  const prRows = prList.map(function(id){
    const rec = state.records[id];
    const lib = libById(id);
    return '<div class="kv mt8"><span>' + esc(lib?lib.name:'Exercício') + '</span>' +
      '<b class="num" style="color:var(--acc)">' + fmtN(rec.w) + 'kg × ' + rec.r + '</b></div>';
  }).join('');
  const newsRows = (news||[]).map(function(a){
    return '<div class="rowline mt14 newpop"><div class="badge-ic" style="width:42px;height:42px">' + icon(a.icon) + '</div>' +
      '<div><h4 style="font-family:var(--fd);text-transform:uppercase;letter-spacing:.5px">' + a.name + '</h4>' +
      '<small class="mut">' + a.desc + '</small></div></div>';
  }).join('');
  const sc = openScreen('<div class="screen-bd">' +
    '<div class="lbl rise" style="letter-spacing:3px;text-align:center">RELATÓRIO DA SESSÃO</div>' +
    '<div class="h-display mt14 rise" style="--d:80ms;font-size:clamp(24px,6.5vw,32px);text-align:center">' + esc(log.name).toUpperCase() + '</div>' +
    (afterLvl.lvl > beforeLvl ? '<div style="text-align:center"><div class="lvlup mt14">' + icon('bolt2') + ' Subiu para o nível ' + afterLvl.lvl + '</div></div>' : '') +
    '<div class="card mt20 rise" style="--d:140ms"><div class="lbl" style="text-align:center">MÚSCULOS TREINADOS</div>' +
    bodyMapHTML(log.groups || {}) + groupsLegendHTML(log.groups || {}) + '</div>' +
    '<div class="mt20 rise" style="--d:200ms"><div class="sumnum num" id="sum-vol" style="text-align:center">' + fmtKg(0) + '</div>' +
    '<div class="lbl mt8" style="text-align:center">Carga total levantada</div></div>' +
    '<div class="statband rise" style="--d:240ms">' +
    '<div><b class="num">' + log.setsDone + '</b><span>Séries</span></div>' +
    '<div><b class="num" id="sum-reps">0</b><span>Reps</span></div>' +
    '<div><b class="num">' + fmtDur(log.duration) + '</b><span>Duração</span></div>' +
    '<div><b class="num" style="color:var(--acc)">+' + fmtN(xpEarned) + '</b><span>XP</span></div></div>' +
    (prList.length ? '<div class="card acc rise" style="--d:280ms"><div class="lbl" style="display:flex;align-items:center;gap:8px">' + icon('trophy') + ' Novos recordes</div>' + prRows + '</div>' : '') +
    (newsRows ? '<div class="card mt14 rise" style="--d:320ms"><div class="lbl">Conquistas desbloqueadas</div>' + newsRows + '</div>' : '') +
    '<div class="stack mt20 rise" style="--d:360ms">' +
    '<button class="btn btn-pri ripple" style="width:100%" data-act="rep-open">' + icon('camera') + ' Publicar no feed</button>' +
    '<div class="split2">' +
    '<button class="btn btn-ghost ripple" data-act="rep-share">' + icon('share') + ' Compartilhar</button>' +
    (state.settings.strava ? '<button class="btn btn-ghost ripple" data-act="rep-strava">' + icon('bolt2') + ' Strava</button>' : '<button class="btn btn-ghost ripple" data-act="rep-close">' + icon('check') + ' Fechar</button>') +
    '</div>' +
    (state.settings.strava ? '<button class="btn btn-ghost btn-sm ripple" style="width:100%" data-act="rep-close">' + icon('check') + ' Fechar sem publicar</button>' : '') +
    '</div></div>');
  sc.dataset.nodismiss = '1';
  celebrate();
  animateNumber(sc.querySelector('#sum-vol'), log.volume, 1100, function(v){ return fmtKg(v); });
  animateNumber(sc.querySelector('#sum-reps'), log.totalReps, 900, function(v){ return fmtN(v); });
  if(state.settings.strava && state.settings.stravaAuto){
    setTimeout(function(){ stravaPost(log).then(function(ok){
      if(ok) toast('Treino publicado no Strava automaticamente.', 'ok', 'bolt2');
    }); }, 1400);
  }
}
function openLogDetail(id){
  const l = state.logs.find(function(x){ return x.id === id; });
  if(!l) return;
  const cards = l.ex.map(function(e){
    const lib = libById(e.exId);
    const rows = e.sets.map(function(s, j){
      const m = TYPE_META[s.type] || TYPE_META.work;
      return '<div class="setrow"><span class="setno">S' + (j+1) + '</span>' +
        '<span class="stbtn ' + m.cls + '" style="width:26px;height:26px;font-size:11px">' + m.l + '</span>' +
        '<b class="num" style="flex:1;font-size:15px">' + fmtN(s.w) + ' kg</b><span class="xmark">×</span>' +
        '<b class="num" style="width:56px;font-size:15px">' + s.r + ' reps</b>' +
        '<span class="lbl num" style="width:52px;text-align:right">@' + (s.rpe||8) + '</span></div>';
    }).join('');
    return '<div class="excard"><b style="font-size:15px">' + esc(lib?lib.name:'Exercício removido') + '</b><div class="mt14">' + rows + '</div></div>';
  }).join('');
  openScreen(screenHeader(l.name) +
    '<div class="screen-bd"><div class="card">' +
    '<div class="kv"><span class="mut">Data</span><b>' + fmtDateL(l.date) + '</b></div>' +
    '<div class="kv"><span class="mut">Volume</span><b class="num" style="color:var(--acc)">' + fmtKg(l.volume) + '</b></div>' +
    '<div class="kv"><span class="mut">Séries / Reps</span><b class="num">' + l.setsDone + ' / ' + l.totalReps + '</b></div>' +
    '<div class="kv"><span class="mut">Duração</span><b>' + fmtDur(l.duration) + '</b></div>' +
    '<div class="kv"><span class="mut">XP</span><b class="num">+' + fmtN(l.xpEarned) + '</b></div>' +
    (l.prCount ? '<div class="kv"><span class="mut">PRs na sessão</span><b class="num" style="color:var(--acc)">' + l.prCount + '</b></div>' : '') +
    '</div>' +
    (l.groups && Object.keys(l.groups).length ? '<div class="card mt14"><div class="lbl">Músculos treinados</div>' +
      bodyMapHTML(l.groups) + groupsLegendHTML(l.groups) + '</div>' : '') +
    '<div class="lbl mt20">Séries registradas</div><div class="stack mt14">' + cards + '</div></div>');
}
