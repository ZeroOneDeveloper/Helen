import { notFound } from 'next/navigation'

import { Container } from '@chakra-ui/react'

import { Recording } from '@/types/data'
import { supabaseServer } from '@utils/supabaseServer'
import { VideoPageContent } from './content'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const VideoPage: React.FC<{ params: { id: string } }> = async ({ params: { id } }) => {
	const supabase = supabaseServer()

	const { data: video } = await supabase.from('videos').select('*').eq('id', id).single()

	if (!video) {
		return notFound()
	}

	const { data: recordings, error } = await supabase.from('recordings').select('*, author(*)').eq('video', video.id)

	if (error) throw error

	return (
		<Container maxW="container.xl">
			<VideoPageContent video={video} recordings={recordings as unknown as Recording[]} />
		</Container>
	)
}

export default VideoPage
