export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      server: {
        Row: {
          id: number
          server_uid: string
        }
        Insert: {
          id?: number
          server_uid: string
        }
        Update: {
          id?: number
          server_uid?: string
        }
      }
      user: {
        Row: {
          id: number
          last_message_timestamp: number
          level: number
          server_uid: string
          user_uid: string
          xp: number
        }
        Insert: {
          id?: number
          last_message_timestamp?: number
          level?: number
          server_uid?: string
          user_uid: string
          xp?: number
        }
        Update: {
          id?: number
          last_message_timestamp?: number
          level?: number
          server_uid?: string
          user_uid?: string
          xp?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      install_available_extensions_and_test: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
