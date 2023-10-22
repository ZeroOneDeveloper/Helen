'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'

import { TbLogout } from 'react-icons/tb'
import { User } from '@supabase/supabase-js'
import { Avatar, IconButton, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react'

import { supabaseClient } from '@utils/supabaseClient'

export const HeaderProfileArea: React.FC<{ user: User }> = ({ user }) => {
	const supabase = supabaseClient()
	const router = useRouter()

	const avatar = user.user_metadata.avatar_url as string
	return (
		<Menu>
			<MenuButton as={IconButton} aria-label="프로필" borderRadius="full">
				<Avatar name={user.user_metadata.full_name} size="sm" draggable="false" userSelect="none" src={avatar} />
			</MenuButton>
			<MenuList>
				<MenuItem
					onClick={async () => {
						await supabase.auth.signOut()
						await router.push('/')
					}}
				>
					<TbLogout size={20} />
					<Text ml={2}>로그아웃</Text>
				</MenuItem>
			</MenuList>
		</Menu>
	)
}
