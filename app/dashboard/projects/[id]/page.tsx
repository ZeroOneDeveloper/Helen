import * as React from 'react'
import { ProjectInfoContent } from './ProjectInfoContent'
import { supabaseServer } from '@/utils/supabaseServer'
import { RecordingWithVideo } from '@/types/data'
import { notFound } from 'next/navigation'

const ProjectInfoPage: React.FC<{ params: { id: string } }> = async ({ params: { id } }) => {
	const supabase = supabaseServer()

	const { data: recording } = await supabase.from('recordings').select('*, author(*), video(*)').eq('id', id).single()

	if (!recording) return notFound()

	return <ProjectInfoContent project={recording as unknown as RecordingWithVideo} />
}

export default ProjectInfoPage
