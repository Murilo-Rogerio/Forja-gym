let chartExSel = '', volRange = 'w';

RENDER.progress = function(){
  const logs = state.logs.slice().sort(function(a,b){ return b.date-a.date; });
  const exsWithLogs = [...new Set(state.logs.flatMap(function(l){ return l.ex.map(function(e){ return e.exId; }); }))]
    .map(function(id){
      const lib = libById(id);
      const last = Math.max.apply(null, state.logs.filter(function(l){ return l.ex.some(function(e){ return e.exId===id; }); }).map(function(l){ return l.date; }));
      return { id: id, name: (lib?lib.name:'Exercício'), last: last };
    }).sort(function(a,b){ return b.last-a.last; });
  if(!chartExSel && exsWithLogs.length) chartExSel = exsWithLogs[0].id;
  let items = [], unit = '';
  if(volRange === 'w'){
    unit = 'semana';
    const cur = mondayOf(new Date()).getTime();
    for(let i=7;i>=0;i--){
      const ws = cur - i*604800000;
      const v = state.logs.filter(function(l){ return mondayOf(new Date(l.date)).getTime() === ws; })
        .reduce(function(s,l){ return s+l.volume; },0);
      const d = new Date(ws);
      items.push({ l: i===0?'atual':(d.getDate()+'/'+(d.getMonth()+1)), v: v, hot: i===0 });
    }
  } else {
    unit = 'mês';
    const now = new Date();
    for(let i=5;i>=0;i--){
      const d = new Date(now.getFullYear(), now.getMonth()-i, 1);
      const dn = new Date(now.getFullYear(), now.getMonth()-i+1, 1);
      const v = state.logs.filter(function(l){ const ld = new Date(l.date); return ld >= d && ld < dn; })
        .reduce(function(s,l){ return s+l.volume; },0);
      items.push({ l: d.toLocaleDateString('pt-BR',{month:'short'}).replace('.',''), v: v, hot: i===0 });
    }
  }
  const li = levelInfo(state.user.xp);
  const histRows = logs.slice(0,20).map(function(l){
    const prTxt = l.prCount ? ' · <span style="color:var(--acc)">' + l.prCount + ' PR</span>' : '';
    return '<button class="wrow ripple" data-act="log-detail" data-arg="' + l.id + '" style="width:100%;text-align:left">' +
      '<div class="wsplit">' + fmtDate(l.date) + '</div>' +
      '<div style="flex:1"><b style="font-family:var(--fd);font-size:16px;letter-spacing:.5px;text-transform:uppercase">' + esc(l.name) + '</b>' +
      '<div class="mut" style="font-size:12.5px;margin-top:2px">' + fmtKg(l.volume) + ' · ' + l.setsDone + ' séries · ' + fmtDur(l.duration) + prTxt + '</div></div>' +
      icon('fwd') + '</button>';
  }).join('');
  const achRows = ACHS.map(function(a){
    const un = state.ach[a.id];
    const dt = un ? '<span class="dt">DESBLOQUEADA · ' + new Date(un.at).toLocaleDateString('pt-BR') + '</span>' : '';
    return '<div class="badge-card ' + (un?'':'locked') + '"><div class="badge-ic">' + icon(a.icon) + '</div>' +
      '<div style="flex:1"><h4>' + a.name + '</h4><small>' + a.desc + '</small>' + dt + '</div></div>';
  }).join('');
  let evoBlock = '';
  if(exsWithLogs.length){
    evoBlock = '<select class="fld mt8" data-chg="ex-select" style="font-family:var(--fd);font-size:16px;text-transform:uppercase;letter-spacing:.5px">' +
      exsWithLogs.map(function(e){ return '<option value="' + e.id + '"' + (e.id===chartExSel?' selected':'') + '>' + esc(e.name) + '</option>'; }).join('') +
      '</select><div class="chartwrap mt14"><canvas class="chart" id="evo-cv" data-h="200"></canvas></div>' +
      '<div id="evo-foot" class="mut mt8" style="font-size:12.5px"></div>';
  } else evoBlock = '<div class="empty mt8">Conclua treinos para ver sua curva de força.</div>';
  document.querySelector('.view[data-view="progress"]').innerHTML =
    '<div class="eyebrow rise">Evolução</div><div class="h-display h1 mt8 rise" style="--d:60ms">SEU<br>PROGRESSO</div>' +
    '<div class="statband rise" style="--d:90ms"><div><b class="num">' + fmtKg(totalVolume()) + '</b><span>Tonelagem total</span></div>' +
    '<div><b class="num">' + state.logs.length + '</b><span>Sessões</span></div>' +
    '<div><b class="num">' + prCount() + '</b><span>PRs</span></div></div>' +
    '<div class="card rise" style="--d:120ms"><div class="rowline"><div class="lbl">Nível ' + li.lvl + '</div>' +
    '<span class="lbl num" style="letter-spacing:1px">' + fmtN(li.cur) + '/' + fmtN(li.need) + ' XP</span></div>' +
    '<div class="xpbar mt8"><i style="width:' + (li.cur/li.need*100).toFixed(1) + '%"></i></div></div>' +
    '<div class="mt20 rise" style="--d:150ms"><div class="rowline"><div class="lbl">Volume por ' + unit + '</div>' +
    '<div class="rowline" style="gap:6px">' +
    '<button class="chip ripple ' + (volRange==='w'?'on':'') + '" data-act="per-range" data-arg="w">Semanal</button>' +
    '<button class="chip ripple ' + (volRange==='m'?'on':'') + '" data-act="per-range" data-arg="m">Mensal</button></div></div>' +
    '<div class="chartwrap mt14">' + (items.every(function(i){ return !i.v; })
      ? '<div class="empty">Sem volume registrado ainda.</div>'
      : '<canvas class="chart" id="vol-cv" data-h="180"></canvas>') + '</div></div>' +
    '<div class="mt20 rise" style="--d:180ms"><div class="lbl">Evolução de carga por exercício</div>' + evoBlock + '</div>' +
    '<div class="mt20 rise" style="--d:210ms"><div class="lbl">Histórico de sessões</div>' +
    (histRows || '<div class="empty mt8">Nada por aqui ainda.</div>') + '</div>' +
    '<div class="mt28 rise" style="--d:240ms"><div class="rowline"><div class="lbl">Conquistas</div>' +
    '<span class="dim num" style="font-size:12px">' + Object.keys(state.ach).length + '/' + ACHS.length + '</span></div>' +
    '<div class="stack mt14">' + achRows + '</div></div>';
  if(!items.every(function(i){ return !i.v; })){
    requestAnimationFrame(function(){ const cv = document.getElementById('vol-cv'); if(cv) drawBars(cv, items); });
  }
  if(exsWithLogs.length){
    const h = historyOf(chartExSel);
    const pts = h.map(function(x){ return { l: fmtDate(x.date), v: Math.round(x.e*10)/10 }; });
    if(pts.length){
      requestAnimationFrame(function(){ const cv = document.getElementById('evo-cv'); if(cv) drawLineChart(cv, pts); });
      const last = h[h.length-1];
      const foot = document.getElementById('evo-foot');
      if(foot) foot.innerHTML = 'Recorde estimado (e1RM): <b style="color:var(--acc)" class="num">' + fmtN(last.e) + 'kg</b> · atual: ' + fmtN(last.w) + 'kg × ' + last.r;
    }
  }
};
