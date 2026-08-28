-- Keep an unpublished archived draft private while preserving `archived` as
-- public history for Problems that were published previously.

drop policy problems_public_read on public.problems;
create policy problems_public_read
on public.problems
for select
to anon, authenticated
using (
  status in (
    'published'::public.problem_status,
    'closed'::public.problem_status,
    'archived'::public.problem_status
  )
  and published_at is not null
  and moderation_state = 'clear'::public.problem_moderation_state
);

drop policy problem_revisions_public_read on public.problem_revisions;
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
      and current_problem.published_at is not null
      and current_problem.moderation_state = 'clear'::public.problem_moderation_state
  )
);

create or replace function public.problem_need_signal_count(target_problem_id uuid)
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
        and problem.published_at is not null
        and problem.moderation_state = 'clear'::public.problem_moderation_state
    )
$function$;

create or replace function public.problem_follow_count(target_problem_id uuid)
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
        and problem.published_at is not null
        and problem.moderation_state = 'clear'::public.problem_moderation_state
    )
$function$;

create or replace view public.problem_directory
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
  and problem.published_at is not null
  and problem.moderation_state = 'clear'::public.problem_moderation_state;

comment on view public.problem_directory is
  'Privacy-safe public Problem read model; archived drafts stay private because public rows require a publication timestamp.';
