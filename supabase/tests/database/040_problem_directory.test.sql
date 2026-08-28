begin;

create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;

select no_plan();

create function pg_temp.save_fixture_problem(
  target_problem_id uuid,
  desired_status public.problem_status,
  problem_slug text,
  change_summary text
)
returns uuid
language sql
as $function$
  select public.save_problem(
    target_problem_id,
    problem_slug,
    'Creative tools remain inaccessible on Linux',
    'Many creative professionals cannot complete common workflows with accessible Linux tools.',
    'Designers and media creators using keyboards, screen readers, or constrained hardware.',
    'Existing tools cover isolated tasks, but the complete professional workflow remains fragmented and difficult to operate without precise pointer input.',
    'Repeated workflow gaps are documented across public issue trackers.',
    'Several single-purpose editors solve only part of the workflow.',
    array['Linux', 'low-bandwidth web'],
    array['accessibility', 'creative tools'],
    desired_status,
    change_summary
  )
$function$;

select ok(
  has_function_privilege(
    'authenticated',
    'public.save_problem(uuid,text,text,text,text,text,text,text,text[],text[],public.problem_status,text)',
    'execute'
  ),
  'authenticated accounts can use the validated Problem save operation'
);
select ok(
  has_function_privilege('authenticated', 'public.toggle_problem_need_signal(uuid,text)', 'execute'),
  'authenticated accounts can maintain one reversible need signal'
);
select ok(
  has_function_privilege('authenticated', 'public.toggle_problem_follow(uuid)', 'execute'),
  'authenticated accounts can maintain one reversible follow'
);
select ok(
  not has_function_privilege('anon', 'public.toggle_problem_need_signal(uuid,text)', 'execute'),
  'anonymous visitors cannot create need signals'
);
select ok(
  not has_function_privilege('anon', 'public.toggle_problem_follow(uuid)', 'execute'),
  'anonymous visitors cannot create follows'
);
select ok(
  not has_function_privilege(
    'authenticated',
    'public.admin_set_problem_moderation(uuid,public.problem_moderation_state,text)',
    'execute'
  ),
  'ordinary authenticated accounts cannot moderate Problems'
);
select ok(
  has_function_privilege(
    'service_role',
    'public.admin_set_problem_moderation(uuid,public.problem_moderation_state,text)',
    'execute'
  ),
  'service role can use the explicit Problem moderation operation'
);
select ok(
  not has_table_privilege('anon', 'public.problem_need_signals', 'select'),
  'anonymous visitors cannot read signal identities or private context'
);
select ok(
  not has_table_privilege('anon', 'public.problem_follows', 'select'),
  'anonymous visitors cannot read follow identities'
);
select ok(
  (
    select relrowsecurity and relforcerowsecurity
    from pg_catalog.pg_class
    where oid = 'public.problems'::regclass
  ),
  'Problems enable and force Row Level Security'
);
select ok(
  (
    select relrowsecurity and relforcerowsecurity
    from pg_catalog.pg_class
    where oid = 'public.problem_need_signals'::regclass
  ),
  'need signals enable and force Row Level Security'
);
select ok(
  (
    select coalesce(reloptions, '{}'::text[]) @> array['security_invoker=true']
    from pg_catalog.pg_class
    where oid = 'public.problem_directory'::regclass
  ),
  'the public directory uses invoking-user permissions and RLS'
);

insert into auth.users (id, email)
values
  ('66666666-6666-4666-8666-666666666666', 'problem-author@example.test'),
  ('77777777-7777-4777-8777-777777777777', 'problem-reader@example.test');

select is(
  (select count(*) from private.accounts),
  2::bigint,
  'test identities receive stable internal accounts'
);

set local role authenticated;
set local request.jwt.claim.sub = '66666666-6666-4666-8666-666666666666';

select ok(
  pg_temp.save_fixture_problem(
    null,
    'draft'::public.problem_status,
    'accessible-creative-tools',
    ''
  ) is not null,
  'an active author can create a private Problem draft'
);
select is(
  (select count(*) from public.problems where slug = 'accessible-creative-tools'),
  1::bigint,
  'the author can read their own draft'
);
select is(
  (
    select count(*)
    from public.problem_revisions
    where problem_id = (select id from public.problems where slug = 'accessible-creative-tools')
  ),
  1::bigint,
  'the draft creates an immutable private revision snapshot'
);

reset role;
set local role anon;

select is(
  (select count(*) from public.problem_directory where slug = 'accessible-creative-tools'),
  0::bigint,
  'anonymous visitors cannot discover a private draft'
);
select is(
  (select count(*) from public.problem_revisions),
  0::bigint,
  'anonymous visitors cannot read private draft revisions'
);

reset role;
set local role authenticated;
set local request.jwt.claim.sub = '66666666-6666-4666-8666-666666666666';

select lives_ok(
  $test$
    select pg_temp.save_fixture_problem(
      (select id from public.problems where slug = 'accessible-creative-tools'),
      'published'::public.problem_status,
      'accessible-creative-tools',
      'Published the evidence-backed Problem definition'
    )
  $test$,
  'the author can publish the draft through a recorded revision'
);
select is(
  (select status::text from public.problems where slug = 'accessible-creative-tools'),
  'published',
  'publication updates the current lifecycle state'
);
select is(
  (
    select count(*)
    from public.problem_revisions
    where problem_id = (select id from public.problems where slug = 'accessible-creative-tools')
  ),
  2::bigint,
  'the author sees the private draft and public publication snapshots'
);

reset role;
set local role anon;

select is(
  (select count(*) from public.problem_directory where slug = 'accessible-creative-tools'),
  1::bigint,
  'the published Problem appears in the signed-out directory'
);
select is(
  (select need_signal_count from public.problem_directory where slug = 'accessible-creative-tools'),
  0::bigint,
  'the public Problem begins with zero need signals'
);
select is(
  (select follow_count from public.problem_directory where slug = 'accessible-creative-tools'),
  0::bigint,
  'the public Problem begins with zero follows'
);
select is(
  (
    select count(*)
    from public.problem_revisions
    where problem_id = (
      select id from public.problem_directory where slug = 'accessible-creative-tools'
    )
  ),
  1::bigint,
  'signed-out visitors see only the public revision snapshot'
);

reset role;
set local role authenticated;
set local request.jwt.claim.sub = '77777777-7777-4777-8777-777777777777';

select is(
  public.toggle_problem_need_signal(
    (select id from public.problem_directory where slug = 'accessible-creative-tools'),
    'This workflow is needed for an accessibility-focused creative team.'
  ),
  true,
  'a second active account can add one need signal'
);
select is(
  public.toggle_problem_follow(
    (select id from public.problem_directory where slug = 'accessible-creative-tools')
  ),
  true,
  'a second active account can follow the published Problem'
);
select is(
  (
    select has_need_signal
    from public.current_problem_interactions(
      (select id from public.problem_directory where slug = 'accessible-creative-tools')
    )
  ),
  true,
  'the account can read its own need-signal state'
);
select is(
  (
    select is_following
    from public.current_problem_interactions(
      (select id from public.problem_directory where slug = 'accessible-creative-tools')
    )
  ),
  true,
  'the account can read its own follow state'
);
select is(
  (
    select private_signal_context
    from public.current_problem_interactions(
      (select id from public.problem_directory where slug = 'accessible-creative-tools')
    )
  ),
  'This workflow is needed for an accessibility-focused creative team.',
  'private need context is returned only to the signalling account'
);
select is(
  (select count(*) from public.problem_need_signals),
  1::bigint,
  'RLS exposes only the current account own need-signal row'
);
select is(
  (select count(*) from public.problem_follows),
  1::bigint,
  'RLS exposes only the current account own follow row'
);

reset role;
set local role anon;

select is(
  (select need_signal_count from public.problem_directory where slug = 'accessible-creative-tools'),
  1::bigint,
  'signed-out visitors see the aggregate need count without identities'
);
select is(
  (select follow_count from public.problem_directory where slug = 'accessible-creative-tools'),
  1::bigint,
  'signed-out visitors see the aggregate follow count without identities'
);

reset role;
set local role authenticated;
set local request.jwt.claim.sub = '77777777-7777-4777-8777-777777777777';

select is(
  public.toggle_problem_need_signal(
    (select id from public.problem_directory where slug = 'accessible-creative-tools'),
    ''
  ),
  false,
  'calling the need-signal operation again reverses the signal'
);
select is(
  public.toggle_problem_follow(
    (select id from public.problem_directory where slug = 'accessible-creative-tools')
  ),
  false,
  'calling the follow operation again reverses the follow'
);

reset role;
set local role anon;

select is(
  (select need_signal_count from public.problem_directory where slug = 'accessible-creative-tools'),
  0::bigint,
  'need-signal reversal returns the public aggregate to zero'
);
select is(
  (select follow_count from public.problem_directory where slug = 'accessible-creative-tools'),
  0::bigint,
  'follow reversal returns the public aggregate to zero'
);

reset role;
set local role authenticated;
set local request.jwt.claim.sub = '77777777-7777-4777-8777-777777777777';

select throws_ok(
  $test$
    select pg_temp.save_fixture_problem(
      (select id from public.problem_directory where slug = 'accessible-creative-tools'),
      'published'::public.problem_status,
      'accessible-creative-tools',
      'Attempted an unauthorized cross-account revision'
    )
  $test$,
  '42501',
  'Problem not found or not editable by this account',
  'one account cannot revise another account Problem'
);

reset role;
set local role authenticated;
set local request.jwt.claim.sub = '66666666-6666-4666-8666-666666666666';

select throws_ok(
  $test$
    select pg_temp.save_fixture_problem(
      (select id from public.problems where slug = 'accessible-creative-tools'),
      'published'::public.problem_status,
      'changed-after-publication',
      'Attempted to change the stable public slug'
    )
  $test$,
  '22023',
  'published Problem slugs are stable',
  'a published Problem keeps a stable public URL'
);

select ok(
  pg_temp.save_fixture_problem(
    null,
    'draft'::public.problem_status,
    'private-archived-draft',
    ''
  ) is not null,
  'the author can create a second private draft'
);
select lives_ok(
  $test$
    select pg_temp.save_fixture_problem(
      (select id from public.problems where slug = 'private-archived-draft'),
      'archived'::public.problem_status,
      'private-archived-draft',
      'Archived an unpublished private draft'
    )
  $test$,
  'the author can archive an unpublished draft without publishing it'
);

reset role;
set local role anon;

select is(
  (select count(*) from public.problem_directory where slug = 'private-archived-draft'),
  0::bigint,
  'archiving an unpublished draft does not leak it into public history'
);

reset role;
set local role service_role;

select ok(
  public.admin_set_problem_moderation(
    (select id from public.problems where slug = 'accessible-creative-tools'),
    'restricted'::public.problem_moderation_state,
    'Restricted during an automated moderation visibility test'
  ),
  'service role can restrict a Problem through the explicit operation'
);

reset role;
set local role anon;

select is(
  (select count(*) from public.problem_directory where slug = 'accessible-creative-tools'),
  0::bigint,
  'a restricted Problem disappears from public read models'
);
select is(
  (select count(*) from public.problem_revisions),
  0::bigint,
  'public revision history is hidden while its Problem is restricted'
);

reset role;
set local role authenticated;
set local request.jwt.claim.sub = '66666666-6666-4666-8666-666666666666';

select is(
  (select count(*) from public.problems where slug = 'accessible-creative-tools'),
  1::bigint,
  'the author can still inspect the restricted Problem record'
);
select throws_ok(
  $test$
    select pg_temp.save_fixture_problem(
      (select id from public.problems where slug = 'accessible-creative-tools'),
      'published'::public.problem_status,
      'accessible-creative-tools',
      'Attempted to edit while moderation restricted the Problem'
    )
  $test$,
  '42501',
  'moderated Problems cannot be edited by the author',
  'authors cannot bypass a moderation restriction'
);

reset role;
set local role service_role;

select ok(
  public.admin_set_problem_moderation(
    (select id from public.problems where slug = 'accessible-creative-tools'),
    'clear'::public.problem_moderation_state,
    'Restored after the automated moderation visibility test'
  ),
  'service role can restore the clear public moderation state'
);
select ok(
  public.admin_suspend_account(
    '66666666-6666-4666-8666-666666666666',
    'Automated Problem authorization test'
  ),
  'service role can suspend the Problem author for lifecycle testing'
);

reset role;
set local role authenticated;
set local request.jwt.claim.sub = '66666666-6666-4666-8666-666666666666';

select throws_ok(
  $test$
    select pg_temp.save_fixture_problem(
      (select id from public.problems where slug = 'accessible-creative-tools'),
      'published'::public.problem_status,
      'accessible-creative-tools',
      'Attempted a revision while suspended'
    )
  $test$,
  '42501',
  'active authenticated account required',
  'suspension blocks revisions without erasing attribution'
);

reset role;
set local role service_role;

select ok(
  public.admin_restore_account('66666666-6666-4666-8666-666666666666'),
  'service role can restore the suspended author after the test'
);

insert into private.problem_interaction_events (problem_id, account_id, action)
select
  problem.id,
  account_record.id,
  'follow_added'
from generate_series(1, 26),
  public.problems as problem,
  private.accounts as account_record
where problem.slug = 'accessible-creative-tools'
  and account_record.auth_user_id = '77777777-7777-4777-8777-777777777777';

select is(
  (
    select count(*)
    from private.problem_interaction_events as event_record
    where event_record.account_id = (
      select id
      from private.accounts
      where auth_user_id = '77777777-7777-4777-8777-777777777777'
    )
  ),
  30::bigint,
  'the abuse-analysis fixture reaches the documented interaction limit'
);

reset role;
set local role authenticated;
set local request.jwt.claim.sub = '77777777-7777-4777-8777-777777777777';

select throws_ok(
  $test$
    select public.toggle_problem_follow(
      (select id from public.problem_directory where slug = 'accessible-creative-tools')
    )
  $test$,
  'P0001',
  'Problem interaction rate limit exceeded',
  'bounded telemetry rejects excessive interaction transitions'
);

select * from finish();
rollback;
