RENDER.workouts = function(){
  const rows = state.workouts.map(function(w){
    return '<div class="wrow rise"><div class="wsplit">' + esc(splitTag(w.name)) + '</div>' +
      '<div style="flex:1" class="tap" data-act="w-start" data-arg="' + w.id + '">' +
      '<b style="font-family:var(--fd);font-size:17px;letter-spacing:.5px;text-transform:uppercase">' + esc(w.name) + '</b>' +
      '<div class="mut" style="font-size:12.5px;margin-top:3px">' + esc(w.split) + ' · ' + w.ex.length + ' exercícios · ' +
      w.ex.reduce(function(s,e){ return s + e.sets.length; },0) + ' séries</div></div>' +
      '<button class="iconbtn ripple" data-act="w-edit" data-arg="' + w.id + '" aria-label="Editar">' + icon('pencil') + '</button>' +
      '<button class="iconbtn ripple" data-act="w-del" data-arg="' + w.id + '" aria-label="Excluir">' + icon('trash') + '</button></div>';
  }).join('');
  document.querySelector('.view[data-view="workouts"]').innerHTML =
    '<div class="rowline rise"><div><div class="eyebrow">Programa</div>' +
    '<div class="h-display h1 mt8">FICHAS DE<br>TREINO</div></div>' +
    '<button class="btn btn-pri ripple" data-act="w-new">' + icon('plus') + ' Nova</button></div>' +
    '<div class="card acc mt14 rise" style="--d:80ms;display:flex;gap:14px;align-items:center;cursor:pointer" data-act="ai-open">' +
    '<div style="width:46px;height:46px;border-radius:14px;background:rgba(56,189,248,.12);color:var(--acc);display:flex;align-items:center;justify-content:center;flex:none">' + icon('wand') + '</div>' +
    '<div style="flex:1"><b style="font-family:var(--fd);font-size:17px;letter-spacing:.5px;text-transform:uppercase;color:var(--acc)">Assistente IA</b>' +
    '<div class="mut mt8" style="font-size:12.5px">Descreva seu objetivo e o Gemini monta seu programa completo</div></div>' + icon('fwd') + '</div>' +
    '<div class="mt20 stack">' + (rows || '<div class="empty">Nenhuma ficha ainda. Crie manualmente ou deixe a IA montar.</div>') + '</div>' +
    '<div class="mt28 rise"><div class="rowline"><div class="lbl">Biblioteca de exercícios</div>' +
    '<span class="dim num" style="font-size:12px">' + state.library.length + ' exercícios</span></div>' +
    '<button class="btn btn-ghost ripple mt14" style="width:100%" data-act="lib-browse">' + icon('search') + ' Explorar e criar exercícios</button></div>';
};
