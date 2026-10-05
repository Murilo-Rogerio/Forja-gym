let authEl = null, authMode = 'login', authBusy = false;
function logoLettersHTML(word){
  return word.split('').map(function(ch, i){
    return '<span style="animation-delay:' + (i*80) + 'ms">' + ch + '</span>';
  }).join('');
}
function renderAuth(){
  if(!authEl){ authEl = openScreen(''); authEl.dataset.nodismiss = '1'; }
  const L = logoLettersHTML('FORJA');
  let form = '';
  if(authMode === 'login'){
    form = '<label class="flabel lbl">E-mail</label><input class="fld" id="au-email" type="email" inputmode="email" placeholder="voce@email.com" autocomplete="email">' +
      '<label class="flabel lbl">Senha</label><div style="position:relative">' +
      '<input class="fld" id="au-pass" type="password" placeholder="Sua senha" autocomplete="current-password" style="padding-right:46px">' +
      '<button class="iconbtn ripple" style="position:absolute;right:4px;top:4px;width:36px;height:36px;border:none" data-act="auth-eye" aria-label="Mostrar senha">' + icon('search') + '</button></div>' +
      '<div class="rowline mt14"><button class="btn btn-pri ripple" style="flex:1" data-act="auth-submit">' + icon('lock') + ' Entrar</button></div>' +
      '<button class="gbtn ripple mt14" data-act="auth-google"><span class="gmark">G</span> Entrar com Google</button>' +
      '<div class="rowline mt20"><button class="btn btn-sm ripple" style="color:var(--mut)" data-act="auth-mode" data-arg="forgot">Esqueci minha senha</button>' +
      '<button class="btn btn-sm ripple" style="color:var(--acc)" data-act="auth-mode" data-arg="register">Criar conta</button></div>';
  } else if(authMode === 'register'){
    form = '<label class="flabel lbl">Nome</label><input class="fld" id="au-name" placeholder="Seu nome" maxlength="30" autocomplete="name">' +
      '<label class="flabel lbl">E-mail</label><input class="fld" id="au-email" type="email" inputmode="email" placeholder="voce@email.com" autocomplete="email">' +
      '<label class="flabel lbl">Senha (mín. 6 caracteres)</label><input class="fld" id="au-pass" type="password" placeholder="Crie uma senha" autocomplete="new-password">' +
      '<label class="flabel lbl">Confirmar senha</label><input class="fld" id="au-pass2" type="password" placeholder="Repita a senha" autocomplete="new-password">' +
      '<button class="btn btn-pri ripple mt20" style="width:100%" data-act="auth-submit">' + icon('user') + ' Criar minha conta</button>' +
      '<button class="gbtn ripple mt14" data-act="auth-google"><span class="gmark">G</span> Criar com Google</button>' +
      '<div class="rowline mt20"><span class="dim" style="font-size:13px">Já tem conta?</span>' +
      '<button class="btn btn-sm ripple" style="color:var(--acc)" data-act="auth-mode" data-arg="login">Entrar</button></div>';
  } else if(authMode === 'forgot'){
    form = '<label class="flabel lbl">E-mail da conta</label><input class="fld" id="au-email" type="email" inputmode="email" placeholder="voce@email.com">' +
      '<button class="btn btn-pri ripple mt20" style="width:100%" data-act="auth-submit">' + icon('key') + ' Recuperar acesso</button>' +
      '<p class="dim mt14" style="font-size:12px;line-height:1.5">No modo local, um código de recuperação aparece aqui mesmo. Com Firebase conectado, enviamos um e-mail real de redefinição.</p>' +
      '<div class="rowline mt20"><button class="btn btn-sm ripple" style="color:var(--mut)" data-act="auth-mode" data-arg="login">Voltar ao login</button></div>';
  } else {
    form = '<label class="flabel lbl">E-mail</label><input class="fld" id="au-email" type="email" placeholder="voce@email.com">' +
      '<label class="flabel lbl">Código de recuperação</label><input class="fld" id="au-code" inputmode="numeric" placeholder="6 dígitos">' +
      '<label class="flabel lbl">Nova senha</label><input class="fld" id="au-pass" type="password" placeholder="Nova senha (mín. 6)">' +
      '<button class="btn btn-pri ripple mt20" style="width:100%" data-act="auth-submit">Redefinir senha</button>' +
      '<div class="rowline mt20"><button class="btn btn-sm ripple" style="color:var(--mut)" data-act="auth-mode" data-arg="login">Voltar ao login</button></div>';
  }
  const title = { login:'BEM-VINDO DE VOLTA', register:'CRIE SUA CONTA', forgot:'RECUPERAR ACESSO', reset:'NOVA SENHA' }[authMode] || '';
  authEl.innerHTML = '<div class="screen-bd" style="display:flex;flex-direction:column;justify-content:center">' +
    '<div class="authcard">' +
    '<div class="logoL">' + L + '</div>' +
    '<p class="mut mt14" style="text-align:center;font-family:var(--fd);letter-spacing:3px;font-size:13px;text-transform:uppercase">' + title + '</p>' +
    '<div class="mt20">' + form + '</div>' +
    '<div class="au-err" id="au-err"></div>' +
    '<div id="au-extra"></div>' +
    '<button class="btn btn-sm ripple mt20" style="width:100%;color:var(--dim)" data-act="auth-guest">Explorar sem conta (modo offline)</button>' +
    '</div></div>';
}
function auErr(msg){ const el = document.getElementById('au-err'); if(el) el.textContent = msg; }
function migrateGuestInto(){
  try{
    const raw = localStorage.getItem(LS_KEY);
    const cur = localStorage.getItem(stateKey());
    if(raw && !cur){ localStorage.setItem(stateKey(), raw); return true; }
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
  try{
    if(authMode === 'login'){
      const email = (document.getElementById('au-email').value||'').trim().toLowerCase();
      const pw = document.getElementById('au-pass').value || '';
      if(!email || !pw) return auErr('Preencha e-mail e senha.');
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
              authBusy = false; return auErr('E-mail ou senha incorretos.');
            }
          }
        }
      }
      const accs = getAccounts();
      const acc = accs[email];
      if(!acc) return auErr('Conta não encontrada. Crie uma conta ou entre como convidado.');
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
      if(!name) return auErr('Diga seu nome.');
      if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return auErr('E-mail inválido.');
      if(pw.length < 6) return auErr('A senha precisa de ao menos 6 caracteres.');
      if(pw !== pw2) return auErr('As senhas não conferem.');
      if(getFbCfg()){
        const fb = await fbInit();
        if(fb){
          try{
            const cred = await FB.a.createUserWithEmailAndPassword(FB.auth, email, pw);
            try{ await FB.a.updateProfile(cred.user, { displayName: name }); }catch(e){}
            await afterFbLogin(cred.user, name);
            return;
          }catch(e){
            const code = String(e && e.code || '');
            if(code.includes('email-already-in-use')) return auErr('Este e-mail já tem conta.');
          }
        }
      }
      const accs = getAccounts();
      if(accs[email]) return auErr('E-mail já cadastrado neste aparelho.');
      const salt = uid();
      accs[email] = { name: name, salt: salt, hash: await hashPw(pw, salt), createdAt: Date.now() };
      saveAccounts(accs);
      setSession({ mode:'local', email: email, name: name });
      const migrated = migrateGuestInto();
      enterApp();
      toast(migrated ? 'Conta criada — seus dados de convidado foram migrados.' : 'Conta criada. Bem-vindo à forja.', 'ok', 'flame');
    } else if(authMode === 'forgot'){
      const email = (document.getElementById('au-email').value||'').trim().toLowerCase();
      if(!email) return auErr('Digite seu e-mail.');
      if(getFbCfg()){
        const fb = await fbInit();
        if(fb){
          try{
            await FB.a.sendPasswordResetEmail(FB.auth, email);
            toast('E-mail de redefinição enviado. Confira sua caixa de entrada.', 'ok', 'mail');
            return;
          }catch(e){}
        }
      }
      const accs = getAccounts();
      if(!accs[email]) return auErr('Nenhuma conta local com este e-mail.');
      const code = String(Math.floor(100000 + Math.random()*900000));
      accs[email].resetCode = code;
      accs[email].resetExp = Date.now() + 10*60000;
      saveAccounts(accs);
      const ex = document.getElementById('au-extra');
      ex.innerHTML = '<div class="card acc mt14"><div class="lbl">Código de recuperação (modo local)</div>' +
        '<div class="h-display num mt8" style="font-size:34px;letter-spacing:6px;color:var(--acc)">' + code + '</div>' +
        '<p class="dim mt8" style="font-size:12px">Válido por 10 minutos. Guarde-o e defina sua nova senha.</p>' +
        '<button class="btn btn-pri ripple mt14" style="width:100%" data-act="auth-mode" data-arg="reset">Já tenho o código</button></div>';
    } else {
      const email = (document.getElementById('au-email').value||'').trim().toLowerCase();
      const code = (document.getElementById('au-code').value||'').trim();
      const pw = document.getElementById('au-pass').value || '';
      const accs = getAccounts();
      const acc = accs[email];
      if(!acc || !acc.resetCode) return auErr('Solicite um código primeiro.');
      if(Date.now() > (acc.resetExp||0)) return auErr('Código expirado. Solicite outro.');
      if(code !== acc.resetCode) return auErr('Código incorreto.');
      if(pw.length < 6) return auErr('Nova senha muito curta (mín. 6).');
      acc.hash = await hashPw(pw, acc.salt);
      delete acc.resetCode; delete acc.resetExp;
      saveAccounts(accs);
      toast('Senha redefinida. Entre com a nova senha.', 'ok');
      authMode = 'login'; renderAuth();
    }
  } finally { authBusy = false; }
}
async function googleLogin(){
  if(!getFbCfg()){
    modalHTML('<div class="sheet-grip"></div><div class="h-display h2">ENTRAR COM GOOGLE</div>' +
      '<p class="mut mt14" style="font-size:13.5px;line-height:1.6">O login com Google usa o Firebase Auth (gratuito). Para ativá-lo:</p>' +
      '<ol class="mut mt8" style="font-size:13px;line-height:1.7;padding-left:18px">' +
      '<li>Crie um projeto em <b>console.firebase.google.com</b></li>' +
      '<li>Ative <b>Authentication → Google</b> e <b>E-mail/senha</b></li>' +
      '<li>Adicione um app web e copie o objeto <b>firebaseConfig</b></li>' +
      '<li>Cole em <b>Perfil → Login com Google (Firebase)</b></li></ol>' +
      '<button class="btn btn-pri ripple mt20" style="width:100%" data-act="fb-set">Configurar agora</button>');
    return;
  }
  const fb = await fbInit();
  if(!fb){ toast('Não foi possível carregar o Firebase (verifique a conexão).', 'bad'); return; }
  try{
    const provider = new FB.a.GoogleAuthProvider();
    const res = await FB.a.signInWithPopup(FB.auth, provider);
    await afterFbLogin(res.user);
  }catch(e){
    toast('Login Google cancelado ou bloqueado.', 'bad');
  }
}
async function afterFbLogin(user, nameOverride){
  const name = nameOverride || user.displayName || (user.email || '').split('@')[0];
  setSession({ mode:'firebase', uid: user.uid, email: user.email || '', name: name });
  migrateGuestInto();
  load();
  enterApp();
  toast('Conectado como ' + name + '.', 'ok');
  fbSyncBestEffort();
}
function enterApp(){
  if(authEl){ authEl.remove(); authEl = null; }
  load();
  setTabbarIcons();
  go('home');
  if(!state.user.name) openOnboarding();
  else if(active){
    modalConfirm({ title:'Treino em andamento', msg:'Você deixou "' + active.name + '" aberto. Retomar de onde parou?', ok:'Retomar treino' })
      .then(function(yes){
        if(yes) openActiveScreen();
        else { active = null; state.active = null; save(); }
      });
  }
  checkAchievements(true);
  save();
}

/* ---------- FIREBASE (opcional) ---------- */
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
    toast('Falha ao carregar o Firebase.', 'bad');
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
        save(); go('home');
        toast('Dados restaurados da nuvem.', 'ok', 'cloud');
      } else {
        await fbUpload();
      }
    } else {
      await fbUpload();
    }
  }catch(e){}
}
async function fbUpload(){
  if(!FB || !session || session.mode !== 'firebase') return false;
  try{
    let payload = JSON.stringify(state);
    if(payload.length > 900000){
      const light = JSON.parse(payload);
      (light.posts||[]).forEach(function(p){ p.photo = null; });
      payload = JSON.stringify(light);
      toast('Sincronizado sem as fotos (limite da nuvem).', 'ai');
    }
    await FB.f.setDoc(FB.f.doc(FB.db, 'forjaUsers', session.uid), { payload: payload, updatedAt: Date.now() });
    return true;
  }catch(e){ return false; }
}
async function fbFeedPull(){
  if(!FB || !session || session.mode !== 'firebase') return;
  try{
    const q = FB.f.query(FB.f.collection(FB.db, 'forjaPosts'), FB.f.orderBy('at', 'desc'), FB.f.limit(30));
    const snap = await FB.f.getDocs(q);
    remoteFeedCache = [];
    snap.forEach(function(d){
      const p = d.data();
      if(p.uid !== session.uid) remoteFeedCache.push({ id: d.id, at: p.at||0, name: p.name||'Atleta', text: p.text||'', photo: p.photo||null, likes: p.likes||0, liked: false, own: false, w: p.w||null });
    });
    if(curView === 'feed') RENDER.feed();
  }catch(e){}
}
async function fbPostPush(post){
  if(!FB || !session || session.mode !== 'firebase') return;
  try{
    const light = Object.assign({}, post);
    if(light.photo && light.photo.length > 400000) light.photo = null;
    await FB.f.addDoc(FB.f.collection(FB.db, 'forjaPosts'), {
      uid: session.uid, name: post.name, text: post.text||'', photo: light.photo, w: post.w||null, at: post.at, likes: 0
    });
  }catch(e){}
}
