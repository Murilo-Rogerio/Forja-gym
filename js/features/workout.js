let activeScreenEl = null, acTick = 0;

function startSession(workoutId){
  const w = state.workouts.find(function(x){ return x.id === workoutId; });
  if(!w) return;
  if(active){
    toast('Você já tem um treino em andamento.', 'bad');
    openActiveScreen();
    return;
  }
  if(!w.ex.length){
    toast('Esta ficha não tem exercícios. Edite-a antes.', 'bad');
    return;
  }

  active = {
    workoutId: w.id,
    name: w.name,
    startedAt: Date.now(),
    origBaseline: JSON.parse(JSON.stringify(state.records || {})),
    baseline: JSON.parse(JSON.stringify(state.records || {})),
    ex: w.ex.map(function(x){
      const last = historyOf(x.exId).slice(-1)[0];
      return {
        exId: x.exId,
        rest: x.rest || 90,
        sets: x.sets.map(function(t){
          return {
            type: t.type || 'work',
            rpe: x.rpe || 8,
            w: last ? last.w : '',
            r: last ? last.r : (t.reps || 10),
            done: false
          };
        })
      };
    })
  };

  state.active = active;
  save();
  openActiveScreen();
  toast('Treino iniciado! Bora forjar.', 'ok', 'flame');
}

/* Iniciar Treino Livre / Avulso (Quick Workout estilo Hevy) */
function startQuickSession(){
  if(active){
    toast('Você já tem um treino em andamento.', 'bad');
    openActiveScreen();
    return;
  }
  const dateStr = new Date().toLocaleDateString('pt-BR', { weekday:'short', day:'numeric', month:'short' });
  active = {
    workoutId: null,
    name: 'Treino Livre (' + dateStr + ')',
    startedAt: Date.now(),
    origBaseline: JSON.parse(JSON.stringify(state.records || {})),
    baseline: JSON.parse(JSON.stringify(state.records || {})),
    ex: []
  };

  state.active = active;
  save();
  openActiveScreen();
  toast('Treino livre iniciado! Adicione exercícios abaixo.', 'ok', 'flame');
}

function startAcTicker(){
  stopAcTicker();
  acTick = setInterval(function(){
    const el = document.getElementById('ac-elapsed');
    if(el && active) el.textContent = fmtDur(Date.now() - active.startedAt);
  }, 10000);
}
function stopAcTicker(){
  if(acTick){ clearInterval(acTick); acTick = 0; }
}

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
  tp.innerHTML = icon('dumbbell') + ' Retomar treino em andamento';
  tp.classList.add('on');
}

/* Retorna as séries da última sessão concluída que incluiu este exercício */
function lastSessionSetsOf(exId){
  const sorted = (state.logs || []).filter(function(l){
    return (l.ex || []).some(function(e){
      return e.exId === exId && (e.sets || []).some(function(s){ return s.done; });
    });
  }).sort(function(a,b){ return b.date - a.date; });

  if(!sorted.length) return null;
  const lastLog = sorted[0];
  const ex = lastLog.ex.find(function(e){ return e.exId === exId; });
  return ex ? ex.sets.filter(function(s){ return s.done; }) : null;
}

function renderActiveInto(el){
  if(!active || !el) return;
  const bd = el.querySelector('.screen-bd');
  const top = bd ? bd.scrollTop : 0;
  const total = active.ex.reduce(function(s,e){ return s + e.sets.length; }, 0);
  const done = active.ex.reduce(function(s,e){ return s + e.sets.filter(function(x){ return x.done; }).length; }, 0);
  const elapsed = Date.now() - active.startedAt;

  let cards = '';
  if(!active.ex.length){
    cards = '<div class="card acc mt14" style="text-align:center;padding:28px 18px">' +
      '<div style="width:48px;height:48px;border-radius:14px;background:rgba(56,189,248,.12);color:var(--acc);margin:0 auto 12px;display:flex;align-items:center;justify-content:center">' + icon('dumbbell') + '</div>' +
      '<b style="font-size:17px;font-family:var(--fd);letter-spacing:.5px;text-transform:uppercase">Treino em Andamento</b>' +
      '<p class="mut mt8" style="font-size:13.5px;line-height:1.5">Nenhum exercício adicionado ainda. Escolha os exercícios que for fazer hoje:</p>' +
      '<button class="btn btn-pri ripple mt14" data-act="ac-ex-add">' + icon('plus') + ' Adicionar Primeiro Exercício</button>' +
      '</div>';
  } else {
    cards = active.ex.map(function(ex, i){
      const lib = libById(ex.exId) || { name:'Exercício removido', group:'—' };
      const last = historyOf(ex.exId).slice(-1)[0];
      const prevSets = lastSessionSetsOf(ex.exId);
      const sugg = coachSuggestionFor(ex.exId, ex.sets[0] ? ex.sets[0].r : 10);
      const allDone = ex.sets.length > 0 && ex.sets.every(function(s){ return s.done; });
      const lastTxt = last ? ' · último: <b class="num" style="color:var(--txt)">' + (last.w > 0 ? fmtN(last.w) + 'kg × ' + last.r : last.r + ' reps') + '</b>' : '';
      
      const suggHTML = sugg
        ? '<div class="rowline mt14" style="gap:8px"><span class="chip ai">' + icon('spark') + ' Sugestão IA: ' + suggestText(sugg) + '</span>' +
          '<button class="btn btn-ghost btn-sm ripple" data-act="ac-apply-suggest" data-arg="' + i + '">Aplicar</button></div>'
        : '';

      const setRows = ex.sets.map(function(s, j){
        const m = TYPE_META[s.type] || TYPE_META.work;
        const prev = prevSets ? (prevSets[j] || prevSets[prevSets.length - 1]) : null;
        const prevW = prev && prev.w !== '' && prev.w !== undefined ? prev.w : '';
        const prevR = prev && prev.r ? prev.r : (s.r || 10);
        const prevTxt = prev ? (prev.w > 0 ? fmtN(prev.w) + 'kg × ' + prev.r : prev.r + ' reps') : '—';

        return '<div class="setrow">' +
          '<span class="setno">S' + (j+1) + '</span>' +
          '<button class="stbtn ' + m.cls + ' ripple" data-act="ac-set-type" data-arg="' + i + ':' + j + '" title="' + m.full + '">' + m.l + '</button>' +
          '<div class="setprev" title="Carga e repetições do treino anterior">' +
          '<span class="setprev-lbl">Ant.</span>' +
          '<b class="num">' + prevTxt + '</b></div>' +
          '<div class="setfield">' +
          '<button data-act="ac-adj" data-arg="w:' + i + ':' + j + ':-1" aria-label="Menos carga">' + icon('minus') + '</button>' +
          '<input type="number" inputmode="decimal" step="2.5" min="0" placeholder="' + (prevW !== '' ? prevW : 'kg') + '" value="' + s.w + '" data-inp="set-w" data-ex="' + i + '" data-set="' + j + '">' +
          '<button data-act="ac-adj" data-arg="w:' + i + ':' + j + ':1" aria-label="Mais carga">' + icon('plus') + '</button>' +
          '</div>' +
          '<button class="iconbtn ripple plate-trigger" data-act="plate-calc" data-arg="' + i + ':' + j + '" title="Calculadora de anilhas">' + icon('plate') + '</button>' +
          '<span class="xmark">×</span>' +
          '<div class="setfield">' +
          '<button data-act="ac-adj" data-arg="r:' + i + ':' + j + ':-1" aria-label="Menos reps">' + icon('minus') + '</button>' +
          '<input type="number" inputmode="numeric" step="1" min="1" placeholder="' + (prevR || 'reps') + '" value="' + s.r + '" data-inp="set-r" data-ex="' + i + '" data-set="' + j + '">' +
          '<button data-act="ac-adj" data-arg="r:' + i + ':' + j + ':1" aria-label="Mais reps">' + icon('plus') + '</button>' +
          '</div>' +
          '<button class="setchk ' + (s.done ? 'on' : '') + '" data-act="ac-toggle-set" data-arg="' + i + ':' + j + '" aria-label="Concluir série">' +
          '<svg class="ic" viewBox="0 0 24 24"><path class="p" d="M5 12.5l4.5 4.5L19 7"/></svg></button>' +
          (ex.sets.length > 1 ? '<button class="iconbtn ripple" style="width:28px;height:28px;border:none;color:var(--dim);margin-left:2px" data-act="ac-set-del" data-arg="' + i + ':' + j + '" aria-label="Remover série" title="Remover série">' + icon('x') + '</button>' : '') +
          '</div>';
      }).join('');

      return '<div class="excard ' + (allDone ? 'acc' : '') + '" id="exc-' + i + '">' +
        '<div class="rowline"><div style="flex:1;min-width:0">' +
        '<b style="font-size:16px">' + esc(lib.name) + '</b>' +
        '<div class="mut mt8" style="font-size:12px">' + ex.sets.length + ' séries · @RPE ' + (ex.sets[0] ? ex.sets[0].rpe : 8) + lastTxt + '</div></div>' +
        '<div style="display:flex;align-items:center;gap:6px">' +
        '<button class="chip ripple num" data-act="ac-rest" data-arg="' + i + '">' + icon('clock') + ' ' + ex.rest + 's</button>' +
        '<button class="iconbtn ripple" style="width:32px;height:32px;color:var(--bad);border:none" data-act="ac-ex-del" data-arg="' + i + '" aria-label="Remover exercício" title="Remover exercício">' + icon('trash') + '</button>' +
        '</div></div>' +
        suggHTML +
        '<div class="mt14">' + setRows + '</div>' +
        '<button class="btn btn-ghost btn-sm ripple mt14" style="width:100%" data-act="ac-set-add" data-arg="' + i + '">' + icon('plus') + ' Adicionar Série</button>' +
        '</div>';
    }).join('');
  }

  el.innerHTML =
    '<div class="screen-hd">' +
    '<button class="iconbtn ripple" data-act="ac-minimize" aria-label="Minimizar">' + icon('down') + '</button>' +
    '<div style="flex:1;min-width:0">' +
    '<div class="t" style="line-height:1.15;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + esc(active.name) + '</div>' +
    '<div class="rowline mt8" style="gap:10px">' +
    '<span class="lbl" style="display:flex;align-items:center;gap:5px;letter-spacing:1px">' + icon('clock') +
    '<span class="num" id="ac-elapsed">' + fmtDur(elapsed) + '</span></span>' +
    '<div class="progressline"><i style="width:' + (done/Math.max(1,total)*100).toFixed(0) + '%"></i></div>' +
    '<span class="lbl num" style="letter-spacing:1px">' + done + '/' + total + '</span></div></div>' +
    '<button class="btn btn-pri btn-sm ripple" data-act="ac-finish">' + icon('check') + ' Concluir</button></div>' +
    '<div class="screen-bd">' +
    '<div class="typeleg" style="margin:0 0 14px">' +
    '<span><i style="background:var(--st-work)"></i>Válida</span>' +
    '<span><i style="background:var(--st-warm)"></i>Aquecimento</span>' +
    '<span><i style="background:var(--st-prep)"></i>Preparatória</span>' +
    '<span><i style="background:var(--st-drop)"></i>Drop-Set</span>' +
    '<span><i style="background:var(--st-fail)"></i>Falha</span>' +
    '<span class="dim">(toque no selo para mudar)</span>' +
    '</div>' +
    cards +
    '<button class="btn btn-ghost ripple mt14" style="width:100%;border-style:dashed;border-color:var(--line-acc)" data-act="ac-ex-add">' + icon('plus') + ' Adicionar Exercício ao Treino</button>' +
    '<button class="btn btn-danger ripple mt14" style="width:100%" data-act="ac-cancel">' + icon('trash') + ' Abandonar treino</button>' +
    '</div>';

  const bd2 = el.querySelector('.screen-bd');
  if(bd2) bd2.scrollTop = top;
}

function addActiveSet(i){
  if(!active || !active.ex[i]) return;
  const ex = active.ex[i];
  const lastSet = ex.sets[ex.sets.length - 1];
  ex.sets.push({
    type: lastSet ? lastSet.type : 'work',
    rpe: lastSet ? lastSet.rpe : 8,
    w: lastSet ? lastSet.w : '',
    r: lastSet ? lastSet.r : 10,
    done: false
  });
  state.active = active;
  save();
  renderActiveInto(activeScreenEl);
  toast('Série S' + ex.sets.length + ' adicionada.', 'ok');
}

function delActiveSet(i, j){
  if(!active || !active.ex[i]) return;
  const ex = active.ex[i];
  if(ex.sets.length <= 1){
    toast('O exercício precisa ter ao menos uma série.', 'bad');
    return;
  }
  ex.sets.splice(j, 1);
  state.active = active;
  save();
  renderActiveInto(activeScreenEl);
}

function delActiveEx(i){
  if(!active || !active.ex[i]) return;
  modalConfirm({
    title: 'Remover Exercício',
    msg: 'Deseja remover este exercício do treino em andamento?',
    ok: 'Remover',
    danger: true
  }).then(function(yes){
    if(yes){
      active.ex.splice(i, 1);
      state.active = active;
      save();
      renderActiveInto(activeScreenEl);
      toast('Exercício removido do treino.', 'ok');
    }
  });
}

function toggleSet(i, j){
  if(!active) return;
  const ex = active.ex[i]; if(!ex) return;
  const s = ex.sets[j]; if(!s) return;

  // Auto-fill a partir do treino anterior se o usuário tocar em Concluir sem preencher
  if(!s.done){
    const prevSets = lastSessionSetsOf(ex.exId);
    const prev = prevSets ? (prevSets[j] || prevSets[prevSets.length - 1]) : null;
    if(s.w === '' || s.w === undefined){
      s.w = prev && prev.w !== undefined && prev.w !== '' ? prev.w : 0;
    }
    if(s.r === '' || s.r === undefined || parseNum(s.r) <= 0){
      s.r = prev && prev.r ? prev.r : 10;
    }
  }

  if(!s.done && (parseNum(s.w) < 0 || parseNum(s.r) <= 0)){
    toast('Preencha repetições válidas para esta série.', 'bad');
    return;
  }

  s.done = !s.done;
  let isPR = false;

  if(s.done){
    const w = parseNum(s.w), r = parseNum(s.r);
    const score = w > 0 ? e1RM(w, r) : r;
    const base = active.baseline[ex.exId];
    if(s.type === 'work' && (!base || score > base.best)){
      isPR = true;
      active.baseline[ex.exId] = { best: score, w: w, r: r, date: Date.now() };
    }
    const isLast = (i === active.ex.length - 1 && j === ex.sets.length - 1);
    if(!isLast && ex.rest > 0){
      Timer.start(ex.rest);
    }
    beep(880, 0.08);
    buzz([40]);
  }

  state.active = active;
  save();
  renderActiveInto(activeScreenEl);

  if(isPR){
    const card = document.getElementById('exc-' + i);
    if(card){
      card.classList.add('prflash');
      const rc = card.getBoundingClientRect();
      burst(rc.left + rc.width/2, rc.top + 40, 36);
      shockwave(rc.left + rc.width/2, rc.top + 40);
    }
    beep(1046, 0.14);
    buzz([80, 60, 80]);
    const lib = libById(ex.exId);
    toast('NOVO RECORDE PESSOAL (PR) — ' + (lib ? lib.name : 'Exercício') + '!', 'ai', 'trophy');
  }
}

function finishSession(){
  if(!active) return;
  const setsDone = active.ex.reduce(function(s,e){ return s + e.sets.filter(function(x){ return x.done; }).length; }, 0);
  if(!setsDone){
    toast('Marque ao menos uma série como concluída antes de finalizar.', 'bad');
    return;
  }

  const beforeLvl = levelInfo(state.user.xp).lvl;
  let volume = 0, totalReps = 0;
  const groups = {};

  const loggedEx = active.ex.map(function(ex){
    const sets = ex.sets.filter(function(s){ return s.done; })
      .map(function(s){
        return { w: parseNum(s.w), r: parseNum(s.r), rpe: s.rpe || 8, type: s.type || 'work', done: true };
      });
    return { exId: ex.exId, sets: sets };
  }).filter(function(e){ return e.sets.length > 0; });

  for(const e of loggedEx){
    const lib = libById(e.exId);
    const g = lib ? lib.group : 'Peito';
    for(const s of e.sets){
      if(s.type !== 'warm'){
        const v = s.w * s.r;
        volume += v;
        totalReps += s.r;
        const activation = Math.max(v, s.r * 25);
        groups[g] = (groups[g] || 0) + activation;
      }
    }
  }

  const prList = [];
  const baseRecords = active.origBaseline || state.records || {};
  for(const e of loggedEx){
    const work = e.sets.filter(function(s){ return s.type === 'work' || s.type === 'drop' || s.type === 'fail'; });
    const top = work.slice().sort(function(a,b){
      const scA = a.w > 0 ? e1RM(a.w, a.r) : a.r;
      const scB = b.w > 0 ? e1RM(b.w, b.r) : b.r;
      return scB - scA;
    })[0];
    if(!top) continue;
    const base = baseRecords[e.exId];
    const est = top.w > 0 ? e1RM(top.w, top.r) : top.r;
    if(!base || est > base.best){
      prList.push(e.exId);
      state.records[e.exId] = { best: est, w: top.w, r: top.r, date: Date.now() };
    }
  }

  const duration = Date.now() - active.startedAt;
  const xpEarned = 50 + Math.floor(volume/400)*5 + prList.length*30 + (duration > 30*60000 ? 15 : 0);
  state.user.xp += xpEarned;

  const log = {
    id: uid(),
    workoutId: active.workoutId,
    name: active.name,
    date: Date.now(),
    duration: duration,
    volume: volume,
    xpEarned: xpEarned,
    prCount: prList.length,
    setsDone: setsDone,
    totalReps: totalReps,
    groups: groups,
    ex: loggedEx
  };

  state.logs.push(log);
  state.active = null;
  active = null;
  stopAcTicker();

  if(activeScreenEl){ activeScreenEl.remove(); activeScreenEl = null; }
  document.getElementById('trainpill').classList.remove('on');
  Timer.stop();
  Timer.closeFull();

  const news = checkAchievements(false);
  save();
  openReport(log, xpEarned, beforeLvl, prList, news);
}

/* Tela de Conclusão de Treino com Mapa Anatômico, Tonalegem, Reps e Duração */
function openReport(log, xpEarned, beforeLvl, prList, news){
  const afterLvl = levelInfo(state.user.xp);
  postLogRef = log;

  const prRows = prList.map(function(id){
    const rec = state.records[id];
    const lib = libById(id);
    const recTxt = rec ? (rec.w > 0 ? fmtN(rec.w) + 'kg × ' + rec.r : rec.r + ' reps') : '';
    return '<div class="kv mt8"><span>' + esc(lib ? lib.name : 'Exercício') + '</span>' +
      '<b class="num" style="color:var(--acc)">' + recTxt + '</b></div>';
  }).join('');

  const newsRows = (news||[]).map(function(a){
    return '<div class="rowline mt14 newpop"><div class="badge-ic" style="width:44px;height:44px">' + icon(a.icon) + '</div>' +
      '<div><h4 style="font-family:var(--fd);text-transform:uppercase;letter-spacing:.5px">' + a.name + '</h4>' +
      '<small class="mut">' + a.desc + '</small></div></div>';
  }).join('');

  const sc = openScreen(
    '<div class="screen-bd">' +
    '<div class="lbl rise" style="letter-spacing:3px;text-align:center">TREINO CONCLUÍDO COM SUCESSO</div>' +
    '<div class="h-display mt14 rise" style="--d:80ms;font-size:clamp(26px,7vw,34px);text-align:center;color:var(--acc)">' +
    esc(log.name).toUpperCase() + '</div>' +
    (afterLvl.lvl > beforeLvl ? '<div style="text-align:center"><div class="lvlup mt14">' + icon('bolt2') + ' Parabéns! Subiu para o nível ' + afterLvl.lvl + '</div></div>' : '') +

    '<div class="card mt20 rise" style="--d:140ms">' +
    '<div class="lbl" style="text-align:center;color:#f43f5e;display:flex;align-items:center;justify-content:center;gap:6px">' +
    icon('flame') + ' Músculos Treinados na Sessão</div>' +
    bodyMapHTML(log.groups || {}) +
    groupsLegendHTML(log.groups || {}) +
    '</div>' +

    '<div class="mt20 rise" style="--d:200ms;text-align:center">' +
    '<div class="sumnum num" id="sum-vol">' + fmtKg(0) + '</div>' +
    '<div class="lbl mt8">Carga Total Movimentada (Tonelagem)</div></div>' +

    '<div class="statband rise" style="--d:240ms">' +
    '<div><b class="num">' + log.setsDone + '</b><span>Séries</span></div>' +
    '<div><b class="num" id="sum-reps">0</b><span>Repetições</span></div>' +
    '<div><b class="num">' + fmtDur(log.duration) + '</b><span>Duração</span></div>' +
    '<div><b class="num" style="color:var(--acc)">+' + fmtN(xpEarned) + '</b><span>XP Ganho</span></div></div>' +

    (prList.length ? '<div class="card acc rise mt14" style="--d:280ms"><div class="lbl" style="display:flex;align-items:center;gap:8px;color:var(--acc)">' + icon('trophy') + ' Novos Recordes Pessoais (PRs)</div>' + prRows + '</div>' : '') +
    (newsRows ? '<div class="card mt14 rise" style="--d:320ms"><div class="lbl">Novas Conquistas Desbloqueadas</div>' + newsRows + '</div>' : '') +

    '<div class="stack mt24 rise" style="--d:360ms">' +
    '<button class="btn btn-pri ripple" style="width:100%;padding:15px;font-size:15px" data-act="rep-open">' +
    icon('camera') + ' Publicar no Feed com Foto</button>' +
    '<div class="split2">' +
    '<button class="btn btn-ghost ripple" data-act="rep-share">' + icon('share') + ' Compartilhar</button>' +
    (state.settings.strava ? '<button class="btn btn-ghost ripple" data-act="rep-strava">' + icon('bolt2') + ' Strava</button>' : '<button class="btn btn-ghost ripple" data-act="rep-close">' + icon('check') + ' Fechar</button>') +
    '</div>' +
    (state.settings.strava ? '<button class="btn btn-ghost btn-sm ripple" style="width:100%" data-act="rep-close">' + icon('check') + ' Concluir e Voltar</button>' : '') +
    '</div></div>'
  );

  sc.dataset.nodismiss = '1';
  celebrate();
  animateNumber(sc.querySelector('#sum-vol'), log.volume, 1100, function(v){ return fmtKg(v); });
  animateNumber(sc.querySelector('#sum-reps'), log.totalReps, 900, function(v){ return fmtN(v); });

  if(state.settings.strava && state.settings.stravaAuto){
    setTimeout(function(){
      stravaPost(log).then(function(ok){
        if(ok) toast('Treino publicado no Strava automaticamente.', 'ok', 'bolt2');
      });
    }, 1500);
  }
}

function openLogDetail(id){
  const l = state.logs.find(function(x){ return x.id === id; });
  if(!l) return;
  const cards = l.ex.map(function(e){
    const lib = libById(e.exId);
    const rows = e.sets.map(function(s, j){
      const m = TYPE_META[s.type] || TYPE_META.work;
      const wTxt = s.w > 0 ? fmtN(s.w) + ' kg' : 'peso corporal';
      return '<div class="setrow"><span class="setno">S' + (j+1) + '</span>' +
        '<span class="stbtn ' + m.cls + '" style="width:26px;height:26px;font-size:11px">' + m.l + '</span>' +
        '<b class="num" style="flex:1;font-size:15px">' + wTxt + '</b><span class="xmark">×</span>' +
        '<b class="num" style="width:56px;font-size:15px">' + s.r + ' reps</b>' +
        '<span class="lbl num" style="width:52px;text-align:right">@' + (s.rpe||8) + '</span></div>';
    }).join('');
    return '<div class="excard"><b style="font-size:15.5px">' + esc(lib ? lib.name : 'Exercício') + '</b><div class="mt14">' + rows + '</div></div>';
  }).join('');

  openScreen(
    screenHeader(l.name) +
    '<div class="screen-bd"><div class="card">' +
    '<div class="kv"><span class="mut">Data</span><b>' + fmtDateL(l.date) + '</b></div>' +
    '<div class="kv"><span class="mut">Volume Total</span><b class="num" style="color:var(--acc)">' + fmtKg(l.volume) + '</b></div>' +
    '<div class="kv"><span class="mut">Séries / Repetições</span><b class="num">' + l.setsDone + ' / ' + l.totalReps + '</b></div>' +
    '<div class="kv"><span class="mut">Duração</span><b>' + fmtDur(l.duration) + '</b></div>' +
    '<div class="kv"><span class="mut">XP Concedido</span><b class="num" style="color:var(--ok)">+' + fmtN(l.xpEarned) + '</b></div>' +
    (l.prCount ? '<div class="kv"><span class="mut">Novos PRs</span><b class="num" style="color:var(--acc)">' + l.prCount + '</b></div>' : '') +
    '</div>' +
    (l.groups && Object.keys(l.groups).length ? '<div class="card mt14"><div class="lbl" style="text-align:center;color:#f43f5e">Músculos Forjados</div>' +
      bodyMapHTML(l.groups) + groupsLegendHTML(l.groups) + '</div>' : '') +
    '<div class="lbl mt20">Detalhamento das Séries</div><div class="stack mt14">' + cards + '</div>' +
    '<div class="mt24 stack" style="gap:10px">' +
    '<button class="btn btn-ghost ripple" style="width:100%" data-act="log-share" data-arg="' + l.id + '">' + icon('share') + ' Compartilhar Resumo do Treino</button>' +
    '<button class="btn btn-danger ripple" style="width:100%" data-act="log-del" data-arg="' + l.id + '">' + icon('trash') + ' Excluir Este Treino do Histórico</button>' +
    '</div></div>'
  );
}

/* ==============================================================
   CALCULADORA DE ANILHAS NA BARRA (PLATE CALCULATOR ESTILO HEVY)
   ============================================================== */

let plateCalcState = {
  exIdx: null,
  setIdx: null,
  targetW: 60,
  barW: 20
};

const PLATE_WEIGHTS = [25, 20, 15, 10, 5, 2.5, 1.25];

function calcBarbellPlates(targetW, barW){
  const perSide = Math.max(0, (targetW - barW) / 2);
  let rem = Math.round(perSide * 100) / 100;
  const plates = [];
  for(const p of PLATE_WEIGHTS){
    while(rem >= p - 0.001){
      plates.push(p);
      rem = Math.round((rem - p) * 100) / 100;
    }
  }
  return { perSide: perSide, plates: plates, remainder: rem };
}

function renderBarbellSVG(plates){
  const meta = {
    25: { h: 104, w: 18, fill: '#ef4444', stroke: '#b91c1c', label: '25' },
    20: { h: 104, w: 16, fill: '#3b82f6', stroke: '#1d4ed8', label: '20' },
    15: { h: 90,  w: 14, fill: '#eab308', stroke: '#a16207', label: '15' },
    10: { h: 78,  w: 12, fill: '#22c55e', stroke: '#15803d', label: '10' },
    5:  { h: 64,  w: 10, fill: '#f8fafc', stroke: '#94a3b8', label: '5', textC: '#0f172a' },
    2.5:{ h: 50,  w: 9,  fill: '#334155', stroke: '#1e293b', label: '2.5' },
    1.25:{ h: 38, w: 8,  fill: '#94a3b8', stroke: '#64748b', label: '1.25' }
  };
  let curX = 76;
  const plateEls = plates.map(function(p){
    const m = meta[p] || { h: 50, w: 10, fill: '#64748b', stroke: '#475569', label: String(p) };
    const y = 60 - m.h / 2;
    const rect = '<rect x="' + curX + '" y="' + y + '" width="' + m.w + '" height="' + m.h + '" rx="3" fill="' + m.fill + '" stroke="' + m.stroke + '" stroke-width="1.5"/>';
    const text = '<text x="' + (curX + m.w/2) + '" y="' + (60 + 3) + '" fill="' + (m.textC || '#fff') + '" font-size="8.5" font-family="sans-serif" font-weight="bold" text-anchor="middle">' + m.label + '</text>';
    curX += m.w + 3;
    return rect + text;
  }).join('');

  const clamp = plates.length ? '<rect x="' + curX + '" y="46" width="8" height="28" rx="2" fill="#cbd5e1" stroke="#64748b"/>' : '';

  return '<svg viewBox="0 0 340 120" style="width:100%;height:100%;max-width:340px;display:block;margin:0 auto">' +
    '<rect x="0" y="54" width="60" height="12" fill="#64748b" rx="2"/>' +
    '<rect x="60" y="36" width="12" height="48" fill="#334155" stroke="#475569" rx="2"/>' +
    '<rect x="72" y="50" width="250" height="20" fill="#475569" rx="2"/>' +
    plateEls +
    clamp +
    '</svg>';
}

function openPlateCalculator(exIdx, setIdx){
  let w = 60;
  if(exIdx != null && setIdx != null && active && active.ex[exIdx] && active.ex[exIdx].sets[setIdx]){
    const curW = parseNum(active.ex[exIdx].sets[setIdx].w);
    w = curW > 0 ? curW : 60;
  }
  plateCalcState.exIdx = (exIdx != null ? +exIdx : null);
  plateCalcState.setIdx = (setIdx != null ? +setIdx : null);
  plateCalcState.targetW = w;
  plateCalcState.barW = 20;

  modalHTML(getPlateCalcModalHTML());
}

function getPlateCalcModalHTML(){
  const res = calcBarbellPlates(plateCalcState.targetW, plateCalcState.barW);
  const bars = [
    { w: 20, l: '20kg (Olímpica)' },
    { w: 15, l: '15kg (Feminina / Smith)' },
    { w: 10, l: '10kg (Curta / Barra W)' }
  ];

  const barChips = bars.map(function(b){
    return '<button class="chip ripple ' + (plateCalcState.barW === b.w ? 'on' : '') + '" data-act="plate-bar" data-arg="' + b.w + '">' + b.l + '</button>';
  }).join('');

  const metaCols = {
    25: '#ef4444', 20: '#3b82f6', 15: '#eab308', 10: '#22c55e', 5: '#f8fafc', 2.5: '#475569', 1.25: '#94a3b8'
  };

  const plateCounts = {};
  res.plates.forEach(function(p){ plateCounts[p] = (plateCounts[p] || 0) + 1; });
  const badgeList = Object.keys(plateCounts).sort(function(a,b){ return (+b) - (+a); }).map(function(p){
    const col = metaCols[p] || '#38bdf8';
    return '<span class="plate-pill" style="border:1px solid ' + col + ';background:rgba(15,23,42,.6)">' +
      '<i style="background:' + col + '"></i>' + plateCounts[p] + 'x ' + p + ' kg</span>';
  }).join(' ');

  const isFromActive = (plateCalcState.exIdx != null && plateCalcState.setIdx != null);

  return '<div class="sheet-grip"></div>' +
    '<div class="rowline">' +
    '<div><div class="h-display h2">CALCULADORA DE ANILHAS</div>' +
    '<div class="mut mt8" style="font-size:12.5px">Veja exatamente quais anilhas colocar de cada lado da barra</div></div>' +
    '<div style="color:var(--acc)">' + icon('plate') + '</div></div>' +

    '<div class="plate-calc-box mt14">' +
    '<div class="lbl">Carga Total na Barra</div>' +
    '<div class="rowline mt8" style="justify-content:center;gap:8px">' +
    '<button class="btn btn-ghost btn-sm ripple num" data-act="plate-adj" data-arg="-10">-10</button>' +
    '<button class="btn btn-ghost btn-sm ripple num" data-act="plate-adj" data-arg="-2.5">-2.5</button>' +
    '<input type="number" id="plate-target-inp" class="fld num" style="width:110px;text-align:center;font-size:24px;font-weight:700;color:var(--acc)" value="' + plateCalcState.targetW + '" data-inp="plate-target">' +
    '<button class="btn btn-ghost btn-sm ripple num" data-act="plate-adj" data-arg="2.5">+2.5</button>' +
    '<button class="btn btn-ghost btn-sm ripple num" data-act="plate-adj" data-arg="10">+10</button>' +
    '</div>' +

    '<div class="lbl mt14">Peso da Barra</div>' +
    '<div class="rowline mt8" style="gap:6px;justify-content:center;flex-wrap:wrap">' + barChips + '</div>' +

    '<div class="barbell-svg-wrap mt14">' + renderBarbellSVG(res.plates) + '</div>' +

    '<div class="rowline mt14" style="justify-content:space-between;padding:0 8px">' +
    '<span class="mut" style="font-size:13.5px">Carga por lado:</span>' +
    '<b class="num" style="font-size:18px;color:var(--acc)">' + fmtN(res.perSide) + ' kg</b>' +
    '</div>' +

    (res.remainder > 0 ? '<div class="warn mt8" style="font-size:12px;color:var(--warn)">Sobra de ' + res.remainder + 'kg não divisível pelas anilhas padrão</div>' : '') +

    '<div class="plate-chip-list mt14">' + (badgeList || '<span class="dim" style="font-size:12.5px">Apenas a barra (sem anilhas adicionais)</span>') + '</div>' +
    '</div>' +

    '<div class="mt20 stack" style="gap:10px">' +
    (isFromActive ?
      '<button class="btn btn-pri ripple" style="width:100%" data-act="plate-apply-one">' + icon('check') + ' Aplicar Carga na Série Atual (' + plateCalcState.targetW + ' kg)</button>' +
      '<button class="btn btn-ghost ripple" style="width:100%" data-act="plate-apply-all">' + icon('bolt2') + ' Aplicar em Todas as Séries deste Exercício</button>'
      : '') +
    '<button class="btn btn-ghost ripple" style="width:100%" data-act="modal-close">Fechar</button>' +
    '</div>';
}

function updatePlateCalcModal(){
  const modal = document.querySelector('#modallayer .sheet');
  if(!modal) return;
  modal.innerHTML = getPlateCalcModalHTML();
}

function applyPlateWeightToActive(applyAll){
  if(plateCalcState.exIdx == null || !active) return;
  const ex = active.ex[plateCalcState.exIdx];
  if(!ex) return;
  const w = plateCalcState.targetW;
  if(applyAll){
    ex.sets.forEach(function(s){ s.w = w; });
    toast('Carga de ' + w + 'kg aplicada em todas as séries do exercício.', 'ok', 'plate');
  } else if(plateCalcState.setIdx != null && ex.sets[plateCalcState.setIdx]){
    ex.sets[plateCalcState.setIdx].w = w;
    toast('Carga de ' + w + 'kg aplicada na série S' + (plateCalcState.setIdx+1) + '.', 'ok', 'plate');
  }
  state.active = active;
  save();
  closeModal();
  if(activeScreenEl) renderActiveInto(activeScreenEl);
}
