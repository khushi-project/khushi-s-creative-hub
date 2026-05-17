
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create policy "user_roles_select_own" on public.user_roles
for select using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));

create policy "user_roles_admin_manage" on public.user_roles
for all using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

-- Replace artwork write policies: admin-only
drop policy if exists "artworks_insert_own" on public.artworks;
drop policy if exists "artworks_delete_own" on public.artworks;
drop policy if exists "artworks_update_own" on public.artworks;

create policy "artworks_insert_admin" on public.artworks
for insert with check (public.has_role(auth.uid(), 'admin') and auth.uid() = user_id);

create policy "artworks_update_admin" on public.artworks
for update using (public.has_role(auth.uid(), 'admin'));

create policy "artworks_delete_admin" on public.artworks
for delete using (public.has_role(auth.uid(), 'admin'));

-- Storage: admins only can upload/delete in artworks bucket; public read remains
create policy "artworks_storage_admin_insert" on storage.objects
for insert to authenticated
with check (bucket_id = 'artworks' and public.has_role(auth.uid(), 'admin'));

create policy "artworks_storage_admin_update" on storage.objects
for update to authenticated
using (bucket_id = 'artworks' and public.has_role(auth.uid(), 'admin'));

create policy "artworks_storage_admin_delete" on storage.objects
for delete to authenticated
using (bucket_id = 'artworks' and public.has_role(auth.uid(), 'admin'));
