create policy "Anyone can upload an avatar."
on "storage"."objects"
as permissive
for insert
to public
with check ((bucket_id = 'avatars'::text));


create policy "Avatar images are publicly accessible."
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'avatars'::text));


create policy "Give users access to all authenticated users"
on "storage"."objects"
as permissive
for select
to authenticated
using ((bucket_id = 'recordings'::text));


create policy "Give users access to own folder c5wwbm_1"
on "storage"."objects"
as permissive
for insert
to authenticated
with check (((bucket_id = 'recordings'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Give users access to own folder c5wwbm_2"
on "storage"."objects"
as permissive
for update
to authenticated
using (((bucket_id = 'recordings'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Give users access to own folder c5wwbm_3"
on "storage"."objects"
as permissive
for delete
to authenticated
using (((bucket_id = 'recordings'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));



