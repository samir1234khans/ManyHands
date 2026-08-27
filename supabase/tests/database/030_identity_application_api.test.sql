begin;

create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;

select plan(23);

select ok(
  has_function_privilege('authenticated', 'public.current_account_context()', 'execute'),
  'authenticated users can read their narrow account context'
);
select ok(
  has_function_privilege('authenticated', 'public.request_account_deletion()', 'execute'),
  'authenticated users can request deletion for themselves'
);
select ok(
  not has_function_privilege('authenticated', 'public.admin_suspend_account(uuid,text)', 'execute'),
  'authenticated users cannot suspend accounts'
);
select ok(
  not has_function_privilege('authenticated', 'public.admin_restore_account(uuid)', 'execute'),
  'authenticated users cannot restore suspended accounts'
);
select ok(
  not has_function_privilege('authenticated', 'public.restore_failed_account_deletion(uuid)', 'execute'),
  'authenticated users cannot invoke deletion compensation'
);
select ok(
  has_function_privilege('service_role', 'public.admin_suspend_account(uuid,text)', 'execute'),
  'service role can suspend accounts through the explicit operation'
);
select ok(
  has_function_privilege('service_role', 'public.admin_restore_account(uuid)', 'execute'),
  'service role can restore suspended accounts through the explicit operation'
);
select ok(
  has_function_privilege('service_role', 'public.restore_failed_account_deletion(uuid)', 'execute'),
  'service role can compensate a failed Auth deletion'
);

insert into auth.users (id, email)
values
  ('44444444-4444-4444-8444-444444444444', 'identity-api-one@example.test'),
  ('55555555-5555-4555-8555-555555555555', 'identity-api-two@example.test');

select is(
  (select count(*) from private.accounts),
  2::bigint,
  'test users receive internal accounts'
);

set local role authenticated;
set local request.jwt.claim.sub = '44444444-4444-4444-8444-444444444444';

select ok(
  (select account_id is not null from public.current_account_context()),
  'current account context exposes a stable internal identifier'
);
select is(
  (select status::text from public.current_account_context()),
  'active',
  'new account context reports active status'
);
select is(
  public.request_account_deletion()::text,
  'deletion_requested',
  'an active user can request deletion for their own account'
);

reset role;

select is(
  (
    select status::text
    from private.accounts
    where auth_user_id = '44444444-4444-4444-8444-444444444444'
  ),
  'deletion_requested',
  'deletion request write-locks the internal account'
);

set local role authenticated;
set local request.jwt.claim.sub = '44444444-4444-4444-8444-444444444444';

select ok(
  (select private.current_active_account_id()) is null,
  'a deletion-requested account has no active write capability'
);
select results_eq(
  $$
    with changed as (
      update public.contributor_profiles
      set display_name = 'Deletion write should fail'
      where account_id = (select private.current_account_id())
      returning 1
    )
    select count(*)::bigint from changed
  $$,
  array[0::bigint],
  'RLS blocks profile writes after deletion is requested'
);

reset role;
set local role service_role;

select ok(
  public.restore_failed_account_deletion('44444444-4444-4444-8444-444444444444'),
  'service role can compensate a failed Auth deletion'
);

reset role;

select is(
  (
    select status::text
    from private.accounts
    where auth_user_id = '44444444-4444-4444-8444-444444444444'
  ),
  'active',
  'compensation restores active account state'
);

set local role service_role;

select ok(
  public.admin_suspend_account(
    '44444444-4444-4444-8444-444444444444',
    'Automated identity application test'
  ),
  'service role can suspend an active account'
);

reset role;

select is(
  (
    select status::text
    from private.accounts
    where auth_user_id = '44444444-4444-4444-8444-444444444444'
  ),
  'suspended',
  'suspension is reflected in account state'
);

set local role authenticated;
set local request.jwt.claim.sub = '44444444-4444-4444-8444-444444444444';

select results_eq(
  $$
    with changed as (
      update public.contributor_profiles
      set display_name = 'Suspended application write'
      where account_id = (select private.current_account_id())
      returning 1
    )
    select count(*)::bigint from changed
  $$,
  array[0::bigint],
  'RLS blocks profile writes for a suspended account'
);

reset role;
set local role service_role;

select ok(
  public.admin_restore_account('44444444-4444-4444-8444-444444444444'),
  'service role can restore a suspended account'
);

reset role;

select is(
  (
    select status::text
    from private.accounts
    where auth_user_id = '44444444-4444-4444-8444-444444444444'
  ),
  'active',
  'restoration returns the account to active state'
);

select ok(
  not has_function_privilege('anon', 'public.current_account_context()', 'execute'),
  'anonymous visitors cannot read account context'
);

set local role authenticated;
set local request.jwt.claim.sub = '55555555-5555-4555-8555-555555555555';

select results_eq(
  $$select count(*)::bigint from public.current_account_context()$$,
  array[1::bigint],
  'a second user receives only their own account context'
);

select * from finish();
rollback;
