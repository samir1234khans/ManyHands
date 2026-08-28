-- Problem-first public directory, authoring, revisions, follows, and private need signals.
-- Public browsing is intentionally account-free. All writes require an active internal account.

create type public.problem_status as enum ('draft', 'published', 'closed', 'archived');
create type public.problem_moderation_state as enum ('clear', 'restricted', 'removed');

create table public.problems (
  id uuid primary key default gen_random_uuid(),
  author_account_id uuid not null references private.accounts (id) on delete restrict,
  slug text not null unique,
  title text not null,
  summary text not null,
  affected_people text not null,
  context text not null,
  evidence text,
  existing_alternatives text,
  platforms text[] not null default '{}'::text[],
  tags text[] not null default '{}'::text[],
  status public.problem_status not null default 'draft',
  moderation_state public.problem_moderation_state not null default 'clear',
  revision_number integer not null default 1,
  published_at timestamptz,
  closed_at timestamptz,
  archived_at timestamptz,
  last_meaningful_update_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint problems_slug_shape check (
    slug ~ '^[a-z0-9][a-z0-9-]{1,78}[a-z0-9]$'
    and slug not like '%--%'
  ),
  constraint problems_title_length check (char_length(title) between 10 and 120),
  constraint problems_summary_length check (char_length(summary) between 30 and 400),
  constraint problems_affected_people_length check (char_length(affected_people) between 20 and 600),
  constraint problems_context_length check (char_length(context) between 20 and 3000),
  constraint problems_evidence_length check (evidence is null or char_length(evidence) <= 3000),
  constraint problems_alternatives_length check (
    existing_alternatives is null or char_length(existing_alternatives) <= 3000
  ),
  constraint problems_platform_count check (cardinality(platforms) <= 12),
  constraint problems_tag_count check (cardinality(tags) <= 20),
  constraint problems_revision_positive check (revision_number >= 1),
  constraint problems_status_timestamps check (
    (
      status = 'draft'
      and published_at is null
      and closed_at is null
      and archived_at is null
    )
    or (
      status = 'published'
      and published_at is not null
      and closed_at is null
      and archived_at is null
    )
    or (
      status = 'closed'
      and published_at is not null
      and closed_at is not null
      and archived_at is null
    )
    or (status = 'archived' and archived_at is not null)
  )
);

create index problems_author_idx on public.problems (author_account_id, updated_at desc);
create index problems_public_directory_idx
  on public.problems (status, moderation_state, last_meaningful_update_at desc);
create index problems_tags_idx on public.problems using gin (tags);
create index problems_platforms_idx on public.problems using gin (platforms);

create trigger manyhands_touch_problem_updated_at
before update on public.problems
for each row execute function private.touch_updated_at();

create table public.problem_revisions (
  id uuid primary key default gen_random_uuid(),
  problem_id uuid not null references public.problems (id) on delete cascade,
  author_account_id uuid not null references private.accounts (id) on delete restrict,
  editor_account_id uuid not null references private.accounts (id) on delete restrict,
  revision_number integer not null,
  slug text not null,
  title text not null,
  summary text not null,
  affected_people text not null,
  context text not null,
  evidence text,
  existing_alternatives text,
  platforms text[] not null,
  tags text[] not null,
  status public.problem_status not null,
  moderation_state public.problem_moderation_state not null,
  is_public boolean not null,
  change_summary text not null,
  created_at timestamptz not null default now(),
  unique (problem_id, revision_number),
  constraint problem_revisions_change_summary_length check (
    char_length(change_summary) between 5 and 500
  )
);

create index problem_revisions_problem_idx
  on public.problem_revisions (problem_id, revision_number desc);

create table public.problem_need_signals (
  problem_id uuid not null references public.problems (id) on delete cascade,
  account_id uuid not null references private.accounts (id) on delete restrict,
  private_context text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (problem_id, account_id),
  constraint problem_need_signals_context_length check (
    private_context is null or char_length(private_context) <= 500
  )
);

create trigger manyhands_touch_problem_need_signal_updated_at
before update on public.problem_need_signals
for each row execute function private.touch_updated_at();

create table public.problem_follows (
  problem_id uuid not null references public.problems (id) on delete cascade,
  account_id uuid not null references private.accounts (id) on delete restrict,
  created_at timestamptz not null default now(),
  primary key (problem_id, account_id)
);

create table private.problem_interaction_events (
  id uuid primary key default gen_random_uuid(),
  problem_id uuid not null references public.problems (id) on delete cascade,
  account_id uuid not null references private.accounts (id) on delete restrict,
  action text not null,
  created_at timestamptz not null default now(),
  constraint problem_interaction_events_action check (
    action in ('need_signal_added', 'need_signal_removed', 'follow_added', 'follow_removed')
  )
);

create index problem_interaction_events_rate_limit_idx
  on private.problem_interaction_events (account_id, created_at desc);

create table private.problem_moderation_events (
  id uuid primary key default gen_random_uuid(),
  problem_id uuid not null references public.problems (id) on delete cascade,
  moderation_state public.problem_moderation_state not null,
  reason text not null,
  created_at timestamptz not null default now(),
  constraint problem_moderation_events_reason_length check (char_length(reason) between 5 and 500)
);

alter table public.problems enable row level security;
alter table public.problems force row level security;
alter table public.problem_revisions enable row level security;
alter table public.problem_revisions force row level security;
alter table public.problem_need_signals enable row level security;
alter table public.problem_need_signals force row level security;
alter table public.problem_follows enable row level security;
alter table public.problem_follows force row level security;

create policy problems_public_read
on public.problems
for select
to anon, authenticated
using (
  status in ('published'::public.problem_status, 'closed'::public.problem_status, 'archived'::public.problem_status)
  and moderation_state = 'clear'::public.problem_moderation_state
);

create policy problems_owner_read
on public.problems
for select
to authenticated
using (author_account_id = (select private.current_account_id()));

create policy problem_revisions_public_read
on public.problem_revisions
for select
to anon, authenticated
using (
  is_public
  and exists (
    select 1
    from public.problems as current_problem
    where current_problem.id = problem_revisions.problem_id
      and current_problem.status in (
        'published'::public.problem_status,
        'closed'::public.problem_status,
        'archived'::public.problem_status
      )
      and current_problem.moderation_state = 'clear'::public.problem_moderation_state
  )
);

create policy problem_revisions_owner_read
on public.problem_revisions
for select
to authenticated
using (author_account_id = (select private.current_account_id()));

create policy problem_need_signals_owner_read
on public.problem_need_signals
for select
to authenticated
using (account_id = (select private.current_account_id()));

create policy problem_follows_owner_read
on public.problem_follows
for select
to authenticated
using (account_id = (select private.current_account_id()));

create function public.problem_need_signal_count(target_problem_id uuid)
returns bigint
language sql
stable
security definer
set search_path = ''
as $function$
  select count(*)::bigint
  from public.problem_need_signals as signal
  where signal.problem_id = target_problem_id
    and exists (
      select 1
      from public.problems as problem
      where problem.id = target_problem_id
        and problem.status in (
          'published'::public.problem_status,
          'closed'::public.problem_status,
          'archived'::public.problem_status
        )
        and problem.moderation_state = 'clear'::public.problem_moderation_state
    )
$function$;

create function public.problem_follow_count(target_problem_id uuid)
returns bigint
language sql
stable
security definer
set search_path = ''
as $function$
  select count(*)::bigint
  from public.problem_follows as follow_record
  where follow_record.problem_id = target_problem_id
    and exists (
      select 1
      from public.problems as problem
      where problem.id = target_problem_id
        and problem.status in (
          'published'::public.problem_status,
          'closed'::public.problem_status,
          'archived'::public.problem_status
        )
        and problem.moderation_state = 'clear'::public.problem_moderation_state
    )
$function$;

create view public.problem_directory
with (security_invoker = true)
as
select
  problem.id,
  problem.author_account_id,
  problem.slug,
  problem.title,
  problem.summary,
  problem.affected_people,
  problem.context,
  problem.evidence,
  problem.existing_alternatives,
  problem.platforms,
  problem.tags,
  problem.status,
  problem.revision_number,
  problem.published_at,
  problem.last_meaningful_update_at,
  problem.created_at,
  problem.updated_at,
  profile.handle as author_handle,
  profile.display_name as author_display_name,
  public.problem_need_signal_count(problem.id) as need_signal_count,
  public.problem_follow_count(problem.id) as follow_count
from public.problems as problem
left join public.contributor_profiles as profile
  on profile.account_id = problem.author_account_id
 and profile.visibility = 'public'::public.profile_visibility
where problem.status in (
    'published'::public.problem_status,
    'closed'::public.problem_status,
    'archived'::public.problem_status
  )
  and problem.moderation_state = 'clear'::public.problem_moderation_state;

comment on view public.problem_directory is
  'Privacy-safe public Problem read model with aggregate demand/follow counts and optional public author profile context.';

create function public.save_problem(
  target_problem_id uuid,
  problem_slug text,
  problem_title text,
  problem_summary text,
  problem_affected_people text,
  problem_context text,
  problem_evidence text,
  problem_existing_alternatives text,
  problem_platforms text[],
  problem_tags text[],
  desired_status public.problem_status,
  change_summary text
)
returns uuid
language plpgsql
volatile
security definer
set search_path = ''
as $function$
declare
  current_account uuid;
  current_problem public.problems%rowtype;
  resulting_problem public.problems%rowtype;
  normalized_slug text := lower(btrim(problem_slug));
  normalized_title text := btrim(problem_title);
  normalized_summary text := btrim(problem_summary);
  normalized_affected_people text := btrim(problem_affected_people);
  normalized_context text := btrim(problem_context);
  normalized_evidence text := nullif(btrim(problem_evidence), '');
  normalized_alternatives text := nullif(btrim(problem_existing_alternatives), '');
  normalized_platforms text[];
  normalized_tags text[];
  normalized_change_summary text := nullif(btrim(change_summary), '');
  next_revision integer;
  transition_allowed boolean := false;
begin
  current_account := private.current_active_account_id();
  if current_account is null then
    raise exception 'active authenticated account required' using errcode = '42501';
  end if;

  select coalesce(array_agg(item order by item), '{}'::text[])
  into normalized_platforms
  from (
    select distinct btrim(raw_item) as item
    from unnest(coalesce(problem_platforms, '{}'::text[])) as raw_item
    where btrim(raw_item) <> ''
  ) as normalized;

  select coalesce(array_agg(item order by item), '{}'::text[])
  into normalized_tags
  from (
    select distinct lower(btrim(raw_item)) as item
    from unnest(coalesce(problem_tags, '{}'::text[])) as raw_item
    where btrim(raw_item) <> ''
  ) as normalized;

  if normalized_slug !~ '^[a-z0-9][a-z0-9-]{1,78}[a-z0-9]$' or normalized_slug like '%--%' then
    raise exception 'invalid problem slug' using errcode = '22023';
  end if;
  if char_length(normalized_title) not between 10 and 120 then
    raise exception 'problem title must be between 10 and 120 characters' using errcode = '22023';
  end if;
  if char_length(normalized_summary) not between 30 and 400 then
    raise exception 'problem summary must be between 30 and 400 characters' using errcode = '22023';
  end if;
  if char_length(normalized_affected_people) not between 20 and 600 then
    raise exception 'affected people must be between 20 and 600 characters' using errcode = '22023';
  end if;
  if char_length(normalized_context) not between 20 and 3000 then
    raise exception 'problem context must be between 20 and 3000 characters' using errcode = '22023';
  end if;
  if normalized_evidence is not null and char_length(normalized_evidence) > 3000 then
    raise exception 'problem evidence must not exceed 3000 characters' using errcode = '22023';
  end if;
  if normalized_alternatives is not null and char_length(normalized_alternatives) > 3000 then
    raise exception 'existing alternatives must not exceed 3000 characters' using errcode = '22023';
  end if;
  if cardinality(normalized_platforms) > 12
    or exists (select 1 from unnest(normalized_platforms) as item where char_length(item) > 60)
  then
    raise exception 'use at most 12 platform values of 60 characters or fewer' using errcode = '22023';
  end if;
  if cardinality(normalized_tags) > 20
    or exists (select 1 from unnest(normalized_tags) as item where char_length(item) > 60)
  then
    raise exception 'use at most 20 tags of 60 characters or fewer' using errcode = '22023';
  end if;

  if target_problem_id is null then
    if desired_status not in ('draft'::public.problem_status, 'published'::public.problem_status) then
      raise exception 'new Problems may only be saved as draft or published' using errcode = '22023';
    end if;

    insert into public.problems (
      author_account_id,
      slug,
      title,
      summary,
      affected_people,
      context,
      evidence,
      existing_alternatives,
      platforms,
      tags,
      status,
      revision_number,
      published_at,
      last_meaningful_update_at
    )
    values (
      current_account,
      normalized_slug,
      normalized_title,
      normalized_summary,
      normalized_affected_people,
      normalized_context,
      normalized_evidence,
      normalized_alternatives,
      normalized_platforms,
      normalized_tags,
      desired_status,
      1,
      case when desired_status = 'published'::public.problem_status then now() else null end,
      now()
    )
    returning * into resulting_problem;

    insert into public.problem_revisions (
      problem_id,
      author_account_id,
      editor_account_id,
      revision_number,
      slug,
      title,
      summary,
      affected_people,
      context,
      evidence,
      existing_alternatives,
      platforms,
      tags,
      status,
      moderation_state,
      is_public,
      change_summary
    )
    values (
      resulting_problem.id,
      current_account,
      current_account,
      1,
      resulting_problem.slug,
      resulting_problem.title,
      resulting_problem.summary,
      resulting_problem.affected_people,
      resulting_problem.context,
      resulting_problem.evidence,
      resulting_problem.existing_alternatives,
      resulting_problem.platforms,
      resulting_problem.tags,
      resulting_problem.status,
      resulting_problem.moderation_state,
      resulting_problem.status <> 'draft'::public.problem_status,
      case
        when desired_status = 'published'::public.problem_status then 'Published the initial Problem definition'
        else 'Created the initial private draft'
      end
    );

    return resulting_problem.id;
  end if;

  select *
  into current_problem
  from public.problems
  where id = target_problem_id
  for update;

  if not found or current_problem.author_account_id <> current_account then
    raise exception 'Problem not found or not editable by this account' using errcode = '42501';
  end if;
  if current_problem.moderation_state <> 'clear'::public.problem_moderation_state then
    raise exception 'moderated Problems cannot be edited by the author' using errcode = '42501';
  end if;
  if current_problem.status <> 'draft'::public.problem_status and normalized_slug <> current_problem.slug then
    raise exception 'published Problem slugs are stable' using errcode = '22023';
  end if;
  if normalized_change_summary is null or char_length(normalized_change_summary) not between 5 and 500 then
    raise exception 'change summary must be between 5 and 500 characters' using errcode = '22023';
  end if;

  transition_allowed :=
    (current_problem.status = 'draft'::public.problem_status and desired_status in (
      'draft'::public.problem_status,
      'published'::public.problem_status,
      'archived'::public.problem_status
    ))
    or (current_problem.status = 'published'::public.problem_status and desired_status in (
      'published'::public.problem_status,
      'closed'::public.problem_status,
      'archived'::public.problem_status
    ))
    or (current_problem.status = 'closed'::public.problem_status and desired_status in (
      'closed'::public.problem_status,
      'published'::public.problem_status,
      'archived'::public.problem_status
    ))
    or (current_problem.status = 'archived'::public.problem_status and desired_status = 'archived'::public.problem_status);

  if not transition_allowed then
    raise exception 'invalid Problem status transition' using errcode = '22023';
  end if;

  next_revision := current_problem.revision_number + 1;

  update public.problems
  set
    slug = case when current_problem.status = 'draft'::public.problem_status then normalized_slug else current_problem.slug end,
    title = normalized_title,
    summary = normalized_summary,
    affected_people = normalized_affected_people,
    context = normalized_context,
    evidence = normalized_evidence,
    existing_alternatives = normalized_alternatives,
    platforms = normalized_platforms,
    tags = normalized_tags,
    status = desired_status,
    revision_number = next_revision,
    published_at = case
      when desired_status in ('published'::public.problem_status, 'closed'::public.problem_status)
        then coalesce(current_problem.published_at, now())
      when desired_status = 'archived'::public.problem_status then current_problem.published_at
      else null
    end,
    closed_at = case when desired_status = 'closed'::public.problem_status then now() else null end,
    archived_at = case when desired_status = 'archived'::public.problem_status then now() else null end,
    last_meaningful_update_at = now()
  where id = target_problem_id
  returning * into resulting_problem;

  insert into public.problem_revisions (
    problem_id,
    author_account_id,
    editor_account_id,
    revision_number,
    slug,
    title,
    summary,
    affected_people,
    context,
    evidence,
    existing_alternatives,
    platforms,
    tags,
    status,
    moderation_state,
    is_public,
    change_summary
  )
  values (
    resulting_problem.id,
    resulting_problem.author_account_id,
    current_account,
    resulting_problem.revision_number,
    resulting_problem.slug,
    resulting_problem.title,
    resulting_problem.summary,
    resulting_problem.affected_people,
    resulting_problem.context,
    resulting_problem.evidence,
    resulting_problem.existing_alternatives,
    resulting_problem.platforms,
    resulting_problem.tags,
    resulting_problem.status,
    resulting_problem.moderation_state,
    resulting_problem.status <> 'draft'::public.problem_status,
    normalized_change_summary
  );

  return resulting_problem.id;
end;
$function$;

create function private.assert_problem_interaction_rate_limit(target_account_id uuid)
returns void
language plpgsql
volatile
security definer
set search_path = ''
as $function$
begin
  if (
    select count(*)
    from private.problem_interaction_events as event_record
    where event_record.account_id = target_account_id
      and event_record.created_at >= now() - interval '10 minutes'
  ) >= 30 then
    raise exception 'Problem interaction rate limit exceeded' using errcode = 'P0001';
  end if;
end;
$function$;

create function public.toggle_problem_need_signal(
  target_problem_id uuid,
  signal_context text
)
returns boolean
language plpgsql
volatile
security definer
set search_path = ''
as $function$
declare
  current_account uuid;
  normalized_context text := nullif(btrim(signal_context), '');
  signal_exists boolean;
begin
  current_account := private.current_active_account_id();
  if current_account is null then
    raise exception 'active authenticated account required' using errcode = '42501';
  end if;
  if normalized_context is not null and char_length(normalized_context) > 500 then
    raise exception 'need-signal context must not exceed 500 characters' using errcode = '22023';
  end if;
  if not exists (
    select 1
    from public.problems as problem
    where problem.id = target_problem_id
      and problem.status = 'published'::public.problem_status
      and problem.moderation_state = 'clear'::public.problem_moderation_state
  ) then
    raise exception 'published Problem required' using errcode = '42501';
  end if;

  perform private.assert_problem_interaction_rate_limit(current_account);

  select exists (
    select 1
    from public.problem_need_signals as signal
    where signal.problem_id = target_problem_id
      and signal.account_id = current_account
  ) into signal_exists;

  if signal_exists then
    delete from public.problem_need_signals
    where problem_id = target_problem_id and account_id = current_account;

    insert into private.problem_interaction_events (problem_id, account_id, action)
    values (target_problem_id, current_account, 'need_signal_removed');

    return false;
  end if;

  insert into public.problem_need_signals (problem_id, account_id, private_context)
  values (target_problem_id, current_account, normalized_context);

  insert into private.problem_interaction_events (problem_id, account_id, action)
  values (target_problem_id, current_account, 'need_signal_added');

  return true;
end;
$function$;

create function public.toggle_problem_follow(target_problem_id uuid)
returns boolean
language plpgsql
volatile
security definer
set search_path = ''
as $function$
declare
  current_account uuid;
  follow_exists boolean;
begin
  current_account := private.current_active_account_id();
  if current_account is null then
    raise exception 'active authenticated account required' using errcode = '42501';
  end if;
  if not exists (
    select 1
    from public.problems as problem
    where problem.id = target_problem_id
      and problem.status = 'published'::public.problem_status
      and problem.moderation_state = 'clear'::public.problem_moderation_state
  ) then
    raise exception 'published Problem required' using errcode = '42501';
  end if;

  perform private.assert_problem_interaction_rate_limit(current_account);

  select exists (
    select 1
    from public.problem_follows as follow_record
    where follow_record.problem_id = target_problem_id
      and follow_record.account_id = current_account
  ) into follow_exists;

  if follow_exists then
    delete from public.problem_follows
    where problem_id = target_problem_id and account_id = current_account;

    insert into private.problem_interaction_events (problem_id, account_id, action)
    values (target_problem_id, current_account, 'follow_removed');

    return false;
  end if;

  insert into public.problem_follows (problem_id, account_id)
  values (target_problem_id, current_account);

  insert into private.problem_interaction_events (problem_id, account_id, action)
  values (target_problem_id, current_account, 'follow_added');

  return true;
end;
$function$;

create function public.current_problem_interactions(target_problem_id uuid)
returns table (
  has_need_signal boolean,
  is_following boolean,
  private_signal_context text
)
language sql
stable
security definer
set search_path = ''
as $function$
  select
    exists (
      select 1
      from public.problem_need_signals as signal
      where signal.problem_id = target_problem_id
        and signal.account_id = private.current_account_id()
    ),
    exists (
      select 1
      from public.problem_follows as follow_record
      where follow_record.problem_id = target_problem_id
        and follow_record.account_id = private.current_account_id()
    ),
    (
      select signal.private_context
      from public.problem_need_signals as signal
      where signal.problem_id = target_problem_id
        and signal.account_id = private.current_account_id()
    )
  where private.current_account_id() is not null
$function$;

create function public.admin_set_problem_moderation(
  target_problem_id uuid,
  desired_state public.problem_moderation_state,
  reason text
)
returns boolean
language plpgsql
volatile
security definer
set search_path = ''
as $function$
declare
  normalized_reason text := btrim(reason);
  changed_count integer;
begin
  if char_length(normalized_reason) not between 5 and 500 then
    raise exception 'moderation reason must be between 5 and 500 characters' using errcode = '22023';
  end if;

  update public.problems
  set moderation_state = desired_state
  where id = target_problem_id;

  get diagnostics changed_count = row_count;
  if changed_count = 0 then
    return false;
  end if;

  insert into private.problem_moderation_events (problem_id, moderation_state, reason)
  values (target_problem_id, desired_state, normalized_reason);

  return true;
end;
$function$;

comment on function public.save_problem(
  uuid, text, text, text, text, text, text, text, text[], text[], public.problem_status, text
) is 'Creates or revises the current active account own Problem through validated lifecycle transitions and immutable revision snapshots.';
comment on function public.toggle_problem_need_signal(uuid, text) is
  'Adds or removes the current active account private need signal for one published Problem with bounded abuse telemetry.';
comment on function public.toggle_problem_follow(uuid) is
  'Adds or removes the current active account follow for one published Problem with bounded abuse telemetry.';
comment on function public.current_problem_interactions(uuid) is
  'Returns only the current account own interaction state for one Problem.';
comment on function public.admin_set_problem_moderation(uuid, public.problem_moderation_state, text) is
  'Service-role-only moderation state transition with a private reason record.';

revoke all on table public.problems from public, anon, authenticated;
revoke all on table public.problem_revisions from public, anon, authenticated;
revoke all on table public.problem_need_signals from public, anon, authenticated;
revoke all on table public.problem_follows from public, anon, authenticated;
revoke all on table private.problem_interaction_events from public, anon, authenticated;
revoke all on table private.problem_moderation_events from public, anon, authenticated;

grant select on table public.problems to anon, authenticated;
grant select on table public.problem_revisions to anon, authenticated;
grant select on table public.problem_need_signals to authenticated;
grant select on table public.problem_follows to authenticated;
grant select on table public.problem_directory to anon, authenticated;

grant all on table public.problems to service_role;
grant all on table public.problem_revisions to service_role;
grant all on table public.problem_need_signals to service_role;
grant all on table public.problem_follows to service_role;
grant all on table private.problem_interaction_events to service_role;
grant all on table private.problem_moderation_events to service_role;

revoke all on function public.problem_need_signal_count(uuid) from public, anon, authenticated;
revoke all on function public.problem_follow_count(uuid) from public, anon, authenticated;
revoke all on function public.save_problem(
  uuid, text, text, text, text, text, text, text, text[], text[], public.problem_status, text
) from public, anon, authenticated;
revoke all on function public.toggle_problem_need_signal(uuid, text) from public, anon, authenticated;
revoke all on function public.toggle_problem_follow(uuid) from public, anon, authenticated;
revoke all on function public.current_problem_interactions(uuid) from public, anon, authenticated;
revoke all on function public.admin_set_problem_moderation(
  uuid, public.problem_moderation_state, text
) from public, anon, authenticated;
revoke all on function private.assert_problem_interaction_rate_limit(uuid) from public, anon, authenticated;

grant execute on function public.problem_need_signal_count(uuid) to anon, authenticated, service_role;
grant execute on function public.problem_follow_count(uuid) to anon, authenticated, service_role;
grant execute on function public.save_problem(
  uuid, text, text, text, text, text, text, text, text[], text[], public.problem_status, text
) to authenticated;
grant execute on function public.toggle_problem_need_signal(uuid, text) to authenticated;
grant execute on function public.toggle_problem_follow(uuid) to authenticated;
grant execute on function public.current_problem_interactions(uuid) to authenticated;
grant execute on function public.admin_set_problem_moderation(
  uuid, public.problem_moderation_state, text
) to service_role;
grant execute on function private.assert_problem_interaction_rate_limit(uuid) to service_role;
