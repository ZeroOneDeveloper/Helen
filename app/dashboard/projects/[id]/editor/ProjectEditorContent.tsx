'use client'

import { Caption, RecordingWithVideo } from '@/types/data'
import { useCurrentUser } from '@/utils/context'
import { supabaseClient } from '@/utils/supabaseClient'
import { handleResponse } from '@/utils/supabaseCommon'
import {
	Alert,
	AlertDescription,
	AlertIcon,
	AlertTitle,
	Box,
	Button,
	Card,
	Container,
	Flex,
	HStack,
	Heading,
	IconButton,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Popover,
	PopoverArrow,
	PopoverBody,
	PopoverCloseButton,
	PopoverContent,
	PopoverFooter,
	PopoverHeader,
	PopoverTrigger,
	Radio,
	RadioGroup,
	Spacer,
	Stack,
	Text,
	Tooltip,
	UseDisclosureReturn,
	useDisclosure,
	useToast,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { TbLock, TbMicrophone, TbPlayerPlay, TbPlayerRecordFilled, TbPlayerStop, TbTrash, TbWorld } from 'react-icons/tb'
import YouTube, { YouTubePlayer } from 'react-youtube'
import { v4 } from 'uuid'

const Caption: React.FC<{
	caption: Caption
	project: RecordingWithVideo
	active: boolean
	navigate?: () => void
	onRecord?: () => void
	index: number
}> = ({ caption, active, navigate, onRecord, project, index }) => {
	const time = React.useMemo(() => {
		const start = Math.round(caption.start)

		const pad = (value: string) => '0'.repeat(Math.max(2 - value.length, 0)) + value

		const mins = Math.floor(start / 60)
		const secs = start % 60

		return `${pad(mins.toString())}:${pad(secs.toString())}`
	}, [caption.start])
	const recording = project.chunks[index]
	const deleteDialog = useDisclosure()
	const supabase = supabaseClient()
	const router = useRouter()
	const toast = useToast({ position: 'top-right' })

	const [loading, setLoading] = React.useState(false)

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
				<Tooltip label="녹음하기">
					<IconButton onClick={onRecord} icon={<TbMicrophone />} aria-label="녹음하기 " />
				</Tooltip>
				{recording && (
					<>
						<Tooltip label="재생">
							<IconButton onClick={(e) => {}} icon={<TbPlayerPlay />} colorScheme="blue" aria-label="재생" />
						</Tooltip>
						<Popover {...deleteDialog}>
							<PopoverTrigger>
								<Box display="inline-block">
									<Tooltip label="오디오 파일 삭제">
										<IconButton onClick={() => deleteDialog.onOpen()} icon={<TbTrash />} colorScheme="red" aria-label="재생" />
									</Tooltip>
								</Box>
							</PopoverTrigger>
							<PopoverContent>
								<PopoverArrow />
								<PopoverCloseButton />
								<PopoverHeader>오디오 파일 삭제</PopoverHeader>
								<PopoverBody>삭제한 파일은 복구할 수 없습니다. 계속할까요?</PopoverBody>
								<PopoverFooter>
									<HStack>
										<Spacer />
										<Button size="sm" onClick={deleteDialog.onClose}>
											취소
										</Button>
										<Button
											size="sm"
											isLoading={loading}
											colorScheme="red"
											onClick={() => {
												setLoading(true)
												toast.promise(
													(async () => {
														const path = project.chunks[index] as string
														const chunks = [...project.chunks]
														chunks[index] = null
														console.log(handleResponse(await supabase.storage.from('recordings').list()))
														handleResponse(await supabase.storage.from('recordings').remove([path]))
														await supabase.from('recordings').update({ chunks }).eq('id', project.id)
														await router.refresh()
														deleteDialog.onClose()
													})().finally(() => setLoading(false)),
													{
														loading: { title: '오디오 파일 삭제 진행 중...' },
														error: { title: '오디오 파일 삭제 중 문제가 발생했습니다.' },
														success: { title: '오디오 파일이 삭제되었습니다.' },
													},
												)
											}}
										>
											삭제
										</Button>
									</HStack>
								</PopoverFooter>
							</PopoverContent>
						</Popover>
					</>
				)}
			</HStack>
		</Card>
	)
}

const RecordPopup: React.FC<{
	disclosure: UseDisclosureReturn
	project: RecordingWithVideo
	index: number
}> = ({ disclosure: { onClose }, project, index }) => {
	const mediaStream = React.useRef<MediaStream | null>(null)
	const mediaRecorder = React.useRef<MediaRecorder | null>(null)
	const timerLoop = React.useRef<number | null>(null)
	const [loading, setLoading] = React.useState(false)
	const [recording, setRecording] = React.useState(false)
	const [elapsed, setElapsed] = React.useState(0)
	const [url, setUrl] = React.useState<string | null>(null)
	const [blob, setBlob] = React.useState<Blob | null>(null)
	const toast = useToast({ position: 'top-right' })
	const router = useRouter()
	const supabase = supabaseClient()
	const user = useCurrentUser()!

	React.useEffect(() => {
		return () => {
			mediaRecorder.current?.stop()
			if (timerLoop.current) clearInterval(timerLoop.current)
			if (mediaStream.current) {
				mediaStream.current.getTracks().forEach((x) => x.stop())
				toast({ title: '녹음이 취소되었습니다.', status: 'warning' })
			}
		}
	}, [])

	const startRecording = async () => {
		if (mediaStream.current) {
			toast({ title: '이미 녹음이 진행중입니다.', status: 'error' })
			return
		}

		setLoading(true)
		setUrl(null)
		setBlob(null)

		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

			mediaStream.current = stream

			setRecording(true)

			const recorder = new MediaRecorder(stream)

			mediaRecorder.current = recorder

			if (timerLoop.current) clearInterval(timerLoop.current)
			setElapsed(0)
			timerLoop.current = setInterval(() => setElapsed((v) => v + 1), 1000) as unknown as number

			recorder.start()
		} catch (e) {
			console.error(e)
			toast({ title: '스트림 시작 중 오류가 발생했습니다.', status: 'error' })
		} finally {
			setLoading(false)
		}
	}

	const elapsedTimeStr = React.useMemo(() => {
		const pad = (value: string) => '0'.repeat(Math.max(2 - value.length, 0)) + value

		const mins = Math.floor(elapsed / 60)
		const secs = elapsed % 60

		return `${pad(mins.toString())}:${pad(secs.toString())}`
	}, [elapsed])

	return (
		<ModalContent>
			<ModalHeader>녹음하기</ModalHeader>
			<ModalCloseButton />
			<ModalBody>
				{recording ? (
					<Card p={4}>
						<HStack>
							<Text ml={2} color="red.500">
								<TbPlayerRecordFilled />
							</Text>
							<Text ml={4}>녹음 진행중: {elapsedTimeStr}</Text>
							<Spacer />

							<IconButton
								isLoading={loading}
								onClick={async () => {
									const recorder = mediaRecorder.current

									if (recorder) {
										setLoading(true)
										try {
											const promise = new Promise<Blob>((resolve) => {
												recorder.ondataavailable = (e) => {
													resolve(e.data)
												}
											})

											recorder.stop()

											const data = await promise

											if (url) {
												URL.revokeObjectURL(url)
											}

											const newUrl = URL.createObjectURL(data)

											setUrl(newUrl)
											setBlob(data)

											mediaStream.current?.getTracks().forEach((x) => x.stop())

											mediaRecorder.current = null
											mediaStream.current = null
											setRecording(false)
										} finally {
											setLoading(false)
										}
									} else setLoading(false)
								}}
								aria-label="종료"
								colorScheme="red"
								icon={<TbPlayerStop />}
							/>
						</HStack>
					</Card>
				) : (
					<IconButton colorScheme="red" onClick={startRecording} isLoading={loading} icon={<TbPlayerRecordFilled />} aria-label="녹음 시작" />
				)}

				{url && (
					<Box mt={4}>
						<audio controls src={url.toString()} style={{ width: '100%' }} />
					</Box>
				)}
			</ModalBody>

			<ModalFooter>
				<HStack>
					<Button onClick={onClose} isDisabled={loading}>
						닫기
					</Button>
					<Button
						colorScheme="blue"
						isLoading={loading}
						isDisabled={!blob}
						onClick={async () => {
							setLoading(true)
							try {
								if (!blob) throw new Error('blob not found')

								const fileId = v4()

								const existing = project.chunks[index]

								console.log(existing)

								if (existing) {
									const result = await supabase.storage.from('recordings').remove([existing as string])
									if (result.error) throw new Error(result.error.message)
									console.log(result.data)
								}

								const { error, data } = await supabase.storage.from('recordings').upload(`${user.id}/${project.id}/${fileId}.webm`, blob)
								if (error) throw new Error(error.message)
								const chunks = [...project.chunks]
								chunks[index] = data.path
								await supabase.from('recordings').update({ chunks }).eq('id', project.id)
								await router.refresh()
								onClose()
								toast({ status: 'success', title: '파일이 저장되었습니다.' })
							} catch (e) {
								toast({ status: 'error', title: '파일을 저장하지 못했습니다', description: `${e}` })
							} finally {
								setLoading(false)
							}
						}}
					>
						업로드
					</Button>
				</HStack>
			</ModalFooter>
		</ModalContent>
	)
}

export const ProjectEditorContent: React.FC<{ project: RecordingWithVideo }> = ({ project }) => {
	const user = useCurrentUser()!

	const [visibility, setVisibility] = React.useState(project.visibility)
	const [updating, setUpdating] = React.useState(false)
	const [player, setPlayer] = React.useState<YouTubePlayer>(null)
	const [activeIndex, setActiveIndex] = React.useState(-1)
	const [time, setTime] = React.useState(0)
	const [recordingIndex, setRecordingIndex] = React.useState(-1)

	const visibilityPopup = useDisclosure()
	const recordPopup = useDisclosure()

	const toast = useToast({ position: 'top-right' })
	const supabase = supabaseClient()
	const router = useRouter()

	React.useEffect(() => setVisibility(project.visibility), [project.visibility])

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
				setTime(currentTime)
			}
		}
		window.addEventListener('message', handler)

		return () => {
			window.removeEventListener('message', handler)
		}
	}, [])

	React.useEffect(() => {
		const adjustedTime = time + 0.4
		const index = project.video.caption?.findLastIndex((x: any) => x.start <= adjustedTime) ?? -1
		if (activeIndex !== index) setActiveIndex(index)
	}, [activeIndex, time])

	return (
		<Container mx="auto" maxW="container.xl">
			<Modal closeOnOverlayClick={false} closeOnEsc={false} isOpen={recordPopup.isOpen} onClose={recordPopup.onClose}>
				<ModalOverlay />
				<RecordPopup disclosure={recordPopup} project={project} index={recordingIndex} />
			</Modal>
			<Flex direction={{ base: 'column-reverse', lg: 'row' }} gap={4}>
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
							project={project}
							index={i}
							navigate={() => {
								player.seekTo(x.start)
							}}
							onRecord={() => {
								setRecordingIndex(i)
								recordPopup.onOpen()
							}}
							active={i === activeIndex}
							caption={x}
							key={i}
						/>
					))}
				</Box>
				<Box maxW={{ lg: 'xs' }} flexShrink={1}>
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
						<Heading mt={2} size="xs">
							{project.video.title}
						</Heading>
						<HStack justify="flex-end" mt={4}>
							<Popover
								onOpen={() => {
									setVisibility(project.visibility)
									visibilityPopup.onOpen()
								}}
								onClose={visibilityPopup.onClose}
								isOpen={visibilityPopup.isOpen}
								placement="bottom-end"
							>
								<PopoverTrigger>
									<Box display="inline-block">
										<Tooltip label="공개 범위 변경">
											<IconButton colorScheme="green" aria-label="공개 범위 변경" icon={<TbWorld />} />
										</Tooltip>
									</Box>
								</PopoverTrigger>
								<PopoverContent>
									<PopoverArrow />
									<PopoverCloseButton />
									<PopoverHeader>공개 범위 변경</PopoverHeader>
									<PopoverBody>
										<RadioGroup onChange={(v) => setVisibility(v as 'public' | 'private')} value={visibility}>
											<Stack direction="column">
												<Radio value="public">
													<HStack>
														<TbWorld />
														<Text>공개</Text>
													</HStack>
												</Radio>
												<Radio value="private">
													<HStack>
														<TbLock />
														<Text>비공개</Text>
													</HStack>
												</Radio>
											</Stack>
										</RadioGroup>
										<Button
											w="full"
											mt={2}
											colorScheme="blue"
											isDisabled={project.visibility === visibility}
											isLoading={updating}
											onClick={async () => {
												setUpdating(true)
												try {
													await supabase.from('recordings').update({ visibility }).eq('id', project.id)
													await router.refresh()
													visibilityPopup.onClose()
													toast({ status: 'success', title: '공개 범위가 설정 되었습니다.' })
												} catch (e) {
													toast({ status: 'error', title: '오류가 발생했어요', description: `${e}` })
												} finally {
													setUpdating(false)
												}
											}}
										>
											적용하기
										</Button>
									</PopoverBody>
								</PopoverContent>
							</Popover>
							<Tooltip label="삭제">
								<IconButton onClick={() => alert('TODO')} colorScheme="red" aria-label="삭제" icon={<TbTrash />} />
							</Tooltip>
						</HStack>
					</Box>
				</Box>
			</Flex>
		</Container>
	)
}
