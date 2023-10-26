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
          author: string
          chunks: Json[]
          created_at: string
          id: string
          updated_at: string | null
          video: string
          visibility: Database["public"]["Enums"]["visibility"]
        }
        Insert: {
          author?: string
          chunks?: Json[]
          created_at?: string
          id?: string
          updated_at?: string | null
          video: string
          visibility?: Database["public"]["Enums"]["visibility"]
        }
        Update: {
          author?: string
          chunks?: Json[]
          created_at?: string
          id?: string
          updated_at?: string | null
          video?: string
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
            foreignKeyName: "recordings_video_fkey"
            columns: ["video"]
            referencedRelation: "videos"
            referencedColumns: ["id"]
          }
        ]
      }
      videos: {
        Row: {
          caption: Json[] | null
          created_at: string
          id: string
          title: string
        }
        Insert: {
          caption?: Json[] | null
          created_at?: string
          id: string
          title: string
        }
        Update: {
          caption?: Json[] | null
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
