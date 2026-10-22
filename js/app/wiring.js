const ACTIONS = {
  'nav': function(d){ go(d.arg); },
  'screen-close': function(){ closeScreen(); },
  'modal-close': function(){ closeModal(); },

  'auth-mode': function(d){ authMode = d.arg; renderAuth(); },
  'auth-submit': function(){ authSubmit(); },
  'auth-google': function(){ googleLogin(); },
  'google-instant-login': function(){ processInstantGoogleLogin(); },
  'auth-guest': function(){ setSession({ mode:'guest' }); enterApp(); },
  'auth-eye': function(){ const p = document.getElementById('au-pass'); if(p) p.type = p.type === 'password' ? 'text' : 'password'; },

  'ob-save': function(){ saveOnboarding(); },

  'w-new': function(){ openEditor(null); },
  'w-edit': function(d){ openEditor(d.arg); },
  'w-del': function(d){
    const w = state.workouts.find(function(x){ return x.id === d.arg; });
    if(!w) return;
    modalConfirm({ title:'Excluir ficha', msg:'"' + w.name + '" será removida. O histórico é mantido.', ok:'Excluir', danger:true })
      .then(function(yes){
        if(yes){ state.workouts = state.workouts.filter(function(x){ return x.id !== d.arg; });
          save(); toast('Ficha excluída.', 'ok'); RENDER.workouts(); }
      });
  },
  'w-start': function(d){ startSession(d.arg); },
  'w-tab': function(d){ workoutViewTab = d.arg; RENDER.workouts(); },
  'w-preset-view': function(d){ openPresetDetails(d.arg); },
  'w-preset-import': function(d){ importPresetRoutine(d.arg); },
  'w-preset-import-single': function(d){ importPresetSingle(d.arg); },
  'lib-browse': function(){ browseLibrary(false); },

  'ai-open': function(){ openAIScreen(); },
  'ai-gen': function(){ aiGenerate(); },
  'ai-saveplan': function(){ aiSavePlan(); },
  'ed-ai-open': function(){ openEditorAIAssistant(); },
  'ed-ai-generate': function(){ runEditorAIGeneration(); },
  'ed-ai-apply': function(){ applyAISuggestions(); },

  'ed-split': function(d){ editing.split = d.arg; renderEditorInto(editorEl); },
  'ed-add': function(){ browseLibrary(true); },
  'ed-save': function(){
    if(!editing) return;
    if(!editing.name.trim()){ toast('Dê um nome à ficha.', 'bad'); return; }
    if(!editing.ex.length){ toast('Adicione ao menos 1 exercício.', 'bad'); return; }
    if(editing.ex.some(function(x){ return !x.sets.length; })){ toast('Todo exercício precisa de ao menos 1 série.', 'bad'); return; }
    editing.name = editing.name.trim();
    if(editing.id){
      const i = state.workouts.findIndex(function(x){ return x.id === editing.id; });
      state.workouts[i] = JSON.parse(JSON.stringify(editing));
    } else state.workouts.push(JSON.parse(JSON.stringify(editing)));
    save(); editing = null;
    if(editorEl){ closeScreen(editorEl); editorEl = null; }
    toast('Ficha salva.', 'ok'); RENDER.workouts();
  },
  'ed-ex-del': function(d){ editing.ex.splice(+d.arg, 1); renderEditorInto(editorEl); },
  'ed-ex-move': function(d){
    const parts = d.arg.split(':'), from = +parts[0];
    const to = parts[1] === 'up' ? from-1 : from+1;
    if(to < 0 || to >= editing.ex.length) return;
    const x = editing.ex.splice(from, 1)[0];
    editing.ex.splice(to, 0, x);
    renderEditorInto(editorEl);
  },
  'ed-rpe': function(d){
    const parts = d.arg.split(':'), x = editing.ex[+parts[0]];
    if(!x) return;
    x.rpe = Math.min(10, Math.max(5, x.rpe + (+parts[1])));
    renderEditorInto(editorEl);
  },
  'ed-rest': function(d){ openRestPicker('ed', +d.arg); },
  'ed-set-type': function(d){
    const parts = d.arg.split(':'), x = editing.ex[+parts[0]];
    if(!x || !x.sets[+parts[1]]) return;
    x.sets[+parts[1]].type = nextType(x.sets[+parts[1]].type);
    renderEditorInto(editorEl);
  },
  'ed-set-rep': function(d){
    const parts = d.arg.split(':'), x = editing.ex[+parts[0]];
    if(!x || !x.sets[+parts[1]]) return;
    x.sets[+parts[1]].reps = Math.min(30, Math.max(1, x.sets[+parts[1]].reps + (+parts[2])));
    renderEditorInto(editorEl);
  },
  'ed-set-add': function(d){
    const x = editing.ex[+d.arg]; if(!x) return;
    const last = x.sets[x.sets.length-1];
    x.sets.push({ type: last ? last.type : 'work', reps: last ? last.reps : 10 });
    renderEditorInto(editorEl);
  },
  'ed-set-del': function(d){
    const parts = d.arg.split(':'), x = editing.ex[+parts[0]];
    if(!x) return;
    x.sets.splice(+parts[1], 1);
    renderEditorInto(editorEl);
  },
  'rest-apply': function(d){
    if(!restCtx) return;
    const s = +d.arg;
    if(restCtx.ctx === 'ed' && editing && editing.ex[restCtx.i]) editing.ex[restCtx.i].rest = s;
    if(restCtx.ctx === 'ac' && active && active.ex[restCtx.i]){ active.ex[restCtx.i].rest = s; state.active = active; save(); }
    closeModal();
    if(restCtx.ctx === 'ed') renderEditorInto(editorEl);
    if(restCtx.ctx === 'ac' && activeScreenEl) renderActiveInto(activeScreenEl);
    toast('Descanso: ' + s + 's', 'ok', 'clock');
  },

  'lib-filter': function(d){
    libFilter = d.arg;
    const c = document.getElementById('lib-chips'); if(c) c.innerHTML = libChipsHTML();
    renderLibList();
  },
  'lib-add': function(d){
    if(!editing) return;
    editing.ex.push({ exId: d.arg, rpe: 8, rest: 90, sets: [{ type:'work', reps: 10 }] });
    const sc = document.getElementById('stack').lastElementChild;
    if(sc) closeScreen(sc);
    if(editorEl) renderEditorInto(editorEl);
    toast('Exercício adicionado à ficha.', 'ok');
  },
  'lib-new': function(){
    openCustomExerciseModal();
  },
  'lib-view-ex': function(d){
    openExerciseDetail(d.arg);
  },
  'lib-del-custom': function(d){
    deleteCustomExercise(d.arg);
  },
  'cex-save': function(){
    saveCustomExercise();
  },
  'cex-img-clear': function(){
    pendingCustomExImg = '';
    renderCustomExPreview();
  },

  'ac-toggle-set': function(d){
    const parts = d.arg.split(':');
    toggleSet(+parts[0], +parts[1]);
  },
  'ac-set-type': function(d){
    if(!active) return;
    const parts = d.arg.split(':'), ex = active.ex[+parts[0]];
    if(!ex || !ex.sets[+parts[1]]) return;
    ex.sets[+parts[1]].type = nextType(ex.sets[+parts[1]].type);
    state.active = active; save();
    renderActiveInto(activeScreenEl);
  },
  'ac-adj': function(d){
    if(!active) return;
    const parts = d.arg.split(':'), f = parts[0], i = +parts[1], j = +parts[2], delta = +parts[3];
    const ex = active.ex[i]; if(!ex) return;
    const s = ex.sets[j]; if(!s) return;
    const key = f === 'w' ? 'w' : 'r';
    const step = f === 'w' ? 2.5 : 1;
    const next = parseNum(s[key]) + delta*step;
    s[key] = next > 0 ? +next.toFixed(1) : '';
    state.active = active; save();
    renderActiveInto(activeScreenEl);
  },
  'ac-rest': function(d){ openRestPicker('ac', +d.arg); },
  'ac-apply-suggest': function(d){
    if(!active) return;
    const ex = active.ex[+d.arg]; if(!ex) return;
    const s = coachSuggestionFor(ex.exId, ex.sets[0] ? ex.sets[0].r : 10);
    if(!s) return;
    ex.sets.forEach(function(st){ if(!st.done){ st.w = s.w; st.r = s.reps; } });
    state.active = active; save();
    renderActiveInto(activeScreenEl);
    toast('Sugestão da IA aplicada nas séries abertas.', 'ai');
  },
  'ac-finish': function(){ finishSession(); },
  'ac-cancel': function(){
    modalConfirm({ title:'Abandonar treino', msg:'As séries desta sessão serão descartadas. Tem certeza?', ok:'Abandonar', danger:true })
      .then(function(yes){
        if(yes){
          active = null; state.active = null; save(); stopAcTicker();
          if(activeScreenEl){ activeScreenEl.remove(); activeScreenEl = null; }
          document.getElementById('trainpill').classList.remove('on');
          Timer.stop(); Timer.closeFull();
          go('home');
          toast('Treino descartado.', 'ok');
        }
      });
  },
  'ac-minimize': function(){ minimizeActive(); },
  'ac-restore': function(){ openActiveScreen(); },

  'rest-preset': function(d){ Timer.start(+d.arg); },
  'rest-add': function(){ Timer.add(30); },
  'rest-skip': function(){ Timer.skip(); },
  'rest-close': function(){ Timer.closeFull(); Timer.showPill(); },

  'coach-open': function(){ openCoach(); },
  'coach-stag': function(){
    const zone = document.getElementById('stag-zone');
    if(zone){ renderStagInto(zone, stagnationAnalysis()); zone.scrollIntoView({ behavior:'smooth' }); }
  },
  'coach-ai': function(){ coachGemini(); },

  'prof-edit': function(){ openProfileEditor(); },
  'prof-save': function(){ saveProfileFromModal(); },
  'set-sound': function(){ state.settings.sound = !state.settings.sound; save(); RENDER.profile(); },
  'set-vib': function(){ state.settings.vibrate = !state.settings.vibrate; save(); RENDER.profile(); },
  'gem-set': function(){ openGemSettings(); },
  'gem-test': function(){ gemTest(); },
  'gem-save': function(){
    state.settings.gemini = document.getElementById('gem-key').value.trim();
    save(); closeModal();
    toast(state.settings.gemini ? 'Chave Gemini salva.' : 'Chave removida.', 'ok');
    if(RENDER[curView]) RENDER[curView]();
  },
  'strava-set': function(){ openStravaSettings(); },
  'strava-auto': function(){
    state.settings.stravaAuto = !state.settings.stravaAuto; save();
    const b = document.querySelector('#modallayer .chip');
    if(b){ b.classList.toggle('on', state.settings.stravaAuto); b.textContent = state.settings.stravaAuto ? 'Sim' : 'Não'; }
  },
  'strava-save': function(){
    state.settings.strava = document.getElementById('strava-key').value.trim();
    save(); closeModal();
    toast(state.settings.strava ? 'Strava conectado.' : 'Strava desconectado.', 'ok');
    if(RENDER[curView]) RENDER[curView]();
  },
  'fb-set': function(){ openFbSettings(); },
  'fb-save': function(){
    try{
      const cfg = JSON.parse(document.getElementById('fb-cfg').value);
      if(!cfg.apiKey || !cfg.projectId) throw new Error('inválido');
      localStorage.setItem(LS_FB, JSON.stringify(cfg));
      closeModal();
      toast('Firebase configurado. Saia e use "Entrar com Google".', 'ok', 'cloud');
    }catch(e){ toast('Config inválida — cole o JSON completo do firebaseConfig.', 'bad'); }
  },
  'fb-disc': function(){
    localStorage.removeItem(LS_FB); FB = null;
    closeModal(); toast('Firebase desconectado.', 'ok');
    if(RENDER[curView]) RENDER[curView]();
  },
  'acc-sync': async function(){
    if(!FB || !session || session.mode !== 'firebase'){ toast('Conecte-se com o Firebase primeiro.', 'bad'); return; }
    toast('Sincronizando com a nuvem...', 'ai', 'sync');
    const ok = await fbUpload();
    toast(ok ? 'Dados enviados para a nuvem.' : 'Falha na sincronização.', ok?'ok':'bad', ok?'cloud':'x');
  },
  'logout': function(){
    modalConfirm({ title:'Sair da conta', msg:'Seus dados permanecem salvos neste aparelho e na nuvem (se conectada).', ok:'Sair' })
      .then(function(yes){ if(yes){ setSession(null); location.reload(); } });
  },
  'install': function(){
    if(deferredPrompt){
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(function(r){
        if(r && r.outcome === 'accepted') toast('FORJA instalado. Bora treinar.', 'ok');
        deferredPrompt = null; RENDER.profile();
      }).catch(function(){ deferredPrompt = null; RENDER.profile(); });
    } else toast('Use o menu do navegador: "Adicionar à tela inicial".', 'ai');
  },
  'reset-data': function(){
    modalConfirm({ title:'Apagar tudo', msg:'Fichas, histórico, records, conquistas, posts e perfil serão removidos deste aparelho e desta conta.', ok:'Apagar tudo', danger:true })
      .then(function(yes){ if(yes){ localStorage.removeItem(stateKey()); localStorage.removeItem(LS_SESSION); location.reload(); } });
  },

  'log-detail': function(d){ openLogDetail(d.arg); },
  'rep-open': function(){
    const sc = document.getElementById('stack').lastElementChild;
    if(sc && sc.dataset.nodismiss === '1'){ postLogRef = postLogRef || state.logs[state.logs.length-1]; }
    openComposer(postLogRef);
  },
  'rep-share': function(){ shareReport(); },
  'rep-strava': async function(){
    const log = postLogRef || state.logs[state.logs.length-1];
    if(!log || !state.settings.strava) return;
    toast('Enviando ao Strava...', 'ai', 'bolt2');
    const ok = await stravaPost(log);
    if(ok) toast('Atividade publicada no Strava.', 'ok', 'bolt2');
    else { toast('Strava bloqueou o envio direto — abrindo compartilhamento.', 'bad'); shareReport(); }
  },
  'rep-close': function(){
    const sc = document.getElementById('stack').lastElementChild;
    if(sc) sc.remove();
    go('home');
  },
  'post-send': function(){ sendPost(); },
  'post-photo-clear': function(){
    postPhoto = null;
    const pv = document.getElementById('photo-prev'); if(pv) pv.innerHTML = '';
    const z = document.getElementById('photo-zone'); if(z) z.style.display = '';
  },
  'post-like': function(d){
    const p = state.posts.find(function(x){ return x.id === d.arg; }) ||
      remoteFeedCache.find(function(x){ return x.id === d.arg; });
    if(!p) return;
    p.liked = !p.liked;
    p.likes = Math.max(0, (p.likes||0) + (p.liked ? 1 : -1));
    save();
    if(p.liked){ buzz([30]); }
    RENDER.feed();
  },
  'post-del': function(d){
    state.posts = state.posts.filter(function(x){ return x.id !== d.arg; });
    save(); RENDER.feed();
    toast('Post removido.', 'ok');
  },
  'feed-new': function(){ openComposer(null); },
  'feed-friends': function(){ openFriends(); },
  'friend-add': function(){
    const email = (document.getElementById('fr-email').value||'').trim().toLowerCase();
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){ toast('E-mail inválido.', 'bad'); return; }
    if(state.friends.some(function(f){ return f.email === email; })){ toast('Já é seu amigo.', 'bad'); return; }
    state.friends.push({ email: email, name: email.split('@')[0].replace(/[._]/g,' ').replace(/\b\w/g, function(c){ return c.toUpperCase(); }) });
    save();
    const sc = document.getElementById('stack').lastElementChild;
    if(sc) sc.remove();
    openFriends();
    toast('Amigo adicionado.', 'ok', 'users');
  },
  'friend-del': function(d){
    state.friends.splice(+d.arg, 1); save();
    const sc = document.getElementById('stack').lastElementChild;
    if(sc) sc.remove();
    openFriends();
  },

  'per-range': function(d){ volRange = d.arg; RENDER.progress(); },
  'nutr-mode': function(d){
    const auto = calcNutrition();
    state.nutrition.custom = d.arg === 'custom'
      ? (state.nutrition.custom || (auto ? { p:auto.p, c:auto.c, f:auto.f } : { p:150, c:200, f:60 }))
      : null;
    save(); RENDER.nutrition();
  },
  'nutr-tab': function(d){
    nutrTab = d.arg;
    RENDER.nutrition();
  },
  'nutr-toggle-micros': function(){
    toggleMicros();
  },
  'nutr-man-save': function(){
    saveManualMeal();
  },
  'nutr-ai-analyze': function(){ runNutritionAIAnalysis(); },
  'nutr-meal-save': function(){ saveLastAnalysisToDiary(); },
  'nutr-chip': function(d){
    const inp = document.getElementById('nutr-ai-input');
    if(inp){ inp.value = d.arg; runNutritionAIAnalysis(); }
  },
  'nutr-meal-del': function(d){
    state.nutrition.meals = (state.nutrition.meals||[]).filter(function(m){ return m.id !== d.arg; });
    save(); RENDER.nutrition();
    toast('Refeição removida do diário.', 'ok');
  },
  'nutr-meals-clear': function(){
    modalConfirm({ title:'Limpar refeições de hoje', msg:'Deseja zerar as refeições consumidas hoje?', ok:'Limpar' })
      .then(function(yes){
        if(yes){
          const startOfDay = new Date(); startOfDay.setHours(0,0,0,0);
          state.nutrition.meals = (state.nutrition.meals||[]).filter(function(m){ return m.at < startOfDay.getTime(); });
          save(); RENDER.nutrition();
          toast('Diário de hoje zerado.', 'ok');
        }
      });
  }
};

const INPUTS = {
  'set-w': function(el){
    if(active){ const ex = active.ex[+el.dataset.ex];
      if(ex && ex.sets[+el.dataset.set]) ex.sets[+el.dataset.set].w = el.value; }
  },
  'set-r': function(el){
    if(active){ const ex = active.ex[+el.dataset.ex];
      if(ex && ex.sets[+el.dataset.set]) ex.sets[+el.dataset.set].r = el.value; }
  },
  'ed-name': function(el){ if(editing) editing.name = el.value; },
  'lib-search': function(el){ libQuery = el.value; renderLibList(); },
  'macro-p': function(el){ macroInput(el, 'p'); },
  'macro-c': function(el){ macroInput(el, 'c'); },
  'macro-f': function(el){ macroInput(el, 'f'); },
  'cex-url': function(el){ handleCustomExURL(el.value); }
};
function macroInput(el, key){
  if(!state.nutrition.custom) return;
  state.nutrition.custom[key] = +el.value;
  save();
  const lb = document.getElementById('mg-' + key);
  if(lb) lb.textContent = el.value + 'g';
  const c = state.nutrition.custom;
  const kcal = c.p*4 + c.c*4 + c.f*9;
  const tot = document.getElementById('nutr-total');
  if(tot) tot.textContent = fmtN(kcal) + ' kcal';
  const cv = document.getElementById('donut-cv');
  if(cv) drawDonut(cv, [{k:'p',v:c.p},{k:'c',v:c.c},{k:'f',v:c.f}], fmtN(kcal), 'kcal / dia');
}
const CHANGES = {
  'ex-select': function(el){ chartExSel = el.value; RENDER.progress(); },
  'cex-file': function(el){ handleCustomExFile(el); },
  'post-photo': function(el){
    const file = el.files && el.files[0];
    if(!file) return;
    resizeImage(file, 900, .8).then(function(data){
      postPhoto = data;
      const pv = document.getElementById('photo-prev');
      if(pv) pv.innerHTML = '<div class="card" style="padding:10px"><img src="' + data + '" style="width:100%;border-radius:10px;display:block">' +
        '<button class="btn btn-ghost btn-sm ripple mt8" style="width:100%" data-act="post-photo-clear">' + icon('trash') + ' Remover foto</button></div>';
      const z = document.getElementById('photo-zone'); if(z) z.style.display = 'none';
    }).catch(function(){ toast('Não foi possível carregar a imagem.', 'bad'); });
  }
};

document.addEventListener('click', function(e){
  const el = e.target.closest('[data-act]');
  if(!el) return;
  const fn = ACTIONS[el.dataset.act];
  if(fn) fn(el.dataset, el, e);
});
document.addEventListener('input', function(e){
  const el = e.target.closest('[data-inp]');
  if(el && INPUTS[el.dataset.inp]) INPUTS[el.dataset.inp](el);
});
document.addEventListener('change', function(e){
  const el = e.target.closest('[data-chg]');
  if(el && CHANGES[el.dataset.chg]) CHANGES[el.dataset.chg](el);
});
document.addEventListener('click', function(e){
  const zone = e.target.closest('#photo-zone');
  if(zone){
    const inp = zone.parentElement.querySelector('input[type="file"]');
    if(inp) inp.click();
  }
});
document.addEventListener('pointerdown', function(e){
  const el = e.target.closest('.btn, .ripple, .tab');
  if(!el) return;
  const r = el.getBoundingClientRect(), d = Math.max(r.width, r.height);
  const ink = document.createElement('span');
  ink.className = 'ripple-ink';
  ink.style.cssText = 'width:'+d+'px;height:'+d+'px;left:'+(e.clientX-r.left-d/2)+'px;top:'+(e.clientY-r.top-d/2)+'px';
  el.appendChild(ink);
  setTimeout(function(){ ink.remove(); }, 520);
}, { passive:true });
document.addEventListener('pointerdown', ensureAudio, { once:true });
