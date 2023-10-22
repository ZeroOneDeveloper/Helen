import React from 'react'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

const Dashboard = async () => {
	const supabase = createServerComponentClient({ cookies })

	const {
		data: { user },
	} = await supabase.auth.getUser()
	if (!user) {
		return redirect('/login')
	}
	return (
		<div>
			<h1>Hello, World!</h1>
		</div>
	)
}

export default Dashboard
