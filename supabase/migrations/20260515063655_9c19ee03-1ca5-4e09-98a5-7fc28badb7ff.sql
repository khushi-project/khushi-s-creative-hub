
-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "profiles_select_all" on public.profiles for select using (true);
create policy "profiles_insert_self" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_self" on public.profiles for update using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email,'@',1)), new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- Artworks
create table public.artworks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  image_url text not null,
  created_at timestamptz not null default now()
);
alter table public.artworks enable row level security;
create policy "artworks_select_all" on public.artworks for select using (true);
create policy "artworks_insert_own" on public.artworks for insert with check (auth.uid() = user_id);
create policy "artworks_update_own" on public.artworks for update using (auth.uid() = user_id);
create policy "artworks_delete_own" on public.artworks for delete using (auth.uid() = user_id);

-- Likes
create table public.likes (
  id uuid primary key default gen_random_uuid(),
  artwork_id uuid not null references public.artworks(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (artwork_id, user_id)
);
alter table public.likes enable row level security;
create policy "likes_select_all" on public.likes for select using (true);
create policy "likes_insert_own" on public.likes for insert with check (auth.uid() = user_id);
create policy "likes_delete_own" on public.likes for delete using (auth.uid() = user_id);

-- Comments
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  artwork_id uuid not null references public.artworks(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);
alter table public.comments enable row level security;
create policy "comments_select_all" on public.comments for select using (true);
create policy "comments_insert_own" on public.comments for insert with check (auth.uid() = user_id);
create policy "comments_delete_own" on public.comments for delete using (auth.uid() = user_id);

-- Contact messages
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);
alter table public.contact_messages enable row level security;
create policy "contact_insert_anyone" on public.contact_messages for insert with check (true);
-- no select policy => no public read

-- Storage bucket for artworks
insert into storage.buckets (id, name, public) values ('artworks','artworks', true) on conflict (id) do nothing;
create policy "artworks_bucket_read" on storage.objects for select using (bucket_id = 'artworks');
create policy "artworks_bucket_insert" on storage.objects for insert with check (bucket_id = 'artworks' and auth.uid() is not null);
create policy "artworks_bucket_delete" on storage.objects for delete using (bucket_id = 'artworks' and auth.uid() = owner);
