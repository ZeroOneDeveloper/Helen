import { Video } from '@/types/data'
import { Box, Card, Image, Text } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'

export const VideoListCard: React.FC<{ video: Video }> = ({ video }) => {
	return (
		<Box as={Link} href={`/dashboard/videos/${video.id}`} display="block" w="full" role="group">
			<Card
				w="full"
				overflow="hidden"
				transition="box-shadow ease .2s"
				_groupHover={{
					boxShadow: 'xl',
				}}
			>
				<Box backgroundImage={`url(https://i.ytimg.com/vi/${video.id}/original.jpg)`} backgroundPosition="center" w="full" backgroundSize="cover" aspectRatio={16 / 9} />
			</Card>
			<Box mt={2}>
				<Text
					transition="text-shadow ease .2s"
					_groupHover={{
						textShadow: '0 0 4px rgba(0, 0, 0, .4)',
					}}
					fontWeight="bold"
				>
					{video.title}
				</Text>
			</Box>
		</Box>
	)
}
