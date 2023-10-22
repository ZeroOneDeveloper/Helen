import Link from 'next/link'
import * as React from 'react'

import { Box, HStack, Text } from '@chakra-ui/react'

import { supabaseServer } from '@utils/supabaseServer'
import { HeaderProfileArea } from './HeaderProfileArea'

export const dynamic = 'force-dynamic'

export const Header: React.FC = async () => {
	const supabase = supabaseServer()

	const {
		data: { user },
	} = await supabase.auth.getUser()

	return (
		<HStack borderBottomWidth={1} px={4} py={2} alignItems="center" bg="white">
			<Box display={'flex'} alignItems={'center'} gap={6}>
				<Text as={Link} href="/dashboard" cursor="pointer" fontFamily="Blacksword" fontSize="2xl">
					Helen
				</Text>
				<Text as={Link} href="/dashboard" fontWeight={'bold'}>
					Home
				</Text>
				<Text as={Link} href="/dashboard/videos" fontWeight={'bold'}>
					Explore
				</Text>
			</Box>
			<Box flexGrow={1} />
			{user && <HeaderProfileArea user={user} />}
		</HStack>
	)
}
