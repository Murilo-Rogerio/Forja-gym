/* ---------- MAPA ANATÔMICO DO CORPO HUMANO (HEATMAP EM VERMELHO) ---------- */

const MUS_FRONT = [
  // Trapézio (Costas superior visível pela frente)
  { g:'Costas', d:'M66,58 L94,58 L88,72 L72,72 Z' },
  // Deltóides anteriores e laterais (Ombros)
  { g:'Ombros', d:'M53,74 a12,11 0 1 0 24,0 a12,11 0 1 0 -24,0' },
  { g:'Ombros', d:'M83,74 a12,11 0 1 0 24,0 a12,11 0 1 0 -24,0' },
  // Peitoral maior e menor (Peito)
  { g:'Peito', d:'M62,78 L79,78 L79,100 Q69,106 62,98 Z' },
  { g:'Peito', d:'M81,78 L98,78 L98,98 Q91,106 81,100 Z' },
  // Bíceps e Braquial (Braços)
  { g:'Braços', d:'M38,106 a8,16 8 0 1 0 16,0 a8,16 8 0 1 0 -16,0' },
  { g:'Braços', d:'M106,106 a8,16 -8 0 1 0 16,0 a8,16 -8 0 1 0 -16,0' },
  // Antebraços (Braços)
  { g:'Braços', d:'M31,148 a7,17 6 0 1 0 14,0 a7,17 6 0 1 0 -14,0' },
  { g:'Braços', d:'M115,148 a7,17 -6 0 1 0 14,0 a7,17 -6 0 1 0 -14,0' },
  // Reto Abdominal (Core)
  { g:'Core', d:'M67,104 h26 a4,6 0 0 1 0,56 h-26 a4,6 0 0 1 0,-56 Z' },
  // Oblíquos (Core)
  { g:'Core', d:'M60,112 C58,132 59,152 63,160 L67,160 L67,114 Z' },
  { g:'Core', d:'M100,112 C102,132 101,152 97,160 L93,160 L93,114 Z' },
  // Quadríceps (Pernas)
  { g:'Pernas', d:'M56,206 a12,34 0 1 0 24,0 a12,34 0 1 0 -24,0' },
  { g:'Pernas', d:'M80,206 a12,34 0 1 0 24,0 a12,34 0 1 0 -24,0' },
  // Tibial e Panturrilhas anteriores (Pernas)
  { g:'Pernas', d:'M58,282 a8.5,20 0 1 0 17,0 a8.5,20 0 1 0 -17,0' },
  { g:'Pernas', d:'M85,282 a8.5,20 0 1 0 17,0 a8.5,20 0 1 0 -17,0' }
];

const MUS_BACK = [
  // Trapézio Médio/Superior (Costas)
  { g:'Costas', d:'M80,54 L106,68 L96,98 L80,114 L64,98 L54,68 Z' },
  // Dorsais / Latissimus dorsi (Costas)
  { g:'Costas', d:'M55,74 C66,90 74,98 80,102 C86,98 94,90 105,74 L105,114 C98,134 90,146 80,152 C70,146 62,134 55,114 Z' },
  // Lombar (Costas)
  { g:'Costas', d:'M71,152 h18 a3,4 0 0 1 0,18 h-18 a3,4 0 0 1 0,-18 Z' },
  // Deltóides posteriores (Ombros)
  { g:'Ombros', d:'M52,70 a10,10 0 1 0 20,0 a10,10 0 1 0 -20,0' },
  { g:'Ombros', d:'M88,70 a10,10 0 1 0 20,0 a10,10 0 1 0 -20,0' },
  // Tríceps (Braços)
  { g:'Braços', d:'M38,104 a8,15 8 0 1 0 16,0 a8,15 8 0 1 0 -16,0' },
  { g:'Braços', d:'M106,104 a8,15 -8 0 1 0 16,0 a8,15 -8 0 1 0 -16,0' },
  // Antebraços posteriores (Braços)
  { g:'Braços', d:'M31,148 a7,17 6 0 1 0 14,0 a7,17 6 0 1 0 -14,0' },
  { g:'Braços', d:'M115,148 a7,17 -6 0 1 0 14,0 a7,17 -6 0 1 0 -14,0' },
  // Glúteos (Pernas)
  { g:'Pernas', d:'M56,184 a12,13 0 1 0 24,0 a12,13 0 1 0 -24,0' },
  { g:'Pernas', d:'M80,184 a12,13 0 1 0 24,0 a12,13 0 1 0 -24,0' },
  // Isquiotibiais / Posterior de coxa (Pernas)
  { g:'Pernas', d:'M57,218 a11,29 0 1 0 22,0 a11,29 0 1 0 -22,0' },
  { g:'Pernas', d:'M81,218 a11,29 0 1 0 22,0 a11,29 0 1 0 -22,0' },
  // Panturrilhas / Gastrocnêmio (Pernas)
  { g:'Pernas', d:'M57,274 a9,23 0 1 0 18,0 a9,23 0 1 0 -18,0' },
  { g:'Pernas', d:'M85,274 a9,23 0 1 0 18,0 a9,23 0 1 0 -18,0' }
];

function figureSVG(shapes, groups, maxV, label){
  const silhouette =
    '<ellipse class="dimshape" cx="80" cy="28" rx="15" ry="18"/>' +
    '<rect class="dimshape" x="72" y="44" width="16" height="13" rx="3"/>' +
    '<path class="dimshape" d="M80,56 C60,56 47,64 45,82 L53,124 C55,142 57,156 61,170 L99,170 C103,156 105,142 107,124 L115,82 C113,64 100,56 80,56 Z"/>' +
    '<path class="dimshape" d="M49,78 C43,108 39,138 37,170 L35,214" fill="none" stroke="rgba(148,163,184,.15)" stroke-width="15" stroke-linecap="round"/>' +
    '<path class="dimshape" d="M111,78 C117,108 121,138 123,170 L125,214" fill="none" stroke="rgba(148,163,184,.15)" stroke-width="15" stroke-linecap="round"/>' +
    '<circle class="dimshape" cx="34" cy="224" r="7"/><circle class="dimshape" cx="126" cy="224" r="7"/>' +
    '<path class="dimshape" d="M69,170 C67,200 66,230 66,258 L67,300" fill="none" stroke="rgba(148,163,184,.15)" stroke-width="21" stroke-linecap="round"/>' +
    '<path class="dimshape" d="M91,170 C93,200 94,230 94,258 L93,300" fill="none" stroke="rgba(148,163,184,.15)" stroke-width="21" stroke-linecap="round"/>' +
    '<ellipse class="dimshape" cx="65" cy="312" rx="11" ry="6"/><ellipse class="dimshape" cx="95" cy="312" rx="11" ry="6"/>';

  let i = 0;
  const mus = shapes.map(function(m){
    const vol = groups[m.g] || 0;
    if(!(vol > 0)) return '<path class="mus" d="' + m.d + '"/>';
    // Intensidade do calor vermelho proporcional ao volume
    const ratio = Math.min(1, vol / Math.max(1, maxV));
    const op = (0.65 + 0.35 * ratio).toFixed(2);
    const attrs = 'class="mus on" fill="rgba(239,68,68,' + op + ')" stroke="#f43f5e" style="--d:' + (i * 65) + 'ms"';
    i++;
    return '<path ' + attrs + ' d="' + m.d + '"/>';
  }).join('');

  return '<figure><svg viewBox="0 0 160 330">' + silhouette + mus + '</svg><figcaption>' + label + '</figcaption></figure>';
}

function bodyMapHTML(groups){
  groups = groups || {};
  const maxV = Math.max.apply(null, [1].concat(Object.keys(groups).map(function(k){ return groups[k] || 0; })));
  return '<div class="bodymap">' +
    figureSVG(MUS_FRONT, groups, maxV, 'Frente') +
    figureSVG(MUS_BACK, groups, maxV, 'Costas') +
    '</div>';
}

function groupsLegendHTML(groups){
  groups = groups || {};
  const total = Object.keys(groups).reduce(function(s, k){ return s + (groups[k] || 0); }, 0);
  const keys = Object.keys(groups).filter(function(k){ return groups[k] > 0; })
    .sort(function(a,b){ return groups[b] - groups[a]; });
  
  if(!keys.length) return '';
  return '<div class="mleg">' + keys.map(function(k){
    const pct = total > 0 ? Math.round((groups[k] / total) * 100) : 0;
    return '<span class="chip"><i></i>' + esc(k) + ' · <b class="num">' + fmtKg(groups[k]) + '</b> <small class="dim">(' + pct + '%)</small></span>';
  }).join('') + '</div>';
}
