-- ManyHands identity and profile data foundation.
--
-- Security model:
-- - auth.users proves authentication identity.
-- - private.accounts is the stable internal identity and lifecycle record.
-- - public.contributor_profiles contains only user-chosen public/profile data.
-- - clients receive explicit grants plus RLS; no table relies on legacy default grants.
-- - server-side authorization remains mandatory even though RLS provides defense in depth.

create schema private;

comment on schema private is
  'Internal ManyHands data and narrowly scoped authorization helpers. This schema is not exposed through the Data API.';

revoke all on schema private from public;
revoke all on schema private from anon;
revoke all on schema private from authenticated;
grant usage on schema private to authenticated;
grant usage on schema private to service_role;

alter default privileges in schema private revoke all on tables from public;
alter default privileges in schema private revoke all on tables from anon;
alter default privileges in schema private revoke all on tables from authenticated;
alter default privileges in schema private revoke all on sequences from public;
alter default privileges in schema private revoke all on sequences from anon;
alter default privileges in schema private revoke all on sequences from authenticated;
alter default privileges in schema private revoke execute on functions from public;
alter default privileges in schema private revoke execute on functions from anon;
alter default privileges in schema private revoke execute on functions from authenticated;

-- New public objects are opt-in to the Data API. This mirrors Supabase's 2026
-- secure default even when the migration is applied to a project created under
-- the older auto-exposure behavior.
alter default privileges in schema public revoke all on tables from anon;
alter default privileges in schema public revoke all on tables from authenticated;
alter default privileges in schema public revoke all on sequences from anon;
alter default privileges in schema public revoke all on sequences from authenticated;
alter default privileges in schema public revoke execute on functions from anon;
alter default privileges in schema public revoke execute on functions from authenticated;

create type private.account_status as enum (
  'active',
  'suspended',
  'deletion_requested',
  'anonymized'
);

create type public.profile_visibility as enum (
  'private',
  'members',
  'public'
);

create type public.availability_level as enum (
  'unavailable',
  'limited',
  'open'
);

create table private.accounts (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users (id) on delete set null,
  status private.account_status not null default 'active',
  suspension_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  suspended_at timestamptz,
  deletion_requested_at timestamptz,
  anonymized_at timestamptz,
  constraint accounts_suspension_reason_length
    check (suspension_reason is null or char_length(suspension_reason) <= 500),
  constraint accounts_suspended_timestamp
    check (status <> 'suspended' or suspended_at is not null),
  constraint accounts_deletion_requested_timestamp
    check (status <> 'deletion_requested' or deletion_requested_at is not null),
  constraint accounts_anonymized_state
    check (
      status <> 'anonymized'
      or (auth_user_id is null and anonymized_at is not null)
    )
);

comment on table private.accounts is
  'Stable internal identity and account lifecycle state. OAuth identity is detachable so attribution can survive account deletion.';
comment on column private.accounts.auth_user_id is
  'Supabase Auth identity. Null after anonymization; never expose this column in public read models.';
comment on column private.accounts.status is
  'Global account lifecycle state. Project roles never change this value.';

create index accounts_status_idx on private.accounts (status);

create table public.contributor_profiles (
  account_id uuid primary key references private.accounts (id) on delete restrict,
  handle text not null,
  display_name text not null,
  biography text,
  avatar_url text,
  skills text[] not null default array[]::text[],
  non_code_roles text[] not null default array[]::text[],
  interests text[] not null default array[]::text[],
  languages text[] not null default array[]::text[],
  availability public.availability_level not null default 'unavailable',
  timezone text,
  public_links jsonb not null default '[]'::jsonb,
  visibility public.profile_visibility not null default 'private',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint contributor_profiles_handle_format
    check (
      handle = lower(handle)
      and char_length(handle) between 3 and 30
      and handle ~ '^[a-z0-9][a-z0-9-]*[a-z0-9]$'
      and handle !~ '--'
    ),
  constraint contributor_profiles_display_name_length
    check (char_length(btrim(display_name)) between 1 and 80),
  constraint contributor_profiles_biography_length
    check (biography is null or char_length(biography) <= 1000),
  constraint contributor_profiles_avatar_url_length
    check (avatar_url is null or char_length(avatar_url) <= 2048),
  constraint contributor_profiles_skills_limit
    check (cardinality(skills) <= 24),
  constraint contributor_profiles_non_code_roles_limit
    check (cardinality(non_code_roles) <= 24),
  constraint contributor_profiles_interests_limit
    check (cardinality(interests) <= 40),
  constraint contributor_profiles_languages_limit
    check (cardinality(languages) <= 20),
  constraint contributor_profiles_timezone_length
    check (timezone is null or char_length(timezone) <= 100),
  constraint contributor_profiles_public_links_shape
    check (
      case
        when jsonb_typeof(public_links) = 'array'
          then jsonb_array_length(public_links) <= 10
        else false
      end
    )
);

comment on table public.contributor_profiles is
  'Privacy-safe contributor profile fields chosen by the user. Email, OAuth records, tokens, moderation notes, and security telemetry never belong here.';
comment on column public.contributor_profiles.visibility is
  'private: owner only; members: any authenticated session; public: signed-out and signed-in readers.';
comment on column public.contributor_profiles.public_links is
  'User-selected public links. The application validates each object before writing it.';

create unique index contributor_profiles_handle_lower_idx
  on public.contributor_profiles (lower(handle));
create index contributor_profiles_visibility_idx
  on public.contributor_profiles (visibility);

create function private.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $function$
begin
  new.updated_at := now();
  return new;
end;
$function$;

revoke all on function private.touch_updated_at() from public;
revoke all on function private.touch_updated_at() from anon;
revoke all on function private.touch_updated_at() from authenticated;

create trigger accounts_touch_updated_at
before update on private.accounts
for each row execute function private.touch_updated_at();

create trigger contributor_profiles_touch_updated_at
before update on public.contributor_profiles
for each row execute function private.touch_updated_at();

-- These are deliberately narrow SECURITY DEFINER helpers. They accept no
-- caller-controlled identity parameter, live outside exposed schemas, use an
-- empty search_path, and return only the current account identifier.
create function private.current_account_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $function$
  select account_record.id
  from private.accounts as account_record
  where account_record.auth_user_id = (select auth.uid())
  limit 1
$function$;

create function private.current_active_account_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $function$
  select account_record.id
  from private.accounts as account_record
  where account_record.auth_user_id = (select auth.uid())
    and account_record.status = 'active'::private.account_status
  limit 1
$function$;

revoke all on function private.current_account_id() from public;
revoke all on function private.current_account_id() from anon;
revoke all on function private.current_account_id() from authenticated;
revoke all on function private.current_active_account_id() from public;
revoke all on function private.current_active_account_id() from anon;
revoke all on function private.current_active_account_id() from authenticated;
grant execute on function private.current_account_id() to authenticated;
grant execute on function private.current_active_account_id() to authenticated;
grant execute on function private.current_account_id() to service_role;
grant execute on function private.current_active_account_id() to service_role;

create function private.create_account_for_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
declare
  internal_account_id uuid;
begin
  insert into private.accounts (auth_user_id)
  values (new.id)
  on conflict (auth_user_id) do update
    set updated_at = now()
  returning id into internal_account_id;

  insert into public.contributor_profiles (
    account_id,
    handle,
    display_name,
    visibility
  )
  values (
    internal_account_id,
    'member-' || left(replace(new.id::text, '-', ''), 12),
    'New contributor',
    'private'::public.profile_visibility
  )
  on conflict (account_id) do nothing;

  return new;
end;
$function$;

create function private.anonymize_account_before_auth_delete()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
declare
  internal_account_id uuid;
begin
  select account_record.id
  into internal_account_id
  from private.accounts as account_record
  where account_record.auth_user_id = old.id
  for update;

  if internal_account_id is not null then
    update private.accounts
    set
      auth_user_id = null,
      status = 'anonymized'::private.account_status,
      suspension_reason = null,
      anonymized_at = now()
    where id = internal_account_id;

    update public.contributor_profiles
    set
      handle = 'former-member-' || left(replace(internal_account_id::text, '-', ''), 12),
      display_name = 'Former contributor',
      biography = null,
      avatar_url = null,
      skills = array[]::text[],
      non_code_roles = array[]::text[],
      interests = array[]::text[],
      languages = array[]::text[],
      availability = 'unavailable'::public.availability_level,
      timezone = null,
      public_links = '[]'::jsonb,
      visibility = 'public'::public.profile_visibility
    where account_id = internal_account_id;
  end if;

  return old;
end;
$function$;

revoke all on function private.create_account_for_auth_user() from public;
revoke all on function private.create_account_for_auth_user() from anon;
revoke all on function private.create_account_for_auth_user() from authenticated;
revoke all on function private.anonymize_account_before_auth_delete() from public;
revoke all on function private.anonymize_account_before_auth_delete() from anon;
revoke all on function private.anonymize_account_before_auth_delete() from authenticated;

create trigger manyhands_create_account_after_auth_user
  after insert on auth.users
  for each row execute function private.create_account_for_auth_user();

create trigger manyhands_anonymize_account_before_auth_user_delete
  before delete on auth.users
  for each row execute function private.anonymize_account_before_auth_delete();

-- Support a safe migration onto a project that already contains auth users.
insert into private.accounts (auth_user_id)
select auth_user.id
from auth.users as auth_user
on conflict (auth_user_id) do nothing;

insert into public.contributor_profiles (
  account_id,
  handle,
  display_name,
  visibility
)
select
  account_record.id,
  'member-' || left(replace(account_record.auth_user_id::text, '-', ''), 12),
  'New contributor',
  'private'::public.profile_visibility
from private.accounts as account_record
where account_record.auth_user_id is not null
on conflict (account_id) do nothing;

alter table private.accounts enable row level security;
alter table private.accounts force row level security;
alter table public.contributor_profiles enable row level security;
alter table public.contributor_profiles force row level security;

revoke all on table private.accounts from anon;
revoke all on table private.accounts from authenticated;
revoke all on table public.contributor_profiles from anon;
revoke all on table public.contributor_profiles from authenticated;

grant all on table private.accounts to service_role;
grant all on table public.contributor_profiles to service_role;

grant select on table public.contributor_profiles to anon;
grant select on table public.contributor_profiles to authenticated;
grant update (
  handle,
  display_name,
  biography,
  avatar_url,
  skills,
  non_code_roles,
  interests,
  languages,
  availability,
  timezone,
  public_links,
  visibility
) on public.contributor_profiles to authenticated;

create policy contributor_profiles_public_read
on public.contributor_profiles
for select
to anon, authenticated
using (visibility = 'public'::public.profile_visibility);

create policy contributor_profiles_member_read
on public.contributor_profiles
for select
to authenticated
using (visibility = 'members'::public.profile_visibility);

create policy contributor_profiles_owner_read
on public.contributor_profiles
for select
to authenticated
using ((select private.current_account_id()) = account_id);

create policy contributor_profiles_active_owner_update
on public.contributor_profiles
for update
to authenticated
using ((select private.current_active_account_id()) = account_id)
with check ((select private.current_active_account_id()) = account_id);

create view public.profile_directory
with (security_invoker = true)
as
select
  account_id,
  handle,
  display_name,
  biography,
  avatar_url,
  skills,
  non_code_roles,
  interests,
  languages,
  availability,
  timezone,
  public_links,
  updated_at
from public.contributor_profiles
where visibility = 'public'::public.profile_visibility;

comment on view public.profile_directory is
  'Explicit signed-out profile read model. security_invoker keeps underlying contributor_profiles RLS in force.';

revoke all on table public.profile_directory from anon;
revoke all on table public.profile_directory from authenticated;
grant select on table public.profile_directory to anon;
grant select on table public.profile_directory to authenticated;
grant select on table public.profile_directory to service_role;
