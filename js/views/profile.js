RENDER.profile = function(){
  const u = state.user, li = levelInfo(u.xp);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const accName = session ? (session.name || session.email || 'Conta') : 'Convidado';
  const accMode = !session ? 'Modo Convidado (Offline)' : session.mode === 'google' ? 'Conta Google Conectada' : session.mode === 'firebase' ? 'Google / Firebase Nuvem' : 'Conta Local';
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
    '<div class="kv"><span class="mut">Gemini IA</span><b style="font-size:13.5px;color:' + (state.settings.gemini?'var(--ok)':'var(--dim)') + '">' + (state.settings.gemini?'conectado':'não configurado') + '</b></div>' +
    '<div class="kv"><span class="mut">Strava</span><b style="font-size:13.5px;color:' + (state.settings.strava?'var(--ok)':'var(--dim)') + '">' + (state.settings.strava?'conectado':'não configurado') + '</b></div>' +
    '<div class="stack mt14">' +
    '<button class="btn btn-ghost ripple" style="width:100%" data-act="gem-set">' + icon('brain') + ' Chave Gemini (IA)</button>' +
    '<button class="btn btn-ghost ripple" style="width:100%" data-act="strava-set">' + icon('bolt2') + ' Strava</button>' +
    '<button class="btn btn-ghost ripple" style="width:100%" data-act="fb-set">' + icon('cloud') + (getFbCfg() ? ' Firebase configurado' : ' Login com Google (Firebase)') + '</button>' +
    (session && session.mode === 'firebase' ? '<button class="btn btn-ghost ripple" style="width:100%" data-act="acc-sync">' + icon('sync') + ' Sincronizar com a nuvem</button>' : '') +
    (session ? '<button class="btn btn-danger ripple" style="width:100%" data-act="logout">' + icon('logout') + ' Sair da conta</button>' : '') +
    '</div></div>' +
    '<div class="card mt14 rise" style="--d:160ms">' +
    '<div class="kv"><span class="mut">Peso corporal</span><b class="num">' + (u.weight?fmtN(u.weight)+' kg':'—') + '</b></div>' +
    '<div class="kv"><span class="mut">Altura</span><b class="num">' + (u.height?fmtN(u.height)+' cm':'—') + '</b></div>' +
    '<div class="kv"><span class="mut">Objetivo</span><b>' + goalLabel(u.goal) + '</b></div>' +
    '<div class="kv"><span class="mut">Nível de atividade</span><b>' + activityLabel(u.activity) + '</b></div>' +
    '<button class="btn btn-ghost ripple mt14" style="width:100%" data-act="prof-edit">' + icon('pencil') + ' Editar perfil</button></div>' +
    '<div class="lbl mt20 rise" style="--d:190ms">Preferências</div><div class="card mt8 rise" style="--d:200ms">' +
    '<div class="kv"><span style="display:flex;align-items:center;gap:10px">' + icon('volume') + ' Som de descanso</span>' +
    '<button class="chip ripple ' + (state.settings.sound?'on':'') + '" data-act="set-sound">' + (state.settings.sound?'Ligado':'Desligado') + '</button></div>' +
    '<div class="kv"><span style="display:flex;align-items:center;gap:10px">' + icon('vibrate') + ' Vibração</span>' +
    '<button class="chip ripple ' + (state.settings.vibrate?'on':'') + '" data-act="set-vib">' + (state.settings.vibrate?'Ligada':'Desligada') + '</button></div></div>' +
    '<div class="lbl mt20 rise" style="--d:220ms">Aplicativo</div><div class="card mt8 rise" style="--d:230ms">' +
    '<p class="mut" style="font-size:13px;line-height:1.6">FORJA roda 100% offline — seus dados ficam no aparelho. Instale na tela inicial para experiência de app nativo.</p>' +
    '<button class="btn btn-pri ripple mt14" style="width:100%" data-act="install" id="install-btn">' + icon('download') + ' Instalar na tela inicial</button>' +
    (isIOS ? '<p class="dim mt8" style="font-size:12px">No iOS: toque em <b>Compartilhar</b> e depois <b>Adicionar à Tela de Início</b>.</p>' : '') + '</div>' +
    (state.demo ? '<p class="dim mt14" style="font-size:12px;line-height:1.6">Os dados incluem o histórico de demonstração do primeiro acesso. Use "Apagar tudo" para começar do zero.</p>' : '') +
    '<button class="btn btn-danger ripple mt20" style="width:100%" data-act="reset-data">' + icon('trash') + ' Apagar todos os dados</button>' +
    '<p class="dim mt14" style="text-align:center;font-family:var(--fd);letter-spacing:2px;font-size:12px">FORJA · TREINO & PERFORMANCE</p>';
  const btn = document.getElementById('install-btn');
  if(btn && !deferredPrompt && !isIOS) btn.style.display = 'none';
};

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
function openFbSettings(){
  modalHTML('<div class="sheet-grip"></div><div class="h-display h2">FIREBASE (GOOGLE + NUVEM)</div>' +
    '<p class="mut mt8" style="font-size:13px;line-height:1.6">Habilita login com Google, recuperação de senha por e-mail, sincronização entre aparelhos e feed da comunidade. No console do Firebase: crie um projeto, ative Authentication (Google + E-mail/senha), adicione um app web e cole o firebaseConfig abaixo.</p>' +
    '<label class="flabel lbl">firebaseConfig (JSON)</label>' +
    '<textarea class="fld" id="fb-cfg" placeholder=\'{"apiKey":"...","authDomain":"...","projectId":"...","appId":"..."}\'>' + (getFbCfg() ? esc(JSON.stringify(getFbCfg())) : '') + '</textarea>' +
    '<div class="split2 mt14"><button class="btn btn-ghost ripple" data-act="fb-disc">Desconectar</button>' +
    '<button class="btn btn-pri ripple" data-act="fb-save">Conectar</button></div>');
}
