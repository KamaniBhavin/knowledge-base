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
      crawlers: {
        Row: {
          crawled_at: string | null
          created_at: string
          failed_at: string | null
          id: number
          priority: number
          scheduled_at: string | null
          started_at: string | null
          url: string
          url_document_type: Database["public"]["Enums"]["url_document_type"]
        }
        Insert: {
          crawled_at?: string | null
          created_at?: string
          failed_at?: string | null
          id?: number
          priority: number
          scheduled_at?: string | null
          started_at?: string | null
          url: string
          url_document_type: Database["public"]["Enums"]["url_document_type"]
        }
        Update: {
          crawled_at?: string | null
          created_at?: string
          failed_at?: string | null
          id?: number
          priority?: number
          scheduled_at?: string | null
          started_at?: string | null
          url?: string
          url_document_type?: Database["public"]["Enums"]["url_document_type"]
        }
        Relationships: []
      }
      documents: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: []
      }
      slack_team_tokens: {
        Row: {
          created_at: string | null
          id: number
          team_id: string
          token: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          team_id: string
          token: string
        }
        Update: {
          created_at?: string | null
          id?: number
          team_id?: string
          token?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      search_documents: {
        Args: {
          query_embedding: string
          match_count?: number
          filter?: Json
        }
        Returns: {
          id: number
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      start_crawler: {
        Args: {
          crawler_id: number
        }
        Returns: undefined
      }
      vector_avg: {
        Args: {
          "": number[]
        }
        Returns: string
      }
      vector_dims: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_norm: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": string
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
    }
    Enums: {
      url_document_type: "XML" | "HTML" | "PDF"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
