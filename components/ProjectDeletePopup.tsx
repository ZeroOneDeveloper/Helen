'use client'

import React from 'react'
import {
	Box,
	Button,
	HStack,
	IconButton,
	Popover,
	PopoverArrow,
	PopoverBody,
	PopoverCloseButton,
	PopoverContent,
	PopoverFooter,
	PopoverHeader,
	PopoverTrigger,
	Spacer,
	Tooltip,
	useDisclosure,
	useToast,
} from '@chakra-ui/react'
import { RecordingWithVideo } from '@types/data'
import { deleteProject } from '@utils/deleteProject'
import { TbTrash } from 'react-icons/tb'
import { supabaseClient } from '@utils/supabaseClient'
import { useRouter } from 'next/navigation'

export const ProjectDeletePopup: React.FC<{ project: RecordingWithVideo }> = ({ project }) => {
	const supabase = supabaseClient()

	const toast = useToast({ position: 'top-right' })
	const router = useRouter()

	const [deleting, setDeleting] = React.useState(false)

	const { onClose, onOpen, isOpen } = useDisclosure()

	return (
		<Popover isOpen={isOpen || deleting} onOpen={onOpen} onClose={onClose}>
			<PopoverTrigger>
				<Box>
					<Tooltip label="삭제">
						<IconButton colorScheme="red" aria-label="삭제" icon={<TbTrash />} />
					</Tooltip>
				</Box>
			</PopoverTrigger>
			<PopoverContent>
				<PopoverHeader>프로젝트 삭제</PopoverHeader>
				<PopoverCloseButton />
				<PopoverArrow />
				<PopoverBody>삭제한 프로젝트는 복구할 수 없습니다. 계속할까요?</PopoverBody>
				<PopoverFooter>
					<HStack>
						<Spacer />
						<Button isDisabled={deleting} onClick={() => onClose()} size="sm">
							취소
						</Button>
						<Button
							isLoading={deleting}
							onClick={() => {
								setDeleting(true)
								toast.promise(
									deleteProject(supabase, project)
										.then(async () => {
											router.push('/dashboard')
										})
										.finally(() => setDeleting(false)),
									{
										loading: {
											title: '프로젝트 삭제 중...',
										},
										error: (e) => ({
											title: '프로젝트를 삭제하지 못했습니다.',
											description: e.message,
										}),
										success: {
											title: '프로젝트가 삭제 되었습니다.',
										},
									},
								)
							}}
							size="sm"
							colorScheme="red"
						>
							삭제
						</Button>
					</HStack>
				</PopoverFooter>
			</PopoverContent>
		</Popover>
	)
}
