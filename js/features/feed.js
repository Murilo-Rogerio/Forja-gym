let postPhoto = null, postLogRef = null, remoteFeedCache = [];

function seedFeedDemo(){
  if(state.feedSeeded) return;
  state.feedSeeded = true;
  state.friends = [
    { email:'carla.menezes@example.com', name:'Carla Menezes' },
    { email:'rafa.pinheiro@example.com', name:'Rafa Pinheiro' },
    { email:'duda.lima@example.com', name:'Duda Lima' }
  ];
  const now = Date.now();
  state.posts = [
    {
      id: uid(),
      at: now - 3*3600000,
      name: 'Carla Menezes',
      text: 'Treino de costas concluído com sucesso. A remada curvada subiu 5kg essa semana — a consistência sempre paga!',
      photo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80',
      likes: 12,
      liked: false,
      w: { name:'Treino B — Costas e Bíceps', volume:8420, duration:52*60000, reps:126, prs:1, groups:['Costas','Braços'] }
    },
    {
      id: uid(),
      at: now - 9*3600000,
      name: 'Rafa Pinheiro',
      text: 'Leg day completo! Saí rastejando mas bati novo PR no agachamento livre. O plano da IA deu muito certo.',
      photo: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=900&q=80',
      likes: 24,
      liked: false,
      w: { name:'Treino C — Pernas Completo', volume:11430, duration:61*60000, reps:118, prs:2, groups:['Pernas','Core'] }
    },
    {
      id: uid(),
      at: now - 26*3600000,
      name: 'Duda Lima',
      text: 'Meta semanal de tonelagem atingida com folga! Rumo ao nível 5 no FORJA.',
      photo: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=900&q=80',
      likes: 9,
      liked: false,
      w: { name:'Treino A — Peito e Ombros', volume:6980, duration:47*60000, reps:104, prs:0, groups:['Peito','Ombros','Braços'] }
    }
  ];
  save();
}

function openComposer(prefLog){
  postPhoto = null;
  postLogRef = prefLog || state.logs[state.logs.length-1] || null;
  const name = state.user.name || (session ? session.name : '') || 'Atleta';

  openScreen(
    screenHeader('Publicar Treino no Feed') +
    '<div class="screen-bd">' +
    '<div class="card"><div class="rowline" style="align-items:flex-start">' +
    '<div class="avatar">' + esc(initialsOf(name)) + '</div>' +
    '<div style="flex:1"><label class="lbl">Como foi seu treino?</label>' +
    '<textarea class="fld mt8" id="post-text" placeholder="Compartilhe como foi a sessão, os recordes batidos, a carga ou um recado pra galera..."></textarea></div></div></div>' +

    '<div class="mt14"><div class="lbl">Foto da Sessão (Opcional)</div>' +
    '<label class="card mt8" style="display:flex;align-items:center;gap:14px;cursor:pointer" id="photo-zone">' +
    '<div style="width:46px;height:46px;border-radius:13px;background:rgba(56,189,248,.12);color:var(--acc);display:flex;align-items:center;justify-content:center">' + icon('camera') + '</div>' +
    '<div class="mut" style="flex:1;font-size:13.5px">Tirar foto ou escolher da galeria</div>' +
    '<span class="chip">' + icon('plus') + ' Foto</span></label>' +
    '<input type="file" accept="image/*" style="display:none" data-chg="post-photo">' +
    '<div id="photo-prev" class="mt14"></div></div>' +

    (postLogRef ?
      '<div class="card mt14"><div class="lbl">Resumo do Treino Concluído</div>' +
      '<div class="rowline mt14"><div><b style="font-family:var(--fd);font-size:17px;letter-spacing:.5px;text-transform:uppercase;color:var(--acc)">' +
      esc(postLogRef.name) + '</b>' +
      '<div class="mut mt8" style="font-size:12.5px">' + fmtKg(postLogRef.volume) + ' tonelagem · ' + postLogRef.totalReps + ' reps · ' + fmtDur(postLogRef.duration) +
      (postLogRef.prCount ? ' · <span style="color:var(--acc)">' + postLogRef.prCount + ' PR</span>' : '') + '</div></div>' +
      '<div style="width:40px;height:40px;border-radius:12px;background:var(--acc-deep);color:var(--acc);display:flex;align-items:center;justify-content:center">' +
      icon('dumbbell') + '</div></div></div>'
      : '') +

    '<button class="btn btn-pri ripple mt24" style="width:100%;padding:15px;font-size:15px" data-act="post-send">' +
    icon('send') + ' Compartilhar no Feed</button>' +
    '</div>'
  );
}

function sendPost(){
  const text = ((document.getElementById('post-text') || {}).value || '').trim();
  if(!text && !postPhoto && !postLogRef){
    toast('Escreva uma legenda ou anexe uma foto/treino.', 'bad');
    return;
  }
  const name = state.user.name || (session ? session.name : '') || 'Atleta';
  const w = postLogRef ? {
    name: postLogRef.name,
    volume: postLogRef.volume,
    duration: postLogRef.duration,
    reps: postLogRef.totalReps,
    prs: postLogRef.prCount,
    groups: Object.keys(postLogRef.groups || {})
  } : null;

  const post = {
    id: uid(),
    at: Date.now(),
    name: name,
    text: text,
    photo: postPhoto,
    likes: 0,
    liked: false,
    w: w
  };

  state.posts.unshift(post);
  save();
  fbPostPush(post);

  const sc = document.getElementById('stack').lastElementChild;
  if(sc) sc.remove();
  const rp = document.getElementById('stack').lastElementChild;
  if(rp && rp.dataset.nodismiss === '1') rp.remove();

  toast('Treino publicado no feed da comunidade!', 'ok', 'send');
  go('feed');
}

function openFriends(){
  const rows = (state.friends || []).map(function(f, i){
    return '<div class="wrow" style="padding:12px 14px"><div class="avatar" style="width:38px;height:38px;font-size:14px">' +
      esc(initialsOf(f.name)) + '</div>' +
      '<div style="flex:1"><b style="font-size:14.5px">' + esc(f.name) + '</b>' +
      '<div class="dim" style="font-size:11.5px">' + esc(f.email) + '</div></div>' +
      '<button class="iconbtn ripple" style="width:34px;height:34px;color:var(--bad)" data-act="friend-del" data-arg="' + i + '" aria-label="Remover">' + icon('x') + '</button></div>';
  }).join('');

  openScreen(
    screenHeader('Comunidade & Amigos') +
    '<div class="screen-bd">' +
    '<div class="card"><div class="lbl">Adicionar Amigo</div>' +
    '<div class="rowline mt8" style="gap:8px">' +
    '<input class="fld" id="fr-email" type="email" placeholder="E-mail ou nome do amigo">' +
    '<button class="btn btn-pri ripple" data-act="friend-add">' + icon('plus') + ' Adicionar</button></div></div>' +
    '<div class="lbl mt20">Seus Amigos (' + (state.friends || []).length + ')</div>' +
    '<div class="stack mt14">' + (rows || '<div class="empty">Nenhum amigo adicionado ainda. Convide amigos pelo e-mail.</div>') + '</div>' +
    '<p class="dim mt20" style="font-size:12px;line-height:1.5">No FORJA, você acompanha os recordes (PRs) e treinos concluídos dos seus amigos no Feed.</p>' +
    '</div>'
  );
}

/* Sincronização de Feed com Firebase Firestore (quando configurado) */
async function fbPostPush(post){
  if(!FB || !session || session.mode !== 'firebase') return;
  try{
    const col = FB.f.collection(FB.db, 'forjaFeed');
    await FB.f.addDoc(col, Object.assign({}, post, { uid: session.uid }));
  }catch(e){
    console.warn('Firebase feed push error', e);
  }
}

async function fbFeedPull(){
  if(!FB || !session || session.mode !== 'firebase') return;
  try{
    const col = FB.f.collection(FB.db, 'forjaFeed');
    const q = FB.f.query(col, FB.f.orderBy('at', 'desc'), FB.f.limit(20));
    const snap = await FB.f.getDocs(q);
    const remote = [];
    snap.forEach(function(doc){
      const d = doc.data();
      if(d && d.id && !state.posts.some(function(p){ return p.id === d.id; })){
        remote.push(d);
      }
    });
    if(remote.length){
      remoteFeedCache = remote;
      if(curView === 'feed' && RENDER.feed) RENDER.feed();
    }
  }catch(e){
    console.warn('Firebase feed pull error', e);
  }
}
