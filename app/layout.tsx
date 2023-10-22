import React from 'react'

import './globals.css'
import { Providers } from './providers'

export const metadata = {
	title: 'Helen',
	description: 'Your hand can change the world.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="ko">
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
