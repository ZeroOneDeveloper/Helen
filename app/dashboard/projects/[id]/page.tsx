'use client'

import { Box, Card, Container, Flex, HStack, Heading, IconButton, Text, Tooltip, VStack } from '@chakra-ui/react'
import * as React from 'react'
import { TbPencil, TbTrash } from 'react-icons/tb'
import { ProjectContext } from './context'
import { useCurrentUser } from '@/utils/context'
import Link from 'next/link'

const ProjectInfoPage: React.FC = () => {
	const project = React.useContext(ProjectContext)
	const user = useCurrentUser()!

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
								<IconButton colorScheme="red" aria-label="수정" icon={<TbTrash />} />
							</Tooltip>
						</HStack>
					)}
					<Card mt={2}>Test</Card>
				</Box>
			</Flex>
		</Container>
	)
}

export default ProjectInfoPage
