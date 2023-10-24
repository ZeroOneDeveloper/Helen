'use client'

import { Recording } from '@/types/data'
import { PropsWithChildren, createContext } from 'react'

export const ProjectContext = createContext<Recording>(null!)

export const ProjectProvider: React.FC<PropsWithChildren<{ project: Recording }>> = ({ project, children }) => (
	<ProjectContext.Provider value={project}>{children}</ProjectContext.Provider>
)
