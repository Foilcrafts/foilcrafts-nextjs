-- ============================================================================
-- Foil Crafts — Supabase schema
-- Paste this into the Supabase SQL Editor (Project → SQL Editor → New query).
-- Run once on a fresh Supabase project. Safe to re-run (uses IF NOT EXISTS).
-- ============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. profiles table — extends auth.users with trade-partner metadata + status
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.profiles (
  id              uuid        primary key references auth.users(id) on delete cascade,
  email           text        not null unique,
  full_name       text,
  company         text,
  phone           text,
  status          text        not null default 'pending'
                              check (status in ('pending', 'approved', 'rejected')),
  role            text        not null default 'user'
                              check (role in ('user', 'admin')),
  created_at      timestamptz not null default now(),
  approved_at     timestamptz,
  last_visited_at timestamptz,
  visit_count     integer     not null default 0
);

create index if not exists profiles_status_idx on public.profiles (status);
create index if not exists profiles_role_idx on public.profiles (role);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. access_requests table — for the public "Request access" form on /contact.
--    Decoupled from auth so leads can submit without creating accounts.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.access_requests (
  id         uuid        primary key default gen_random_uuid(),
  name       text        not null,
  company    text        not null,
  phone      text        not null,
  email      text        not null,
  status     text        not null default 'pending'
                         check (status in ('pending', 'contacted', 'converted', 'rejected')),
  notes      text,
  created_at timestamptz not null default now()
);

create index if not exists access_requests_status_idx
  on public.access_requests (status, created_at desc);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. handle_new_user trigger — automatically creates a profile row when a
--    new auth.users row is created (via signup). Reads metadata passed in
--    options.data during signUp().
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, company, phone, status, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', null),
    coalesce(new.raw_user_meta_data->>'company',   null),
    coalesce(new.raw_user_meta_data->>'phone',     null),
    'pending',
    'user'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Row Level Security
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.profiles         enable row level security;
alter table public.access_requests  enable row level security;

-- Helper function: checks if a given uid has role='admin'.
-- Uses SECURITY DEFINER so it bypasses RLS when evaluating the profiles table,
-- which avoids infinite recursion in admin RLS policies.
create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = uid and role = 'admin'
  );
$$;

-- ─── profiles policies ───────────────────────────────────────────────────────

-- Any signed-in user can read THEIR OWN profile.
drop policy if exists "profiles: self read" on public.profiles;
create policy "profiles: self read" on public.profiles
  for select
  using (auth.uid() = id);

-- Admins can read ALL profiles (uses is_admin() to avoid recursive self-join).
drop policy if exists "profiles: admin read all" on public.profiles;
create policy "profiles: admin read all" on public.profiles
  for select
  using (public.is_admin(auth.uid()));

-- Users CANNOT change their own status / role — they can only update their name/company/phone.
-- (Admin updates happen via the service_role key in server actions; RLS doesn't apply there.)
drop policy if exists "profiles: self update own metadata" on public.profiles;
create policy "profiles: self update own metadata" on public.profiles
  for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and status = (select status from public.profiles where id = auth.uid())
    and role   = (select role   from public.profiles where id = auth.uid())
  );

-- Admins can update any profile (uses is_admin() to avoid recursive self-join).
drop policy if exists "profiles: admin update all" on public.profiles;
create policy "profiles: admin update all" on public.profiles
  for update
  using (public.is_admin(auth.uid()));

-- Insert: handled by the trigger, but allow explicit upsert from server action.
drop policy if exists "profiles: self insert" on public.profiles;
create policy "profiles: self insert" on public.profiles
  for insert
  with check (auth.uid() = id);

-- ─── access_requests policies ────────────────────────────────────────────────

-- Anyone (even anonymous) can INSERT an access request — that's the whole point of the form.
drop policy if exists "access_requests: public insert" on public.access_requests;
create policy "access_requests: public insert" on public.access_requests
  for insert
  to anon, authenticated
  with check (true);

-- Only admins can READ or UPDATE access requests (uses is_admin() — no recursion).
drop policy if exists "access_requests: admin read" on public.access_requests;
create policy "access_requests: admin read" on public.access_requests
  for select
  using (public.is_admin(auth.uid()));

drop policy if exists "access_requests: admin update" on public.access_requests;
create policy "access_requests: admin update" on public.access_requests
  for update
  using (public.is_admin(auth.uid()));

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. (Optional) Notification trigger — email Foil Crafts team when a new
--    access request comes in. Requires a Postgres function calling pg_net or
--    Supabase Edge Function. Skipped for now — admin checks the dashboard
--    daily. Can be added later.
-- ─────────────────────────────────────────────────────────────────────────────

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. Make an admin user (run AFTER your team member signs up via the website).
--    Replace the email with your actual admin email.
-- ─────────────────────────────────────────────────────────────────────────────

-- update public.profiles
-- set role = 'admin', status = 'approved'
-- where email = 'gaurav@foilcrafts.com';

-- ─────────────────────────────────────────────────────────────────────────────
-- Done. After this runs, every new signup goes to status='pending', shows
-- up in /admin, and the admin clicks Approve to grant access to /library.
-- ─────────────────────────────────────────────────────────────────────────────
