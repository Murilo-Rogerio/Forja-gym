const LS_KEY = 'forja-state-v1', LS_SESSION = 'forja-session', LS_ACCOUNTS = 'forja-accounts', LS_FB = 'forja-fbconfig';
let state = null, session = null, FB = null, active = null;

function defaultState(){
  return {
    v: 5,
    user: { name:'', sex:'m', age:'', weight:'', height:'', activity:'moderado', goal:'manter', xp:0, avatar:'', createdAt:Date.now() },
    workouts: [],
    library: LIB.map(function(l){ return Object.assign({}, l); }),
    logs: [],
    records: {},
    ach: {},
    nutrition: { custom: null, meals: [], lastAnalysis: null },
    habits: { date: new Date().toISOString().slice(0,10), water: 0, waterTarget: 3500, creatine: false, sleep: 7.5 },
    settings: { sound: true, vibrate: true, voiceCoach: true, gemini: '', strava: '', stravaAuto: false },
    active: null,
    demo: false,
    posts: [],
    friends: [],
    feedSeeded: false,
    updatedAt: 0
  };
}

function migrateState(s){
  if(!s.v) s.v = 1;
  if(s.v < 2){
    (s.workouts||[]).forEach(function(w){
      (w.ex||[]).forEach(function(e){
        if(typeof e.sets === 'number'){
          const n = e.sets, reps = e.repsTarget || 10;
          e.sets = [];
          for(let i=0;i<n;i++) e.sets.push({ type:'work', reps: reps });
          delete e.repsTarget;
        }
      });
    });
    (s.logs||[]).forEach(function(l){
      (l.ex||[]).forEach(function(e){
        (e.sets||[]).forEach(function(st){ if(!st.type) st.type='work'; });
      });
    });
    if(s.active){
      (s.active.ex||[]).forEach(function(e){
        if(typeof e.sets === 'number'){
          const n = e.sets, reps = e.targetReps || 10, rest = e.rest || 90;
          e.sets = [];
          for(let i=0;i<n;i++) e.sets.push({ type:'work', reps: reps, rest: rest, w:'', r:'', rpe: e.rpe||8, done:false });
          delete e.targetReps;
        } else {
          (e.sets||[]).forEach(function(st){ if(!st.type) st.type='work'; });
        }
      });
    }
  }

  // Versão 3: merge de novos exercícios da biblioteca e suporte a refeições/micronutrientes
  if(s.v < 3){
    s.library = s.library || [];
    LIB.forEach(function(libEx){
      if(!s.library.some(function(e){ return e.id === libEx.id; })){
        s.library.push(Object.assign({}, libEx));
      }
    });
    s.v = 3;
  }

  // Versão 4: Remoção completa de dados de exemplo/demonstração.
  // Zera qualquer histórico fabricado anterior para manter o app 100% autêntico e funcional.
  if(s.v < 4 || s.demo){
    if(s.demo){
      s.logs = [];
      s.records = {};
      s.ach = {};
      s.user.xp = 0;
      s.posts = [];
      s.demo = false;
    }
    s.v = 4;
  }

  // Versão 5: merge de novos exercícios pré-cadastrados comuns (90+ exercícios com equipamento e descrição)
  if(s.v < 5){
    s.library = s.library || [];
    LIB.forEach(function(libEx){
      const existing = s.library.find(function(e){ return e.id === libEx.id; });
      if(!existing){
        s.library.push(Object.assign({}, libEx));
      } else {
        if(!existing.desc && libEx.desc) existing.desc = libEx.desc;
        if(!existing.equip && libEx.equip) existing.equip = libEx.equip;
      }
    });
    s.v = 5;
  }

  const todayStr = new Date().toISOString().slice(0,10);
  s.habits = Object.assign({ date: todayStr, water: 0, waterTarget: 3500, creatine: false, sleep: 7.5 }, s.habits || {});
  if(s.habits.date !== todayStr){
    s.habits.date = todayStr;
    s.habits.water = 0;
    s.habits.creatine = false;
  }
  s.settings = Object.assign({ sound:true, vibrate:true, voiceCoach:true, gemini:'', strava:'', stravaAuto:false }, s.settings||{});
  s.nutrition = s.nutrition || { custom:null, meals:[], lastAnalysis:null };
  if(!Array.isArray(s.nutrition.meals)) s.nutrition.meals = [];
  s.posts = s.posts || [];
  s.friends = s.friends || [];
  return s;
}

function stateKey(){
  if(!session || session.mode === 'guest') return LS_KEY;
  return LS_KEY + ':' + session.mode + ':' + (session.uid || session.email);
}

function save(){
  if(!state) return;
  state.updatedAt = Date.now();
  try{
    localStorage.setItem(stateKey(), JSON.stringify(state));
  } catch(e){
    toast('Armazenamento cheio — remova fotos antigas do feed.', 'bad');
  }
}

function load(){
  try{
    const raw = localStorage.getItem(stateKey());
    state = raw ? migrateState(Object.assign(defaultState(), JSON.parse(raw))) : defaultState();
  }catch(e){
    state = defaultState();
  }
  active = state.active || null;
}

function getSession(){
  try{ return JSON.parse(localStorage.getItem(LS_SESSION)) || null; }catch(e){ return null; }
}
function setSession(s){
  session = s;
  if(s) localStorage.setItem(LS_SESSION, JSON.stringify(s));
  else localStorage.removeItem(LS_SESSION);
}
function getAccounts(){
  try{ return JSON.parse(localStorage.getItem(LS_ACCOUNTS)) || {}; }catch(e){ return {}; }
}
function saveAccounts(a){
  localStorage.setItem(LS_ACCOUNTS, JSON.stringify(a));
}
function getFbCfg(){
  try{ return JSON.parse(localStorage.getItem(LS_FB)) || null; }catch(e){ return null; }
}
function libById(id){
  return state.library.find(function(e){ return e.id === id; }) || null;
}
