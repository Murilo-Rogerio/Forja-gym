RENDER.profile = function(){
  const u = state.user, li = levelInfo(u.xp);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const accName = session ? (session.name || session.email || 'Conta') : 'Convidado';
  const accMode = !session ? 'Modo Convidado (Offline)' : session.mode === 'supabase' ? 'Supabase Cloud (Sincronizado)' : session.mode === 'google' ? 'Conta Google Conectada' : session.mode === 'firebase' ? 'Google / Firebase Nuvem' : 'Conta Local';
  document.querySelector('.view[data-view="profile"]').innerHTML =
    '<div class="eyebrow rise">Atleta</div><div class="h-display h1 mt8 rise" style="--d:60ms">' + esc(u.name || 'PERFIL').toUpperCase() + '</div>' +
    '<div class="card mt20 rise" style="--d:90ms"><div class="rowline"><div>' +
    '<div class="lbl">Nível atual</div><div class="h-display" style="font-size:38px;color:var(--acc)">' + li.lvl + '</div></div>' +
    '<div style="flex:1;padding-left:16px"><div class="xpbar"><i style="width:' + (li.cur/li.need*100).toFixed(1) + '%"></i></div>' +
    '<div class="lbl mt8 num" style="letter-spacing:1px">' + fmtN(li.cur) + ' / ' + fmtN(li.need) + ' XP</div></div></div></div>' +
    '<div class="lbl mt20 rise" style="--d:120ms">Conta & Conexões</div>' +
    '<div class="card mt8 rise" style="--d:130ms">' +
    '<div class="kv"><span class="mut">Sessão</span><b style="font-size:13.5px">' + esc(accName) + '</b></div>' +
    '<div class="kv"><span class="mut">Tipo</span><b style="font-size:13.5px">' + esc(accMode) + '</b></div>' +
    '<div class="kv"><span class="mut">Sincronização Nuvem</span><b style="font-size:13.5px;color:' + (session && session.mode === 'supabase' ? 'var(--ok)' : 'var(--dim)') + '">' + (session && session.mode === 'supabase' ? 'Supabase Conectado' : 'Modo Local-First (Offline)') + '</b></div>' +
    '<div class="kv"><span class="mut">Gemini IA</span><b style="font-size:13.5px;color:' + (state.settings.gemini?'var(--ok)':'var(--dim)') + '">' + (state.settings.gemini?'conectado':'não configurado') + '</b></div>' +
    '<div class="kv"><span class="mut">Strava</span><b style="font-size:13.5px;color:' + (state.settings.strava?'var(--ok)':'var(--dim)') + '">' + (state.settings.strava?'conectado':'não configurado') + '</b></div>' +
    '<div class="stack mt14">' +
    '<button class="btn btn-pri ripple" style="width:100%" data-act="sb-sync">' + icon('cloud') + ' Sincronizar com Supabase Cloud</button>' +
    '<button class="btn btn-ghost ripple" style="width:100%" data-act="sb-set">' + icon('sync') + ' Configurações Supabase Cloud</button>' +
    '<button class="btn btn-ghost ripple" style="width:100%" data-act="gem-set">' + icon('brain') + ' Chave Gemini (IA)</button>' +
    '<button class="btn btn-ghost ripple" style="width:100%" data-act="strava-set">' + icon('bolt2') + ' Strava</button>' +
    '<button class="btn btn-ghost ripple" style="width:100%" data-act="fb-set">' + icon('cloud') + (getFbCfg() ? ' Firebase configurado' : ' Firebase Opcional') + '</button>' +
    (session ? '<button class="btn btn-danger ripple" style="width:100%" data-act="logout">' + icon('logout') + ' Sair da conta</button>' : '') +
    '</div></div>' +
    '<div class="card mt14 rise" style="--d:160ms">' +
    '<div class="rowline"><div class="lbl">Rastreador de Peso Corporal</div>' +
    '<button class="btn btn-pri btn-sm ripple" data-act="weight-log-modal">' + icon('plus') + ' Registrar Peso</button></div>' +
    '<div class="statband mt14"><div><b class="num">' + (u.weight ? fmtN(u.weight) + ' kg' : '—') + '</b><span>Peso Atual</span></div>' +
    '<div><b class="num">' + (state.weightLogs && state.weightLogs.length ? fmtN(state.weightLogs[0].weight) + ' kg' : '—') + '</b><span>Peso Inicial</span></div>' +
    '<div><b class="num" style="color:' + (weightChangeDiff() > 0 ? 'var(--warn)' : weightChangeDiff() < 0 ? 'var(--ok)' : 'var(--txt)') + '">' + (weightChangeDiff() !== 0 ? (weightChangeDiff() > 0 ? '+' : '') + fmtN(weightChangeDiff()) + ' kg' : '0.0 kg') + '</b><span>Variação</span></div></div>' +
    ((state.weightLogs && state.weightLogs.length >= 2) ? '<div class="chartwrap mt14"><canvas class="chart" id="weight-chart-cv" data-h="130"></canvas></div>' : '') +
    '<div class="mt14">' + weightLogRowsHTML() + '</div>' +
    '</div>' +

    '<div class="card mt14 rise" style="--d:170ms">' +
    '<div class="kv"><span class="mut">Altura</span><b class="num">' + (u.height?fmtN(u.height)+' cm':'—') + '</b></div>' +
    '<div class="kv"><span class="mut">Objetivo</span><b>' + goalLabel(u.goal) + '</b></div>' +
    '<div class="kv"><span class="mut">Nível de atividade</span><b>' + activityLabel(u.activity) + '</b></div>' +
    '<button class="btn btn-ghost ripple mt14" style="width:100%" data-act="prof-edit">' + icon('pencil') + ' Editar Dados Básicos</button></div>' +
    '<div class="lbl mt20 rise" style="--d:190ms">Preferências</div><div class="card mt8 rise" style="--d:200ms">' +
    '<div class="kv"><span style="display:flex;align-items:center;gap:10px">' + icon('volume') + ' Som de descanso</span>' +
    '<button class="chip ripple ' + (state.settings.sound?'on':'') + '" data-act="set-sound">' + (state.settings.sound?'Ligado':'Desligado') + '</button></div>' +
    '<div class="kv"><span style="display:flex;align-items:center;gap:10px">' + icon('vibrate') + ' Vibração</span>' +
    '<button class="chip ripple ' + (state.settings.vibrate?'on':'') + '" data-act="set-vib">' + (state.settings.vibrate?'Ligada':'Desligada') + '</button></div>' +
    '<div class="kv"><span style="display:flex;align-items:center;gap:10px">' + icon('speaker') + ' Voz do Coach (Áudio)</span>' +
    '<button class="chip ripple ' + (state.settings.voiceCoach!==false?'on':'') + '" data-act="set-voice">' + (state.settings.voiceCoach!==false?'Ligada':'Desligada') + '</button></div></div>' +
    '<div class="lbl mt20 rise" style="--d:220ms">Aplicativo & Dados</div><div class="card mt8 rise" style="--d:230ms">' +
    '<p class="mut" style="font-size:13px;line-height:1.6">FORJA roda 100% offline — seus dados ficam no aparelho. Instale na tela inicial para experiência de app nativo.</p>' +
    '<div class="stack mt14">' +
    '<button class="btn btn-pri ripple" style="width:100%" data-act="install" id="install-btn">' + icon('download') + ' Instalar na tela inicial</button>' +
    '<button class="btn btn-ghost ripple" style="width:100%" data-act="hevy-import-open">' + icon('fileCsv') + ' Importar Histórico do Hevy (CSV)</button>' +
    '<button class="btn btn-ghost ripple" style="width:100%" data-act="plate-calc-tool">' + icon('plate') + ' Calculadora de Anilhas na Barra</button>' +
    '<button class="btn btn-ghost ripple" style="width:100%" data-act="backup-export">' + icon('download') + ' Exportar Backup Completo (JSON)</button>' +
    '<button class="btn btn-ghost ripple" style="width:100%" data-act="hevy-export-csv">' + icon('fileCsv') + ' Exportar Treinos em CSV (Compatível Hevy)</button>' +
    '<button class="btn btn-ghost ripple" style="width:100%" data-act="backup-import">' + icon('sync') + ' Restaurar Backup (JSON)</button>' +
    '</div>' +
    (isIOS ? '<p class="dim mt8" style="font-size:12px">No iOS: toque em <b>Compartilhar</b> e depois <b>Adicionar à Tela de Início</b>.</p>' : '') + '</div>' +
    '<button class="btn btn-danger ripple mt20" style="width:100%" data-act="reset-data">' + icon('trash') + ' Limpar e Reiniciar Dados</button>' +
    '<p class="dim mt14" style="text-align:center;font-family:var(--fd);letter-spacing:2px;font-size:12px">FORJA · TREINO & PERFORMANCE</p>';
  const btn = document.getElementById('install-btn');
  if(btn && !deferredPrompt && !isIOS) btn.style.display = 'none';

  if(state.weightLogs && state.weightLogs.length >= 2){
    requestAnimationFrame(function(){
      const cv = document.getElementById('weight-chart-cv');
      if(cv){
        const pts = state.weightLogs.slice().sort(function(a,b){ return a.date - b.date; }).map(function(l){
          return {
            l: new Date(l.date).toLocaleDateString('pt-BR', {day:'numeric',month:'short'}).replace('.',''),
            v: l.weight
          };
        });
        drawLineChart(cv, pts);
      }
    });
  }
};

function weightChangeDiff(){
  const logs = (state.weightLogs || []).slice().sort(function(a,b){ return a.date - b.date; });
  if(logs.length < 2) return 0;
  return +(logs[logs.length-1].weight - logs[0].weight).toFixed(1);
}

function weightLogRowsHTML(){
  const logs = (state.weightLogs || []).slice().sort(function(a,b){ return b.date - a.date; }).slice(0, 5);
  if(!logs.length) return '<p class="dim text-center" style="font-size:12px;margin:8px 0">Nenhuma pesagem gravada ainda. Toque em "Registrar Peso".</p>';
  return logs.map(function(l){
    return '<div class="rowline" style="padding:7px 0;border-bottom:1px solid var(--line);font-size:13px">' +
      '<div><b>' + fmtN(l.weight) + ' kg</b>' + (l.note ? ' <span class="dim" style="font-size:11.5px">(' + esc(l.note) + ')</span>' : '') + '</div>' +
      '<div style="display:flex;align-items:center;gap:8px"><span class="dim" style="font-size:11.5px">' + fmtDate(l.date) + '</span>' +
      '<button class="iconbtn ripple" style="width:24px;height:24px;border:none;color:var(--dim)" data-act="weight-log-del" data-arg="' + l.id + '" title="Excluir">' + icon('x') + '</button></div>' +
      '</div>';
  }).join('');
}

function openWeightLogModal(){
  const curW = state.user.weight || '';
  modalHTML(
    '<div class="sheet-grip"></div>' +
    '<div class="rowline"><div class="h-display h2">REGISTRAR PESO CORPORAL</div>' +
    '<div style="color:var(--acc)">' + icon('trend') + '</div></div>' +
    '<p class="mut mt8" style="font-size:13px;line-height:1.5">Acompanhe sua evolução de peso real sem estimativas hipotéticas. Use para avaliar hipertrofia ou queima de gordura.</p>' +
    '<label class="flabel lbl mt14">Peso Atual (kg) *</label>' +
    '<input class="fld num mt8" id="wl-weight" type="number" inputmode="decimal" step="0.1" min="30" max="300" placeholder="Ex: 75.5" value="' + curW + '" style="font-size:22px;font-weight:700">' +
    '<label class="flabel lbl mt14">Observação / Condição (Opcional)</label>' +
    '<input class="fld mt8" id="wl-note" placeholder="Ex: Em jejum ao acordar, pós-treino..." maxlength="40">' +
    '<div class="split2 mt20">' +
    '<button class="btn btn-ghost ripple" data-act="modal-close">Cancelar</button>' +
    '<button class="btn btn-pri ripple" data-act="weight-log-save">' + icon('check') + ' Salvar Pesagem</button>' +
    '</div>'
  );
  setTimeout(function(){
    const el = document.getElementById('wl-weight');
    if(el){ el.focus(); el.select(); }
  }, 120);
}

function saveWeightLogFromModal(){
  const el = document.getElementById('wl-weight');
  const noteEl = document.getElementById('wl-note');
  const w = el ? parseNum(el.value) : 0;
  if(w <= 0){
    toast('Digite um peso válido.', 'bad');
    return;
  }
  const note = noteEl ? noteEl.value.trim() : '';
  logBodyWeight(w, note);
  closeModal();
  toast('Pesagem de ' + fmtN(w) + ' kg gravada com sucesso!', 'ok', 'check');
  if(RENDER[curView]) RENDER[curView]();
}

function deleteWeightLog(id){
  state.weightLogs = (state.weightLogs || []).filter(function(x){ return x.id !== id; });
  const last = (state.weightLogs || []).slice().sort(function(a,b){ return a.date - b.date; }).slice(-1)[0];
  if(last) state.user.weight = last.weight;
  save();
  toast('Registro de peso removido.', 'ok');
  if(RENDER[curView]) RENDER[curView]();
}

function openProfileEditor(){
  const u = state.user;
  const actOpts = [['sedentario','Sedentário'],['leve','Levemente ativo'],['moderado','Moderadamente ativo'],['intenso','Muito ativo'],['atleta','Atleta']]
    .map(function(o){ return '<option value="' + o[0] + '"' + (u.activity===o[0]?' selected':'') + '>' + o[1] + '</option>'; }).join('');
  const goalOpts = [['cut','Cutting (perder gordura)'],['manter','Manutenção'],['bulk','Bulking (ganhar massa)']]
    .map(function(o){ return '<option value="' + o[0] + '"' + (u.goal===o[0]?' selected':'') + '>' + o[1] + '</option>'; }).join('');
  modalHTML('<div class="sheet-grip"></div><div class="h-display h2">EDITAR PERFIL</div>' +
    '<label class="flabel lbl">Nome</label><input class="fld" id="pf-name" value="' + esc(u.name) + '" maxlength="30" placeholder="Seu nome">' +
    '<div class="split2"><div><label class="flabel lbl">Sexo</label>' +
    '<select class="fld" id="pf-sex"><option value="m"' + (u.sex==='m'?' selected':'') + '>Masculino</option>' +
    '<option value="f"' + (u.sex==='f'?' selected':'') + '>Feminino</option></select></div>' +
    '<div><label class="flabel lbl">Idade (anos)</label><input class="fld" id="pf-age" type="number" inputmode="numeric" min="10" max="99" value="' + u.age + '"></div></div>' +
    '<div class="split2"><div><label class="flabel lbl">Peso (kg)</label>' +
    '<input class="fld" id="pf-weight" type="number" inputmode="decimal" step="0.5" min="30" max="250" value="' + u.weight + '"></div>' +
    '<div><label class="flabel lbl">Altura (cm)</label>' +
    '<input class="fld" id="pf-height" type="number" inputmode="numeric" min="120" max="230" value="' + u.height + '"></div></div>' +
    '<label class="flabel lbl">Nível de atividade</label><select class="fld" id="pf-activity">' + actOpts + '</select>' +
    '<label class="flabel lbl">Objetivo</label><select class="fld" id="pf-goal">' + goalOpts + '</select>' +
    '<button class="btn btn-pri ripple mt20" style="width:100%" data-act="prof-save">Salvar perfil</button>');
  const goalSel = document.getElementById('pf-goal');
  if(goalSel) goalSel.addEventListener('change', function(){ state.nutrition.custom = null; save(); });
}
function saveProfileFromModal(){
  const u = state.user;
  u.name = document.getElementById('pf-name').value.trim();
  u.sex = document.getElementById('pf-sex').value;
  u.age = Math.max(0, parseNum(document.getElementById('pf-age').value));
  u.weight = Math.max(0, parseNum(document.getElementById('pf-weight').value));
  u.height = Math.max(0, parseNum(document.getElementById('pf-height').value));
  u.activity = document.getElementById('pf-activity').value;
  u.goal = document.getElementById('pf-goal').value;
  save(); closeModal();
  toast('Perfil atualizado.', 'ok');
  if(RENDER[curView]) RENDER[curView]();
}
function openGemSettings(){
  modalHTML('<div class="sheet-grip"></div><div class="h-display h2">CHAVE GEMINI (IA)</div>' +
    '<p class="mut mt8" style="font-size:13px;line-height:1.6">Crie uma chave gratuita no Google AI Studio e cole abaixo. Ela fica salva só no seu aparelho e é usada direto do navegador.</p>' +
    '<a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener" class="btn btn-ghost btn-sm ripple mt14">' + icon('key') + ' Abrir Google AI Studio</a>' +
    '<label class="flabel lbl">Sua chave de API</label>' +
    '<input class="fld" id="gem-key" type="password" placeholder="AIza..." value="' + esc(state.settings.gemini) + '">' +
    '<div class="split2 mt14"><button class="btn btn-ghost ripple" data-act="gem-test">Testar chave</button>' +
    '<button class="btn btn-pri ripple" data-act="gem-save">Salvar</button></div>' +
    '<div id="gem-status" class="au-err"></div>');
}
async function gemTest(){
  const st = document.getElementById('gem-status');
  if(st) st.textContent = '';
  const key = document.getElementById('gem-key').value.trim();
  if(!key){ if(st) st.textContent = 'Cole a chave primeiro.'; return; }
  state.settings.gemini = key; save();
  if(st) st.textContent = 'Testando...';
  const r = await geminiCall('Responda apenas com a palavra: OK', false);
  if(st) st.textContent = r ? 'Chave funcionando.' : 'Não respondeu — verifique a chave.';
  if(r) toast('Gemini conectado com sucesso.', 'ok', 'wand');
}
function openStravaSettings(){
  modalHTML('<div class="sheet-grip"></div><div class="h-display h2">STRAVA</div>' +
    '<p class="mut mt8" style="font-size:13px;line-height:1.6">No Strava: <b>Configurações → Meu perfil de API</b>, crie um app e gere um <b>Access Token</b> (escopo activity:write). Cole abaixo: ao concluir treinos, publico automaticamente como atividade de musculação.</p>' +
    '<label class="flabel lbl">Access Token</label>' +
    '<input class="fld" id="strava-key" placeholder="strava_token..." value="' + esc(state.settings.strava) + '">' +
    '<div class="kv mt14"><span style="display:flex;align-items:center;gap:10px">Publicar automaticamente ao concluir</span>' +
    '<button class="chip ripple ' + (state.settings.stravaAuto?'on':'') + '" data-act="strava-auto">' + (state.settings.stravaAuto?'Sim':'Não') + '</button></div>' +
    '<p class="dim mt8" style="font-size:11.5px;line-height:1.5">Se o Strava bloquear a publicação direta do navegador, o FORJA abre a folha de compartilhamento nativa como alternativa.</p>' +
    '<button class="btn btn-pri ripple mt14" style="width:100%" data-act="strava-save">Salvar conexão</button>');
}
function openSupabaseSettings(){
  const cfg = getSupabaseConfig();
  modalHTML('<div class="sheet-grip"></div><div class="h-display h2">SUPABASE CLOUD</div>' +
    '<p class="mut mt8" style="font-size:13px;line-height:1.6">Seu banco de dados relacional Supabase armazena treinos, histórico de cargas, feed e sincronização entre aparelhos com segurança.</p>' +
    '<label class="flabel lbl mt14">URL do Projeto</label>' +
    '<input class="fld" id="sb-url" placeholder="https://xyz.supabase.co" value="' + esc(cfg.url) + '">' +
    '<label class="flabel lbl mt14">Chave Anon / Publishable</label>' +
    '<input class="fld" id="sb-key" type="password" placeholder="eyJ..." value="' + esc(cfg.anonKey) + '">' +
    '<div class="card mt14" style="background:rgba(56,189,248,.08);border-color:rgba(56,189,248,.25)">' +
    '<div class="rowline" style="gap:10px">' +
    '<div style="color:var(--acc)">' + icon('shield') + '</div>' +
    '<span class="dim" style="font-size:11.5px">Projeto vinculado: <b>janbrprcrbjseutnxiko</b>. Chave de serviço protegida com segurança no servidor.</span>' +
    '</div></div>' +
    '<div class="split2 mt20"><button class="btn btn-ghost ripple" data-act="sb-reset-cfg">Restaurar Padrão</button>' +
    '<button class="btn btn-pri ripple" data-act="sb-save-cfg">Salvar e Conectar</button></div>');
}

function openFbSettings(){
  modalHTML('<div class="sheet-grip"></div><div class="h-display h2">FIREBASE (GOOGLE + NUVEM)</div>' +
    '<p class="mut mt8" style="font-size:13px;line-height:1.6">Habilita login com Google, recuperação de senha por e-mail, sincronização entre aparelhos e feed da comunidade. No console do Firebase: crie um projeto, ative Authentication (Google + E-mail/senha), adicione um app web e cole o firebaseConfig abaixo.</p>' +
    '<label class="flabel lbl">firebaseConfig (JSON)</label>' +
    '<textarea class="fld" id="fb-cfg" placeholder=\'{"apiKey":"...","authDomain":"...","projectId":"...","appId":"..."}\'>' + (getFbCfg() ? esc(JSON.stringify(getFbCfg())) : '') + '</textarea>' +
    '<div class="split2 mt14"><button class="btn btn-ghost ripple" data-act="fb-disc">Desconectar</button>' +
    '<button class="btn btn-pri ripple" data-act="fb-save">Conectar</button></div>');
}

/* Backup e Restauração de Dados */
function exportBackupData(){
  const data = {
    app: 'FORJA',
    version: state.v,
    exportedAt: new Date().toISOString(),
    user: state.user,
    workouts: state.workouts,
    logs: state.logs,
    records: state.records,
    ach: state.ach,
    nutrition: state.nutrition,
    settings: state.settings,
    posts: state.posts,
    friends: state.friends
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'forja-backup-' + new Date().toISOString().slice(0,10) + '.json';
  a.click();
  toast('Backup exportado com sucesso.', 'ok', 'download');
}

function importBackupData(){
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json,application/json';
  input.onchange = function(e){
    const file = e.target.files && e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function(evt){
      try{
        const data = JSON.parse(evt.target.result);
        if(!data.user || !Array.isArray(data.workouts) || !Array.isArray(data.logs)){
          toast('Arquivo de backup inválido.', 'bad');
          return;
        }
        modalConfirm({
          title: 'Restaurar Backup',
          msg: 'Deseja substituir os dados atuais pelos dados do backup (' + data.workouts.length + ' fichas, ' + data.logs.length + ' treinos concluídos)?',
          ok: 'Restaurar',
          danger: true
        }).then(function(yes){
          if(yes){
            state = migrateState(Object.assign(defaultState(), data));
            active = state.active || null;
            save();
            location.reload();
          }
        });
      }catch(err){
        toast('Erro ao ler arquivo de backup JSON.', 'bad');
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

/* Exportar Histórico no formato Hevy CSV */
function exportHevyCSV(){
  if(!state.logs || !state.logs.length){
    toast('Nenhum treino concluído para exportar.', 'bad');
    return;
  }
  const rows = [
    'Date,Workout Name,Exercise Name,Set Order,Weight,Reps,RPE,Distance,Seconds,Notes,Workout Notes'
  ];

  state.logs.slice().sort(function(a,b){ return a.date - b.date; }).forEach(function(l){
    const dStr = new Date(l.date).toISOString().replace('T', ' ').slice(0, 19);
    const wName = '"' + (l.name || 'Treino').replace(/"/g, '""') + '"';
    (l.ex || []).forEach(function(e){
      const lib = libById(e.exId);
      const exName = '"' + (lib ? lib.name : 'Exercício').replace(/"/g, '""') + '"';
      (e.sets || []).forEach(function(s, setIdx){
        const w = s.w || 0;
        const r = s.r || 0;
        const rpe = s.rpe || 8;
        rows.push([dStr, wName, exName, (setIdx + 1), w, r, rpe, 0, 0, '""', '""'].join(','));
      });
    });
  });

  const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'forja-workouts-' + new Date().toISOString().slice(0,10) + '.csv';
  a.click();
  toast('Histórico de treinos exportado em CSV!', 'ok', 'fileCsv');
}
