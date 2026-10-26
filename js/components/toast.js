function toast(msg, kind, ico){
  const el = document.createElement('div');
  el.className = 'toast ' + (kind||'');
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
  el.innerHTML = icon(ico || (kind==='ok'?'check':kind==='bad'?'x':kind==='ai'?'spark':'info')) + '<span>' + esc(msg) + '</span>';
  const layer = document.getElementById('toastlayer');
  layer.appendChild(el);
  while(layer.children.length > 3) layer.firstElementChild.remove();
  setTimeout(function(){ el.classList.add('out'); setTimeout(function(){ el.remove(); }, 260); }, 2800);
}

function modalConfirm(o){
  return new Promise(function(res){
    const layer = document.getElementById('modallayer');
    layer.innerHTML = '<div class="sheet" role="dialog" aria-modal="true" aria-labelledby="md-title"><div class="sheet-grip"></div>' +
      '<div class="h-display h2" id="md-title">' + esc(o.title) + '</div>' +
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
  layer.innerHTML = '<div class="sheet" role="dialog" aria-modal="true">' + html + '</div>';
  layer.classList.add('on');
  layer.onclick = function(e){ if(e.target === layer){ closeModal(); } };
  return layer;
}

function closeModal(){
  const l = document.getElementById('modallayer');
  if(l){
    l.classList.remove('on');
    l.innerHTML='';
  }
}

// Global Keyboard Navigation (WCAG 2.1 AA)
window.addEventListener('keydown', function(e){
  if(e.key === 'Escape'){
    const modal = document.getElementById('modallayer');
    if(modal && modal.classList.contains('on')){
      closeModal();
      return;
    }
    const rf = document.getElementById('restfull');
    if(rf && rf.classList.contains('on')){
      rf.classList.remove('on');
      return;
    }
    const stack = document.getElementById('stack');
    if(stack && stack.lastElementChild && !stack.lastElementChild.dataset.nodismiss){
      closeScreen(stack.lastElementChild);
    }
  }
});
