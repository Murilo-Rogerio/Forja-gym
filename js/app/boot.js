let deferredPrompt = null;

function openOnboarding(){
  const actOpts = [['sedentario','Sedentário'],['leve','Levemente ativo'],['moderado','Moderadamente ativo'],['intenso','Muito ativo'],['atleta','Atleta']]
    .map(function(o){ return '<option value="' + o[0] + '"' + (o[0]==='moderado'?' selected':'') + '>' + o[1] + '</option>'; }).join('');
  const sc = openScreen('<div class="screen-bd" style="display:flex;flex-direction:column;justify-content:center;min-height:100vh">' +
    '<div class="eyebrow">Treino & Performance</div>' +
    '<div class="h-display mt14" style="font-size:clamp(54px,18vw,80px);line-height:.9">FORJA</div>' +
    '<p class="mut mt14" style="line-height:1.6;font-size:14.5px">Cargas, PRs, IA, feed social e descanso cronometrado. Tudo no seu bolso.</p>' +
    '<label class="flabel lbl">Como devo te chamar?</label><input class="fld" id="ob-name" placeholder="Seu nome" maxlength="30">' +
    '<div class="split2"><div><label class="flabel lbl">Sexo</label>' +
    '<select class="fld" id="ob-sex"><option value="m">Masculino</option><option value="f">Feminino</option></select></div>' +
    '<div><label class="flabel lbl">Idade</label><input class="fld" id="ob-age" type="number" inputmode="numeric" placeholder="28"></div></div>' +
    '<div class="split2"><div><label class="flabel lbl">Peso (kg)</label><input class="fld" id="ob-weight" type="number" inputmode="decimal" placeholder="78"></div>' +
    '<div><label class="flabel lbl">Altura (cm)</label><input class="fld" id="ob-height" type="number" inputmode="numeric" placeholder="176"></div></div>' +
    '<label class="flabel lbl">Nível de atividade</label><select class="fld" id="ob-activity">' + actOpts + '</select>' +
    '<label class="rowline mt20" style="cursor:pointer">' +
    '<input type="checkbox" id="ob-demo" checked style="width:19px;height:19px;accent-color:#38bdf8">' +
    '<span class="mut" style="font-size:13px;line-height:1.4">Criar fichas ABC com histórico de 3 semanas e feed de demonstração (removível depois)</span></label>' +
    '<button class="btn btn-pri ripple mt28" style="width:100%;padding:16px" data-act="ob-save">COMEÇAR A FORJAR</button></div>');
  sc.dataset.nodismiss = '1';
}
function saveOnboarding(){
  const name = document.getElementById('ob-name').value.trim();
  if(!name){ toast('Diga seu nome para começarmos.', 'bad'); return; }
  Object.assign(state.user, { name: name, sex: document.getElementById('ob-sex').value, age: parseNum(document.getElementById('ob-age').value),
    weight: parseNum(document.getElementById('ob-weight').value), height: parseNum(document.getElementById('ob-height').value), activity: document.getElementById('ob-activity').value });
  createStarterWorkouts();
  const demoBox = document.getElementById('ob-demo');
  if(demoBox && demoBox.checked){ seedDemo(); seedFeedDemo(); state.demo = true; }
  save();
  const sc = document.getElementById('stack').lastElementChild;
  if(sc) sc.remove();
  go('home');
  toast('Bem-vindo à forja, ' + name + '.', 'ok', 'flame');
}
function createStarterWorkouts(){
  const pick = function(n){ return state.library.find(function(e){ return e.name === n; }); };
  const mk = function(name, arr){
    return { id: uid(), name: name, split: 'ABC',
      ex: arr.map(function(a){
        const lib = pick(a[0]);
        return { exId: lib ? lib.id : uid(), rpe: a[3], rest: a[4], sets: [{ type:'work', reps: a[2] }] };
      }) };
  };
  state.workouts = [
    mk('Treino A — Peito, Ombro, Tríceps', [
      ['Supino Reto com Barra',0,10,8,90],['Supino Inclinado com Halteres',0,12,8,90],
      ['Elevação Lateral com Halteres',0,15,9,60],['Tríceps Testa',0,12,8,75]]),
    mk('Treino B — Costas e Bíceps', [
      ['Puxada Frontal na Polia',0,10,8,90],['Remada Curvada com Barra',0,10,8,90],
      ['Rosca Direta com Barra',0,12,8,75],['Rosca Martelo',0,12,9,60]]),
    mk('Treino C — Pernas Completo', [
      ['Agachamento Livre',0,8,8,120],['Leg Press 45°',0,12,8,90],
      ['Mesa Flexora',0,12,9,75],['Elevação Pélvica',0,12,8,75],['Panturrilha em Pé',0,15,9,60]])
  ];
  state.workouts.forEach(function(w){ w.ex.forEach(function(e,i){
    const t = e.sets[0].reps;
    e.sets = [];
    if(i === 0) e.sets.push({ type:'warm', reps: Math.min(20, t+5) });
    for(let k=0;k<4;k++) e.sets.push({ type:'work', reps: t });
  });});
}
function seedDemo(){
  const plan = {
    'ex-supino-reto-com-barra':[60,5], 'ex-supino-inclinado-com-halteres':[22,2],
    'ex-elevacao-lateral-com-halteres':[8,1], 'ex-triceps-testa':[30,2.5],
    'ex-puxada-frontal-na-polia':[55,3.5], 'ex-remada-curvada-com-barra':[50,3.5],
    'ex-rosca-direta-com-barra':[25,2], 'ex-rosca-martelo':[12,1],
    'ex-agachamento-livre':[80,5], 'ex-leg-press-45':[140,10],
    'ex-mesa-flexora':[45,3.5], 'ex-elevacao-pelvica':[60,5], 'ex-panturrilha-em-pe':[60,5]
  };
  const occ = {};
  const daysAgo = [21,19,17,14,12,10,7,5,3];
  let xpTotal = 0;
  daysAgo.forEach(function(d, idx){
    const w = state.workouts[idx % 3];
    const date = Date.now() - d*86400000;
    const ex = []; let vol = 0, reps = 0, setsDone = 0, prs = 0;
    const groups = {};
    w.ex.forEach(function(we){
      const p = plan[we.exId] || [40, 2.5];
      occ[we.exId] = occ[we.exId] || 0;
      let weight, r, rpe, sets = [];
      if(we.exId === 'ex-supino-reto-com-barra'){
        weight = 80; r = 10; rpe = 9;
        sets = [{ w: 40, r: 12, rpe: 4, type:'warm', done:true }];
        for(let k=0;k<4;k++) sets.push({ w: weight, r: r, rpe: rpe, type:'work', done:true });
      } else {
        weight = p[0] + p[1]*occ[we.exId];
        r = we.sets.filter(function(s){ return s.type === 'work'; })[0].reps - (occ[we.exId]%2 === 0 ? 1 : 0);
        rpe = 7 + (occ[we.exId]%3);
        sets = we.sets.map(function(s){ return { w: s.type==='warm' ? Math.round(weight*.5) : weight, r: s.type==='warm' ? r+3 : r, rpe: s.type==='warm' ? 4 : rpe, type: s.type, done: true }; });
      }
      occ[we.exId]++;
      ex.push({ exId: we.exId, sets: sets });
      const lib = libById(we.exId);
      const g = lib ? lib.group : 'Outros';
      sets.forEach(function(s){ if(s.type !== 'warm'){ vol += s.w*s.r; reps += s.r; groups[g] = (groups[g]||0) + s.w*s.r; } });
      setsDone += sets.length;
      const est = e1RM(weight, r);
      if(!state.records[we.exId] || est > state.records[we.exId].best){
        state.records[we.exId] = { best: est, w: weight, r: r, date: date }; prs++;
      }
    });
    const duration = (42 + (idx%3)*5) * 60000;
    const xpEarned = 40 + Math.floor(vol/500)*5;
    xpTotal += xpEarned;
    state.logs.push({ id: uid(), workoutId: w.id, name: w.name, date: date, duration: duration,
      volume: vol, xpEarned: xpEarned, prCount: prs, setsDone: setsDone, totalReps: reps, groups: groups, ex: ex });
  });
  state.user.xp = xpTotal;
  checkAchievements(true);
}

function setTabbarIcons(){
  const icons = { home:'home', workouts:'dumbbell', feed:'users', progress:'trend', nutrition:'apple', profile:'user' };
  const labels = { home:'Início', workouts:'Treinos', feed:'Feed', progress:'Progresso', nutrition:'Nutrição', profile:'Perfil' };
  document.querySelectorAll('.tab').forEach(function(t){
    t.innerHTML = icon(icons[t.dataset.arg]) + '<span>' + labels[t.dataset.arg] + '</span>';
  });
}
function makeIcon(size){
  const c = document.createElement('canvas'); c.width = c.height = size;
  const ctx = c.getContext('2d');
  const r = size*.22, s = size;
  ctx.beginPath();
  ctx.moveTo(r,0); ctx.arcTo(s,0,s,s,r); ctx.arcTo(s,s,0,s,r); ctx.arcTo(0,s,0,0,r); ctx.arcTo(0,0,s,0,r);
  ctx.closePath(); ctx.fillStyle = '#0f172a'; ctx.fill();
  ctx.strokeStyle = 'rgba(56,189,248,.5)'; ctx.lineWidth = s*.012; ctx.stroke();
  const cx = s/2, cy = s/2, u = s/512;
  ctx.fillStyle = '#e8eef8'; ctx.fillRect(cx-106*u, cy-9*u, 212*u, 18*u);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(cx-82*u, cy-30*u, 16*u, 60*u); ctx.fillRect(cx+66*u, cy-30*u, 16*u, 60*u);
  ctx.fillRect(cx-56*u, cy-58*u, 22*u, 116*u); ctx.fillRect(cx+34*u, cy-58*u, 22*u, 116*u);
  ctx.fillRect(cx-96*u, cy-82*u, 26*u, 164*u); ctx.fillRect(cx+70*u, cy-82*u, 26*u, 164*u);
  ctx.fillRect(cx-134*u, cy-104*u, 30*u, 208*u); ctx.fillRect(cx+104*u, cy-104*u, 30*u, 208*u);
  return c.toDataURL('image/png');
}
function initPWA(){
  try{
    const apple = document.createElement('link');
    apple.rel = 'apple-touch-icon'; apple.href = makeIcon(180);
    document.head.appendChild(apple);
  }catch(e){}
  window.addEventListener('beforeinstallprompt', function(e){
    e.preventDefault(); deferredPrompt = e;
    const btn = document.getElementById('install-btn');
    if(btn) btn.style.display = '';
  });
  if('serviceWorker' in navigator && location.protocol.indexOf('http') === 0){
    navigator.serviceWorker.register('./sw.js').catch(function(){
      console.info('SW não registrado nesta origem — o app permanece offline-first via armazenamento local.');
    });
  }
}

let resizeT = 0;
window.addEventListener('resize', function(){
  clearTimeout(resizeT);
  resizeT = setTimeout(function(){ if(state && RENDER[curView]) RENDER[curView](); }, 250);
});
window.addEventListener('beforeunload', function(){ if(active){ state.active = active; save(); } });

(function boot(){
  session = getSession();
  if(session){
    load();
    setTabbarIcons();
    go('home');
    if(!state.user.name) openOnboarding();
    else if(active){
      modalConfirm({ title:'Treino em andamento', msg:'Você deixou "' + active.name + '" aberto. Retomar de onde parou?', ok:'Retomar treino' })
        .then(function(yes){
          if(yes) openActiveScreen();
          else { active = null; state.active = null; save(); }
        });
    }
    checkAchievements(true);
    save();
    if(session.mode === 'firebase') fbInit().then(function(){ if(FB) fbSyncBestEffort(); });
  } else {
    let hasGuestData = false;
    try{
      const raw = JSON.parse(localStorage.getItem(LS_KEY));
      hasGuestData = !!(raw && raw.user && raw.user.name);
    }catch(e){}
    if(hasGuestData){
      setSession({ mode:'guest' });
      load(); setTabbarIcons(); go('home');
      checkAchievements(true); save();
    } else {
      setTabbarIcons();
      renderAuth();
    }
  }
  initPWA();
})();
