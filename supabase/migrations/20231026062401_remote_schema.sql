alter table "public"."recordings" alter column "author" set not null;

CREATE UNIQUE INDEX recordings_author_video_key ON public.recordings USING btree (author, video);

alter table "public"."recordings" add constraint "recordings_author_video_key" UNIQUE using index "recordings_author_video_key";


