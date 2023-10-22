import * as React from 'react'
import { redirect } from 'next/navigation'

import { Box } from '@chakra-ui/react'

import { Header } from '@components/layout/Header'
import { supabaseServer } from '@utils/supabaseServer'

export const dynamic = 'force-dynamic'

const DashboardLayout: React.FC<React.PropsWithChildren> = async ({ children }) => {
	const supabase = supabaseServer()

	const user = await supabase.auth.getUser()

	if (user.data.user == null) {
		return redirect('/')
	}

	return (
		<Box bg="gray.50" minH="100vh">
			<Header />
			<Box px={4} py={4}>
				{children}
			</Box>
		</Box>
	)
}

export default DashboardLayout
