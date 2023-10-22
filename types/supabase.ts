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
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      recordings: {
        Row: {
          author: string | null
          chunks: Json[]
          created_at: string
          id: string
          updated_at: string | null
          video_id: string | null
          visibility: Database["public"]["Enums"]["visibility"]
        }
        Insert: {
          author?: string | null
          chunks?: Json[]
          created_at?: string
          id?: string
          updated_at?: string | null
          video_id?: string | null
          visibility?: Database["public"]["Enums"]["visibility"]
        }
        Update: {
          author?: string | null
          chunks?: Json[]
          created_at?: string
          id?: string
          updated_at?: string | null
          video_id?: string | null
          visibility?: Database["public"]["Enums"]["visibility"]
        }
        Relationships: [
          {
            foreignKeyName: "recordings_author_fkey"
            columns: ["author"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
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
