'use client'

import React from 'react'
import Link from 'next/link'

import dayjs from 'dayjs'
import YouTubePlayer from 'react-youtube'
import { Box, Button, Card, Flex, Heading, Skeleton, Text, useToast } from '@chakra-ui/react'

import { Recording, Video } from '@/types/data'
import { supabaseClient } from '@utils/supabaseClient'

export const VideoPageContent: React.FC<{ video: Video; recordings: Recording[] }> = ({ video, recordings }) => {
	const createdAt = React.useMemo(() => dayjs(video.created_at).format('YYYY-MM-DD'), [video.created_at])
	const [videoLoading, setVideoLoading] = React.useState(true)
	const [creating, setCreating] = React.useState(false)
	const supabase = supabaseClient()

	const toast = useToast()

	const createRecording = async () => {
		setCreating(true)

		try {
			const { data, error } = await supabase.from('recordings').insert({ video_id: video.id }).select('id').single()
			if (error) throw error
			// console.log(response)
		} finally {
			setCreating(false)
		}
	}

	React.useEffect(() => setVideoLoading(true), [video.id])

	return (
		<Box w="full">
			<Flex gap={4} direction={{ base: 'column', lg: 'row' }}>
				<Box flexGrow={1} flexShrink={0}>
					<Card
						overflow="hidden"
						className="player"
						w="full"
						aspectRatio="16 / 9"
						position="relative"
						sx={{
							iframe: {
								position: 'absolute',
								width: '100%',
								height: '100%',
								left: 0,
								top: 0,
							},
						}}
					>
						{videoLoading && <Skeleton h="full" />}
						<YouTubePlayer onReady={() => setVideoLoading(false)} videoId={video.id} loading="lazy" />
					</Card>
					<Box mt={4}>
						<Heading size="lg">{video.title}</Heading>
						<Text>{createdAt}</Text>
					</Box>
				</Box>
				<Box>
					<Card minW="xs">
						{recordings.length == 0 ? (
							<Box p={4}>
								공개된 더빙 프로젝트가 없습니다.
								<Button mt="2" w="full" colorScheme="blue" isLoading={creating} onClick={createRecording}>
									최초 생성하기
								</Button>
							</Box>
						) : (
							<Box>{JSON.stringify(recordings)}</Box>
						)}
					</Card>
				</Box>
			</Flex>
		</Box>
	)
}
