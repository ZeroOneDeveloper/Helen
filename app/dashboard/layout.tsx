import * as React from 'react'
import { redirect } from 'next/navigation'

import { Box } from '@chakra-ui/react'

import { Header } from '@components/layout/Header'
import { supabaseServer } from '@utils/supabaseServer'

const DashboardLayout: React.FC<React.PropsWithChildren> = async ({ children }) => {
	const supabase = supabaseServer()

	const user = await supabase.auth.getUser()

	if (user.data.user == null) {
		return redirect('/')
	}

	return (
		<Box>
			<Header />
			<Box px={4} py={4}>
				{children}
			</Box>
		</Box>
	)
}

export default DashboardLayout
