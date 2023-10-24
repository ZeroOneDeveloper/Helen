'use client'

import { useCurrentUser } from '@/utils/context'
import {
	Box,
	Button,
	Card,
	Container,
	Flex,
	HStack,
	Heading,
	IconButton,
	Menu,
	MenuButton,
	MenuIcon,
	MenuItem,
	MenuList,
	Popover,
	PopoverArrow,
	PopoverBody,
	PopoverCloseButton,
	PopoverContent,
	PopoverHeader,
	PopoverTrigger,
	Radio,
	RadioGroup,
	Stack,
	Text,
	Tooltip,
} from '@chakra-ui/react'
import * as React from 'react'
import { ProjectContext } from '../context'
import YouTube from 'react-youtube'
import { TbGlobe, TbLock, TbTrash, TbWorld } from 'react-icons/tb'

const ProjectEditorPage: React.FC = () => {
	const project = React.useContext(ProjectContext)
	const user = useCurrentUser()!

	const [visibility, setVisibility] = React.useState(project.visibility)

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
						<Popover onOpen={() => setVisibility(project.visibility)} placement="bottom-end">
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
									<Button w="full" mt={2} colorScheme="blue" isDisabled={project.visibility === visibility}>
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

export default ProjectEditorPage
