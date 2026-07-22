-- ============================================================
-- ResQ AI - Supabase Schema Migration
-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/tliwdujwzgkopusoufkk/sql
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- USERS TABLE
-- ============================================================
create table if not exists public.users (
  id          uuid primary key default uuid_generate_v4(),
  auth_id     uuid unique references auth.users(id) on delete cascade,
  name        text not null,
  email       text unique not null,
  role        text not null default 'citizen' check (role in ('citizen', 'admin')),
  phone       text,
  location    text,
  created_at  timestamptz not null default now()
);

alter table public.users enable row level security;

-- Users can read their own record
create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = auth_id);

-- Users can update their own record
create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = auth_id);

-- Allow insert during registration (service role or authenticated)
create policy "Allow insert on registration"
  on public.users for insert
  with check (true);

-- Admins can read all users
create policy "Admins can view all users"
  on public.users for select
  using (
    exists (
      select 1 from public.users u
      where u.auth_id = auth.uid() and u.role = 'admin'
    )
  );

-- ============================================================
-- INCIDENTS TABLE
-- ============================================================
create table if not exists public.incidents (
  id               text primary key default ('INC-' || substring(gen_random_uuid()::text, 1, 6)),
  title            text not null,
  type             text not null,
  description      text not null,
  severity         text not null check (severity in ('Critical', 'High', 'Medium', 'Low')),
  status           text not null default 'Pending'
                   check (status in ('Pending', 'Assigned', 'In Progress', 'Resolved', 'Closed')),
  location         text not null default 'Unknown',
  contact_number   text,
  reported_by      uuid references public.users(id) on delete set null,
  reporter_name    text not null default 'Anonymous',
  confidence       float not null default 0.0,
  priority_score   int not null default 3,
  image_url        text,
  analysis         jsonb,
  dispatched_units text[] not null default '{}',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

alter table public.incidents enable row level security;

-- Citizens can view their own incidents
create policy "Citizens can view own incidents"
  on public.incidents for select
  using (
    reported_by = (
      select id from public.users where auth_id = auth.uid()
    )
  );

-- Citizens can insert incidents
create policy "Citizens can insert incidents"
  on public.incidents for insert
  with check (true);

-- Admins can view all incidents
create policy "Admins can view all incidents"
  on public.incidents for select
  using (
    exists (
      select 1 from public.users u
      where u.auth_id = auth.uid() and u.role = 'admin'
    )
  );

-- Admins can update any incident
create policy "Admins can update incidents"
  on public.incidents for update
  using (
    exists (
      select 1 from public.users u
      where u.auth_id = auth.uid() and u.role = 'admin'
    )
  );

-- ============================================================
-- ENABLE REALTIME on incidents
-- ============================================================
alter publication supabase_realtime add table public.incidents;

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger incidents_updated_at
  before update on public.incidents
  for each row execute function public.update_updated_at();

-- ============================================================
-- SEED: Admin user profile (run AFTER creating the admin auth account)
-- Replace <your-admin-auth-uuid> with the UUID from auth.users
-- ============================================================
-- insert into public.users (auth_id, name, email, role, phone)
-- values (
--   '<your-admin-auth-uuid>',
--   'Admin Officer',
--   'admin@resqai.com',
--   'admin',
--   '+91 9876543210'
-- );
