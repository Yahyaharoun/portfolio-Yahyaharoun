-- Créer le bucket s'il n'existe pas et le rendre public
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

-- Autoriser la lecture publique pour tout le monde (anonyme et authentifié)
create policy "anyone_can_read_media"
on storage.objects for select
to public
using ( bucket_id = 'media' );

-- Autoriser l'upload pour tout le monde (le RLS d'insertion est géré par la logique applicative Next.js)
-- Si vous voulez restreindre l'upload aux utilisateurs connectés via Supabase Auth : remplacez "to public" par "to authenticated"
create policy "anyone_can_upload_media"
on storage.objects for insert
to public
with check ( bucket_id = 'media' );

-- Autoriser la mise à jour
create policy "anyone_can_update_media"
on storage.objects for update
to public
using ( bucket_id = 'media' );

-- Autoriser la suppression
create policy "anyone_can_delete_media"
on storage.objects for delete
to public
using ( bucket_id = 'media' );
