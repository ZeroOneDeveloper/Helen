'use client';

import React from 'react'
import {
	Box, Button,
	Card, HStack, IconButton,
	ModalBody,
	ModalCloseButton,
	ModalContent, ModalFooter,
	ModalHeader, Spacer,
	Text,
	UseDisclosureReturn,
	useToast
} from '@chakra-ui/react'
import { Caption, RecordingWithVideo } from '@/types/data'
import { useRouter } from 'next/navigation'
import { supabaseClient } from '@utils/supabaseClient'
import { useCurrentUser } from '@utils/context'
import { TbPlayerRecordFilled, TbPlayerStop } from 'react-icons/tb'
import Crunker from 'crunker'
import { v4 } from 'uuid'
import { handleResponse } from '@utils/supabaseCommon'
import { AudioEditor } from '@/components/audio/AudioEditor';

const RecordPopup: React.FC<{
	disclosure: UseDisclosureReturn
	project: RecordingWithVideo
	index: number
}> = ({ disclosure: { onClose }, project, index }) => {
	const mediaStream = React.useRef<MediaStream | null>(null)
	const mediaRecorder = React.useRef<MediaRecorder | null>(null)
	const timerLoop = React.useRef<number | null>(null)
	const startTime = React.useRef<number>(0)
	const duration = React.useRef<number>(0)
	const [loading, setLoading] = React.useState(false)
	const [recording, setRecording] = React.useState(false)
	const [elapsed, setElapsed] = React.useState(0)
	const [url, setUrl] = React.useState<string | null>(null)
	const [blob, setBlob] = React.useState<Blob | null>(null)

	const toast = useToast({ position: 'top-right' })
	const router = useRouter()
	const supabase = supabaseClient()
	const user = useCurrentUser()!

	const rangeRef = React.useRef<{ start: number; end: number }>({ start: 0, end: 0 })

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

			const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })

			mediaRecorder.current = recorder

			if (timerLoop.current) clearInterval(timerLoop.current)
			setRecording(true)
			setElapsed(0)
			startTime.current = Date.now()
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
				<Text fontWeight={'bold'} fontSize={'xl'} mb={4}>
					{(project.video.caption![index] as Caption).text}
				</Text>
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
										duration.current = Date.now() - startTime.current
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
						<AudioEditor src={url} valueRef={rangeRef} />

						{/*<audio controls src={url.toString()} style={{ width: '100%' }} />*/}
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

								const crunker = new Crunker()
								const range = rangeRef.current

								const [buffer] = await crunker.fetchAudio(blob)
								const sliced = crunker.sliceAudio(buffer, range.start, range.end)
								const { blob: outBlob } = crunker.export(sliced, 'audio/webm')

								const fileId = v4()

								const existing = project.chunks[index]

								if (existing) {
									const result = await supabase.storage.from('recordings').remove([(existing as { path: string }).path])
									if (result.error) throw new Error(result.error.message)
								}

								const { path } = handleResponse(await supabase.storage.from('recordings').upload(`${user.id}/${project.id}/${fileId}.webm`, outBlob))

								const chunks = [...project.chunks]
								chunks[index] = { path, duration: duration.current }
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

export default RecordPopup