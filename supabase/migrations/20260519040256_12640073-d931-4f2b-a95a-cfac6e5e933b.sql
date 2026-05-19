-- Seed predefined admin user
do $$
declare
  admin_uid uuid;
begin
  select id into admin_uid from auth.users where email = 'admin@khushishub.com';

  if admin_uid is null then
    admin_uid := gen_random_uuid();
    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, recovery_sent_at, last_sign_in_at,
      raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
    ) values (
      '00000000-0000-0000-0000-000000000000', admin_uid, 'authenticated', 'authenticated',
      'admin@khushishub.com', crypt('Admin@12345', gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}', '{"full_name":"Admin"}',
      now(), now(), '', '', '', ''
    );

    insert into auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
    values (gen_random_uuid(), admin_uid,
      format('{"sub":"%s","email":"%s"}', admin_uid, 'admin@khushishub.com')::jsonb,
      'email', admin_uid::text, now(), now(), now());
  else
    -- Reset password to known value
    update auth.users
    set encrypted_password = crypt('Admin@12345', gen_salt('bf')),
        email_confirmed_at = coalesce(email_confirmed_at, now()),
        updated_at = now()
    where id = admin_uid;
  end if;

  -- Ensure admin role
  insert into public.user_roles (user_id, role)
  values (admin_uid, 'admin'::app_role)
  on conflict do nothing;
end $$;