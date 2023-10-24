import { Recording, RecordingWithVideo } from '@/types/data'
import { supabaseServer } from '@/utils/supabaseServer'
import { notFound } from 'next/navigation'
import * as React from 'react'
import { ProjectProvider } from './context'

const ProjectLayout: React.FC<React.PropsWithChildren<{ params: { id: string } }>> = async ({ params: { id }, children }) => {
	const supabase = supabaseServer()

	const { data: recording } = await supabase.from('recordings').select('*, author(*), video(*)').eq('id', id).single()

	console.log(recording)

	if (!recording) {
		return notFound()
	}

	return <ProjectProvider project={recording as unknown as RecordingWithVideo}>{children}</ProjectProvider>
}

export default ProjectLayout
