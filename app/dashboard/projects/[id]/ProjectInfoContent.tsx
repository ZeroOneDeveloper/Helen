'use client'

import { RecordingWithVideo } from '@/types/data'
import { useCurrentUser } from '@/utils/context'
import { Box, Card, Container, Flex, HStack, Heading, IconButton, Tooltip } from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { TbPencil, TbTrash } from 'react-icons/tb'

export const ProjectInfoContent: React.FC<{ project: RecordingWithVideo }> = ({ project }) => {
	const user = useCurrentUser()!
	const router = useRouter()

	return (
		<Container mx="auto" maxW="container.xl">
			<Flex direction={{ base: 'column', lg: 'row' }} gap={4}>
				<Box flexGrow={1} flexShrink={1}>
					<Heading size="md">{project.video.title}</Heading>
				</Box>
				<Box minW="xs" flexShrink={0}>
					{project.author.id === user.id && (
						<HStack>
							<Flex grow={1} />
							<Tooltip label="수정">
								<IconButton as={Link} href={`/dashboard/projects/${project.id}/editor`} colorScheme="blue" aria-label="수정" icon={<TbPencil />} />
							</Tooltip>
							<Tooltip label="삭제">
								<IconButton onClick={() => alert('TODO')} colorScheme="red" aria-label="수정" icon={<TbTrash />} />
							</Tooltip>
						</HStack>
					)}
					<Card mt={2}>Test</Card>
				</Box>
			</Flex>
		</Container>
	)
}
