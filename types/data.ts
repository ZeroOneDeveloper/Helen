import { Database } from './supabase'

export type Video = Database['public']['Tables']['videos']['Row']

export type Profile = Database['public']['Tables']['profiles']['Row']

export type Recording = Omit<Database['public']['Tables']['recordings']['Row'], 'author'> & {
	author: Profile
}

export type RecordingWithVideo = Omit<Recording, 'video'> & {
	video: Video
}

export type Caption = {
	text: string
	start: number
	duration: number
}
