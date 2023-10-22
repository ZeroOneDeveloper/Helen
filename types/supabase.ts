export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      recordings: {
        Row: {
          author_id: string | null
          chunks: Json[]
          created_at: string
          id: string | null
          updated_at: string | null
          video_id: string | null
          visibility: Database["public"]["Enums"]["visibility"]
        }
        Insert: {
          author_id?: string | null
          chunks?: Json[]
          created_at?: string
          id?: string | null
          updated_at?: string | null
          video_id?: string | null
          visibility?: Database["public"]["Enums"]["visibility"]
        }
        Update: {
          author_id?: string | null
          chunks?: Json[]
          created_at?: string
          id?: string | null
          updated_at?: string | null
          video_id?: string | null
          visibility?: Database["public"]["Enums"]["visibility"]
        }
        Relationships: [
          {
            foreignKeyName: "recordings_video_id_fkey"
            columns: ["video_id"]
            referencedRelation: "videos"
            referencedColumns: ["id"]
          }
        ]
      }
      videos: {
        Row: {
          created_at: string
          id: string
          title: string
        }
        Insert: {
          created_at?: string
          id: string
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      visibility: "public" | "private"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
