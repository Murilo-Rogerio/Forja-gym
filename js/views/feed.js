function postCardHTML(p, idx){
  const av = esc(initialsOf(p.name));
  const strip = p.w ? '<div class="post-strip">' + icon('dumbbell') +
    '<div style="flex:1;min-width:0"><b style="font-family:var(--fd);font-size:14px;letter-spacing:.5px;text-transform:uppercase">' + esc(p.w.name) + '</b>' +
    '<div class="mut" style="font-size:11.5px">' + fmtKg(p.w.volume) + ' · ' + (p.w.reps||0) + ' reps · ' + fmtDur(p.w.duration||0) +
    (p.w.prs ? ' · <span style="color:var(--acc)">' + p.w.prs + ' PR</span>' : '') + '</div></div>' +
    (p.w.groups||[]).slice(0,3).map(function(g){ return '<span class="chip" style="font-size:10px;padding:3px 8px">' + esc(g) + '</span>'; }).join('') + '</div>' : '';
  const photo = p.photo ? '<img class="post-photo" src="' + esc(p.photo) + '" alt="Foto do treino" loading="lazy">' : '';
  const own = p.own;

  return '<div class="post rise" style="--d:' + (idx*60) + 'ms">' +
    '<div class="rowline" style="align-items:flex-start"><div style="display:flex;gap:11px;align-items:center">' +
    '<div class="avatar">' + av + '</div><div><b style="font-size:14.5px">' + esc(p.name) + '</b>' +
    '<div class="dim" style="font-size:11.5px">' + timeAgo(p.at) + (own ? ' · você' : '') + '</div></div></div>' +
    (own ? '<button class="iconbtn ripple" style="width:34px;height:34px" data-act="post-del" data-arg="' + esc(p.id) + '" aria-label="Apagar">' + icon('trash') + '</button>' : '') +
    '</div>' +
    (p.text ? '<p class="mt14" style="font-size:14px;line-height:1.55">' + esc(p.text) + '</p>' : '') +
    photo + strip +
    '<div class="rowline mt14"><button class="likebtn' + (p.liked?' on':'') + '" data-act="post-like" data-arg="' + esc(p.id) + '">' +
    icon('heart') + '<span class="num">' + (p.likes||0) + '</span></button>' +
    '<span class="dim" style="font-size:11.5px">FORJA</span></div></div>';
}

RENDER.feed = function(){
  if(!state.feedSeeded && (!state.posts || !state.posts.length)){
    seedFeedDemo();
  }
  const myName = (state.user && state.user.name) || (session ? session.name : '');
  const merged = (remoteFeedCache || []).concat((state.posts || []).map(function(p){
    p.own = Boolean(myName && p.name === myName);
    return p;
  })).sort(function(a,b){ return b.at - a.at; });

  const emptyState =
    '<div class="card mt20 rise" style="text-align:center;padding:36px 20px">' +
    '<div style="width:60px;height:60px;border-radius:18px;background:var(--acc-deep);color:var(--acc);margin:0 auto 16px;display:flex;align-items:center;justify-content:center">' +
    icon('camera') + '</div>' +
    '<b style="font-size:18px;font-family:var(--fd);letter-spacing:.5px;text-transform:uppercase">Seu Feed Está Pronto!</b>' +
    '<p class="mut mt8" style="font-size:13.5px;line-height:1.6;max-width:340px;margin:8px auto">' +
    'Finalize um treino na academia, tire uma foto do shape ou dos pesos e compartilhe sua evolução com a comunidade.</p>' +
    '<div class="mt14" style="display:flex;gap:8px;justify-content:center">' +
    '<button class="btn btn-pri ripple" data-act="feed-new">' + icon('plus') + ' Publicar Treino ou Foto</button>' +
    '<button class="btn btn-ghost ripple" data-act="feed-friends">' + icon('users') + ' Amigos</button>' +
    '</div>' +
    '<div class="mt14"><button class="btn btn-ghost btn-sm ripple" data-act="feed-seed">' + icon('spark') + ' Carregar Feed Demo</button></div></div>';

  document.querySelector('.view[data-view="feed"]').innerHTML =
    '<div class="rowline rise"><div><div class="eyebrow">Comunidade</div>' +
    '<div class="h-display h1 mt8">FEED SOCIAL</div></div>' +
    '<div style="display:flex;gap:8px">' +
    '<button class="iconbtn ripple" data-act="feed-friends" aria-label="Amigos">' + icon('users') + '</button>' +
    '<button class="btn btn-pri btn-sm ripple" data-act="feed-new">' + icon('camera') + ' Publicar</button></div></div>' +
    '<div class="stack mt20">' +
    (merged.length ? merged.map(postCardHTML).join('') : emptyState) +
    '</div>';

  if(typeof fbFeedPull === 'function') fbFeedPull();
};
