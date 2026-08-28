-- Give the application a create-only Problem RPC whose generated TypeScript
-- contract does not need to model a nullable update identifier.

create function public.create_problem(
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
language sql
volatile
security definer
set search_path = ''
as $function$
  select public.save_problem(
    null,
    problem_slug,
    problem_title,
    problem_summary,
    problem_affected_people,
    problem_context,
    problem_evidence,
    problem_existing_alternatives,
    problem_platforms,
    problem_tags,
    desired_status,
    change_summary
  )
$function$;

comment on function public.create_problem(
  text, text, text, text, text, text, text, text[], text[], public.problem_status, text
) is 'Creates a new Problem for the current active account through the same validated lifecycle and revision logic as save_problem.';

revoke all on function public.create_problem(
  text, text, text, text, text, text, text, text[], text[], public.problem_status, text
) from public, anon, authenticated;

grant execute on function public.create_problem(
  text, text, text, text, text, text, text, text[], text[], public.problem_status, text
) to authenticated;
