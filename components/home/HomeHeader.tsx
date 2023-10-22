'use client'

import { Box, Text, HStack, IconButton, Tooltip } from '@chakra-ui/react'
import Link from 'next/link'
import * as React from 'react'
import { TbLogin } from 'react-icons/tb'

export const HomeHeader: React.FC = () => {
	const rootRef = React.useRef<HTMLDivElement>(null)
	const logoRef = React.useRef<HTMLDivElement>(null)

	React.useEffect(() => {
		const handler = () => {
			let alpha = Math.min(1, (window.scrollY - 200) / 200)
			if (alpha < 0) alpha = 0
			if (rootRef.current != null) rootRef.current.style.backgroundColor = `rgba(255, 255, 255, ${alpha})`
			if (logoRef.current != null) {
				logoRef.current.style.visibility = alpha === 0 ? 'hidden' : 'visible'
				logoRef.current.style.opacity = `${alpha}`
			}
		}

		window.addEventListener('scroll', handler)

		return () => {
			window.removeEventListener('scroll', handler)
		}
	}, [])

	return (
		<HStack ref={rootRef} alignItems="center" position="sticky" w="100%" top={0} zIndex={999} p={4}>
			<Text
				cursor="pointer"
				style={{ opacity: 0 }}
				ref={logoRef}
				fontFamily="Blacksword"
				fontSize="2xl"
				onClick={() => {
					window.scrollTo({ top: 0, behavior: 'smooth' })
				}}
			>
				Helen
			</Text>
			<Box flexGrow={1} />
			<Tooltip label="로그인">
				<IconButton as={Link} href="/login" aria-label="로그인" icon={<TbLogin />} />
			</Tooltip>
		</HStack>
	)
}
