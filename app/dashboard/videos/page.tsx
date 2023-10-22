'use client'

import * as React from 'react'

import { VirtuosoGrid } from 'react-virtuoso'
import { PostgrestError } from '@supabase/supabase-js'
import { Box, Container, Spinner, styled } from '@chakra-ui/react'

import { Video } from '@/types/data'
import { supabaseClient } from '@utils/supabaseClient'
import { VideoListCard } from '@components/video/VideoListCard'
import { VideoCardSkeleton } from '@components/video/VideoCardSkeleton'

const ListContainer = React.forwardRef<HTMLDivElement, React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>>(({ children, ...props }, ref) => (
	<Box display="grid" flexWrap="wrap" gridTemplateColumns="repeat(3, 1fr)" gap={4} ref={ref} {...props}>
		{children}
	</Box>
))

const VideoListPage: React.FC = () => {
	const [total, setTotal] = React.useState(0)
	const [error, setError] = React.useState<PostgrestError | null>(null)
	const [data, setData] = React.useState<Video[]>([])
	const hasMore = React.useMemo(() => total === 0 || data.length < total, [total, data])

	const supabase = supabaseClient()

	const fetchItems = async (offset: number) => {
		const result = await supabase
			.from('videos')
			.select('*', { count: 'exact' })
			.range(offset, offset + 49)
		if (result.error != null) {
			setError(result.error)
			return
		}
		setError(null)
		setData((data) => [...data, ...result.data])
		setTotal(result.count!)
	}

	React.useEffect(() => {
		const timeout = setTimeout(() => {
			console.log('fetch first')
			fetchItems(0)
		})

		return () => clearTimeout(timeout)
	}, [])

	return (
		<Container maxW="container.lg">
			<VirtuosoGrid
				useWindowScroll
				components={{
					List: ListContainer,
					ScrollSeekPlaceholder: () => <VideoCardSkeleton />,
				}}
				overscan={200}
				totalCount={data.length}
				endReached={() => fetchItems(data.length)}
				itemContent={(i) => <VideoListCard video={data[i]} />}
				scrollSeekConfiguration={{
					enter: (velocity) => Math.abs(velocity) > 200,
					exit: (velocity) => Math.abs(velocity) < 30,
				}}
			/>
			{hasMore && (
				<Box w="full" display="flex" justifyContent="center" mt={4}>
					<Spinner />
				</Box>
			)}
		</Container>
	)
}

export default VideoListPage
