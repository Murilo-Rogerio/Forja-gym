function toast(msg, kind, ico){
  const el = document.createElement('div');
  el.className = 'toast ' + (kind||'');
  el.innerHTML = icon(ico || (kind==='ok'?'check':kind==='bad'?'x':kind==='ai'?'spark':'info')) + '<span>' + esc(msg) + '</span>';
  const layer = document.getElementById('toastlayer');
  layer.appendChild(el);
  while(layer.children.length > 3) layer.firstElementChild.remove();
  setTimeout(function(){ el.classList.add('out'); setTimeout(function(){ el.remove(); }, 260); }, 2800);
}
function modalConfirm(o){
  return new Promise(function(res){
    const layer = document.getElementById('modallayer');
    layer.innerHTML = '<div class="sheet"><div class="sheet-grip"></div>' +
      '<div class="h-display h2">' + esc(o.title) + '</div>' +
      '<p class="mut mt8" style="line-height:1.55;font-size:14.5px">' + esc(o.msg) + '</p>' +
      '<div class="split2 mt20"><button class="btn btn-ghost ripple" id="md-no">Cancelar</button>' +
      '<button class="btn ' + (o.danger?'btn-danger':'btn-pri') + ' ripple" id="md-yes">' + esc(o.ok||'Confirmar') + '</button></div></div>';
    layer.classList.add('on');
    const done = function(v){ layer.classList.remove('on'); layer.innerHTML=''; res(v); };
    layer.onclick = function(e){ if(e.target === layer) done(false); };
    document.getElementById('md-no').onclick = function(){ done(false); };
    document.getElementById('md-yes').onclick = function(){ done(true); };
  });
}
function modalHTML(html){
  const layer = document.getElementById('modallayer');
  layer.innerHTML = '<div class="sheet">' + html + '</div>';
  layer.classList.add('on');
  layer.onclick = function(e){ if(e.target === layer){ layer.classList.remove('on'); layer.innerHTML=''; } };
  return layer;
}
function closeModal(){ const l = document.getElementById('modallayer'); l.classList.remove('on'); l.innerHTML=''; }