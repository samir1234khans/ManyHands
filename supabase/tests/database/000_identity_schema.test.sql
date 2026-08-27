begin;

create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;

select plan(25);

select ok(
  to_regnamespace('private') is not null,
  'private schema exists'
);

select ok(
  exists (
    select 1
    from pg_type as type_record
    join pg_namespace as namespace_record
      on namespace_record.oid = type_record.typnamespace
    where namespace_record.nspname = 'private'
      and type_record.typname = 'account_status'
      and type_record.typtype = 'e'
  ),
  'private.account_status enum exists'
);

select ok(
  exists (
    select 1
    from pg_type as type_record
    join pg_namespace as namespace_record
      on namespace_record.oid = type_record.typnamespace
    where namespace_record.nspname = 'public'
      and type_record.typname = 'profile_visibility'
      and type_record.typtype = 'e'
  ),
  'public.profile_visibility enum exists'
);

select ok(
  exists (
    select 1
    from pg_type as type_record
    join pg_namespace as namespace_record
      on namespace_record.oid = type_record.typnamespace
    where namespace_record.nspname = 'public'
      and type_record.typname = 'availability_level'
      and type_record.typtype = 'e'
  ),
  'public.availability_level enum exists'
);

select ok(
  to_regclass('private.accounts') is not null,
  'private.accounts exists'
);

select ok(
  to_regclass('public.contributor_profiles') is not null,
  'public.contributor_profiles exists'
);

select ok(
  exists (
    select 1
    from pg_class
    where oid = to_regclass('public.profile_directory')
      and relkind = 'v'
  ),
  'public.profile_directory is a view'
);

select ok(
  (select relrowsecurity from pg_class where oid = to_regclass('private.accounts')),
  'private.accounts has RLS enabled'
);

select ok(
  (select relforcerowsecurity from pg_class where oid = to_regclass('private.accounts')),
  'private.accounts forces RLS'
);

select ok(
  (select relrowsecurity from pg_class where oid = to_regclass('public.contributor_profiles')),
  'public.contributor_profiles has RLS enabled'
);

select ok(
  (select relforcerowsecurity from pg_class where oid = to_regclass('public.contributor_profiles')),
  'public.contributor_profiles forces RLS'
);

select ok(
  not has_table_privilege('anon', 'private.accounts', 'select'),
  'anon cannot select private accounts'
);

select ok(
  not has_table_privilege('authenticated', 'private.accounts', 'select'),
  'authenticated cannot select private accounts directly'
);

select ok(
  has_table_privilege('anon', 'public.contributor_profiles', 'select'),
  'anon has the explicit profile select grant'
);

select ok(
  has_table_privilege('authenticated', 'public.contributor_profiles', 'select'),
  'authenticated has the explicit profile select grant'
);

select ok(
  not has_table_privilege('anon', 'public.contributor_profiles', 'update'),
  'anon cannot update contributor profiles'
);

select ok(
  has_column_privilege(
    'authenticated',
    'public.contributor_profiles',
    'display_name',
    'update'
  ),
  'authenticated can update an allowed profile column'
);

select ok(
  not has_column_privilege(
    'authenticated',
    'public.contributor_profiles',
    'account_id',
    'update'
  ),
  'authenticated cannot reassign profile ownership'
);

select ok(
  coalesce(
    (
      select 'security_invoker=true' = any(coalesce(reloptions, array[]::text[]))
      from pg_class
      where oid = to_regclass('public.profile_directory')
    ),
    false
  ),
  'profile_directory uses security_invoker'
);

select ok(
  not exists (
    select 1
    from pg_attribute
    where attrelid = to_regclass('public.profile_directory')
      and attname = 'auth_user_id'
      and not attisdropped
  ),
  'profile_directory excludes auth identity'
);

select ok(
  not exists (
    select 1
    from pg_attribute
    where attrelid = to_regclass('public.contributor_profiles')
      and attname in ('email', 'auth_user_id', 'oauth_token', 'moderator_notes')
      and not attisdropped
  ),
  'public profiles contain no private identity or moderation columns'
);

select ok(
  (
    select procedure_record.prosecdef
    from pg_proc as procedure_record
    join pg_namespace as namespace_record
      on namespace_record.oid = procedure_record.pronamespace
    where namespace_record.nspname = 'private'
      and procedure_record.proname = 'current_account_id'
  ),
  'current_account_id is a narrowly scoped security-definer helper'
);

select ok(
  (
    select procedure_record.prosecdef
    from pg_proc as procedure_record
    join pg_namespace as namespace_record
      on namespace_record.oid = procedure_record.pronamespace
    where namespace_record.nspname = 'private'
      and procedure_record.proname = 'current_active_account_id'
  ),
  'current_active_account_id is a narrowly scoped security-definer helper'
);

select ok(
  exists (
    select 1
    from pg_trigger
    where tgrelid = 'auth.users'::regclass
      and tgname = 'manyhands_create_account_after_auth_user'
      and not tgisinternal
  ),
  'new auth users receive an internal account and profile'
);

select ok(
  exists (
    select 1
    from pg_trigger
    where tgrelid = 'auth.users'::regclass
      and tgname = 'manyhands_anonymize_account_before_auth_user_delete'
      and not tgisinternal
  ),
  'auth deletion invokes account anonymization'
);

select * from finish();
rollback;
