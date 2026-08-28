begin;

create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;

select plan(4);

select ok(
  has_function_privilege(
    'authenticated',
    'public.create_problem(text,text,text,text,text,text,text,text[],text[],public.problem_status,text)',
    'execute'
  ),
  'authenticated accounts can use the create-only Problem RPC'
);

select ok(
  not has_function_privilege(
    'anon',
    'public.create_problem(text,text,text,text,text,text,text,text[],text[],public.problem_status,text)',
    'execute'
  ),
  'anonymous visitors cannot create Problems'
);

insert into auth.users (id, email)
values ('88888888-8888-4888-8888-888888888888', 'problem-create-rpc@example.test');

set local role authenticated;
set local request.jwt.claim.sub = '88888888-8888-4888-8888-888888888888';

select ok(
  public.create_problem(
    'typed-create-problem',
    'Creative tooling gaps need a shared problem space',
    'People need a durable place to describe an unmet workflow before one implementation becomes the assumed answer.',
    'Designers, maintainers, researchers, and contributors who need to coordinate around the same unmet workflow.',
    'Repositories and issue trackers are useful after implementation begins, but they do not provide a neutral place to define the need and compare multiple solution attempts.',
    'Repeated coordination gaps are visible across public open-source project discussions.',
    'Existing directories tend to start from repositories, issues, or individual projects rather than the unmet need.',
    array['Web', 'Linux'],
    array['coordination', 'open source'],
    'draft'::public.problem_status,
    'Created through the typed create-only RPC'
  ) is not null,
  'an active account can create a private draft without a nullable Problem identifier'
);

select is(
  (select count(*) from public.problems where slug = 'typed-create-problem'),
  1::bigint,
  'the create-only RPC uses the validated Problem save and revision pipeline'
);

select * from finish();
rollback;
