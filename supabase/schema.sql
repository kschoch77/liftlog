create table if not exists public.workouts (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  date timestamptz not null,
  exercises jsonb not null,
  total_volume numeric not null default 0,
  prs_achieved jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.workouts enable row level security;

create policy "Users can read their own workouts"
  on public.workouts
  for select
  using (auth.uid() is not null and auth.uid() = user_id);

create policy "Users can insert their own workouts"
  on public.workouts
  for insert
  with check (auth.uid() is not null and auth.uid() = user_id);

create policy "Users can update their own workouts"
  on public.workouts
  for update
  using (auth.uid() is not null and auth.uid() = user_id)
  with check (auth.uid() is not null and auth.uid() = user_id);

create policy "Users can delete their own workouts"
  on public.workouts
  for delete
  using (auth.uid() is not null and auth.uid() = user_id);

create table if not exists public.template_folders (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.template_folders enable row level security;

create policy "Users can read their own template folders"
  on public.template_folders
  for select
  using (auth.uid() is not null and auth.uid() = user_id);

create policy "Users can insert their own template folders"
  on public.template_folders
  for insert
  with check (auth.uid() is not null and auth.uid() = user_id);

create policy "Users can update their own template folders"
  on public.template_folders
  for update
  using (auth.uid() is not null and auth.uid() = user_id)
  with check (auth.uid() is not null and auth.uid() = user_id);

create policy "Users can delete their own template folders"
  on public.template_folders
  for delete
  using (auth.uid() is not null and auth.uid() = user_id);

create table if not exists public.workout_templates (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  folder_id text references public.template_folders(id) on delete set null,
  exercises jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.workout_templates enable row level security;

create policy "Users can read their own workout templates"
  on public.workout_templates
  for select
  using (auth.uid() is not null and auth.uid() = user_id);

create policy "Users can insert their own workout templates"
  on public.workout_templates
  for insert
  with check (auth.uid() is not null and auth.uid() = user_id);

create policy "Users can update their own workout templates"
  on public.workout_templates
  for update
  using (auth.uid() is not null and auth.uid() = user_id)
  with check (auth.uid() is not null and auth.uid() = user_id);

create policy "Users can delete their own workout templates"
  on public.workout_templates
  for delete
  using (auth.uid() is not null and auth.uid() = user_id);
