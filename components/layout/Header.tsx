import * as React from 'react'
import Link from 'next/link'

import { Box, HStack, Text } from '@chakra-ui/react'

import { supabaseServer } from '@utils/supabaseServer'
import { HeaderProfileArea } from './HeaderProfileArea'

export const Header: React.FC = async () => {
	const supabase = supabaseServer()

	const {
		data: { user },
	} = await supabase.auth.getUser()

	return (
		<HStack borderBottomWidth={1} px={4} py={2} alignItems="center">
			<Box display={'flex'} alignItems={'center'} gap={6}>
				<Text as={Link} href="/dashboard" cursor="pointer" fontFamily="Blacksword" fontSize="2xl">
					Helen
				</Text>
				<Text fontWeight={'bold'}>Home</Text>
				<Text fontWeight={'bold'}>Explore</Text>
			</Box>
			<Box flexGrow={1} />
			{user && <HeaderProfileArea user={user} />}
		</HStack>
	)
}
