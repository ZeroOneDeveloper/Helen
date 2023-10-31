'use client'

import React from 'react'

import { Box, Button, Card, Flex, HStack, Heading, Skeleton, Tag, Text, useToast } from '@chakra-ui/react'
import dayjs from 'dayjs'
import YouTubePlayer from 'react-youtube'

import { Recording, Video } from '@/types/data'
import { useCurrentUser } from '@/utils/context'
import { supabaseClient } from '@utils/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const ProjectLinkButton: React.FC<{ recording: Recording }> = ({ recording }) => {
	const dateStr = React.useMemo(() => dayjs(recording.created_at).format('YYYY-MM-DD'), [recording.created_at])
	const user = useCurrentUser()!

	return (
		<Button
			as={Link}
			href={`/dashboard/projects/${recording.id}`}
			variant="ghost"
			textAlign="left"
			flexDirection="column"
			h="fit-content"
			justifyContent="flex-start"
			w="full"
			p={4}
		>
			<HStack w="full">
				<Box flexGrow={1}>{recording.author.full_name}</Box>
				<Box>{dateStr}</Box>
			</HStack>
			<HStack w="full" mt="2">
				{user.id === recording.author.id && <Tag colorScheme="blue">내 프로젝트</Tag>}
				{recording.visibility === 'public' && <Tag colorScheme="green">공개된 프로젝트</Tag>}
			</HStack>
		</Button>
	)
}

export const VideoPageContent: React.FC<{ video: Video; recordings: Recording[] }> = ({ video, recordings }) => {
	const createdAt = React.useMemo(() => dayjs(video.created_at).format('YYYY-MM-DD'), [video.created_at])
	const playerRef = React.useRef<YouTubePlayer>(null)
	const [videoLoading, setVideoLoading] = React.useState(true)
	const [creating, setCreating] = React.useState(false)
	const supabase = supabaseClient()

	const toast = useToast({ position: 'top-right' })
	const router = useRouter()
	const user = useCurrentUser()!

	const createRecording = async () => {
		setCreating(true)

		try {
			const { data, error } = await supabase.from('recordings').insert({ video: video.id, author: user.id }).select('id').single()
			if (error) return toast({ title: error.message, status: 'error' })

			await router.push('/dashboard/projects/' + data.id)

			toast({ title: '프로젝트가 생성 되었습니다.', status: 'success' })
		} finally {
			setCreating(false)
		}
	}

	React.useEffect(() => setVideoLoading(true), [video.id])

	return (
		<Box w="full">
			<Flex gap={4} direction={{ base: 'column', lg: 'row' }}>
				<Box flexGrow={1}>
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
						<YouTubePlayer
							ref={playerRef}
							onReady={() => {
								setVideoLoading(false)
								console.log(playerRef.current)
							}}
							videoId={video.id}
							loading="lazy"
						/>
					</Card>
					<Box mt={4}>
						<Heading size="lg">{video.title}</Heading>
						<Text>{createdAt}</Text>
					</Box>
				</Box>
				<Box minW="xs">
					{!!recordings.length && (
						<Button mb={4} w="full" colorScheme="blue" isLoading={creating} onClick={createRecording}>
							새 더빙 프로젝트
						</Button>
					)}
					<Card w="full" maxW={{ lg: 'xs' }}>
						{recordings.length == 0 ? (
							<Box p={4}>
								공개된 더빙 프로젝트가 없습니다.
								<Button mt="2" w="full" colorScheme="blue" isLoading={creating} onClick={createRecording}>
									최초 생성하기
								</Button>
							</Box>
						) : (
							<Box>
								{recordings.map((x, i) => (
									<ProjectLinkButton recording={x} key={i} />
								))}
							</Box>
						)}
					</Card>
				</Box>
			</Flex>
		</Box>
	)
}
