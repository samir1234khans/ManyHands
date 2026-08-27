begin;

create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;

select plan(12);

insert into auth.users (id, email)
values ('33333333-3333-4333-8333-333333333333', 'deleting-user@example.test');

select is(
  (select count(*) from private.accounts),
  1::bigint,
  'the auth identity receives one internal account'
);

select is(
  (select count(*) from public.contributor_profiles),
  1::bigint,
  'the auth identity receives one contributor profile'
);

update public.contributor_profiles
set
  display_name = 'Delete Me',
  biography = 'Private biography chosen before deletion',
  avatar_url = 'https://example.test/avatar.png',
  skills = array['typescript', 'research'],
  non_code_roles = array['documentation'],
  interests = array['open-source'],
  languages = array['English'],
  availability = 'open'::public.availability_level,
  timezone = 'Asia/Kolkata',
  public_links = '[{"label":"Website","url":"https://example.test"}]'::jsonb,
  visibility = 'private'::public.profile_visibility
where handle = 'member-333333333333';

select lives_ok(
  $$
    delete from auth.users
    where id = '33333333-3333-4333-8333-333333333333'
  $$,
  'deleting the auth identity invokes the anonymization path safely'
);

select is(
  (select count(*) from private.accounts),
  1::bigint,
  'account deletion preserves the stable attribution record'
);

select ok(
  (select auth_user_id is null from private.accounts),
  'anonymization detaches the external auth identity'
);

select is(
  (select status::text from private.accounts),
  'anonymized',
  'the internal account records its anonymized lifecycle state'
);

select ok(
  (select anonymized_at is not null from private.accounts),
  'the anonymization timestamp is retained for lifecycle auditing'
);

select is(
  (select display_name from public.contributor_profiles),
  'Former contributor',
  'public attribution is replaced with a neutral label'
);

select ok(
  (
    select
      biography is null
      and avatar_url is null
      and cardinality(skills) = 0
      and cardinality(non_code_roles) = 0
      and cardinality(interests) = 0
      and cardinality(languages) = 0
      and timezone is null
      and jsonb_array_length(public_links) = 0
    from public.contributor_profiles
  ),
  'optional profile data is scrubbed during anonymization'
);

select is(
  (select availability::text from public.contributor_profiles),
  'unavailable',
  'an anonymized profile cannot advertise availability'
);

select is(
  (select visibility::text from public.contributor_profiles),
  'public',
  'the neutral attribution record remains available to future project history'
);

set local role anon;

select results_eq(
  $$select count(*)::bigint from public.profile_directory$$,
  array[1::bigint],
  'the anonymous directory exposes only the neutral attribution record'
);

select * from finish();
rollback;
