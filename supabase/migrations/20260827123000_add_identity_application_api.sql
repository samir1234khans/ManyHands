-- Narrow Data API functions required by the identity application layer.
-- Every SECURITY DEFINER function uses an empty search_path and explicit grants.

create function public.current_account_context()
returns table (
  account_id uuid,
  status private.account_status
)
language sql
stable
security definer
set search_path = ''
as $function$
  select account_record.id, account_record.status
  from private.accounts as account_record
  where account_record.auth_user_id = (select auth.uid())
  limit 1
$function$;

comment on function public.current_account_context() is
  'Returns only the current authenticated user internal account identifier and lifecycle state.';

revoke all on function public.current_account_context() from public;
revoke all on function public.current_account_context() from anon;
revoke all on function public.current_account_context() from authenticated;
grant execute on function public.current_account_context() to authenticated;
grant execute on function public.current_account_context() to service_role;

create function public.request_account_deletion()
returns private.account_status
language plpgsql
volatile
security definer
set search_path = ''
as $function$
declare
  resulting_status private.account_status;
begin
  if (select auth.uid()) is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;

  update private.accounts
  set
    status = 'deletion_requested'::private.account_status,
    deletion_requested_at = now(),
    suspension_reason = null,
    suspended_at = null
  where auth_user_id = (select auth.uid())
    and status = 'active'::private.account_status
  returning status into resulting_status;

  if resulting_status is null then
    raise exception 'active account required' using errcode = '42501';
  end if;

  return resulting_status;
end;
$function$;

comment on function public.request_account_deletion() is
  'Moves the current active account into a write-locked deletion_requested state before server-side Auth deletion.';

revoke all on function public.request_account_deletion() from public;
revoke all on function public.request_account_deletion() from anon;
revoke all on function public.request_account_deletion() from authenticated;
grant execute on function public.request_account_deletion() to authenticated;

create function public.restore_failed_account_deletion(target_auth_user_id uuid)
returns boolean
language plpgsql
volatile
security definer
set search_path = ''
as $function$
declare
  restored boolean;
begin
  update private.accounts
  set
    status = 'active'::private.account_status,
    deletion_requested_at = null
  where auth_user_id = target_auth_user_id
    and status = 'deletion_requested'::private.account_status;

  get diagnostics restored = row_count;
  return restored;
end;
$function$;

comment on function public.restore_failed_account_deletion(uuid) is
  'Service-role compensation when Auth deletion fails after the account was write-locked.';

revoke all on function public.restore_failed_account_deletion(uuid) from public;
revoke all on function public.restore_failed_account_deletion(uuid) from anon;
revoke all on function public.restore_failed_account_deletion(uuid) from authenticated;
grant execute on function public.restore_failed_account_deletion(uuid) to service_role;

create function public.admin_suspend_account(target_auth_user_id uuid, reason text)
returns boolean
language plpgsql
volatile
security definer
set search_path = ''
as $function$
declare
  suspended boolean;
begin
  if reason is null or char_length(btrim(reason)) not between 1 and 500 then
    raise exception 'suspension reason must be between 1 and 500 characters' using errcode = '22023';
  end if;

  update private.accounts
  set
    status = 'suspended'::private.account_status,
    suspended_at = now(),
    suspension_reason = btrim(reason),
    deletion_requested_at = null
  where auth_user_id = target_auth_user_id
    and status in ('active'::private.account_status, 'suspended'::private.account_status);

  get diagnostics suspended = row_count;
  return suspended;
end;
$function$;

create function public.admin_restore_account(target_auth_user_id uuid)
returns boolean
language plpgsql
volatile
security definer
set search_path = ''
as $function$
declare
  restored boolean;
begin
  update private.accounts
  set
    status = 'active'::private.account_status,
    suspended_at = null,
    suspension_reason = null
  where auth_user_id = target_auth_user_id
    and status = 'suspended'::private.account_status;

  get diagnostics restored = row_count;
  return restored;
end;
$function$;

comment on function public.admin_suspend_account(uuid, text) is
  'Service-role-only lifecycle operation used by trusted moderation and integration tests.';
comment on function public.admin_restore_account(uuid) is
  'Service-role-only restoration of a suspended account.';

revoke all on function public.admin_suspend_account(uuid, text) from public;
revoke all on function public.admin_suspend_account(uuid, text) from anon;
revoke all on function public.admin_suspend_account(uuid, text) from authenticated;
revoke all on function public.admin_restore_account(uuid) from public;
revoke all on function public.admin_restore_account(uuid) from anon;
revoke all on function public.admin_restore_account(uuid) from authenticated;
grant execute on function public.admin_suspend_account(uuid, text) to service_role;
grant execute on function public.admin_restore_account(uuid) to service_role;
