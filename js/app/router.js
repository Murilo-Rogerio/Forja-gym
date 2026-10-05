const TABS = ['home','workouts','feed','progress','nutrition','profile'];
let curView = 'home';
const RENDER = {};

function go(view){
  const iN = TABS.indexOf(view), iO = TABS.indexOf(curView);
  document.querySelectorAll('.view').forEach(function(v){ v.classList.remove('on','dir-l','dir-r'); });
  const el = document.querySelector('.view[data-view="' + view + '"]');
  if(el) el.classList.add('on', iN > iO ? 'dir-r' : 'dir-l');
  curView = view;
  document.querySelectorAll('.tab').forEach(function(t){ t.classList.toggle('on', t.dataset.arg === view); });
  if(RENDER[view]) RENDER[view]();
}
function openScreen(html){
  const sc = document.createElement('div');
  sc.className = 'screen'; sc.innerHTML = html;
  document.getElementById('stack').appendChild(sc);
  return sc;
}
function closeScreen(sc){
  sc = sc || document.getElementById('stack').lastElementChild;
  if(!sc) return;
  sc.classList.add('out');
  const node = sc;
  setTimeout(function(){ node.remove(); }, 280);
  if(node === activeScreenEl) activeScreenEl = null;
}
function screenHeader(title, opts){
  opts = opts || {};
  return '<div class="screen-hd">' +
    (opts.back !== false ? '<button class="iconbtn ripple" data-act="screen-close" aria-label="Voltar">' + icon('back') + '</button>' : '') +
    '<div class="t">' + esc(title) + '</div>' + (opts.right||'') + '</div>';
}