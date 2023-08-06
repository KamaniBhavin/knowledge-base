export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            documents: {
                Row: {
                    content: string | null;
                    embedding: string | null;
                    id: number;
                    metadata: Json | null;
                };
                Insert: {
                    content?: string | null;
                    embedding?: string | null;
                    id?: number;
                    metadata?: Json | null;
                };
                Update: {
                    content?: string | null;
                    embedding?: string | null;
                    id?: number;
                    metadata?: Json | null;
                };
                Relationships: [];
            };
            slack_team_tokens: {
                Row: {
                    created_at: string | null;
                    id: number;
                    team_id: string;
                    token: string;
                };
                Insert: {
                    created_at?: string | null;
                    id?: number;
                    team_id: string;
                    token: string;
                };
                Update: {
                    created_at?: string | null;
                    id?: number;
                    team_id?: string;
                    token?: string;
                };
                Relationships: [];
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            ivfflathandler: {
                Args: {
                    "": unknown;
                };
                Returns: unknown;
            };
            search_documents: {
                Args: {
                    query_embedding: string;
                    match_count?: number;
                    filter?: Json;
                };
                Returns: {
                    id: number;
                    content: string;
                    metadata: Json;
                    similarity: number;
                }[];
            };
            vector_avg: {
                Args: {
                    "": number[];
                };
                Returns: string;
            };
            vector_dims: {
                Args: {
                    "": string;
                };
                Returns: number;
            };
            vector_norm: {
                Args: {
                    "": string;
                };
                Returns: number;
            };
            vector_out: {
                Args: {
                    "": string;
                };
                Returns: unknown;
            };
            vector_send: {
                Args: {
                    "": string;
                };
                Returns: string;
            };
            vector_typmod_in: {
                Args: {
                    "": unknown[];
                };
                Returns: number;
            };
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
}
