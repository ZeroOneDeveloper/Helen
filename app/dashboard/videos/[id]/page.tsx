import { notFound } from 'next/navigation'

import { Box, Container } from '@chakra-ui/react'

import { VideoPageContent } from './content'
import { supabaseServer } from '@utils/supabaseServer'

export const dynamic = 'force-dynamic'

const VideoPage: React.FC<{ params: { id: string } }> = async ({ params: { id } }) => {
	const supabase = supabaseServer()

	const { data: video } = await supabase.from('videos').select('*').eq('id', id).single()

	if (!video) {
		return notFound()
	}

	const { data: recordings, error } = await supabase.from('recordings').select('*').eq('video_id', video.id)

	if (error) throw error

	return (
		<Container maxW="container.xl">
			<VideoPageContent video={video} recordings={recordings} />
		</Container>
	)
}

export default VideoPage
