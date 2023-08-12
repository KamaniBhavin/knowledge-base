import { Database } from "../_types/generated.types.ts";
import { createClient } from "@supabase/supabase-js";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";

export function supabase() {
    return createClient<Database>(
        Deno.env.get("SUPABASE_URL"),
        Deno.env.get("SUPABASE_ANON_KEY"),
    );
}

export function getSupabaseVectorStore() {
    return new SupabaseVectorStore(new OpenAIEmbeddings(), {
        client: supabase(),
        tableName: "documents",
        queryName: "search_documents",
    });
}
