'use client'

import { Recording, RecordingWithVideo } from '@/types/data'
import { PropsWithChildren, createContext } from 'react'

export const ProjectContext = createContext<RecordingWithVideo>(null!)

export const ProjectProvider: React.FC<PropsWithChildren<{ project: RecordingWithVideo }>> = ({ project, children }) => (
	<ProjectContext.Provider value={project}>{children}</ProjectContext.Provider>
)
