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
  using (auth.uid() = user_id);

create policy "Users can insert their own workouts"
  on public.workouts
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own workouts"
  on public.workouts
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own workouts"
  on public.workouts
  for delete
  using (auth.uid() = user_id);
