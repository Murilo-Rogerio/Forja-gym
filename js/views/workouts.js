let workoutViewTab = 'my'; // 'my' ou 'presets'

RENDER.workouts = function(){
  const myWorkouts = state.workouts || [];

  // Linhas das fichas do próprio usuário
  const rows = myWorkouts.map(function(w){
    return '<div class="wrow rise"><div class="wsplit">' + esc(splitTag(w.name)) + '</div>' +
      '<div style="flex:1" class="tap" data-act="w-start" data-arg="' + w.id + '">' +
      '<b style="font-family:var(--fd);font-size:17.5px;letter-spacing:.5px;text-transform:uppercase">' + esc(w.name) + '</b>' +
      '<div class="mut" style="font-size:12.5px;margin-top:3px">' + esc(w.split) + ' · ' + w.ex.length + ' exercícios · ' +
      w.ex.reduce(function(s,e){ return s + e.sets.length; },0) + ' séries</div></div>' +
      '<button class="iconbtn ripple" data-act="w-share" data-arg="' + w.id + '" aria-label="Compartilhar" title="Compartilhar ficha com amigos">' + icon('share') + '</button>' +
      '<button class="iconbtn ripple" data-act="w-dup" data-arg="' + w.id + '" aria-label="Duplicar" title="Duplicar ficha">' + icon('copy') + '</button>' +
      '<button class="iconbtn ripple" data-act="w-edit" data-arg="' + w.id + '" aria-label="Editar" title="Editar ficha">' + icon('pencil') + '</button>' +
      '<button class="iconbtn ripple" data-act="w-del" data-arg="' + w.id + '" aria-label="Excluir" title="Excluir ficha">' + icon('trash') + '</button></div>';
  }).join('');

  // Cards dos modelos de treinos pré-prontos (opcionais)
  const presetsHTML = PRESET_ROUTINES.map(function(p){
    const wChips = p.workouts.map(function(w){
      return '<span class="chip" style="font-size:11px">' + esc(w.name.split('—')[1] || w.name) + ' (' + w.ex.length + ' ex)</span>';
    }).join(' ');

    return '<div class="preset-card rise">' +
      '<div class="rowline">' +
      '<span class="preset-tag">' + icon('bolt2') + ' ' + esc(p.tag) + '</span>' +
      '<span class="dim" style="font-size:12px">' + esc(p.days) + '</span>' +
      '</div>' +
      '<b style="font-family:var(--fd);font-size:18px;letter-spacing:.5px;text-transform:uppercase;display:block;margin-top:8px">' + esc(p.name) + '</b>' +
      '<p class="mut mt8" style="font-size:13px;line-height:1.45">' + esc(p.desc) + '</p>' +
      '<div class="rowline mt14" style="gap:6px;flex-wrap:wrap">' + wChips + '</div>' +
      '<div class="rowline mt14" style="gap:8px">' +
      '<button class="btn btn-ghost btn-sm ripple" style="flex:1" data-act="w-preset-view" data-arg="' + p.id + '">' + icon('eye') + ' Ver Exercícios</button>' +
      '<button class="btn btn-pri btn-sm ripple" style="flex:1" data-act="w-preset-import" data-arg="' + p.id + '">' + icon('plus') + ' Adicionar aos Meus</button>' +
      '</div></div>';
  }).join('');

  // Conteúdo da aba selecionada
  let bodyContent = '';
  if(workoutViewTab === 'my'){
    bodyContent =
      // Banner Assistente IA
      '<div class="card acc mt14 rise" style="--d:80ms;display:flex;gap:14px;align-items:center;cursor:pointer" data-act="ai-open">' +
      '<div style="width:46px;height:46px;border-radius:14px;background:rgba(56,189,248,.12);color:var(--acc);display:flex;align-items:center;justify-content:center;flex:none">' + icon('wand') + '</div>' +
      '<div style="flex:1"><b style="font-family:var(--fd);font-size:17px;letter-spacing:.5px;text-transform:uppercase;color:var(--acc)">Assistente IA (Gemini)</b>' +
      '<div class="mut mt8" style="font-size:12.5px">Quer um treino feito sob medida para seu objetivo? Toque para gerar com a IA</div></div>' + icon('fwd') + '</div>' +

      // Lista de Fichas do Usuário
      '<div class="mt20 stack">' +
      (rows ||
        ('<div class="card mt14 text-center" style="padding:28px 18px">' +
        '<div style="width:50px;height:50px;border-radius:14px;background:rgba(56,189,248,.1);color:var(--acc);display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px">' + icon('bolt2') + '</div>' +
        '<div class="h-display h2">NENHUMA FICHA CRIADA</div>' +
        '<p class="mut mt8" style="font-size:13.5px;line-height:1.5">Você tem total liberdade para montar seu treino do zero, pedir ajuda à nossa IA ou escolher um modelo pronto opcional.</p>' +
        '<div class="mt20 stack" style="gap:10px">' +
        '<button class="btn btn-pri ripple" style="width:100%" data-act="w-quick">' + icon('play') + ' Iniciar Treino Livre Agora</button>' +
        '<button class="btn btn-ghost ripple" style="width:100%" data-act="w-new">' + icon('plus') + ' Montar Meu Treino do Zero</button>' +
        '<button class="btn btn-ghost ripple" style="width:100%" data-act="ai-open">' + icon('wand') + ' Criar com Assistente IA (Gemini)</button>' +
        '<button class="btn btn-ghost ripple" style="width:100%" data-act="w-tab" data-arg="presets">' + icon('copy') + ' Explorar Rotinas Prontas Opcionais</button>' +
        '</div></div>')
      ) +
      '</div>';
  } else {
    bodyContent =
      '<div class="mt14 rise">' +
      '<p class="mut" style="font-size:13px;line-height:1.5;margin-bottom:14px">' +
      'Rotinas opcionais completas, com séries e descansos recomendados. Elas vêm com <b>cargas limpas</b> para você registrar seus pesos reais na academia. Adicione a divisão inteira ou apenas os dias que quiser:</p>' +
      presetsHTML +
      '</div>';
  }

  document.querySelector('.view[data-view="workouts"]').innerHTML =
    '<div class="rowline rise"><div><div class="eyebrow">Programa & Rotinas</div>' +
    '<div class="h-display h1 mt8">FICHAS DE<br>TREINO</div></div>' +
    '<div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end">' +
    '<button class="btn btn-ghost btn-sm ripple" data-act="hevy-import-open" title="Importar histórico do Hevy (CSV)">' + icon('fileCsv') + ' Importar Hevy</button>' +
    '<button class="btn btn-ghost btn-sm ripple" data-act="w-import-code" title="Importar ficha compartilhada">' + icon('download') + ' Importar Ficha</button>' +
    '<button class="btn btn-ghost btn-sm ripple" data-act="w-quick" title="Iniciar treino avulso">' + icon('play') + ' Treino Livre</button>' +
    '<button class="btn btn-pri btn-sm ripple" data-act="w-new">' + icon('plus') + ' Nova</button></div></div>' +

    // Seletor de Abas (Minhas Fichas vs Modelos Prontos)
    '<div class="tab-strip mt14 rise" style="--d:40ms">' +
    '<button class="' + (workoutViewTab === 'my' ? 'on' : '') + '" data-act="w-tab" data-arg="my">Minhas Fichas (' + myWorkouts.length + ')</button>' +
    '<button class="' + (workoutViewTab === 'presets' ? 'on' : '') + '" data-act="w-tab" data-arg="presets">Modelos Prontos (' + PRESET_ROUTINES.length + ')</button>' +
    '</div>' +

    bodyContent +

    // Acesso à Biblioteca de Exercícios
    '<div class="mt28 rise"><div class="rowline"><div class="lbl">Biblioteca de exercícios</div>' +
    '<span class="dim num" style="font-size:12px">' + state.library.length + ' exercícios</span></div>' +
    '<button class="btn btn-ghost ripple mt14" style="width:100%" data-act="lib-browse">' + icon('search') + ' Explorar biblioteca & Criar exercício com foto</button></div>';
};

/* Visualizar detalhes de uma rotina pronta */
function openPresetDetails(presetId){
  const preset = PRESET_ROUTINES.find(function(p){ return p.id === presetId; });
  if(!preset) return;

  const wBlocks = preset.workouts.map(function(w, wIdx){
    const exRows = w.ex.map(function(x, i){
      const lib = libById(x.exId) || { name: 'Exercício', group: '—', equip: 'Livre' };
      return '<div class="rowline" style="padding:7px 0;border-bottom:1px solid rgba(148,163,184,.08);font-size:13px">' +
        '<div style="flex:1"><b style="font-size:13.5px">' + (i+1) + '. ' + esc(lib.name) + '</b>' +
        '<div class="dim" style="font-size:11.5px">' + esc(lib.group) + ' · ' + esc(lib.equip) + '</div></div>' +
        '<div class="num" style="text-align:right;color:var(--acc);font-size:12.5px">' + x.sets.length + 'x' + x.sets[0].reps + ' · ' + x.rest + 's</div>' +
        '</div>';
    }).join('');

    return '<div class="preset-item">' +
      '<div class="rowline mb8">' +
      '<b style="font-family:var(--fd);font-size:16px;letter-spacing:.5px;text-transform:uppercase">' + esc(w.name) + '</b>' +
      '<button class="btn btn-ghost btn-sm ripple" data-act="w-preset-import-single" data-arg="' + preset.id + ':' + wIdx + '">' + icon('plus') + ' Adicionar este dia</button>' +
      '</div>' +
      '<div class="mt8">' + exRows + '</div></div>';
  }).join('');

  openScreen(
    screenHeader(preset.name, {
      right: '<button class="btn btn-pri btn-sm ripple" data-act="w-preset-import" data-arg="' + preset.id + '">' + icon('plus') + ' Adicionar Todas</button>'
    }) +
    '<div class="screen-bd">' +
    '<div class="card acc mb14">' +
    '<span class="preset-tag mb8">' + icon('bolt2') + ' ' + esc(preset.tag) + ' · ' + esc(preset.days) + '</span>' +
    '<p class="mut mt8" style="font-size:13.5px;line-height:1.5">' + esc(preset.desc) + '</p>' +
    '<button class="btn btn-pri ripple mt14" style="width:100%" data-act="w-preset-import" data-arg="' + preset.id + '">' +
    icon('plus') + ' Adicionar Divisão Completa (' + preset.workouts.length + ' treinos)</button>' +
    '</div>' +
    '<div class="lbl mt20">Fichas desta Divisão:</div>' +
    '<div class="stack mt8">' + wBlocks + '</div>' +
    '</div>'
  );
}

/* Importar rotina pronta completa */
function importPresetRoutine(presetId){
  const preset = PRESET_ROUTINES.find(function(p){ return p.id === presetId; });
  if(!preset) return;

  preset.workouts.forEach(function(w){
    const cloned = JSON.parse(JSON.stringify(w));
    cloned.id = uid();
    // Garante cargas limpas para o usuário
    cloned.ex.forEach(function(e){
      (e.sets || []).forEach(function(st){ st.w = ''; st.done = false; });
    });
    state.workouts.push(cloned);
  });

  save();
  workoutViewTab = 'my';
  const sc = document.getElementById('stack').lastElementChild;
  if(sc) closeScreen(sc);

  RENDER.workouts();
  toast(preset.name + ' (' + preset.workouts.length + ' treinos) adicionado aos seus treinos!', 'ok', 'bolt2');
}

/* Importar treino único da rotina */
function importPresetSingle(arg){
  const parts = String(arg).split(':');
  const presetId = parts[0];
  const wIdx = parseInt(parts[1], 10);
  const preset = PRESET_ROUTINES.find(function(p){ return p.id === presetId; });
  if(!preset || !preset.workouts[wIdx]) return;

  const w = JSON.parse(JSON.stringify(preset.workouts[wIdx]));
  w.id = uid();
  w.ex.forEach(function(e){
    (e.sets || []).forEach(function(st){ st.w = ''; st.done = false; });
  });

  state.workouts.push(w);
  save();
  workoutViewTab = 'my';
  const sc = document.getElementById('stack').lastElementChild;
  if(sc) closeScreen(sc);

  RENDER.workouts();
  toast('Treino "' + w.name + '" adicionado às suas fichas!', 'ok', 'check');
}

/* Compartilhar Ficha de Treino com Amigos (Código / WhatsApp) */
function shareWorkoutRoutine(id){
  const w = state.workouts.find(function(x){ return x.id === id; });
  if(!w) return;
  const clean = {
    name: w.name,
    split: w.split || 'Livre',
    ex: w.ex.map(function(e){
      const lib = libById(e.exId);
      return {
        name: lib ? lib.name : 'Exercício',
        group: lib ? lib.group : 'Peito',
        equip: lib ? lib.equip : 'Livre',
        rpe: e.rpe || 8,
        rest: e.rest || 90,
        sets: (e.sets || []).map(function(s){ return { type: s.type || 'work', reps: s.reps || 10 }; })
      };
    })
  };
  const jsonStr = JSON.stringify(clean);
  const code = 'FORJA:' + btoa(unescape(encodeURIComponent(jsonStr)));
  const text = '⚡ Ficha FORJA: ' + w.name + ' (' + w.ex.length + ' exercícios)\n' +
    'Divisão: ' + (w.split || 'Livre') + '\n\n' +
    'Código para importar no app:\n' + code;

  if(navigator.share){
    navigator.share({ title: 'Ficha FORJA - ' + w.name, text: text }).catch(function(){});
  } else if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(code).then(function(){
      toast('Código da ficha copiado! Envie para seus amigos.', 'ok', 'copy');
    }).catch(function(){
      openRoutineShareModal(w.name, code);
    });
  } else {
    openRoutineShareModal(w.name, code);
  }
}

function openRoutineShareModal(title, code){
  modalHTML(
    '<div class="sheet-grip"></div>' +
    '<div class="rowline"><div class="h-display h2">COMPARTILHAR FICHA</div>' +
    '<div style="color:var(--acc)">' + icon('share') + '</div></div>' +
    '<p class="mut mt8" style="font-size:13.5px">Copie o código abaixo e envie para seus amigos importarem no FORJA:</p>' +
    '<textarea class="fld mt14" style="min-height:90px;font-family:monospace;font-size:12px" readonly>' + esc(code) + '</textarea>' +
    '<button class="btn btn-pri ripple mt14" style="width:100%" data-act="modal-close">' + icon('check') + ' Fechar</button>'
  );
}

function openImportWorkoutModal(){
  modalHTML(
    '<div class="sheet-grip"></div>' +
    '<div class="rowline"><div class="h-display h2">IMPORTAR FICHA</div>' +
    '<div style="color:var(--acc)">' + icon('download') + '</div></div>' +
    '<p class="mut mt8" style="font-size:13px;line-height:1.5">' +
    'Cole abaixo o código de ficha compartilhado por um amigo (começa com FORJA:...):</p>' +
    '<textarea class="fld mt14" id="import-code-inp" placeholder="Cole o código FORJA:... aqui" style="min-height:95px"></textarea>' +
    '<button class="btn btn-pri ripple mt14" style="width:100%" data-act="w-import-apply">' + icon('check') + ' Importar Ficha Agora</button>'
  );
}

function applyWorkoutImport(){
  const inp = document.getElementById('import-code-inp');
  let raw = (inp ? inp.value : '').trim();
  if(!raw) return toast('Cole o código da ficha para importar.', 'bad');
  if(raw.includes('FORJA:')) raw = raw.split('FORJA:')[1].trim().split(/\s+/)[0];
  try{
    const jsonStr = decodeURIComponent(escape(atob(raw)));
    const data = JSON.parse(jsonStr);
    if(!data.name || !Array.isArray(data.ex)) throw new Error('invalid');
    const newW = {
      id: uid(),
      name: data.name,
      split: data.split || 'Livre',
      ex: data.ex.map(function(item){
        const lib = matchExercise(item.name, item.group);
        return {
          exId: lib.id,
          rpe: item.rpe || 8,
          rest: item.rest || 90,
          sets: (item.sets || []).map(function(s){ return { type: s.type || 'work', reps: s.reps || 10, w: '' }; })
        };
      })
    };
    state.workouts.push(newW);
    save();
    closeModal();
    RENDER.workouts();
    toast('Ficha "' + newW.name + '" importada com sucesso!', 'ok', 'check');
  }catch(err){
    toast('Código de ficha inválido ou corrompido.', 'bad');
  }
}
