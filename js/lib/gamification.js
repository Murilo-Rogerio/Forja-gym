function xpNeeded(l){ return 120 + (l-1)*80; }
function levelInfo(xp){
  let lvl = 1, rem = xp, need = xpNeeded(1);
  while(rem >= need){ rem -= need; lvl++; need = xpNeeded(lvl); }
  return { lvl: lvl, cur: rem, need: need };
}
function historyOf(exId){
  return state.logs.filter(function(l){ return l.ex.some(function(e){ return e.exId === exId; }); })
    .sort(function(a,b){ return a.date - b.date; })
    .map(function(l){
      const e = l.ex.find(function(x){ return x.exId === exId; });
      const done = (e.sets || []).filter(function(s){ return s.done && (s.w > 0 || s.r > 0) && (s.type === 'work' || s.type === 'drop' || s.type === 'fail'); });
      const top = done.slice().sort(function(a,b){
        const scA = a.w > 0 ? e1RM(a.w, a.r) : a.r;
        const scB = b.w > 0 ? e1RM(b.w, b.r) : b.r;
        return scB - scA;
      })[0] || null;
      if(!top) return null;
      const avg = done.length ? done.reduce(function(s,x){ return s + (x.rpe||8); },0)/done.length : 8;
      const score = top.w > 0 ? e1RM(top.w, top.r) : top.r;
      return { date: l.date, w: top.w, r: top.r, rpe: avg, e: score, isBodyweight: !(top.w > 0) };
    }).filter(Boolean);
}
function rebuildRecords(){
  state.records = {};
  const sortedLogs = state.logs.slice().sort(function(a,b){ return a.date - b.date; });
  for(const log of sortedLogs){
    for(const e of (log.ex || [])){
      const work = (e.sets || []).filter(function(s){ return (s.type === 'work' || s.type === 'drop' || s.type === 'fail') && (s.w > 0 || s.r > 0); });
      const top = work.slice().sort(function(a,b){
        const scA = a.w > 0 ? e1RM(a.w, a.r) : a.r;
        const scB = b.w > 0 ? e1RM(b.w, b.r) : b.r;
        return scB - scA;
      })[0];
      if(!top) continue;
      const score = top.w > 0 ? e1RM(top.w, top.r) : top.r;
      const cur = state.records[e.exId];
      if(!cur || score > cur.best){
        state.records[e.exId] = { best: score, w: top.w, r: top.r, date: log.date };
      }
    }
  }
}
function totalVolume(){ return state.logs.reduce(function(s,l){ return s + l.volume; }, 0); }
function weeklyStats(){
  const mon = mondayOf(new Date()).getTime();
  const wk = state.logs.filter(function(l){ return mondayOf(new Date(l.date)).getTime() === mon; });
  return { count: wk.length, volume: wk.reduce(function(s,l){ return s + l.volume; }, 0) };
}
function weekStreak(){
  const weeks = new Set(state.logs.map(function(l){ return mondayOf(new Date(l.date)).getTime(); }));
  let cur = mondayOf(new Date()).getTime();
  if(!weeks.has(cur)) cur -= 604800000;
  let n = 0;
  while(weeks.has(cur)){ n++; cur -= 604800000; }
  return n;
}
function steelConsistency(){
  let cur = mondayOf(new Date()).getTime();
  for(let i=0;i<4;i++){
    const cnt = state.logs.filter(function(l){ return mondayOf(new Date(l.date)).getTime() === cur; }).length;
    if(cnt < 3) return false;
    cur -= 604800000;
  }
  return true;
}
function prCount(){ return state.logs.reduce(function(s,l){ return s + (l.prCount||0); }, 0); }
function suggestedWorkout(){
  if(!state.workouts.length) return null;
  const last = state.logs.slice().sort(function(a,b){ return b.date - a.date; })[0];
  if(!last) return state.workouts[0];
  const i = state.workouts.findIndex(function(w){ return w.id === last.workoutId; });
  return state.workouts[(i+1) % state.workouts.length] || state.workouts[0];
}
function checkAchievements(silent){
  const news = [];
  const unlock = function(id){
    if(!state.ach[id]){ state.ach[id] = { at: Date.now() };
      const a = ACHS.find(function(x){ return x.id === id; }); if(a) news.push(a); }
  };
  const sess = state.logs.length;
  if(sess >= 1) unlock('first');
  if(state.logs.some(function(l){ return l.volume >= 1000; })) unlock('ton1');
  if(totalVolume() >= 10000) unlock('ton10');
  if(totalVolume() >= 50000) unlock('ton50');
  if(steelConsistency()) unlock('steel');
  if(prCount() >= 1) unlock('pr1');
  if(prCount() >= 10) unlock('pr10');
  if(sess >= 10) unlock('s10');
  if(sess >= 50) unlock('s50');
  if(levelInfo(state.user.xp).lvl >= 5) unlock('lvl5');
  if(state.logs.some(function(l){ return l.totalReps >= 100; })) unlock('rep100');
  if(state.logs.some(function(l){ return l.duration >= 45*60000; })) unlock('hour');
  for(const exId in state.records){
    const h = historyOf(exId);
    if(h.length >= 5 && h[0].e > 0 && state.records[exId].best >= h[0].e*2){ unlock('double'); break; }
  }
  if(news.length && !silent) save();
  return news;
}