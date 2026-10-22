let editing = null, editorEl = null, restCtx = null;
let libFilter = 'Todos', libQuery = '', libSelect = false;
let pendingCustomExImg = '';

function libChipsHTML(){
  const groups = ['Todos','Peito','Costas','Pernas','Ombros','Braços','Core'];
  return groups.map(function(g){
    const count = g === 'Todos' ? state.library.length : state.library.filter(function(e){ return e.group === g; }).length;
    return '<button class="chip ripple ' + (g === libFilter ? 'on' : '') + '" data-act="lib-filter" data-arg="' + esc(g) + '">' +
      esc(g) + ' <small class="dim">(' + count + ')</small></button>';
  }).join('');
}

function libListHTML(){
  const q = libQuery.toLowerCase().trim();
  const list = state.library.filter(function(e){
    const matchG = (libFilter === 'Todos' || e.group === libFilter);
    const matchQ = !q || normTxt(e.name).includes(normTxt(q)) || normTxt(e.equip || '').includes(normTxt(q));
    return matchG && matchQ;
  });

  if(!list.length){
    return '<div class="empty">' +
      '<p>Nenhum exercício encontrado para essa busca.</p>' +
      '<button class="btn btn-pri btn-sm ripple mt14" data-act="lib-new">' + icon('plus') + ' Criar exercício personalizado agora</button>' +
      '</div>';
  }

  return list.map(function(e){
    // Foto do exercício ou ícone estilizado
    let thumb = '';
    if(e.img){
      thumb = '<img src="' + esc(e.img) + '" class="ex-thumb" alt="' + esc(e.name) + '">';
    } else {
      thumb = '<div class="ex-thumb-icon">' + icon('bolt2') + '</div>';
    }

    return '<div class="wrow" style="padding:10px 14px;align-items:center;gap:12px">' +
      thumb +
      '<div style="flex:1;min-width:0;cursor:pointer" data-act="lib-view-ex" data-arg="' + e.id + '">' +
      '<b style="font-size:15px;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + esc(e.name) + '</b>' +
      '<div class="lbl mt8" style="color:var(--dim);font-size:11.5px">' +
      esc(e.group) + ' · ' + esc(e.equip || 'Livre') +
      (e.custom ? ' · <span style="color:var(--acc);font-weight:600">Personalizado</span>' : '') +
      '</div></div>' +
      (libSelect
        ? '<button class="btn btn-pri btn-sm ripple" style="flex:none" data-act="lib-add" data-arg="' + e.id + '">' + icon('plus') + ' Usar</button>'
        : '<button class="iconbtn ripple" style="flex:none" data-act="lib-view-ex" data-arg="' + e.id + '" aria-label="Detalhes">' + icon('fwd') + '</button>') +
      '</div>';
  }).join('');
}

function renderLibList(){
  const el = document.getElementById('lib-list');
  if(el) el.innerHTML = libListHTML();
}

function browseLibrary(selectMode, ctx){
  libQuery = '';
  libFilter = 'Todos';
  libSelect = !!selectMode;
  window.libAddContext = ctx || (selectMode && activeScreenEl && (!editorEl || !editorEl.isConnected) ? 'active' : 'editor');

  openScreen(
    screenHeader('Biblioteca de Exercícios', {
      right: '<button class="btn btn-pri btn-sm ripple" data-act="lib-new">' + icon('plus') + ' Criar</button>'
    }) +
    '<div class="screen-bd">' +
    // Banner Criar Exercício Personalizado
    '<div class="card acc mb14" style="display:flex;align-items:center;gap:12px;cursor:pointer;margin-bottom:14px" data-act="lib-new">' +
    '<div style="width:42px;height:42px;border-radius:12px;background:rgba(56,189,248,.15);color:var(--acc);display:flex;align-items:center;justify-content:center;flex:none">' + icon('plus') + '</div>' +
    '<div style="flex:1"><b style="font-size:14.5px;color:var(--acc)">Cadastrar Exercício Próprio</b>' +
    '<div class="dim" style="font-size:12px">Adicione com nome, grupo muscular, execução e foto</div></div>' +
    icon('fwd') + '</div>' +

    '<div style="position:relative"><span style="position:absolute;left:14px;top:13px;color:var(--dim);display:flex">' + icon('search') + '</span>' +
    '<input class="fld" placeholder="Buscar por nome ou equipamento (ex: Supino, Halteres, Cabo)..." value="" data-inp="lib-search" style="padding-left:44px"></div>' +
    '<div class="rowline mt14" id="lib-chips" style="gap:6px;flex-wrap:wrap">' + libChipsHTML() + '</div>' +
    '<div class="mt20 stack" id="lib-list">' + libListHTML() + '</div></div>'
  );
}

/* Modal detalhado de visualização do exercício */
function openExerciseDetail(exId){
  const e = libById(exId);
  if(!e) return;

  let imgHTML = '';
  if(e.img){
    imgHTML = '<img src="' + esc(e.img) + '" class="ex-detail-img" alt="' + esc(e.name) + '">';
  }

  modalHTML(
    '<div class="sheet-grip"></div>' +
    imgHTML +
    '<div class="rowline">' +
    '<div><span class="preset-tag">' + esc(e.group) + ' · ' + esc(e.equip || 'Livre') + '</span>' +
    '<div class="h-display h2 mt8">' + esc(e.name) + '</div></div>' +
    '</div>' +
    (e.desc ? '<div class="card mt14"><div class="lbl">Instruções de Execução</div><p class="mut mt8" style="font-size:13.5px;line-height:1.55">' + esc(e.desc) + '</p></div>' : '') +
    '<div class="mt20 stack" style="gap:10px">' +
    (libSelect ? '<button class="btn btn-pri ripple" style="width:100%" data-act="lib-add" data-arg="' + e.id + '">' + icon('plus') + ' Adicionar à Ficha Atual</button>' : '') +
    (e.custom ? '<button class="btn btn-danger ripple" style="width:100%" data-act="lib-del-custom" data-arg="' + e.id + '">' + icon('trash') + ' Excluir Exercício Personalizado</button>' : '') +
    '<button class="btn btn-ghost ripple" style="width:100%" data-act="modal-close">Fechar</button>' +
    '</div>'
  );
}

/* Modal de cadastro de exercício personalizado com foto e instruções */
function openCustomExerciseModal(){
  pendingCustomExImg = '';
  modalHTML(
    '<div class="sheet-grip"></div>' +
    '<div class="rowline"><div class="h-display h2">NOVO EXERCÍCIO</div>' +
    '<div style="color:var(--acc)">' + icon('bolt2') + '</div></div>' +
    '<p class="mut mt8" style="font-size:13px;line-height:1.45">' +
    'Crie seu próprio exercício com foto, instruções de execução e grupo muscular. Ele ficará salvo na sua biblioteca permanente.</p>' +

    '<label class="flabel lbl mt14">Nome do Exercício *</label>' +
    '<input class="fld mt8" id="cex-name" placeholder="Ex.: Agachamento Búlgaro com Halteres" maxlength="50">' +

    '<div class="split2 mt14">' +
    '<div><label class="flabel lbl">Grupo Muscular</label>' +
    '<select class="fld mt8" id="cex-group">' +
    ['Peito','Costas','Pernas','Ombros','Braços','Core'].map(function(g){ return '<option value="' + g + '">' + g + '</option>'; }).join('') +
    '</select></div>' +
    '<div><label class="flabel lbl">Equipamento</label>' +
    '<select class="fld mt8" id="cex-equip">' +
    ['Halteres','Barra','Máquina','Cabo','Peso Corporal','Kettlebell','Outro'].map(function(eq){ return '<option value="' + eq + '">' + eq + '</option>'; }).join('') +
    '</select></div>' +
    '</div>' +

    '<label class="flabel lbl mt14">Instruções / Como Executar (Opcional)</label>' +
    '<textarea class="fld mt8" id="cex-desc" placeholder="Ex.: Mantenha a coluna ereta, desça controlando o movimento até 90 graus e contraia no topo..." style="min-height:75px"></textarea>' +

    '<label class="flabel lbl mt14">Foto ou Ilustração do Exercício</label>' +
    '<div class="rowline mt8" style="gap:8px">' +
    '<label class="btn btn-ghost btn-sm ripple" style="flex:1;cursor:pointer;text-align:center">' +
    icon('camera') + ' Escolher Foto' +
    '<input type="file" id="cex-file" accept="image/*" style="display:none" data-chg="cex-file">' +
    '</label>' +
    '</div>' +
    '<input class="fld mt8" id="cex-url" placeholder="Ou cole o link de uma imagem (https://...)" data-inp="cex-url">' +
    '<div id="cex-preview" class="ex-preview-box" style="display:none"></div>' +

    '<button class="btn btn-pri ripple mt20" style="width:100%" data-act="cex-save">' +
    icon('check') + ' Salvar Exercício na Biblioteca</button>'
  );
}

/* Processa upload de imagem para o exercício personalizado */
async function handleCustomExFile(inputEl){
  if(!inputEl || !inputEl.files || !inputEl.files[0]) return;
  const file = inputEl.files[0];
  try{
    const b64 = await resizeImage(file, 600, 0.82);
    pendingCustomExImg = b64;
    renderCustomExPreview();
  } catch(err){
    toast('Não foi possível processar a imagem.', 'bad');
  }
}

function handleCustomExURL(url){
  pendingCustomExImg = (url || '').trim();
  renderCustomExPreview();
}

function renderCustomExPreview(){
  const box = document.getElementById('cex-preview');
  if(!box) return;
  if(pendingCustomExImg){
    box.style.display = 'block';
    box.innerHTML = '<img src="' + esc(pendingCustomExImg) + '" alt="Prévia"><button class="iconbtn ripple" style="position:absolute;top:8px;right:8px;background:rgba(0,0,0,.6);color:#fff" data-act="cex-img-clear">' + icon('trash') + '</button>';
  } else {
    box.style.display = 'none';
    box.innerHTML = '';
  }
}

/* Salva o exercício customizado e atualiza a biblioteca */
function saveCustomExercise(){
  const nameEl = document.getElementById('cex-name');
  const groupEl = document.getElementById('cex-group');
  const equipEl = document.getElementById('cex-equip');
  const descEl = document.getElementById('cex-desc');

  const name = nameEl ? nameEl.value.trim() : '';
  if(!name){
    toast('Dê um nome ao exercício.', 'bad');
    if(nameEl) nameEl.focus();
    return;
  }

  const group = groupEl ? groupEl.value : 'Peito';
  const equip = equipEl ? equipEl.value : 'Livre';
  const desc = descEl ? descEl.value.trim() : '';
  const img = pendingCustomExImg || '';

  const newEx = {
    id: 'ex-c-' + uid(),
    name: name,
    group: group,
    equip: equip,
    desc: desc,
    img: img,
    custom: true
  };

  state.library.push(newEx);
  save();
  closeModal();
  renderLibList();

  if(libSelect && window.libAddContext === 'active' && active){
    active.ex.push({ exId: newEx.id, rest: 90, sets: [{ type:'work', reps: 10, w: '', r: 10, done: false }] });
    state.active = active;
    save();
    const sc = document.getElementById('stack').lastElementChild;
    if(sc) closeScreen(sc);
    window.libAddContext = 'editor';
    if(activeScreenEl) renderActiveInto(activeScreenEl);
    toast('Exercício "' + name + '" criado e adicionado ao treino!', 'ok', 'check');
  } else if(libSelect && editing){
    editing.ex.push({ exId: newEx.id, rpe: 8, rest: 90, sets: [{ type:'work', reps: 10 }] });
    const sc = document.getElementById('stack').lastElementChild;
    if(sc) closeScreen(sc);
    if(editorEl) renderEditorInto(editorEl);
    toast('Exercício "' + name + '" criado e adicionado à ficha!', 'ok', 'check');
  } else {
    toast('Exercício "' + name + '" salvo com sucesso na biblioteca!', 'ok', 'check');
  }
}

/* Excluir exercício personalizado */
function deleteCustomExercise(exId){
  const idx = state.library.findIndex(function(e){ return e.id === exId; });
  if(idx === -1) return;
  const name = state.library[idx].name;
  state.library.splice(idx, 1);
  save();
  closeModal();
  renderLibList();
  toast('Exercício "' + name + '" removido da biblioteca.', 'ok');
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
    return '<button class="chip ripple ' + (e.split === s ? 'on' : '') + '" data-act="ed-split" data-arg="' + esc(s) + '">' + esc(s) + '</button>';
  }).join('');

  const cards = e.ex.map(function(x, i){
    const lib = libById(x.exId) || { name:'Exercício removido', group:'—', equip:'Livre' };
    const setRows = x.sets.map(function(st, j){
      const m = TYPE_META[st.type] || TYPE_META.work;
      return '<div class="setrow">' +
        '<span class="setno">S' + (j+1) + '</span>' +
        '<button class="stbtn ' + m.cls + ' ripple" data-act="ed-set-type" data-arg="' + i + ':' + j + '" title="' + m.full + '">' + m.l + '</button>' +
        '<div class="stepper" style="flex:1"><button data-act="ed-set-rep" data-arg="' + i + ':' + j + ':-1" aria-label="Menos reps">' + icon('minus') + '</button>' +
        '<b>' + st.reps + ' <small>reps</small></b>' +
        '<button data-act="ed-set-rep" data-arg="' + i + ':' + j + ':1" aria-label="Mais reps">' + icon('plus') + '</button></div>' +
        '<button class="iconbtn ripple" style="width:34px;height:34px;color:var(--bad)" data-act="ed-set-del" data-arg="' + i + ':' + j + '" aria-label="Remover série">' + icon('trash') + '</button>' +
        '</div>';
    }).join('');

    return '<div class="excard">' +
      '<div class="rowline"><div style="flex:1">' +
      '<b style="font-size:15.5px">' + esc(lib.name) + '</b>' +
      '<div class="lbl mt8" style="color:var(--dim)">' + esc(lib.group) + ' · ' + esc(lib.equip || 'Livre') + '</div></div>' +
      '<div style="display:flex;gap:6px">' +
      '<button class="iconbtn ripple" style="width:34px;height:34px" data-act="ed-ex-move" data-arg="' + i + ':up" aria-label="Subir">' + icon('up') + '</button>' +
      '<button class="iconbtn ripple" style="width:34px;height:34px" data-act="ed-ex-move" data-arg="' + i + ':down" aria-label="Descer">' + icon('down') + '</button>' +
      '<button class="iconbtn ripple" style="width:34px;height:34px;color:var(--bad)" data-act="ed-ex-del" data-arg="' + i + '" aria-label="Remover">' + icon('trash') + '</button></div></div>' +
      '<div class="rowline mt14" style="gap:8px;flex-wrap:wrap">' +
      '<div><div class="lbl" style="margin-bottom:5px">RPE alvo</div><div class="stepper">' +
      '<button data-act="ed-rpe" data-arg="' + i + ':-1">' + icon('minus') + '</button><b>@' + x.rpe + '</b>' +
      '<button data-act="ed-rpe" data-arg="' + i + ':1">' + icon('plus') + '</button></div></div>' +
      '<div><div class="lbl" style="margin-bottom:5px">Descanso</div>' +
      '<button class="chip ripple num" data-act="ed-rest" data-arg="' + i + '">' + icon('clock') + ' ' + x.rest + 's</button></div>' +
      '<div style="flex:1;min-width:110px"><div class="lbl" style="margin-bottom:5px">Séries (' + x.sets.length + ')</div>' +
      '<button class="btn btn-ghost btn-sm ripple" style="width:100%" data-act="ed-set-add" data-arg="' + i + '">' + icon('plus') + ' Série</button></div></div>' +
      '<div class="mt14">' + (setRows || '<div class="dim" style="font-size:12px">Nenhuma série — adicione acima.</div>') + '</div></div>';
  }).join('');

  el.innerHTML =
    screenHeader(e.id ? 'Editar Ficha de Treino' : 'Nova Ficha de Treino', {
      right: '<button class="btn btn-pri btn-sm ripple" data-act="ed-save">' + icon('check') + ' Salvar</button>'
    }) +
    '<div class="screen-bd">' +
    // Banner Assistente IA no topo do criador de treinos
    '<div class="card acc mb14 rise" style="display:flex;align-items:center;gap:12px;margin-bottom:18px;cursor:pointer" data-act="ed-ai-open">' +
    '<div style="width:42px;height:42px;border-radius:13px;background:rgba(56,189,248,.15);color:var(--acc);display:flex;align-items:center;justify-content:center;flex:none">' + icon('wand') + '</div>' +
    '<div style="flex:1"><b style="font-size:14.5px;color:var(--acc)">Assistente de Treino IA (Gemini)</b>' +
    '<div class="mut mt8" style="font-size:12px">Sugerir exercícios complementares, séries e descansos ideais</div></div>' +
    '<span class="chip ai">' + icon('spark') + ' Abrir IA</span></div>' +

    '<label class="flabel lbl">Nome da Ficha</label>' +
    '<input class="fld mt8" placeholder="Ex.: Treino A — Peito & Tríceps" value="' + esc(e.name) + '" data-inp="ed-name" maxlength="40">' +
    '<label class="flabel lbl mt14">Divisão</label>' +
    '<div class="rowline mt8" style="gap:6px;flex-wrap:wrap">' + splitChips + '</div>' +

    '<div class="rowline mt28">' +
    '<div class="lbl">Exercícios (' + e.ex.length + ')</div>' +
    '<div style="display:flex;gap:8px">' +
    '<button class="btn btn-ghost btn-sm ripple" data-act="ed-add">' + icon('plus') + ' Exercício</button>' +
    '<button class="btn btn-ghost btn-sm ripple" data-act="ed-ai-open">' + icon('wand') + ' Sugerir IA</button>' +
    '</div></div>' +

    '<div class="stack mt14">' + (cards || '<div class="empty">Nenhum exercício ainda. Clique em "Exercício" ou "Sugerir IA" para montar sua ficha.</div>') + '</div>' +
    '<div class="typeleg mt14">' +
    '<span><i style="background:var(--st-work)"></i>Válida (V)</span>' +
    '<span><i style="background:var(--st-warm)"></i>Aquec. (A)</span>' +
    '<span><i style="background:var(--st-prep)"></i>Prep. (P)</span>' +
    '<span><i style="background:var(--st-drop)"></i>Drop (D)</span>' +
    '<span><i style="background:var(--st-fail)"></i>Falha (F)</span>' +
    '<span class="dim" style="font-size:10px">(toque no selo para mudar)</span>' +
    '</div></div>';

  const bd2 = el.querySelector('.screen-bd');
  if(bd2) bd2.scrollTop = top;
}

function openRestPicker(ctx, i){
  restCtx = { ctx: ctx, i: i };
  const secs = [30, 45, 60, 75, 90, 120, 150, 180, 240, 300];
  modalHTML(
    '<div class="sheet-grip"></div><div class="h-display h2">TEMPO DE DESCANSO</div>' +
    '<p class="mut mt8" style="font-size:13.5px">Escolha o descanso entre as séries deste exercício:</p>' +
    '<div class="rowline mt14" style="gap:8px;flex-wrap:wrap">' +
    secs.map(function(s){
      return '<button class="chip ripple num" style="padding:10px 18px;font-size:15px;font-weight:600" data-act="rest-apply" data-arg="' + s + '">' + s + 's</button>';
    }).join('') +
    '</div>'
  );
}

/* Modal do Assistente IA para o Criador de Ficha */
function openEditorAIAssistant(){
  const wName = editing ? editing.name : '';
  const exCount = editing ? editing.ex.length : 0;

  modalHTML(
    '<div class="sheet-grip"></div>' +
    '<div class="rowline"><div class="h-display h2">ASSISTENTE IA (GEMINI)</div>' +
    '<div style="color:var(--acc)">' + icon('spark') + '</div></div>' +
    '<p class="mut mt8" style="font-size:13px;line-height:1.5">' +
    'Deixe o Gemini analisar sua ficha ("' + (wName || 'Novo Treino') + '") e sugerir exercícios perfeitos com séries, reps e descansos calculados.</p>' +
    '<div class="card mt14">' +
    '<label class="flabel lbl">O que você deseja?</label>' +
    '<select class="fld mt8" id="ed-ai-goal">' +
    '<option value="hipertrofia">Foco em Hipertrofia (volume e estímulo máximo)</option>' +
    '<option value="forca">Foco em Força Pura (pesado com mais descanso)</option>' +
    '<option value="definicao">Condicionamento / Densidade muscular</option>' +
    '</select>' +
    '<label class="flabel lbl mt14">Instruções ou ênfase específica (opcional)</label>' +
    '<textarea class="fld mt8" id="ed-ai-prompt" placeholder="Ex.: Quero ênfase em peitoral superior e tríceps cabeça longa, com halteres e polia..."></textarea>' +
    '<div class="mt20 stack">' +
    '<button class="btn btn-pri ripple" style="width:100%" data-act="ed-ai-generate">' +
    icon('wand') + (exCount > 0 ? ' Sugerir complementos para esta ficha' : ' Gerar ficha completa agora') + '</button>' +
    '</div></div>' +
    '<div id="ed-ai-result" class="mt14"></div>'
  );
}

async function runEditorAIGeneration(){
  const btn = document.querySelector('[data-act="ed-ai-generate"]');
  const resEl = document.getElementById('ed-ai-result');
  if(!btn || !editing) return;

  btn.disabled = true;
  btn.innerHTML = icon('sync', 'spin') + ' Consultando o Gemini...';
  if(resEl) resEl.innerHTML = '<div class="mut mt8" style="text-align:center">Analisando biomecânica e gerando séries...</div>';

  const goal = (document.getElementById('ed-ai-goal') || {}).value || 'hipertrofia';
  const prompt = (document.getElementById('ed-ai-prompt') || {}).value || '';
  const currentIds = editing.ex.map(function(x){ return x.exId; });

  const result = await aiSuggestForWorkout(editing.name, currentIds, prompt + ' (Objetivo: ' + goal + ')');

  btn.disabled = false;
  btn.innerHTML = icon('wand') + ' Gerar Novamente';

  if(!result || !result.exercises.length){
    if(resEl) resEl.innerHTML = '<div class="empty">Não foi possível gerar sugestões no momento.</div>';
    return;
  }

  // Renderiza prévia das sugestões
  const rows = result.exercises.map(function(item){
    const lib = libById(item.exId);
    return '<div class="wrow" style="padding:10px 12px;margin-bottom:8px">' +
      '<div style="flex:1"><b style="font-size:14px">' + esc(lib ? lib.name : 'Exercício') + '</b>' +
      '<div class="dim" style="font-size:11.5px">' + item.sets.length + ' séries · ' + item.rest + 's descanso · @RPE ' + item.rpe + '</div>' +
      (item.motivo ? '<div class="mut mt8" style="font-size:11px;line-height:1.4">' + esc(item.motivo) + '</div>' : '') +
      '</div></div>';
  }).join('');

  window.pendingAISuggestions = result.exercises;
  if(resEl){
    resEl.innerHTML =
      '<div class="card acc newpop mt8">' +
      '<div class="lbl" style="color:var(--acc)">' + (result.isAI ? 'Sugestão do Gemini' : 'Sugestão do Coach Local') + '</div>' +
      '<div class="mt14 stack">' + rows + '</div>' +
      '<button class="btn btn-pri ripple mt14" style="width:100%" data-act="ed-ai-apply">' +
      icon('check') + ' Inserir na Ficha Atual</button>' +
      '</div>';
  }
}

function applyAISuggestions(){
  const exercises = window.pendingAISuggestions;
  if(!editing || !Array.isArray(exercises)) return;
  exercises.forEach(function(item){
    if(!editing.ex.some(function(x){ return x.exId === item.exId; })){
      editing.ex.push({
        exId: item.exId,
        rpe: item.rpe || 8,
        rest: item.rest || 90,
        sets: item.sets || [{ type:'work', reps:10 }]
      });
    }
  });
  window.pendingAISuggestions = null;
  closeModal();
  renderEditorInto(editorEl);
  toast(exercises.length + ' exercícios adicionados à sua ficha!', 'ok', 'spark');
}
