'use client'

import React from 'react'
import { Box, Button, Container, Text } from '@chakra-ui/react'
import { VirtuosoGrid } from 'react-virtuoso'
import { VideoListCard } from '@components/video/VideoListCard'
import { Video } from '@/types/data'
import Link from 'next/link'

const ListContainer = React.forwardRef<HTMLDivElement, React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>>(({ children, ...props }, ref) => (
	<Box display="grid" flexWrap="wrap" gridTemplateColumns="repeat(3, 1fr)" gap={4} ref={ref} {...props}>
		{children}
	</Box>
))

const MyProjectInfo: React.FC<{ projects: Video[] }> = ({ projects }) => {
	return (
		<Container maxW="container.lg">
			<Text mb={4} fontWeight={'bold'} fontSize={'2xl'}>
				Your Project
			</Text>
			{projects.length !== 0 ? <VirtuosoGrid
				useWindowScroll
				components={{
					List: ListContainer,
				}}
				overscan={200}
				totalCount={projects.length}
				itemContent={(i) => <VideoListCard video={projects[i]} />}
			/> : <Button colorScheme={'blue'} as={Link} href='/dashboard/videos'>Create Your First Project</Button>}
		</Container>
	)
}

export default MyProjectInfo
