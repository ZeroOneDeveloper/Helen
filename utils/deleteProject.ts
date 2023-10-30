import { RecordingWithVideo } from '@/types/data'
import { SupabaseClient } from '@supabase/supabase-js'

export const deleteProject = async (supabase: SupabaseClient, project: RecordingWithVideo) => {
	const files = project.chunks.filter((x) => x).map((x) => (x as { path: string }).path)

	await supabase.storage.from('recordings').remove(files)
	await supabase.from('recordings').delete().eq('id', project.id)
}
