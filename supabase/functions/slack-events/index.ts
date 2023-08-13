import { Slack } from "../_shared/slack.ts";
import serve = Deno.serve;
import { ISlackEvent, ISlackUrlVerificationEvent } from "../_shared/types.ts";
import { supabase } from "../_utils/supabase_client.ts";

import { getSlackTeamToken } from "../_shared/supabase.ts";
import { SlackQAChat } from "../_types/derived.types.ts";

serve(async (req) => {
    const event: ISlackEvent = await req.json();

    if (!event) {
        return new Response(JSON.stringify({ error: "No event provided" }), {
            headers: { "Content-Type": "application/json" },
        });
    }

    // Url verification event to capture events from slack
    if (event.type === "url_verification") {
        const { challenge } = event as ISlackUrlVerificationEvent;
        return Response.json({ challenge });
    }

    if (event.event?.type !== "message") {
        return new Response(null);
    }

    const {
        team_id: teamId,
        event: { user, text, client_msg_id: msgId },
    } = event;

    // msgId is null when the message is sent from the Bot.
    // We ignore these messages
    if (!msgId) {
        return new Response(null, { status: 200 });
    }

    const slack = new Slack(await getSlackTeamToken(teamId));
    await slack.postMessage({
        channel: user,
        text: "Thinking...🤔",
    });

    await supabase()
        .from("slack_qa_chats")
        .insert(<SlackQAChat["Insert"]>{
            message: text,
            response_url: "",
            slack_team_id: teamId,
            slack_user_id: user,
        });

    return new Response(null);
});
