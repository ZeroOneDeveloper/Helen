import { Database } from './supabase'

export type Video = Database['public']['Tables']['videos']['Row']
