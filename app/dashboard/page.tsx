import React from 'react'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Box, Container, Spinner } from '@chakra-ui/react'

export const dynamic = 'force-dynamic'

const Dashboard = async () => {
	const supabase = createServerComponentClient({ cookies })

	const {
		data: { user },
	} = await supabase.auth.getUser()
	if (!user) {
		return redirect('/login')
	}
	const data = (await supabase.from('recordings').select('*').eq('author', user.id)).data
	return (
		<Container maxW="container.lg">
			<h1>Hello, World!</h1>
		</Container>
	)
}

export default Dashboard
