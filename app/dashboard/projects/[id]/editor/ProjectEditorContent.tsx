'use client'

import { Caption, RecordingWithVideo } from '@/types/data'
import { useCurrentUser } from '@/utils/context'
import { supabaseClient } from '@/utils/supabaseClient'
import {
	Container,
	Flex,
	Box,
	Card,
	Heading,
	HStack,
	Popover,
	PopoverTrigger,
	Tooltip,
	IconButton,
	PopoverContent,
	PopoverArrow,
	PopoverCloseButton,
	PopoverHeader,
	PopoverBody,
	RadioGroup,
	Stack,
	Radio,
	Button,
	Text,
	useToast,
	useDisclosure,
	Alert,
	AlertTitle,
	AlertIcon,
	AlertDescription,
	Spacer,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { TbWorld, TbLock, TbTrash, TbPlayerPlay } from 'react-icons/tb'
import YouTube, { YouTubePlayer } from 'react-youtube'

const Caption: React.FC<{ caption: Caption; active: boolean }> = ({ caption, active }) => {
	const time = React.useMemo(() => {
		const start = Math.round(caption.start)

		const pad = (value: string) => '0'.repeat(Math.max(2 - value.length, 0)) + value

		const mins = Math.floor(start / 60)
		const secs = start % 60

		return `${pad(mins.toString())}:${pad(secs.toString())}`
	}, [caption.start])

	return (
		<Card p={2} mb={4} bg={active ? 'blue.100' : undefined}>
			<HStack pl={2}>
				<Text display="block" minW={16}>
					{time}
				</Text>
				<Text>{caption.text}</Text>
				<Spacer />
				<Tooltip label="재생">
					<IconButton icon={<TbPlayerPlay />} colorScheme="blue" aria-label="재생" />
				</Tooltip>
				<Tooltip label="오디오 파일 삭제">
					<IconButton icon={<TbTrash />} colorScheme="red" aria-label="재생" />
				</Tooltip>
			</HStack>
		</Card>
	)
}

export const ProjectEditorContent: React.FC<{ project: RecordingWithVideo }> = ({ project }) => {
	const user = useCurrentUser()!

	const [visibility, setVisibility] = React.useState(project.visibility)
	const [updating, setUpdating] = React.useState(false)
	const [player, setPlayer] = React.useState<YouTubePlayer>(null)
	const [activeIndex, setActiveIndex] = React.useState(-1)

	const { onOpen, onClose, isOpen } = useDisclosure()

	const toast = useToast({ position: 'top-right' })
	const supabase = supabaseClient()
	const router = useRouter()

	React.useEffect(() => setVisibility(project.visibility), [project.visibility])

	return (
		<Container mx="auto" maxW="container.xl">
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
					{project.video.caption?.map((x: any, i) => <Caption active={i === activeIndex} caption={x} key={i} />)}
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
									onOpen()
								}}
								onClose={onClose}
								isOpen={isOpen}
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
													onClose()
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
