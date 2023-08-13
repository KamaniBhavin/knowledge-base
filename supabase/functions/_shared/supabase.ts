import { PostgrestSingleResponse } from "https://esm.sh/v130/@supabase/postgrest-js@1.7.2/dist/module/types.d.ts";
import { SlackTeamToken } from "../_types/derived.types.ts";
import { supabase } from "../_utils/supabase_client.ts";

export async function getSlackTeamToken(teamId: string): Promise<string> {
    const token: PostgrestSingleResponse<SlackTeamToken["Row"]> =
        await supabase()
            .from("slack_team_tokens")
            .select("*")
            .eq("team_id", teamId)
            .single();

    if (token.error) {
        throw new Error(`Token not found for teamId: ${teamId}`);
    }

    return token.data.token;
}
