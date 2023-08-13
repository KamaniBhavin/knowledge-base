import serve = Deno.serve;
import { supabase } from "../_utils/supabase_client.ts";
import { Crawler } from "../_types/derived.types.ts";
import { Slack } from "../_shared/slack.ts";
import { getSlackTeamToken } from "../_shared/supabase.ts";

serve(async (req) => {
    const form = await req.formData();
    const userId = form.get("user_id");
    const teamId = form.get("team_id");
    const url = form.get("text");
    const responseUrl = form.get("response_url");

    if (!userId || !teamId || !url) {
        return new Response("Missing required parameters", { status: 400 });
    }

    if (
        typeof url !== "string" ||
        typeof userId !== "string" ||
        typeof teamId !== "string"
    ) {
        return new Response(`Invalid parameter types! 
            url: ${typeof url}, 
            userId: ${typeof userId}, 
            teamId: ${typeof teamId} `);
    }

    const slack = new Slack(await getSlackTeamToken(teamId));

    if (!url.match(/^[a-zA-Z]+:\/\//)) {
        await slack.postEphemeral({
            channel: userId,
            user: userId,
            text: "URL is invalid! Must start with http:// or https://",
        });

        return new Response(null);
    }

    await supabase()
        .from("crawlers")
        .insert(<Crawler["Insert"]>{
            url,
            url_document_type: "HTML",
            priority: 1,
            slack_webhook: responseUrl,
            slack_team_id: teamId,
            slack_user_id: userId,
        });

    await slack.postMessage({
        channel: userId,
        text: "We are on it!",
    });

    return new Response(null, { status: 200 });
});
