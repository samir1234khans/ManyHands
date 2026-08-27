begin;

create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;

select plan(13);

insert into auth.users (id, email)
values
  ('11111111-1111-4111-8111-111111111111', 'user-one@example.test'),
  ('22222222-2222-4222-8222-222222222222', 'user-two@example.test');

select is(
  (select count(*) from private.accounts),
  2::bigint,
  'auth-user creation produces two stable internal accounts'
);

select is(
  (select count(*) from public.contributor_profiles),
  2::bigint,
  'auth-user creation produces two private-by-default profiles'
);

set local role anon;

select results_eq(
  $$select count(*)::bigint from public.contributor_profiles$$,
  array[0::bigint],
  'anonymous readers cannot see private profiles'
);

reset role;
set local role authenticated;
set local request.jwt.claim.sub = '11111111-1111-4111-8111-111111111111';

select results_eq(
  $$select count(*)::bigint from public.contributor_profiles$$,
  array[1::bigint],
  'an authenticated user can read only their own private profile'
);

select ok(
  (select private.current_account_id()) = (
    select account_id
    from public.contributor_profiles
    where handle = 'member-111111111111'
  ),
  'the current-account helper maps auth identity to internal identity'
);

select lives_ok(
  $$
    update public.contributor_profiles
    set
      display_name = 'User One',
      visibility = 'public'::public.profile_visibility
    where account_id = (select private.current_active_account_id())
  $$,
  'an active user can update their own allowed profile fields'
);

select results_eq(
  $$
    select display_name
    from public.contributor_profiles
    where account_id = (select private.current_account_id())
  $$,
  array['User One'::text],
  'the owner update is visible to the owner'
);

select results_eq(
  $$
    with changed as (
      update public.contributor_profiles
      set display_name = 'Compromised'
      where handle = 'member-222222222222'
      returning 1
    )
    select count(*)::bigint from changed
  $$,
  array[0::bigint],
  'one authenticated user cannot update another private profile'
);

reset role;
set local role anon;

select results_eq(
  $$select count(*)::bigint from public.profile_directory$$,
  array[1::bigint],
  'anonymous readers see only profiles explicitly made public'
);

reset role;
set local role authenticated;
set local request.jwt.claim.sub = '22222222-2222-4222-8222-222222222222';

select results_eq(
  $$select count(*)::bigint from public.contributor_profiles$$,
  array[2::bigint],
  'a signed-in user sees public profiles plus their own private profile'
);

reset role;
update private.accounts
set
  status = 'suspended'::private.account_status,
  suspended_at = now(),
  suspension_reason = 'Automated policy test'
where auth_user_id = '11111111-1111-4111-8111-111111111111';

set local role authenticated;
set local request.jwt.claim.sub = '11111111-1111-4111-8111-111111111111';

select ok(
  (select private.current_active_account_id()) is null,
  'a suspended user has no active-account capability'
);

select results_eq(
  $$
    with changed as (
      update public.contributor_profiles
      set display_name = 'Suspended write'
      where account_id = (select private.current_account_id())
      returning 1
    )
    select count(*)::bigint from changed
  $$,
  array[0::bigint],
  'suspension prevents protected writes'
);

select results_eq(
  $$select count(*)::bigint from public.contributor_profiles$$,
  array[1::bigint],
  'suspension preserves the user attribution and readable profile row'
);

select * from finish();
rollback;
