-- ==============================================================================
-- FORJA — Esquema de Banco de Dados, RLS e Sincronização Supabase Cloud
-- Offline-First: Dados locais no cliente + Sincronização em nuvem
-- ==============================================================================

-- 1. EXTENSÕES
create extension if not exists "pgcrypto";

-- 2. TABELA: profiles (Perfis de atletas)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null,
  xp integer default 0 not null,
  weight numeric(5,2) default 70,
  height numeric(5,2) default 175,
  created_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Perfis são visíveis publicamente"
  on public.profiles for select
  using (true);

create policy "Atletas gerenciam o próprio perfil"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 3. TABELA: workouts (Rotinas e fichas de treino)
create table if not exists public.workouts (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  description text default '',
  exercises jsonb not null default '[]'::jsonb,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.workouts enable row level security;

create policy "Atletas gerenciam suas próprias fichas de treino"
  on public.workouts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 4. TABELA: workout_logs (Histórico de sessões realizadas)
create table if not exists public.workout_logs (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  workout_id text,
  workout_name text not null,
  duration integer default 0,
  tonnage numeric(10,2) default 0,
  reps integer default 0,
  sets integer default 0,
  muscles jsonb default '[]'::jsonb,
  records jsonb default '[]'::jsonb,
  exercises jsonb not null default '[]'::jsonb,
  completed_at timestamptz default now() not null,
  created_at timestamptz default now() not null
);

alter table public.workout_logs enable row level security;

create policy "Atletas gerenciam seu próprio histórico de sessões"
  on public.workout_logs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 5. TABELA: feed_posts (Publicações na mini rede social)
create table if not exists public.feed_posts (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  author_name text not null,
  caption text default '',
  photo_url text default null,
  workout_summary jsonb not null default '{}'::jsonb,
  likes_count integer default 0 not null,
  created_at timestamptz default now() not null
);

alter table public.feed_posts enable row level security;

create policy "Publicações do feed são visíveis para todos"
  on public.feed_posts for select
  using (true);

create policy "Atletas publicam no feed"
  on public.feed_posts for insert
  with check (auth.uid() = user_id);

create policy "Atletas podem atualizar suas próprias publicações"
  on public.feed_posts for update
  using (auth.uid() = user_id);

create policy "Atletas podem remover suas próprias publicações"
  on public.feed_posts for delete
  using (auth.uid() = user_id);

-- 6. TABELA: post_likes (Curtidas no feed)
create table if not exists public.post_likes (
  id uuid default gen_random_uuid() primary key,
  post_id text references public.feed_posts(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  constraint post_likes_user_post_key unique (post_id, user_id)
);

alter table public.post_likes enable row level security;

create policy "Curtidas são visíveis para todos"
  on public.post_likes for select
  using (true);

create policy "Atletas gerenciam suas próprias curtidas"
  on public.post_likes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 7. REPLICATION REALTIME
alter publication supabase_realtime add table public.feed_posts;
