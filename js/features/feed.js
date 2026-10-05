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
    { id: uid(), at: now - 3*3600000, name:'Carla Menezes', text:'Treino de costas concluído. A puxada frontal subiu 5kg essa semana — consistência paga.',
      photo:'https://picsum.photos/seed/forja-feed-1/900/620.jpg', likes:12, liked:false,
      w:{ name:'Treino B — Costas e Bíceps', volume:8420, duration:52*60000, reps:126, prs:1, groups:['Costas','Braços'] } },
    { id: uid(), at: now - 9*3600000, name:'Rafa Pinheiro', text:'Pernas completo. Saí rastejando do jeito certo. Nova PR no agachamento.',
      photo:'https://picsum.photos/seed/forja-feed-2/900/620.jpg', likes:24, liked:false,
      w:{ name:'Treino C — Pernas Completo', volume:11430, duration:61*60000, reps:118, prs:2, groups:['Pernas','Core'] } },
    { id: uid(), at: now - 26*3600000, name:'Duda Lima', text:'Meta mensal de tonelagem batida com uma semana de antecedência. O gráfico não mente.',
      photo:'https://picsum.photos/seed/forja-feed-3/900/620.jpg', likes:9, liked:false,
      w:{ name:'Treino A — Peito e Ombros', volume:6980, duration:47*60000, reps:104, prs:0, groups:['Peito','Ombros','Braços'] } }
  ];
  save();
}
function openComposer(prefLog){
  postPhoto = null;
  postLogRef = prefLog || state.logs[state.logs.length-1] || null;
  const name = state.user.name || (session ? session.name : '') || 'Atleta';
  openScreen(screenHeader('Publicar treino') +
    '<div class="screen-bd">' +
    '<div class="card"><div class="rowline" style="align-items:flex-start">' +
    '<div class="avatar">' + esc(initialsOf(name)) + '</div>' +
    '<div style="flex:1"><label class="lbl">Legenda</label>' +
    '<textarea class="fld mt8" id="post-text" placeholder="Como foi o treino? Conta a evolução, a PR, o sufrimento..."></textarea></div></div></div>' +
    '<div class="mt14"><div class="lbl">Foto do treino (opcional)</div>' +
    '<label class="card mt8" style="display:flex;align-items:center;gap:14px;cursor:pointer" id="photo-zone">' +
    '<div style="width:46px;height:46px;border-radius:13px;background:rgba(56,189,248,.1);color:var(--acc);display:flex;align-items:center;justify-content:center">' + icon('camera') + '</div>' +
    '<div class="mut" style="flex:1;font-size:13px">Tirar foto ou escolher da galeria</div>' + icon('plus') + '</label>' +
    '<input type="file" accept="image/*" style="display:none" data-chg="post-photo">' +
    '<div id="photo-prev" class="mt14"></div></div>' +
    (postLogRef ? '<div class="card mt14"><div class="lbl">Anexar resumo do treino</div>' +
      '<div class="rowline mt14"><div><b style="font-family:var(--fd);font-size:16px;letter-spacing:.5px;text-transform:uppercase">' + esc(postLogRef.name) + '</b>' +
      '<div class="mut mt8" style="font-size:12.5px">' + fmtKg(postLogRef.volume) + ' · ' + postLogRef.totalReps + ' reps · ' + fmtDur(postLogRef.duration) +
      (postLogRef.prCount ? ' · ' + postLogRef.prCount + ' PR' : '') + '</div></div>' + icon('dumbbell') + '</div></div>' : '') +
    '<button class="btn btn-pri ripple mt20" style="width:100%" data-act="post-send">' + icon('send') + ' Publicar no feed</button></div>');
}
function sendPost(){
  const text = ((document.getElementById('post-text') || {}).value || '').trim();
  if(!text && !postPhoto && !postLogRef){ toast('Escreva algo ou anexe o treino.', 'bad'); return; }
  const name = state.user.name || (session ? session.name : '') || 'Atleta';
  const w = postLogRef ? { name: postLogRef.name, volume: postLogRef.volume, duration: postLogRef.duration,
    reps: postLogRef.totalReps, prs: postLogRef.prCount, groups: Object.keys(postLogRef.groups || {}) } : null;
  const post = { id: uid(), at: Date.now(), name: name, text: text, photo: postPhoto, likes: 0, liked: false, w: w };
  state.posts.unshift(post);
  save();
  fbPostPush(post);
  const sc = document.getElementById('stack').lastElementChild;
  if(sc) sc.remove();
  const rp = document.getElementById('stack').lastElementChild;
  if(rp && rp.dataset.nodismiss === '1') rp.remove();
  toast('Treino publicado no feed.', 'ok', 'send');
  go('feed');
}
function openFriends(){
  const rows = state.friends.map(function(f, i){
    return '<div class="wrow" style="padding:12px 14px"><div class="avatar" style="width:38px;height:38px;font-size:14px">' + esc(initialsOf(f.name)) + '</div>' +
      '<div style="flex:1"><b style="font-size:14.5px">' + esc(f.name) + '</b>' +
      '<div class="dim" style="font-size:11.5px">' + esc(f.email) + '</div></div>' +
      '<button class="iconbtn ripple" style="width:34px;height:34px;color:var(--bad)" data-act="friend-del" data-arg="' + i + '" aria-label="Remover">' + icon('x') + '</button></div>';
  }).join('');
  openScreen(screenHeader('Amigos') +
    '<div class="screen-bd">' +
    '<div class="card"><div class="lbl">Adicionar amigo</div>' +
    '<div class="rowline mt8" style="gap:8px"><input class="fld" id="fr-email" type="email" placeholder="e-mail do amigo">' +
    '<button class="btn btn-pri ripple" data-act="friend-add">' + icon('plus') + '</button></div></div>' +
    '<div class="lbl mt20">Seus amigos (' + state.friends.length + ')</div>' +
    '<div class="stack mt14">' + (rows || '<div class="empty">Nenhum amigo ainda. Adicione pelo e-mail.</div>') + '</div>' +
    (FB ? '<p class="dim mt14" style="font-size:12px;line-height:1.5">Com Firebase conectado, seus posts públicos aparecem no feed da comunidade para todos os usuários do seu projeto.</p>' : '') +
    '</div>');
}
