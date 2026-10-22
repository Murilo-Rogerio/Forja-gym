/* ==========================================================================
   FORJA — Integração Supabase Cloud (Auth, Feed, Workouts & Sync)
   Projeto: janbrprcrbjseutnxiko (https://janbrprcrbjseutnxiko.supabase.co)
   Offline-first: funciona 100% no aparelho e sincroniza na nuvem quando online
   ========================================================================== */

const LS_SB_CFG = 'forja_supabase_cfg_v1';
const DEFAULT_SB_URL = 'https://janbrprcrbjseutnxiko.supabase.co';
const DEFAULT_SB_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphbmJycHJjcmJqc2V1dG54aWtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2OTc1MzEsImV4cCI6MjEwODI3MzUzMX0.K9waeCJsEeYMXCBvXQ7iUCcVslQ82-1Z8qRbzPG5kaY';

let sbClientInstance = null;
let sbRealtimeSub = null;

function getSupabaseConfig(){
  try{
    const raw = localStorage.getItem(LS_SB_CFG);
    if(raw){
      const parsed = JSON.parse(raw);
      if(parsed && parsed.url && parsed.anonKey) return parsed;
    }
  }catch(e){}
  return {
    url: DEFAULT_SB_URL,
    anonKey: DEFAULT_SB_ANON_KEY
  };
}

function saveSupabaseConfig(cfg){
  try{
    if(!cfg){
      localStorage.removeItem(LS_SB_CFG);
    } else {
      localStorage.setItem(LS_SB_CFG, JSON.stringify(cfg));
    }
    sbClientInstance = null; // Re-instancia no próximo uso
  }catch(e){}
}

function sbGetClient(){
  if(sbClientInstance) return sbClientInstance;
  if(typeof window !== 'undefined' && window.supabase && typeof window.supabase.createClient === 'function'){
    const cfg = getSupabaseConfig();
    try{
      sbClientInstance = window.supabase.createClient(cfg.url, cfg.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storageKey: 'forja_sb_auth_token'
        }
      });
      return sbClientInstance;
    }catch(err){
      console.warn('Erro ao inicializar Supabase client:', err);
      return null;
    }
  }
  return null;
}

function sbIsAvailable(){
  return Boolean(sbGetClient());
}

/* ==========================================================================
   AUTENTICAÇÃO SUPABASE
   ========================================================================== */

async function sbSignUp(email, password, name){
  const client = sbGetClient();
  if(!client) return { error: { message: 'Biblioteca Supabase indisponível no momento. Verifique sua conexão.' } };
  
  try{
    const res = await client.auth.signUp({
      email: email,
      password: password,
      options: {
        data: { name: name }
      }
    });

    if(res.error) return { error: res.error };

    const user = res.data && res.data.user;
    if(user && user.id){
      // Tenta criar o perfil diretamente
      try{
        await client.from('profiles').upsert({
          id: user.id,
          name: name || user.email.split('@')[0],
          xp: 0,
          weight: (state && state.user && state.user.weight) || 70,
          height: (state && state.user && state.user.height) || 175,
          created_at: new Date().toISOString()
        });
      }catch(errProfile){
        console.warn('Erro ao criar perfil no signup:', errProfile);
      }
    }

    return { data: res.data };
  }catch(err){
    return { error: err };
  }
}

async function sbSignIn(email, password){
  const client = sbGetClient();
  if(!client) return { error: { message: 'Biblioteca Supabase indisponível. Verifique sua conexão.' } };

  try{
    const res = await client.auth.signInWithPassword({
      email: email,
      password: password
    });

    if(res.error) return { error: res.error };
    return { data: res.data };
  }catch(err){
    return { error: err };
  }
}

async function sbSignInWithGoogle(){
  const client = sbGetClient();
  if(!client) return { error: { message: 'Supabase offline ou indisponível.' } };

  try{
    const redirectTo = window.location.origin + window.location.pathname;
    const res = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo
      }
    });

    if(res.error) return { error: res.error };
    return { data: res.data };
  }catch(err){
    return { error: err };
  }
}

async function sbResetPassword(email){
  const client = sbGetClient();
  if(!client) return { error: { message: 'Supabase indisponível.' } };

  try{
    const redirectTo = window.location.origin + window.location.pathname;
    const res = await client.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo
    });
    if(res.error) return { error: res.error };
    return { data: res.data };
  }catch(err){
    return { error: err };
  }
}

async function sbSignOut(){
  const client = sbGetClient();
  if(client){
    try{
      await client.auth.signOut();
    }catch(e){}
  }
}

async function sbGetSession(){
  const client = sbGetClient();
  if(!client) return null;
  try{
    const res = await client.auth.getSession();
    return res && res.data ? res.data.session : null;
  }catch(e){
    return null;
  }
}

/* ==========================================================================
   SINCRONIZAÇÃO DE PERFIL, FICHAS E HISTÓRICO
   ========================================================================== */

async function sbSyncProfile(){
  const client = sbGetClient();
  if(!client || !session || !session.uid) return false;

  try{
    const u = state.user;
    const payload = {
      id: session.uid,
      name: u.name || session.name || 'Atleta',
      xp: u.xp || 0,
      weight: u.weight || null,
      height: u.height || null
    };

    const res = await client.from('profiles').upsert(payload);
    return !res.error;
  }catch(e){
    console.warn('Erro ao sincronizar perfil Supabase:', e);
    return false;
  }
}

async function sbSyncWorkouts(){
  const client = sbGetClient();
  if(!client || !session || !session.uid) return false;

  try{
    // 1. Enviar fichas locais para o Supabase
    const localWorkouts = state.workouts || [];
    if(localWorkouts.length > 0){
      const rows = localWorkouts.map(function(w){
        return {
          id: String(w.id),
          user_id: session.uid,
          name: w.name || 'Treino',
          split: w.split || '',
          exercises: w.ex || [],
          updated_at: new Date().toISOString()
        };
      });

      const res = await client.from('workouts').upsert(rows, { onConflict: 'id' });
      if(res.error) console.warn('Aviso upsert workouts:', res.error);
    }

    // 2. Baixar fichas do Supabase (para merge em múltiplos aparelhos)
    const remote = await client.from('workouts').select('*').eq('user_id', session.uid);
    if(remote.data && Array.isArray(remote.data)){
      let changed = false;
      remote.data.forEach(function(rw){
        const exists = state.workouts.some(function(lw){ return String(lw.id) === String(rw.id); });
        if(!exists){
          state.workouts.push({
            id: rw.id,
            name: rw.name,
            split: rw.split,
            ex: rw.exercises || []
          });
          changed = true;
        }
      });
      if(changed) save();
    }
    return true;
  }catch(e){
    console.warn('Erro ao sincronizar treinos Supabase:', e);
    return false;
  }
}

async function sbSyncLogs(){
  const client = sbGetClient();
  if(!client || !session || !session.uid) return false;

  try{
    // 1. Enviar treinos concluídos locais
    const localLogs = state.logs || [];
    if(localLogs.length > 0){
      // Envia os 50 mais recentes para manter eficiência
      const recent = localLogs.slice(-50).map(function(l){
        return {
          id: String(l.id),
          user_id: session.uid,
          name: l.name || 'Treino Concluído',
          volume: Number(l.volume) || 0,
          duration: Number(l.duration) || 0,
          reps: Number(l.totalReps) || 0,
          pr_count: Number(l.prCount) || 0,
          groups: l.groups || {},
          exercises: l.ex || [],
          created_at: new Date(l.date || Date.now()).toISOString()
        };
      });

      const res = await client.from('workout_logs').upsert(recent, { onConflict: 'id' });
      if(res.error) console.warn('Aviso upsert workout_logs:', res.error);
    }

    // 2. Baixar logs do Supabase
    const remote = await client.from('workout_logs').select('*').eq('user_id', session.uid).order('created_at', { ascending: true }).limit(100);
    if(remote.data && Array.isArray(remote.data)){
      let changed = false;
      remote.data.forEach(function(rl){
        const exists = state.logs.some(function(ll){ return String(ll.id) === String(rl.id); });
        if(!exists){
          state.logs.push({
            id: rl.id,
            name: rl.name,
            date: new Date(rl.created_at).getTime(),
            volume: Number(rl.volume) || 0,
            duration: Number(rl.duration) || 0,
            totalReps: Number(rl.reps) || 0,
            prCount: Number(rl.pr_count) || 0,
            groups: rl.groups || {},
            ex: rl.exercises || []
          });
          changed = true;
        }
      });
      if(changed){
        state.logs.sort(function(a,b){ return a.date - b.date; });
        rebuildRecords();
        checkAchievements(true);
        save();
      }
    }
    return true;
  }catch(e){
    console.warn('Erro ao sincronizar histórico Supabase:', e);
    return false;
  }
}

async function sbSyncAll(showToast){
  if(!session || session.mode !== 'supabase'){
    if(showToast) toast('Conecte sua conta Supabase para sincronizar.', 'bad');
    return false;
  }

  const client = sbGetClient();
  if(!client){
    if(showToast) toast('Supabase não conectado. Modo offline ativo.', 'bad');
    return false;
  }

  if(showToast) toast('Sincronizando com Supabase Cloud...', 'ai', 'cloud');

  try{
    const [pOk, wOk, lOk] = await Promise.all([
      sbSyncProfile(),
      sbSyncWorkouts(),
      sbSyncLogs()
    ]);

    const anyOk = pOk || wOk || lOk;
    if(showToast){
      if(anyOk) toast('Nuvem Supabase sincronizada com sucesso!', 'ok', 'cloud');
      else toast('Não foi possível sincronizar no momento.', 'bad');
    }
    return anyOk;
  }catch(e){
    if(showToast) toast('Falha na sincronização.', 'bad');
    return false;
  }
}

/* ==========================================================================
   FEED DA COMUNIDADE COM SUPABASE
   ========================================================================== */

async function sbPushPost(post){
  const client = sbGetClient();
  if(!client || !session || !session.uid) return false;

  try{
    const row = {
      id: String(post.id),
      user_id: session.uid,
      author_name: post.name || session.name || 'Atleta',
      text: post.text || '',
      photo_url: post.photo || null,
      workout_summary: post.w || null,
      likes_count: Number(post.likes) || 0,
      created_at: new Date(post.at || Date.now()).toISOString()
    };

    const res = await client.from('feed_posts').insert([row]);
    if(res.error){
      console.warn('Erro ao publicar post no Supabase:', res.error);
      return false;
    }
    return true;
  }catch(e){
    console.warn('Exceção ao publicar post Supabase:', e);
    return false;
  }
}

async function sbPullFeed(){
  const client = sbGetClient();
  if(!client) return [];

  try{
    const res = await client
      .from('feed_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(40);

    if(res.error || !Array.isArray(res.data)) return [];

    let userLikes = new Set();
    if(session && session.uid){
      try{
        const likesRes = await client.from('post_likes').select('post_id').eq('user_id', session.uid);
        if(likesRes.data){
          likesRes.data.forEach(function(l){ userLikes.add(l.post_id); });
        }
      }catch(errLikes){}
    }

    const currentUid = session ? session.uid : null;
    return res.data.map(function(item){
      return {
        id: item.id,
        at: new Date(item.created_at).getTime(),
        name: item.author_name || 'Atleta',
        text: item.text || '',
        photo: item.photo_url || null,
        likes: item.likes_count || 0,
        liked: userLikes.has(item.id),
        w: item.workout_summary || null,
        own: Boolean(currentUid && item.user_id === currentUid),
        fromCloud: true
      };
    });
  }catch(e){
    console.warn('Erro ao buscar feed Supabase:', e);
    return [];
  }
}

async function sbToggleLike(postId, currentLiked){
  const client = sbGetClient();
  if(!client || !session || !session.uid) return false;

  try{
    if(currentLiked){
      // Remover like
      await client.from('post_likes').delete().eq('post_id', postId).eq('user_id', session.uid);
      // Decrementar contador
      const postRes = await client.from('feed_posts').select('likes_count').eq('id', postId).single();
      if(postRes.data){
        const curCount = Math.max(0, (postRes.data.likes_count || 1) - 1);
        await client.from('feed_posts').update({ likes_count: curCount }).eq('id', postId);
      }
    } else {
      // Adicionar like
      await client.from('post_likes').upsert({ post_id: postId, user_id: session.uid });
      // Incrementar contador
      const postRes = await client.from('feed_posts').select('likes_count').eq('id', postId).single();
      if(postRes.data){
        const curCount = (postRes.data.likes_count || 0) + 1;
        await client.from('feed_posts').update({ likes_count: curCount }).eq('id', postId);
      }
    }
    return true;
  }catch(e){
    console.warn('Erro ao alternar like no Supabase:', e);
    return false;
  }
}

function sbInitRealtimeFeed(){
  const client = sbGetClient();
  if(!client || sbRealtimeSub) return;

  try{
    sbRealtimeSub = client
      .channel('public:feed_posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'feed_posts' }, function(){
        // Recarrega o feed quando houver novos posts
        if(typeof fbFeedPull === 'function') fbFeedPull();
      })
      .subscribe();
  }catch(e){
    console.warn('Realtime Supabase não disponível:', e);
  }
}
