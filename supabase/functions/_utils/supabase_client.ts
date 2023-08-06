import { Database } from "../_types/generated.types.ts";
import { createClient } from "@supabase/supabase-js";

export function supabase() {
    return createClient<Database>(
        Deno.env.get("SUPABASE_URL"),
        Deno.env.get("SUPABASE_ANON_KEY"),
    );
}
