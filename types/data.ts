import { Database } from './supabase'

export type Video = Database['public']['Tables']['videos']['Row']

export type Recording = Database['public']['Tables']['recordings']['Row']
