const MUS_FRONT = [
  { g:'Costas', d:'M66,60 L94,60 L88,72 L72,72 Z' },
  { g:'Ombros', d:'M55,76 a11,10 0 1 0 22,0 a11,10 0 1 0 -22,0' },
  { g:'Ombros', d:'M83,76 a11,10 0 1 0 22,0 a11,10 0 1 0 -22,0' },
  { g:'Peito', d:'M63,78 L79,78 L79,98 Q70,104 63,97 Z' },
  { g:'Peito', d:'M81,78 L97,78 L97,97 Q90,104 81,98 Z' },
  { g:'Core', d:'M67,104 h26 a4,7 0 0 1 0,54 h-26 a4,7 0 0 1 0,-54 Z' },
  { g:'Core', d:'M62,110 C60,130 61,150 64,158 L67,158 L67,112 Z' },
  { g:'Core', d:'M98,110 C100,130 99,150 96,158 L93,158 L93,112 Z' },
  { g:'Braços', d:'M39,108 a7,15 8 0 1 0 14,0 a7,15 8 0 1 0 -14,0' },
  { g:'Braços', d:'M107,108 a7,15 -8 0 1 0 14,0 a7,15 -8 0 1 0 -14,0' },
  { g:'Braços', d:'M33,150 a6.5,16 6 0 1 0 13,0 a6.5,16 6 0 1 0 -13,0' },
  { g:'Braços', d:'M114,150 a6.5,16 -6 0 1 0 13,0 a6.5,16 -6 0 1 0 -13,0' },
  { g:'Pernas', d:'M57,208 a11,32 0 1 0 22,0 a11,32 0 1 0 -22,0' },
  { g:'Pernas', d:'M81,208 a11,32 0 1 0 22,0 a11,32 0 1 0 -22,0' },
  { g:'Pernas', d:'M59,282 a8,19 0 1 0 16,0 a8,19 0 1 0 -16,0' },
  { g:'Pernas', d:'M85,282 a8,19 0 1 0 16,0 a8,19 0 1 0 -16,0' }
];
const MUS_BACK = [
  { g:'Costas', d:'M80,56 L104,68 L96,98 L80,112 L64,98 L56,68 Z' },
  { g:'Costas', d:'M56,72 C66,88 74,96 80,100 C86,96 94,88 104,72 L104,110 C98,132 90,144 80,150 C70,144 62,132 56,110 Z' },
  { g:'Costas', d:'M72,150 h16 a3,4 0 0 1 0,18 h-16 a3,4 0 0 1 0,-18 Z' },
  { g:'Braços', d:'M39,106 a7,14 8 0 1 0 14,0 a7,14 8 0 1 0 -14,0' },
  { g:'Braços', d:'M107,106 a7,14 -8 0 1 0 14,0 a7,14 -8 0 1 0 -14,0' },
  { g:'Braços', d:'M33,150 a6.5,16 6 0 1 0 13,0 a6.5,16 6 0 1 0 -13,0' },
  { g:'Braços', d:'M114,150 a6.5,16 -6 0 1 0 13,0 a6.5,16 -6 0 1 0 -13,0' },
  { g:'Pernas', d:'M57,184 a11,11 0 1 0 22,0 a11,11 0 1 0 -22,0' },
  { g:'Pernas', d:'M81,184 a11,11 0 1 0 22,0 a11,11 0 1 0 -22,0' },
  { g:'Pernas', d:'M58,216 a10.5,28 0 1 0 21,0 a10.5,28 0 1 0 -21,0' },
  { g:'Pernas', d:'M81,216 a10.5,28 0 1 0 21,0 a10.5,28 0 1 0 -21,0' },
  { g:'Pernas', d:'M58,272 a8.5,22 0 1 0 17,0 a8.5,22 0 1 0 -17,0' },
  { g:'Pernas', d:'M85,272 a8.5,22 0 1 0 17,0 a8.5,22 0 1 0 -17,0' }
];
function figureSVG(shapes, groups, maxV, label){
  const silhouette =
    '<ellipse class="dimshape" cx="80" cy="30" rx="15" ry="18"/>' +
    '<rect class="dimshape" x="72" y="46" width="16" height="12" rx="3"/>' +
    '<path class="dimshape" d="M80,58 C60,58 48,66 46,84 L54,124 C56,142 58,156 62,170 L98,170 C102,156 104,142 106,124 L114,84 C112,66 100,58 80,58 Z"/>' +
    '<path class="dimshape" d="M50,80 C44,110 40,140 38,172 L36,214" fill="none" stroke="rgba(148,163,184,.15)" stroke-width="15" stroke-linecap="round"/>' +
    '<path class="dimshape" d="M110,80 C116,110 120,140 122,172 L124,214" fill="none" stroke="rgba(148,163,184,.15)" stroke-width="15" stroke-linecap="round"/>' +
    '<circle class="dimshape" cx="35" cy="224" r="7"/><circle class="dimshape" cx="125" cy="224" r="7"/>' +
    '<path class="dimshape" d="M70,172 C68,200 67,230 67,258 L68,300" fill="none" stroke="rgba(148,163,184,.15)" stroke-width="21" stroke-linecap="round"/>' +
    '<path class="dimshape" d="M90,172 C92,200 93,230 93,258 L92,300" fill="none" stroke="rgba(148,163,184,.15)" stroke-width="21" stroke-linecap="round"/>' +
    '<ellipse class="dimshape" cx="66" cy="312" rx="11" ry="6"/><ellipse class="dimshape" cx="94" cy="312" rx="11" ry="6"/>';
  let i = 0;
  const mus = shapes.map(function(m){
    const vol = groups[m.g] || 0;
    if(!(vol > 0)) return '<path class="mus" d="' + m.d + '"/>';
    const op = (.5 + .5*(vol/Math.max(1,maxV))).toFixed(2);
    const attrs = 'class="mus on" fill="rgba(239,68,68,' + op + ')" stroke="rgba(239,68,68,.75)" style="--d:' + (i*70) + 'ms"';
    i++;
    return '<path ' + attrs + ' d="' + m.d + '"/>';
  }).join('');
  return '<figure><svg viewBox="0 0 160 330">' + silhouette + mus + '</svg><figcaption>' + label + '</figcaption></figure>';
}
function bodyMapHTML(groups){
  const maxV = Math.max.apply(null, [1].concat(Object.keys(groups).map(function(k){ return groups[k] || 0; })));
  return '<div class="bodymap">' + figureSVG(MUS_FRONT, groups, maxV, 'Frente') + figureSVG(MUS_BACK, groups, maxV, 'Costas') + '</div>';
}
function groupsLegendHTML(groups){
  const keys = Object.keys(groups).filter(function(k){ return groups[k] > 0; })
    .sort(function(a,b){ return groups[b]-groups[a]; });
  if(!keys.length) return '';
  return '<div class="mleg">' + keys.map(function(k){
    return '<span class="chip"><i></i>' + esc(k) + ' · <b class="num">' + fmtKg(groups[k]) + '</b></span>';
  }).join('') + '</div>';
}