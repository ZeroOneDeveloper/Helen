'use client'

import * as React from 'react'

import { VirtuosoGrid } from 'react-virtuoso'
import { PostgrestError } from '@supabase/supabase-js'
import { Alert, AlertIcon, AlertTitle, Box, Container, Input, InputGroup, InputLeftAddon, Spinner } from '@chakra-ui/react'

import { Video } from '@/types/data'
import { supabaseClient } from '@utils/supabaseClient'
import { VideoListCard } from '@components/video/VideoListCard'
import { TbSearch } from 'react-icons/tb'

const ListContainer = React.forwardRef<HTMLDivElement, React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>>(({ children, ...props }, ref) => (
	<Box display="grid" flexWrap="wrap" gridTemplateColumns="repeat(3, 1fr)" gap={4} ref={ref} {...props}>
		{children}
	</Box>
))

const VideoListPage: React.FC = () => {
	const [total, setTotal] = React.useState(0)
	const [error, setError] = React.useState<PostgrestError | null>(null)
	const [data, setData] = React.useState<Video[]>([])
	const [query, setQuery] = React.useState('')
	const [loading, setLoading] = React.useState(true)
	const hasMore = React.useMemo(() => data.length < total, [total, data])

	const supabase = supabaseClient()

	const fetchItems = async (offset: number, reset: boolean = false, abort: AbortSignal | null = null) => {
		let queryBuilder = supabase
			.from('videos')
			.select('*', { count: 'exact' })
			.range(offset, offset + 49)

		if (query) queryBuilder = queryBuilder.textSearch('title', query)

		if (abort) queryBuilder = queryBuilder.abortSignal(abort)
		const result = await queryBuilder

		if (result.error != null) {
			setError(result.error)
			return
		}
		setError(null)
		if (reset) setData(result.data)
		else setData((data) => [...data, ...result.data])
		setTotal(result.count!)
	}

	React.useEffect(() => {
		const ac = new AbortController()
		const timeout = setTimeout(() => {
			setLoading(true)
			setData([])
			fetchItems(0, true, ac.signal).finally(() => setLoading(false))
		}, 300)

		return () => {
			clearTimeout(timeout)
			ac.abort()
		}
	}, [query])

	return (
		<Container maxW="container.lg">
			<InputGroup>
				<InputLeftAddon>
					<TbSearch />
				</InputLeftAddon>
				<Input mb={4} onChange={(e) => setQuery(e.target.value)} value={query} placeholder="검색" />
			</InputGroup>
			<VirtuosoGrid
				useWindowScroll
				components={{
					List: ListContainer,
				}}
				overscan={200}
				totalCount={data.length}
				endReached={() => {
					setLoading(true)
					fetchItems(data.length).finally(() => setLoading(false))
				}}
				itemContent={(i) => <VideoListCard video={data[i]} />}
			/>
			{data.length === 0 && !loading && !hasMore && (
				<Alert>
					<AlertIcon />
					<AlertTitle>검색 결과가 없습니다</AlertTitle>
				</Alert>
			)}
			{loading && hasMore && (
				<Box w="full" display="flex" justifyContent="center" mt={4}>
					<Spinner />
				</Box>
			)}
		</Container>
	)
}

export default VideoListPage
