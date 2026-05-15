
revoke execute on function public.handle_new_user() from anon, authenticated, public;
-- Restrict storage listing: only allow read of specific objects, not list-all
drop policy if exists "artworks_bucket_read" on storage.objects;
create policy "artworks_bucket_read_object" on storage.objects for select using (bucket_id = 'artworks');
