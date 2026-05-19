
create or replace function public.grant_admin_on_signup()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email = 'admin@khushishub.com' then
    insert into public.user_roles (user_id, role)
    values (new.id, 'admin'::app_role)
    on conflict do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_grant_admin on auth.users;
create trigger on_auth_user_grant_admin
after insert on auth.users
for each row execute function public.grant_admin_on_signup();
