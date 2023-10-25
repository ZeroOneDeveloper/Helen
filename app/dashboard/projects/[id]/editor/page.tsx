import * as React from 'react'
import { ProjectEditorContent } from './ProjectEditorContent'
import { supabaseServer } from '@/utils/supabaseServer'
import { RecordingWithVideo } from '@/types/data'
import { notFound } from 'next/navigation'

export const revalidate = 0

const ProjectEditorPage: React.FC<{ params: { id: string } }> = async ({ params: { id } }) => {
	const supabase = supabaseServer()

	const { data: project } = await supabase.from('recordings').select('*, author(*), video(*)').eq('id', id).single()

	if (!project) return notFound()

	return <ProjectEditorContent project={project as unknown as RecordingWithVideo} />
}

export default ProjectEditorPage
