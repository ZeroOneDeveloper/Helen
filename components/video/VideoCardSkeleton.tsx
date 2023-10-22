import { Box, Card, Skeleton } from '@chakra-ui/react'
import React from 'react'

export const VideoCardSkeleton: React.FC = () => {
	return (
		<Box w="full">
			<Card w="full" overflow="hidden">
				<Skeleton w="full" aspectRatio={16 / 9} />
				{/* backgroundImage={`url(https://i.ytimg.com/vi/${video.id}/original.jpg)`} */}
			</Card>
			<Box mt={2}>
				<Skeleton height="6" />
			</Box>
		</Box>
	)
}
