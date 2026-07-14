-- IngredientIQ database schema
-- Covers Issue 5: profiles table, scans table, and RLS policies

-- Ensures gen_random_uuid() is available regardless of project defaults
create extension if not exists pgcrypto;

-- profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name varchar(100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- scans
create table public.scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  product_name varchar(255),
  raw_ingredients text not null,
  ingredient_hash varchar(64),
  verdict text check (verdict in ('SAFE', 'UNSAFE', 'CAUTION')),
  summary text,
  analysis_json jsonb,
  scanned_at timestamptz not null default now()
);

-- Helpful for the repeat scan detection lookup (Issue 15 / shared/hash.js)
create index scans_ingredient_hash_idx on public.scans (ingredient_hash);
create index scans_user_id_idx on public.scans (user_id);

-- Row Level Security

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

alter table public.scans enable row level security;

create policy "Users can view their own scans"
  on public.scans for select
  using (auth.uid() = user_id);

create policy "Users can insert their own scans"
  on public.scans for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own scans"
  on public.scans for update
  using (auth.uid() = user_id);

create policy "Users can delete their own scans"
  on public.scans for delete
  using (auth.uid() = user_id);

-- Creates a matching profiles row whenever a new user signs up,
-- regardless of which auth method was used
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, created_at, updated_at)
  values (new.id, new.raw_user_meta_data->>'display_name', now(), now());
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Unique constraint required for upsert conflict resolution in guest scan migration
alter table public.scans
add constraint scans_ingredient_hash_user_id_unique
unique (ingredient_hash, user_id);