drop policy "Recording's author can update or delete it" on "public"."recordings";

alter table "public"."recordings" drop constraint "recordings_video_id_fkey";

create table "public"."profiles" (
    "id" uuid not null,
    "updated_at" timestamp with time zone,
    "username" text,
    "full_name" text,
    "avatar_url" text
);


alter table "public"."profiles" enable row level security;

alter table "public"."recordings" drop column "author_id";

alter table "public"."recordings" drop column "video_id";

alter table "public"."recordings" add column "author" uuid default auth.uid();

alter table "public"."recordings" add column "video" character varying not null;

alter table "public"."recordings" alter column "id" set not null;

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX profiles_username_key ON public.profiles USING btree (username);

CREATE UNIQUE INDEX recordings_pkey ON public.recordings USING btree (id);

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."recordings" add constraint "recordings_pkey" PRIMARY KEY using index "recordings_pkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."profiles" add constraint "profiles_username_key" UNIQUE using index "profiles_username_key";

alter table "public"."profiles" add constraint "username_length" CHECK ((char_length(username) >= 3)) not valid;

alter table "public"."profiles" validate constraint "username_length";

alter table "public"."recordings" add constraint "recordings_author_fkey" FOREIGN KEY (author) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."recordings" validate constraint "recordings_author_fkey";

alter table "public"."recordings" add constraint "recordings_video_fkey" FOREIGN KEY (video) REFERENCES videos(id) not valid;

alter table "public"."recordings" validate constraint "recordings_video_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$function$
;

create policy "Public profiles are viewable by everyone."
on "public"."profiles"
as permissive
for select
to public
using (true);


create policy "Users can insert their own profile."
on "public"."profiles"
as permissive
for insert
to public
with check ((auth.uid() = id));


create policy "Users can update own profile."
on "public"."profiles"
as permissive
for update
to public
using ((auth.uid() = id));


create policy "Recording's author can update or delete it"
on "public"."recordings"
as permissive
for all
to authenticated
using ((auth.uid() = author));



