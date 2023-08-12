import { Slack } from "../_shared/slack.ts";
import serve = Deno.serve;
import { ISlackEvent, ISlackUrlVerificationEvent } from "../_shared/types.ts";
import { getSupabaseVectorStore, supabase } from "../_utils/supabase_client.ts";
import { SlackTeamToken } from "../_types/derived.types.ts";
import { PostgrestSingleResponse } from "https://esm.sh/v130/@supabase/postgrest-js@1.7.2/dist/module/types.d.ts";
import { RetrievalQAChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";

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

    const token: PostgrestSingleResponse<SlackTeamToken["Row"]> =
        await supabase()
            .from("slack_team_tokens")
            .select("*")
            .eq("team_id", teamId)
            .single();

    if (token.error) {
        console.log(`No token for team ${teamId}`);
        return new Response(null);
    }

    const model = new OpenAI({});
    const retriever = getSupabaseVectorStore().asRetriever();
    const chain = RetrievalQAChain.fromLLM(model, retriever);
    const response = await chain.call({ query: text });

    const slack = new Slack(token.data.token);
    await slack.postMessage({
        channel: user,
        text: response.text,
    });

    return new Response(null);
});
