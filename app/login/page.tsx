'use client'

import { Box, Button, Card, Heading, VStack } from '@chakra-ui/react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function Login() {
	const supabase = createClientComponentClient()

	return (
		<Box>
			<Card maxW="md" mx="auto" mt="32" p="8">
				<Heading textAlign="center" size="lg" fontWeight="light">
					Sign In
				</Heading>
				<VStack mt="8" spacing="4">
					<Button
						leftIcon={
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
								<mask id="mask0_1408_28" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
									<path d="M20 0H0V20H20V0Z" fill="white" />
								</mask>
								<g mask="url(#mask0_1408_28)">
									<path
										d="M19.6 10.2271C19.6 9.51804 19.5364 8.83624 19.4182 8.18164H10V12.0498H15.3818C15.15 13.2998 14.4455 14.3589 13.3864 15.068V17.5771H16.6182C18.5091 15.8362 19.6 13.2725 19.6 10.2271Z"
										fill="#4285F4"
									/>
									<path
										d="M10 19.9999C12.7 19.9999 14.9636 19.1044 16.6181 17.5772L13.3863 15.0681C12.4909 15.6681 11.3454 16.0226 10 16.0226C7.3954 16.0226 5.1909 14.2635 4.4045 11.8999H1.0636V14.4908C2.7091 17.759 6.0909 19.9999 10 19.9999Z"
										fill="#34A853"
									/>
									<path
										d="M4.4045 11.9002C4.2045 11.3002 4.0909 10.6593 4.0909 10.0002C4.0909 9.34108 4.2045 8.70018 4.4045 8.10018V5.50928H1.0636C0.3864 6.85928 0 8.38658 0 10.0002C0 11.6138 0.3864 13.1411 1.0636 14.4911L4.4045 11.9002Z"
										fill="#FBBC04"
									/>
									<path
										d="M10 3.9773C11.4681 3.9773 12.7863 4.4818 13.8227 5.4727L16.6909 2.6045C14.9591 0.9909 12.6954 0 10 0C6.0909 0 2.7091 2.2409 1.0636 5.5091L4.4045 8.1C5.1909 5.7364 7.3954 3.9773 10 3.9773Z"
										fill="#E94235"
									/>
								</g>
							</svg>
						}
						w="full"
						onClick={async () => {
							await supabase.auth.signInWithOAuth({
								provider: 'google',
								options: {
									redirectTo: `${process.env.NEXT_PUBLIC_ROOT_URI}/auth/callback`,
								},
							})
						}}
						bg={'#F2F2F2'}
						_hover={{ bg: '#dadada' }}
						_active={{ bg: '#c2c2c2' }}
					>
						<Box flexGrow={1} color="#1F1F1F">
							Continue With Google
						</Box>
					</Button>
					<Button
						leftIcon={
							<svg width="18" height="18" viewBox="0 0 32 32" fill="#000000" xmlns="http://www.w3.org/2000/svg">
								<path
									d="M32 13.4444C32 20.3173 24.8366 25.8889 16 25.8889C7.16344 25.8889 0 20.3173 0 13.4444C0 6.57157 7.16344 1 16 1C24.8366 1 32 6.57157 32 13.4444Z"
									fill="currentColor"
								/>
								<path
									d="M7.44989 20.6606L5.55742 30.5014C5.47983 30.9049 5.94424 31.1886 6.26778 30.9354L14.9732 24.1224C15.2372 23.9158 15.1861 23.5025 14.8798 23.3663L8.06685 20.3384C7.80542 20.2222 7.50392 20.3796 7.44989 20.6606Z"
									fill="currentColor"
								/>
							</svg>
						}
						w="full"
						onClick={async () => {
							await supabase.auth.signInWithOAuth({
								provider: 'kakao',
								options: {
									redirectTo: `${process.env.NEXT_PUBLIC_ROOT_URI}/auth/callback`,
								},
							})
						}}
						bg={'#FEE500'}
						_hover={{ bg: '#e5ce00' }}
						_active={{ bg: '#cbb700' }}
					>
						<Box flexGrow={1} color="black" opacity="85%">
							Continue With Kakao
						</Box>
					</Button>
				</VStack>
			</Card>
			{/* login
      <Button onClick={async () => {
        console.log(await supabase.auth.signInWithOAuth({provider: 'google', options: {redirectTo: 'http://localhost:3000/auth/callback'}}))
      }}>test - google</Button>
      <Messages /> */}
		</Box>
	)
}
