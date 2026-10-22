let deferredPrompt = null;

function openOnboarding(){
  const actOpts = [
    ['sedentario','Sedentário (pouco exercício)'],
    ['leve','Levemente ativo (1–3 dias/semana)'],
    ['moderado','Moderadamente ativo (3–5 dias/semana)'],
    ['intenso','Muito ativo (6–7 dias/semana)'],
    ['atleta','Atleta / Treino pesado diário']
  ].map(function(o){
    return '<option value="' + o[0] + '"' + (o[0]==='moderado'?' selected':'') + '>' + o[1] + '</option>';
  }).join('');

  const sc = openScreen(
    '<div class="screen-bd" style="display:flex;flex-direction:column;justify-content:center;min-height:100vh">' +
    '<div class="eyebrow">Treino & Performance</div>' +
    '<div class="h-display mt14" style="font-size:clamp(50px,18vw,78px);line-height:.9">FORJA</div>' +
    '<p class="mut mt14" style="line-height:1.6;font-size:14.5px">' +
    'Seu diário de treinos profissional, inspirado no Hevy com assistência inteligente de IA para montagem de fichas e micronutrientes.</p>' +

    '<label class="flabel lbl mt20">Como devemos te chamar?</label>' +
    '<input class="fld mt8" id="ob-name" placeholder="Seu nome" maxlength="30" value="' + esc(session ? session.name : '') + '">' +

    '<div class="split2 mt14"><div><label class="flabel lbl">Sexo</label>' +
    '<select class="fld mt8" id="ob-sex"><option value="m">Masculino</option><option value="f">Feminino</option></select></div>' +
    '<div><label class="flabel lbl">Idade</label><input class="fld mt8" id="ob-age" type="number" inputmode="numeric" placeholder="25"></div></div>' +

    '<div class="split2 mt14"><div><label class="flabel lbl">Peso (kg)</label><input class="fld mt8" id="ob-weight" type="number" inputmode="decimal" placeholder="78"></div>' +
    '<div><label class="flabel lbl">Altura (cm)</label><input class="fld mt8" id="ob-height" type="number" inputmode="numeric" placeholder="176"></div></div>' +

    '<label class="flabel lbl mt14">Nível de atividade</label><select class="fld mt8" id="ob-activity">' + actOpts + '</select>' +

    '<label class="flabel lbl mt14">Como deseja começar seu programa?</label>' +
    '<select class="fld mt8" id="ob-starter">' +
    '<option value="abc">Fichas Clássicas ABC (pesos em branco, você registra na academia)</option>' +
    '<option value="ai">Criar meu programa personalizado com a IA (Gemini)</option>' +
    '<option value="empty">Começar do zero (vou criar minhas próprias fichas)</option>' +
    '</select>' +

    '<button class="btn btn-pri ripple mt28" style="width:100%;padding:16px;font-size:16px" data-act="ob-save">' +
    icon('flame') + ' ENTRAR NA FORJA</button>' +
    '</div>'
  );
  sc.dataset.nodismiss = '1';
}

function saveOnboarding(){
  const nameInput = document.getElementById('ob-name');
  const name = nameInput ? nameInput.value.trim() : '';
  if(!name){ toast('Por favor, informe seu nome para começar.', 'bad'); return; }

  Object.assign(state.user, {
    name: name,
    sex: document.getElementById('ob-sex').value,
    age: parseNum(document.getElementById('ob-age').value),
    weight: parseNum(document.getElementById('ob-weight').value),
    height: parseNum(document.getElementById('ob-height').value),
    activity: document.getElementById('ob-activity').value
  });

  const starter = (document.getElementById('ob-starter') || {}).value || 'abc';
  if(starter === 'abc'){
    createStarterWorkouts();
  } else {
    state.workouts = [];
  }

  // Garante que o usuário comece 100% limpo, sem cargas ou PRs fictícios
  state.logs = [];
  state.records = {};
  state.ach = {};
  state.user.xp = 0;
  state.demo = false;
  save();

  const sc = document.getElementById('stack').lastElementChild;
  if(sc) sc.remove();

  go('home');
  toast('Bem-vindo à FORJA, ' + name + '! Bons treinos.', 'ok', 'flame');

  // Se escolheu IA, abre o assistente diretamente
  if(starter === 'ai'){
    setTimeout(function(){ openAIScreen(); }, 400);
  }
}

/* Cria fichas ABC com estrutura correta e limpa (pesos vazios para o usuário preencher na academia) */
function createStarterWorkouts(){
  const pick = function(n){ return state.library.find(function(e){ return e.name === n; }); };
  const mk = function(name, arr){
    return {
      id: uid(),
      name: name,
      split: 'ABC',
      ex: arr.map(function(a){
        const lib = pick(a[0]);
        return {
          exId: lib ? lib.id : uid(),
          rpe: a[3],
          rest: a[4],
          sets: [{ type:'work', reps: a[2] }]
        };
      })
    };
  };

  state.workouts = [
    mk('Treino A — Peito, Ombros e Tríceps', [
      ['Supino Reto com Barra', 0, 10, 8, 90],
      ['Supino Inclinado com Halteres', 0, 10, 8, 90],
      ['Elevação Lateral com Halteres', 0, 12, 9, 60],
      ['Tríceps na Polia com Barra', 0, 12, 8, 75],
      ['Tríceps Testa com Barra W', 0, 10, 8, 90]
    ]),
    mk('Treino B — Costas e Bíceps', [
      ['Puxada Frontal na Polia', 0, 10, 8, 90],
      ['Remada Curvada com Barra', 0, 10, 8, 90],
      ['Remada Baixa na Polia (Sentado)', 0, 12, 8, 75],
      ['Rosca Direta com Barra W', 0, 10, 8, 75],
      ['Rosca Martelo com Halteres', 0, 12, 9, 60]
    ]),
    mk('Treino C — Pernas Completo', [
      ['Agachamento Livre com Barra', 0, 8, 8, 120],
      ['Leg Press 45°', 0, 10, 8, 90],
      ['Cadeira Extensora', 0, 12, 9, 75],
      ['Mesa Flexora', 0, 12, 9, 75],
      ['Panturrilha em Pé na Máquina', 0, 15, 9, 60]
    ])
  ];

  state.workouts.forEach(function(w){
    w.ex.forEach(function(e, i){
      const t = e.sets[0].reps;
      e.sets = [];
      // 1 série de aquecimento leve no primeiro exercício
      if(i === 0) e.sets.push({ type:'warm', reps: Math.min(20, t + 4) });
      // 3 séries válidas de trabalho (com reps alvo e cargas em branco)
      for(let k = 0; k < 3; k++) e.sets.push({ type:'work', reps: t });
    });
  });
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
  ctx.closePath(); ctx.fillStyle = '#070b15'; ctx.fill();
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
      modalConfirm({
        title: 'Treino em andamento',
        msg: 'Você deixou "' + active.name + '" aberto. Retomar de onde parou?',
        ok: 'Retomar treino'
      }).then(function(yes){
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
      load();
      setTabbarIcons();
      go('home');
      checkAchievements(true);
      save();
    } else {
      setTabbarIcons();
      renderAuth();
    }
  }
  initPWA();
})();
