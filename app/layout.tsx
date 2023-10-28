import React from 'react'

import './globals.css'
import { Providers } from './providers'
import { supabaseServer } from '@/utils/supabaseServer'
import { Profile } from '@/types/data'

export const dynamic = 'force-dynamic'

export const metadata = {
	title: 'ODS',
	description: 'Your hand can change the world.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const sb = supabaseServer()
	const {
		data: { user },
	} = await sb.auth.getUser()

	let profile: Profile | null = null

	if (user) {
		profile = (await sb.from('profiles').select('*').eq('id', user.id).single()).data
	}

	return (
		<html lang="ko">
			<body>
				<Providers profile={profile}>{children}</Providers>
			</body>
		</html>
	)
}
