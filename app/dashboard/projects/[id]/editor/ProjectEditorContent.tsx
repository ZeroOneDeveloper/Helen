'use client'

import { RecordingWithVideo } from '@/types/data'
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
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { TbWorld, TbLock, TbTrash } from 'react-icons/tb'
import YouTube from 'react-youtube'

export const ProjectEditorContent: React.FC<{ project: RecordingWithVideo }> = ({ project }) => {
	const user = useCurrentUser()!

	const [visibility, setVisibility] = React.useState(project.visibility)
	const [updating, setUpdating] = React.useState(false)

	const { onOpen, onClose, isOpen } = useDisclosure()

	const toast = useToast({ position: 'top-right' })
	const supabase = supabaseClient()
	const router = useRouter()

	React.useEffect(() => setVisibility(project.visibility), [project.visibility])

	return (
		<Container mx="auto" maxW="container.xl">
			<Flex direction={{ base: 'column-reverse', lg: 'row' }} gap={4}>
				<Box flexGrow={1}>
					<Box>asdfasdf</Box>
					<Box>asdfasdf</Box>
					<Box>asdfasdf</Box>
					<Box>asdfasdf</Box>
					<Box>asdfasdf</Box>
					<Box>asdfasdf</Box>
					<Box>asdfasdf</Box>
					<Box>asdfasdf</Box>
					<Box>asdfasdf</Box>
					<Box>asdfasdf</Box>
					<Box>asdfasdf</Box>
					<Box>asdfasdf</Box>
				</Box>
				<Box maxW={{ lg: 'xs' }} flexShrink={1}>
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
						<YouTube videoId={project.video.id} />
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
							<IconButton colorScheme="red" aria-label="삭제" icon={<TbTrash />} />
						</Tooltip>
					</HStack>
				</Box>
			</Flex>
		</Container>
	)
}
