let editing = null, editorEl = null, restCtx = null;
let libFilter = 'Todos', libQuery = '', libSelect = false;

function libChipsHTML(){
  const groups = ['Todos'].concat([...new Set(state.library.map(function(e){ return e.group; }))]);
  return groups.map(function(g){
    return '<button class="chip ripple ' + (g===libFilter?'on':'') + '" data-act="lib-filter" data-arg="' + esc(g) + '">' + esc(g) + '</button>';
  }).join('');
}
function libListHTML(){
  const q = libQuery.toLowerCase();
  const list = state.library.filter(function(e){
    return (libFilter === 'Todos' || e.group === libFilter) && e.name.toLowerCase().includes(q);
  });
  if(!list.length) return '<div class="empty">Nenhum exercício encontrado.</div>';
  return list.map(function(e){
    return '<div class="wrow" style="padding:12px 14px"><div style="flex:1">' +
      '<b style="font-size:15px">' + esc(e.name) + '</b>' +
      '<div class="lbl mt8">' + esc(e.group) + (e.custom?' · customizado':'') + '</div></div>' +
      (libSelect ? '<button class="btn btn-pri btn-sm ripple" data-act="lib-add" data-arg="' + e.id + '">' + icon('plus') + ' Adicionar</button>' : icon('check')) +
      '</div>';
  }).join('');
}
function renderLibList(){ const el = document.getElementById('lib-list'); if(el) el.innerHTML = libListHTML(); }
function browseLibrary(selectMode){
  libQuery = ''; libFilter = 'Todos'; libSelect = !!selectMode;
  openScreen(screenHeader('Biblioteca', { right:
    '<button class="iconbtn ripple" data-act="lib-new" aria-label="Novo exercício">' + icon('plus') + '</button>' }) +
    '<div class="screen-bd">' +
    '<div style="position:relative"><span style="position:absolute;left:14px;top:12px;color:var(--dim);display:flex">' + icon('search') + '</span>' +
    '<input class="fld" placeholder="Buscar exercício..." value="" data-inp="lib-search" style="padding-left:44px"></div>' +
    '<div class="rowline mt14" id="lib-chips" style="gap:6px;flex-wrap:wrap">' + libChipsHTML() + '</div>' +
    '<div class="mt20 stack" id="lib-list">' + libListHTML() + '</div></div>');
}
function openEditor(id){
  const w = id ? state.workouts.find(function(x){ return x.id === id; }) : null;
  editing = w ? JSON.parse(JSON.stringify(w)) : { id: null, name: '', split: 'ABC', ex: [] };
  editorEl = openScreen('');
  renderEditorInto(editorEl);
}
function renderEditorInto(el){
  if(!editing || !el) return;
  const bd = el.querySelector('.screen-bd');
  const top = bd ? bd.scrollTop : 0;
  const e = editing;
  const splits = ['ABC','ABCD','ABCDE','ABCDEF','Upper/Lower','Full Body','Push/Pull/Legs','Livre'];
  const splitChips = splits.map(function(s){
    return '<button class="chip ripple ' + (e.split===s?'on':'') + '" data-act="ed-split" data-arg="' + esc(s) + '">' + esc(s) + '</button>';
  }).join('');
  const cards = e.ex.map(function(x, i){
    const lib = libById(x.exId) || { name:'Exercício removido', group:'—' };
    const setRows = x.sets.map(function(st, j){
      const m = TYPE_META[st.type] || TYPE_META.work;
      return '<div class="setrow"><span class="setno">S' + (j+1) + '</span>' +
        '<button class="stbtn ' + m.cls + ' ripple" data-act="ed-set-type" data-arg="' + i + ':' + j + '" title="' + m.full + '">' + m.l + '</button>' +
        '<div class="stepper" style="flex:1"><button data-act="ed-set-rep" data-arg="' + i + ':' + j + ':-1">' + icon('minus') + '</button>' +
        '<b>' + st.reps + ' <small>reps</small></b>' +
        '<button data-act="ed-set-rep" data-arg="' + i + ':' + j + ':1">' + icon('plus') + '</button></div>' +
        '<button class="iconbtn ripple" style="width:34px;height:34px;color:var(--bad)" data-act="ed-set-del" data-arg="' + i + ':' + j + '" aria-label="Remover série">' + icon('trash') + '</button></div>';
    }).join('');
    return '<div class="excard"><div class="rowline"><div style="flex:1">' +
      '<b style="font-size:15px">' + esc(lib.name) + '</b><div class="lbl mt8">' + esc(lib.group) + '</div></div>' +
      '<div style="display:flex;gap:6px">' +
      '<button class="iconbtn ripple" style="width:34px;height:34px" data-act="ed-ex-move" data-arg="' + i + ':up" aria-label="Subir">' + icon('up') + '</button>' +
      '<button class="iconbtn ripple" style="width:34px;height:34px" data-act="ed-ex-move" data-arg="' + i + ':down" aria-label="Descer">' + icon('down') + '</button>' +
      '<button class="iconbtn ripple" style="width:34px;height:34px;color:var(--bad)" data-act="ed-ex-del" data-arg="' + i + '" aria-label="Remover">' + icon('trash') + '</button></div></div>' +
      '<div class="rowline mt14" style="gap:8px;flex-wrap:wrap">' +
      '<div><div class="lbl" style="margin-bottom:5px">RPE alvo</div><div class="stepper">' +
      '<button data-act="ed-rpe" data-arg="' + i + ':-1">' + icon('minus') + '</button><b>' + x.rpe + '</b>' +
      '<button data-act="ed-rpe" data-arg="' + i + ':1">' + icon('plus') + '</button></div></div>' +
      '<div><div class="lbl" style="margin-bottom:5px">Descanso</div>' +
      '<button class="chip ripple num" data-act="ed-rest" data-arg="' + i + '">' + icon('clock') + ' ' + x.rest + 's</button></div>' +
      '<div style="flex:1;min-width:110px"><div class="lbl" style="margin-bottom:5px">Séries (' + x.sets.length + ')</div>' +
      '<button class="btn btn-ghost btn-sm ripple" data-act="ed-set-add" data-arg="' + i + '">' + icon('plus') + ' Série</button></div></div>' +
      '<div class="mt14">' + (setRows || '<div class="dim" style="font-size:12px">Nenhuma série — adicione acima.</div>') + '</div></div>';
  }).join('');
  el.innerHTML = screenHeader(e.id ? 'Editar ficha' : 'Nova ficha', { right:
    '<button class="btn btn-pri btn-sm ripple" data-act="ed-save">Salvar</button>' }) +
    '<div class="screen-bd">' +
    '<label class="flabel lbl">Nome da ficha</label>' +
    '<input class="fld" placeholder="Ex.: Treino A — Peito e Ombros" value="' + esc(e.name) + '" data-inp="ed-name" maxlength="40">' +
    '<label class="flabel lbl">Divisão</label><div class="rowline" style="gap:6px;flex-wrap:wrap">' + splitChips + '</div>' +
    '<div class="rowline mt28"><div class="lbl">Exercícios (' + e.ex.length + ')</div>' +
    '<div style="display:flex;gap:8px"><button class="btn btn-ghost btn-sm ripple" data-act="ed-add">' + icon('plus') + ' Adicionar</button>' +
    '<button class="btn btn-ghost btn-sm ripple" data-act="ai-open">' + icon('wand') + ' IA</button></div></div>' +
    '<div class="stack mt14">' + (cards || '<div class="empty">Adicione exercícios da biblioteca para montar a ficha.</div>') + '</div>' +
    '<div class="typeleg mt14"><span><i style="background:rgba(56,189,248,.5)"></i>Válida</span><span><i style="background:rgba(251,191,36,.5)"></i>Preparatória</span><span><i style="background:rgba(148,163,184,.4)"></i>Aquecimento</span></div>' +
    '</div>';
  const bd2 = el.querySelector('.screen-bd');
  if(bd2) bd2.scrollTop = top;
}
function openRestPicker(ctx, i){
  restCtx = { ctx: ctx, i: i };
  const secs = [30,45,60,75,90,120,150,180,240,300];
  modalHTML('<div class="sheet-grip"></div><div class="h-display h2">DESCANSO ENTRE SÉRIES</div>' +
    '<p class="mut mt8" style="font-size:13px">Escolha o tempo aplicado a este exercício:</p>' +
    '<div class="rowline mt14" style="gap:8px;flex-wrap:wrap">' +
    secs.map(function(s){ return '<button class="chip ripple num" style="padding:10px 16px;font-size:15px" data-act="rest-apply" data-arg="' + s + '">' + s + 's</button>'; }).join('') +
    '</div>');
}
