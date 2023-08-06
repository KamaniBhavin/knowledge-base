import serve = Deno.serve;
import { Slack } from "../_shared/slack.ts";
import { supabase } from "../_utils/supabase_client.ts";
import { SlackTeamToken } from "../_types/derived.types.ts";

serve(async (req) => {
    const code = new URL(req.url).searchParams.get("code");

    if (!code) {
        return new Response(JSON.stringify({ error: "No code provided" }), {
            headers: { "Content-Type": "application/json" },
        });
    }

    // Get the bot token for the team that installed the app using the code
    const response = await Slack.getInstances().oAuth({
        code: code,
        client_id: Deno.env.get("SLACK_CLIENT_ID"),
        client_secret: Deno.env.get("SLACK_CLIENT_SECRET"),
    });

    await supabase()
        .from("slack_team_tokens")
        .insert(<SlackTeamToken["Insert"]>{
            team_id: response.team.id,
            token: response.access_token,
        });

    // redirect to slack.com for now.
    return new Response(null, {
        headers: {
            Location: "https://slack.com",
        },
        status: 302,
    });
});
