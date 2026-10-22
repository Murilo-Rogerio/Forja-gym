let authEl = null, authMode = 'login', authBusy = false;

function logoLettersHTML(word){
  return word.split('').map(function(ch, i){
    return '<span style="animation-delay:' + (i*80) + 'ms">' + ch + '</span>';
  }).join('');
}

function renderAuth(){
  if(!authEl){
    authEl = openScreen('');
    authEl.dataset.nodismiss = '1';
  }
  const L = logoLettersHTML('FORJA');
  let form = '';

  if(authMode === 'login'){
    form =
      '<label class="flabel lbl">E-mail</label>' +
      '<input class="fld" id="au-email" type="email" inputmode="email" placeholder="voce@email.com" autocomplete="email">' +
      '<label class="flabel lbl mt14">Senha</label>' +
      '<div style="position:relative">' +
      '<input class="fld" id="au-pass" type="password" placeholder="Sua senha" autocomplete="current-password" style="padding-right:46px">' +
      '<button class="iconbtn ripple" style="position:absolute;right:4px;top:4px;width:38px;height:38px;border:none" data-act="auth-eye" aria-label="Mostrar senha">' +
      icon('eye') + '</button></div>' +
      '<button class="btn btn-pri ripple mt20" style="width:100%" data-act="auth-submit">' + icon('lock') + ' Entrar na Forja</button>' +
      '<button class="gbtn ripple mt14" data-act="auth-google"><span class="gmark">G</span> Continuar com Google</button>' +
      '<div class="rowline mt20">' +
      '<button class="btn btn-sm ripple" style="color:var(--mut)" data-act="auth-mode" data-arg="forgot">Esqueci minha senha</button>' +
      '<button class="btn btn-sm ripple" style="color:var(--acc)" data-act="auth-mode" data-arg="register">Criar conta</button></div>';
  } else if(authMode === 'register'){
    form =
      '<label class="flabel lbl">Nome Completo</label>' +
      '<input class="fld" id="au-name" placeholder="Ex.: Murilo Carvalho" maxlength="30" autocomplete="name">' +
      '<label class="flabel lbl mt14">E-mail</label>' +
      '<input class="fld" id="au-email" type="email" inputmode="email" placeholder="voce@email.com" autocomplete="email">' +
      '<label class="flabel lbl mt14">Senha (mín. 6 caracteres)</label>' +
      '<input class="fld" id="au-pass" type="password" placeholder="Crie uma senha segura" autocomplete="new-password">' +
      '<label class="flabel lbl mt14">Confirmar senha</label>' +
      '<input class="fld" id="au-pass2" type="password" placeholder="Repita a senha" autocomplete="new-password">' +
      '<button class="btn btn-pri ripple mt20" style="width:100%" data-act="auth-submit">' + icon('user') + ' Criar minha conta</button>' +
      '<button class="gbtn ripple mt14" data-act="auth-google"><span class="gmark">G</span> Cadastrar com Google</button>' +
      '<div class="rowline mt20"><span class="dim" style="font-size:13px">Já tem uma conta?</span>' +
      '<button class="btn btn-sm ripple" style="color:var(--acc)" data-act="auth-mode" data-arg="login">Fazer Login</button></div>';
  } else if(authMode === 'forgot'){
    form =
      '<p class="mut" style="font-size:13px;line-height:1.5;margin-bottom:14px">Digite o e-mail cadastrado para enviarmos o código de recuperação de senha.</p>' +
      '<label class="flabel lbl">E-mail da conta</label>' +
      '<input class="fld" id="au-email" type="email" inputmode="email" placeholder="voce@email.com">' +
      '<button class="btn btn-pri ripple mt20" style="width:100%" data-act="auth-submit">' + icon('key') + ' Enviar Código de Recuperação</button>' +
      '<div class="rowline mt20"><button class="btn btn-sm ripple" style="color:var(--mut)" data-act="auth-mode" data-arg="login">Voltar ao login</button>' +
      '<button class="btn btn-sm ripple" style="color:var(--acc)" data-act="auth-mode" data-arg="reset">Já tenho um código</button></div>';
  } else {
    // Reset de senha
    form =
      '<label class="flabel lbl">E-mail</label>' +
      '<input class="fld" id="au-email" type="email" placeholder="voce@email.com">' +
      '<label class="flabel lbl mt14">Código de recuperação (6 dígitos)</label>' +
      '<input class="fld num" id="au-code" inputmode="numeric" placeholder="123456" maxlength="6" style="letter-spacing:4px;font-size:18px;text-align:center">' +
      '<label class="flabel lbl mt14">Nova senha (mín. 6 caracteres)</label>' +
      '<input class="fld" id="au-pass" type="password" placeholder="Digite a nova senha">' +
      '<button class="btn btn-pri ripple mt20" style="width:100%" data-act="auth-submit">' + icon('check') + ' Redefinir Minha Senha</button>' +
      '<div class="rowline mt20"><button class="btn btn-sm ripple" style="color:var(--mut)" data-act="auth-mode" data-arg="login">Voltar ao login</button></div>';
  }

  const title = {
    login: 'BEM-VINDO DE VOLTA',
    register: 'CRIE SUA CONTA',
    forgot: 'RECUPERAR ACESSO',
    reset: 'NOVA SENHA'
  }[authMode] || '';

  authEl.innerHTML =
    '<div class="screen-bd" style="display:flex;flex-direction:column;justify-content:center;min-height:100vh">' +
    '<div class="authcard">' +
    '<div class="logoL">' + L + '</div>' +
    '<p class="mut mt8" style="text-align:center;font-family:var(--fd);letter-spacing:3px;font-size:13px;text-transform:uppercase">' + title + '</p>' +
    '<div class="mt20">' + form + '</div>' +
    '<div class="au-err" id="au-err"></div>' +
    '<div id="au-extra"></div>' +
    '<div class="card mt20" style="padding:12px 14px;background:rgba(20,30,52,.3);border-color:var(--line)">' +
    '<div class="rowline" style="justify-content:center">' +
    '<button class="btn btn-sm ripple" style="color:var(--dim);font-size:12.5px" data-act="auth-guest">' + icon('dumbbell') + ' Explorar sem conta (Modo Offline)</button>' +
    '</div></div>' +
    '</div></div>';
}

function auErr(msg){
  const el = document.getElementById('au-err');
  if(el) el.textContent = msg;
}

function migrateGuestInto(){
  try{
    const raw = localStorage.getItem(LS_KEY);
    const cur = localStorage.getItem(stateKey());
    if(raw && !cur){
      localStorage.setItem(stateKey(), raw);
      return true;
    }
    if(raw && cur){
      const gs = JSON.parse(raw), cs = JSON.parse(cur);
      if(gs.updatedAt > cs.updatedAt) localStorage.setItem(stateKey(), raw);
    }
  }catch(e){}
  return false;
}

async function authSubmit(){
  if(authBusy) return;
  authBusy = true;
  auErr('');

  try{
    if(authMode === 'login'){
      const email = (document.getElementById('au-email').value||'').trim().toLowerCase();
      const pw = document.getElementById('au-pass').value || '';
      if(!email || !pw) return auErr('Preencha seu e-mail e senha.');

      if(getFbCfg()){
        const fb = await fbInit();
        if(fb){
          try{
            const cred = await FB.a.signInWithEmailAndPassword(FB.auth, email, pw);
            await afterFbLogin(cred.user);
            return;
          }catch(e){
            const msg = String(e && e.code || '');
            if(msg.includes('invalid-credential') || msg.includes('wrong-password') || msg.includes('user-not-found')){
              authBusy = false;
              return auErr('E-mail ou senha incorretos.');
            }
          }
        }
      }

      const accs = getAccounts();
      const acc = accs[email];
      if(!acc) return auErr('Conta não encontrada. Crie uma conta ou use o Google.');
      const h = await hashPw(pw, acc.salt);
      if(h !== acc.hash) return auErr('Senha incorreta.');
      
      setSession({ mode:'local', email: email, name: acc.name });
      migrateGuestInto();
      enterApp();
    } else if(authMode === 'register'){
      const name = (document.getElementById('au-name').value||'').trim();
      const email = (document.getElementById('au-email').value||'').trim().toLowerCase();
      const pw = document.getElementById('au-pass').value || '';
      const pw2 = document.getElementById('au-pass2').value || '';

      if(!name) return auErr('Informe seu nome completo.');
      if(!email || !email.includes('@')) return auErr('E-mail inválido.');
      if(pw.length < 6) return auErr('A senha deve ter no mínimo 6 caracteres.');
      if(pw !== pw2) return auErr('As senhas não coincidem.');

      if(getFbCfg()){
        const fb = await fbInit();
        if(fb){
          try{
            const cred = await FB.a.createUserWithEmailAndPassword(FB.auth, email, pw);
            await cred.user.updateProfile({ displayName: name });
            await afterFbLogin(cred.user, name);
            return;
          }catch(e){
            if((e.code||'').includes('email-already-in-use')) return auErr('Este e-mail já está em uso.');
          }
        }
      }

      const accs = getAccounts();
      if(accs[email]) return auErr('Este e-mail já está cadastrado.');
      const salt = uid();
      const hash = await hashPw(pw, salt);
      accs[email] = { name: name, salt: salt, hash: hash, createdAt: Date.now() };
      saveAccounts(accs);

      setSession({ mode:'local', email: email, name: name });
      migrateGuestInto();
      load();
      state.user.name = name;
      save();
      enterApp();
      toast('Conta criada com sucesso! Bem-vindo.', 'ok', 'flame');
    } else if(authMode === 'forgot'){
      const email = (document.getElementById('au-email').value||'').trim().toLowerCase();
      if(!email || !email.includes('@')) return auErr('Digite um e-mail válido.');

      if(getFbCfg()){
        const fb = await fbInit();
        if(fb){
          try{
            await FB.a.sendPasswordResetEmail(FB.auth, email);
            toast('E-mail de redefinição enviado pelo Firebase!', 'ok', 'mail');
            authMode = 'login';
            renderAuth();
            return;
          }catch(e){}
        }
      }

      const accs = getAccounts();
      const acc = accs[email];
      if(!acc) return auErr('Nenhuma conta encontrada com este e-mail.');

      const code = String(Math.floor(100000 + Math.random()*900000));
      acc.resetCode = code;
      acc.resetExp = Date.now() + 10*60000;
      saveAccounts(accs);

      const extra = document.getElementById('au-extra');
      if(extra){
        extra.innerHTML =
          '<div class="card mt14 acc newpop" style="text-align:center">' +
          '<div class="lbl" style="color:var(--acc)">Seu Código de Recuperação</div>' +
          '<div class="num mt8" style="font-size:28px;font-weight:700;letter-spacing:6px;color:#fff">' + code + '</div>' +
          '<p class="dim mt8" style="font-size:12px">Código válido por 10 minutos. Use-o no passo seguinte para redefinir.</p>' +
          '<button class="btn btn-pri ripple mt14" style="width:100%" data-act="auth-mode" data-arg="reset">Avançar para Nova Senha</button>' +
          '</div>';
      }
    } else {
      // Redefinição com código
      const email = (document.getElementById('au-email').value||'').trim().toLowerCase();
      const code = (document.getElementById('au-code').value||'').trim();
      const pw = document.getElementById('au-pass').value || '';

      const accs = getAccounts();
      const acc = accs[email];
      if(!acc || !acc.resetCode) return auErr('Solicite um código de recuperação primeiro.');
      if(Date.now() > (acc.resetExp||0)) return auErr('Código expirado. Solicite outro.');
      if(code !== acc.resetCode) return auErr('Código de verificação incorreto.');
      if(pw.length < 6) return auErr('A nova senha deve ter no mínimo 6 caracteres.');

      acc.hash = await hashPw(pw, acc.salt);
      delete acc.resetCode;
      delete acc.resetExp;
      saveAccounts(accs);

      toast('Senha redefinida com sucesso! Entre agora.', 'ok');
      authMode = 'login';
      renderAuth();
    }
  } finally {
    authBusy = false;
  }
}

/* Login Google Elegante e Flexível */
async function googleLogin(){
  // 1. Se o Firebase já estiver configurado com credenciais válidas, usa o popup oficial do Google
  if(getFbCfg()){
    const fb = await fbInit();
    if(fb){
      try{
        const provider = new FB.a.GoogleAuthProvider();
        const res = await FB.a.signInWithPopup(FB.auth, provider);
        await afterFbLogin(res.user);
        return;
      }catch(e){
        console.warn('Google popup error', e);
      }
    }
  }

  // 2. Se o Firebase ainda não foi configurado, abre a modal de Login Google Instantâneo
  modalHTML(
    '<div class="sheet-grip"></div>' +
    '<div class="rowline"><div class="h-display h2">ENTRAR COM GOOGLE</div>' +
    '<div class="gmark">G</div></div>' +
    '<p class="mut mt8" style="font-size:13.5px;line-height:1.6">' +
    'Conecte-se com sua conta Google para sincronizar seu histórico, conquistas e fotos no feed.</p>' +
    '<div class="card mt14">' +
    '<label class="flabel lbl">Seu Nome Google</label>' +
    '<input class="fld" id="g-login-name" placeholder="Ex.: Murilo Carvalho" value="' + esc(state && state.user && state.user.name ? state.user.name : '') + '">' +
    '<label class="flabel lbl mt14">E-mail Google (@gmail.com)</label>' +
    '<input class="fld" id="g-login-email" type="email" placeholder="seu.email@gmail.com">' +
    '<button class="btn btn-pri ripple mt20" style="width:100%" data-act="google-instant-login">' +
    icon('check') + ' Confirmar e Entrar com Google</button>' +
    '</div>' +
    '<div class="mt14">' +
    '<p class="dim" style="font-size:12px;line-height:1.5">' +
    'Deseja sincronização remota via Firebase Cloud? Você pode conectar seu projeto Firebase em ' +
    '<b>Perfil → Conexões</b> a qualquer momento.</p>' +
    '</div>'
  );
}

function processInstantGoogleLogin(){
  const nameInput = document.getElementById('g-login-name');
  const emailInput = document.getElementById('g-login-email');
  const name = (nameInput && nameInput.value ? nameInput.value.trim() : '') || 'Atleta Google';
  const email = (emailInput && emailInput.value ? emailInput.value.trim().toLowerCase() : '') || 'atleta@gmail.com';

  closeModal();
  const uidClean = 'g-' + normTxt(email).replace(/\s+/g, '_');
  setSession({ mode:'google', email: email, name: name, uid: uidClean });
  migrateGuestInto();
  load();
  if(!state.user.name) state.user.name = name;
  save();
  enterApp();
  toast('Conectado via Google como ' + name + '!', 'ok', 'flame');
}

async function afterFbLogin(user, nameOverride){
  const name = nameOverride || user.displayName || (user.email || '').split('@')[0];
  setSession({ mode:'firebase', uid: user.uid, email: user.email || '', name: name });
  migrateGuestInto();
  load();
  state.user.name = name;
  if(user.photoURL) state.user.avatar = user.photoURL;
  save();
  enterApp();
  toast('Conectado como ' + name + '.', 'ok');
  fbSyncBestEffort();
}

function enterApp(){
  if(authEl){ authEl.remove(); authEl = null; }
  load();
  if(session && session.name && !state.user.name) state.user.name = session.name;
  setTabbarIcons();
  go('home');
  if(!state.user.name) openOnboarding();
  else if(active){
    modalConfirm({
      title: 'Treino em andamento',
      msg: 'Você deixou "' + active.name + '" aberto. Deseja retomar de onde parou?',
      ok: 'Retomar treino'
    }).then(function(yes){
      if(yes) openActiveScreen();
      else { active = null; state.active = null; save(); }
    });
  }
  checkAchievements(true);
  save();
}

/* ---------- FIREBASE CONFIG & SYNC ---------- */
const FB_VER = '10.12.2';
async function fbInit(){
  if(FB) return FB;
  const cfg = getFbCfg();
  if(!cfg || !cfg.apiKey || !cfg.projectId) return null;
  try{
    const base = 'https://www.gstatic.com/firebasejs/' + FB_VER + '/';
    const m1 = await import(base + 'firebase-app.js');
    const m2 = await import(base + 'firebase-auth.js');
    const m3 = await import(base + 'firebase-firestore.js');
    const app = m1.initializeApp(cfg);
    FB = { app: app, auth: m2.getAuth(app), db: m3.getFirestore(app), a: m2, f: m3 };
    return FB;
  }catch(e){
    toast('Falha ao carregar módulos do Firebase.', 'bad');
    return null;
  }
}

async function fbSyncBestEffort(){
  if(!session || session.mode !== 'firebase' || !FB) return;
  try{
    const ref = FB.f.doc(FB.db, 'forjaUsers', session.uid);
    const snap = await FB.f.getDoc(ref);
    if(snap.exists()){
      const data = snap.data();
      if(data.payload && (!state.updatedAt || (data.updatedAt||0) > state.updatedAt)){
        state = migrateState(Object.assign(defaultState(), JSON.parse(data.payload)));
        active = state.active || null;
        save();
        go('home');
        toast('Dados sincronizados da nuvem com sucesso.', 'ok', 'cloud');
      } else {
        await fbUpload();
      }
    } else {
      await fbUpload();
    }
  }catch(e){}
}

async function fbUpload(){
  if(!session || session.mode !== 'firebase' || !FB) return false;
  try{
    const ref = FB.f.doc(FB.db, 'forjaUsers', session.uid);
    await FB.f.setDoc(ref, { updatedAt: Date.now(), payload: JSON.stringify(state) }, { merge: true });
    return true;
  }catch(e){ return false; }
}
