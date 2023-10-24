import { Profile } from '@/types/data'
import { createContext, useContext } from 'react'

export const UserContext = createContext<Profile | null>(null)

export const useCurrentUser = () => useContext(UserContext)
