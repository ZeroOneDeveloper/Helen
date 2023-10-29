drop policy "All users can view public recordings" on "public"."recordings";

create policy "All users can view public recordings"
on "public"."recordings"
as permissive
for select
to authenticated
using ((visibility = 'public'::visibility));



