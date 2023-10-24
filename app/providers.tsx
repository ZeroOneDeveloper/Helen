// app/providers.tsx
'use client'
import type { PropsWithChildren } from 'react'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/react'
import { Profile } from '@/types/data'
import { UserContext } from '@/utils/context'

export function Providers({ children, profile }: PropsWithChildren<{ profile: Profile | null }>) {
	return (
		<CacheProvider>
			<ChakraProvider>
				<UserContext.Provider value={profile}>{children}</UserContext.Provider>
			</ChakraProvider>
		</CacheProvider>
	)
}
