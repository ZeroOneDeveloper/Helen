import * as React from 'react'

import { Box, Card, Heading } from '@chakra-ui/react'

export const HomeFeatureCard: React.FC<React.PropsWithChildren<{ title: React.ReactNode; icon: React.ReactNode }>> = ({ title, icon, children }) => {
	return (
		<Card p={8} h="full">
			<Box w={12} h={12} display="flex" justifyContent="center" alignItems="center" bg="blue.500" borderRadius={48} color="white" fontSize={24}>
				{icon}
			</Box>
			<Heading size="md" fontWeight="extrabold" mt={4}>
				{title}
			</Heading>
			<Box mt={2} color="gray.500">
				{children}
			</Box>
		</Card>
	)
}
