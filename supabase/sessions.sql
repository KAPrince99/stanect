-- Stanect 0.2 — persist voice sessions.
-- Run this in the Supabase SQL editor. There is no migration runner in the repo.

create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  vapi_call_id text not null unique,
  owner_id text not null,
  companion_id uuid not null references public.companions (id) on delete cascade,
  assistant_id text,
  duration_seconds integer not null default 0
    check (duration_seconds >= 0 and duration_seconds <= 3600),
  transcript jsonb not null default '[]'::jsonb,
  recap jsonb,
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists sessions_owner_ended_at_idx
  on public.sessions (owner_id, ended_at desc nulls last);

create index if not exists sessions_companion_id_idx
  on public.sessions (companion_id);

alter table public.sessions enable row level security;

drop policy if exists sessions_select_own on public.sessions;
create policy sessions_select_own
  on public.sessions
  for select
  using (owner_id = coalesce(auth.jwt() ->> 'sub', ''));

grant select on public.sessions to authenticated;
grant all on public.sessions to service_role;
