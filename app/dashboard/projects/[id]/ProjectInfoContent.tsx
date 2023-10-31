'use client'

import type { Caption } from '@/types/data'
import { RecordingWithVideo } from '@/types/data'
import { useCurrentUser } from '@/utils/context'
import { supabaseClient } from '@/utils/supabaseClient'
import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Card, Container, Flex, HStack, Heading, IconButton, Spacer, Text, Tooltip, useToast } from '@chakra-ui/react'
import Link from 'next/link'
import * as React from 'react'
import { TbPencil, TbPlayerPause, TbPlayerPlay, TbTrash } from 'react-icons/tb'
import YouTube, { YouTubePlayer } from 'react-youtube'
import { AudioFileStore } from './editor/ProjectEditorContent'
import { ProjectDeletePopup } from '@components/ProjectDeletePopup'

const Caption: React.FC<{
	caption: Caption
	project: RecordingWithVideo
	active: boolean
	navigate?: () => void
	index: number
	store: AudioFileStore
}> = ({ caption, active, navigate, project, index, store }) => {
	const time = React.useMemo(() => {
		const start = Math.round(caption.start)

		const pad = (value: string) => '0'.repeat(Math.max(2 - value.length, 0)) + value

		const mins = Math.floor(start / 60)
		const secs = start % 60

		return `${pad(mins.toString())}:${pad(secs.toString())}`
	}, [caption.start])
	const file = React.useMemo(() => {
		return store[index]
	}, [index, store])
	const recording = project.chunks[index]
	const [playing, setPlaying] = React.useState(false)

	React.useEffect(() => {
		const audio = file?.audio
		if (!audio) return
		const pause = () => {
			setPlaying(false)
			file.playing = false
		}
		const play = () => {
			setPlaying(true)
			file.playing = true
		}
		const ended = () => {
			setPlaying(false)
			file.playing = false
		}

		audio.addEventListener('pause', pause)
		audio.addEventListener('play', play)
		audio.addEventListener('ended', ended)

		return () => {
			audio.removeEventListener('play', play)
			audio.removeEventListener('pause', pause)
			audio.removeEventListener('stop', stop)
		}
	}, [file?.audio])

	return (
		<Card p={2} mb={4} bg={active ? 'blue.100' : undefined}>
			<HStack pl={2}>
				<Text display="block" minW={16}>
					{time}
				</Text>
				<Tooltip label="클릭해 이동">
					<Text cursor="pointer" onClick={navigate}>
						{caption.text}
					</Text>
				</Tooltip>
				<Spacer />
				{recording && (
					<Tooltip label="재생">
						<IconButton
							onClick={() => {
								const audio = file?.audio
								if (!audio) return
								audio.play()
							}}
							icon={playing ? <TbPlayerPause /> : <TbPlayerPlay />}
							colorScheme="blue"
							aria-label="재생"
						/>
					</Tooltip>
				)}
			</HStack>
		</Card>
	)
}

export const ProjectInfoContent: React.FC<{ project: RecordingWithVideo }> = ({ project }) => {
	const user = useCurrentUser()!
	const [player, setPlayer] = React.useState<YouTubePlayer>(null)
	const [activeIndex, setActiveIndex] = React.useState(-1)
	const [time, setTime] = React.useState(0)
	const [files, setFiles] = React.useState<AudioFileStore>([])
	const filesRef = React.useRef<AudioFileStore>(files)
	const playingRef = React.useRef<boolean>(false)
	const toast = useToast({ position: 'top-right' })

	const supabase = supabaseClient()

	React.useEffect(() => {
		const handler = (e: MessageEvent<any>) => {
			const rawData = e.data
			if (typeof rawData !== 'string') return
			let data
			try {
				data = JSON.parse(rawData)
			} catch {
				data = null
			}
			if (!data) return

			if (data.channel !== 'widget') return

			if (data.event === 'infoDelivery') {
				const currentTime = data.info.currentTime
				if (currentTime === undefined) return
				setTime(currentTime)

				if (!playingRef.current) return

				const captions = (project.video.caption as any[]) ?? []
				const files = filesRef.current

				for (let i = 0; i < files.length; i++) {
					const file = files[i]
					const caption = captions[i] as Caption
					const chunk = project.chunks[i] as { duration: number }
					if (!chunk) continue
					if (file && caption) {
						const audio = file.audio
						const end = caption.start + Math.max(chunk.duration / 1000)
						const seekTime = currentTime - caption.start

						if (caption.start <= currentTime && end >= currentTime) {
							audio.currentTime = seekTime
							audio.play()
						} else {
							audio.pause()
						}
					}
				}

				return
			}

			if (data.event === 'onStateChange') {
				const playing = data.info === 1
				for (const file of filesRef.current) {
					if (!file) continue
					if (!playing) file.audio.pause()
				}
				playingRef.current = playing
				return
			}
		}
		window.addEventListener('message', handler)

		return () => {
			window.removeEventListener('message', handler)
		}
	}, [])

	React.useEffect(() => {
		const adjustedTime = time + 0.4
		const captions = project.video.caption
		if (!captions) return
		const index = captions.findLastIndex((x: any) => x.start <= adjustedTime) ?? -1
		if (activeIndex !== index) {
			setActiveIndex(index)
		}
	}, [activeIndex, time])

	React.useEffect(() => {
		const ac = new AbortController()

		const timeout = setTimeout(() => {
			toast.promise(
				(async () => {
					if (ac.signal.aborted) return
					const audioFiles = [...files]

					for (let i = 0; i < project.chunks.length; i++) {
						const chunk = project.chunks[i] as { path: string; duration: number }
						if (!chunk) continue
						if (audioFiles[i]) continue

						const {
							data: { publicUrl },
						} = supabase.storage.from('recordings').getPublicUrl(chunk.path)

						const blob = await (await fetch(publicUrl)).blob()
						if (ac.signal.aborted) return

						const objectURL = URL.createObjectURL(blob)

						const audio = new Audio(objectURL)

						await new Promise<void>((resolve) => {
							audio.addEventListener('canplaythrough', () => resolve(), false)
						})

						audioFiles[i] = { played: false, audio, objectURL, playing: false }
					}

					const toRemove: number[] = []
					audioFiles.forEach((_x, i) => {
						if (!project.chunks[i]) {
							toRemove.push(i)
						}
					})
					toRemove.forEach((x) => {
						const f = audioFiles[x]
						if (f) {
							URL.revokeObjectURL(f.objectURL)
						}
						audioFiles[x] = undefined
					})
					setFiles(audioFiles)
					filesRef.current = audioFiles
				})(),
				{
					success: {
						title: '오디오 파일 다운로드가 완료 되었습니다.',
					},
					error: {
						title: '오디오 파일 다운로드 중 문제가 발생했습니다',
					},
					loading: {
						title: '오디오 파일을 다운로드 중입니다...',
					},
				},
			)
		}, 100)

		return () => {
			clearTimeout(timeout)
			ac.abort()
		}
	}, [project.chunks])

	return (
		<Container mx="auto" maxW="container.xl">
			<Flex direction={{ base: 'column', lg: 'row' }} gap={4}>
				<Box flexGrow={1} flexShrink={1}>
					<Heading size="md">{project.video.title}</Heading>
					<Text>by {project.author.full_name}</Text>
				</Box>
				<Box minW="xs" flexShrink={0}>
					{project.author.id === user.id && (
						<HStack>
							<Flex grow={1} />
							<Tooltip label="수정">
								<IconButton as={Link} href={`/dashboard/projects/${project.id}/editor`} colorScheme="blue" aria-label="수정" icon={<TbPencil />} />
							</Tooltip>
							<ProjectDeletePopup project={project} />
						</HStack>
					)}
				</Box>
			</Flex>

			<Flex mt={4} direction={{ base: 'column-reverse', lg: 'row' }} gap={4}>
				<Box flexGrow={1}>
					{!project.video.caption?.length && (
						<Alert status="error" p={4} alignItems="flex-start">
							<AlertIcon />
							<Box>
								<AlertTitle>등록된 자막이 없습니다.</AlertTitle>
								<AlertDescription>자막이 존재하지 않는 영상은 사용할 수 없습니다.</AlertDescription>
							</Box>
						</Alert>
					)}
					{project.video.caption?.map((x: any, i) => (
						<Caption
							store={files}
							project={project}
							index={i}
							navigate={() => {
								player.seekTo(x.start)
							}}
							active={i === activeIndex}
							caption={x}
							key={i}
						/>
					))}
				</Box>
				<Box maxW={{ lg: 'xl' }} flexShrink={1} minW="xl">
					<Box position="sticky" top={4}>
						<Card
							aspectRatio="16 / 9"
							position="relative"
							overflow="hidden"
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
							<YouTube
								onReady={(e) => {
									setPlayer(e.target)
								}}
								videoId={project.video.id}
							/>
						</Card>
					</Box>
				</Box>
			</Flex>
		</Container>
	)
}
