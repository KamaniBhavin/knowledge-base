import serve = Deno.serve;
import { SlackQAChatInsertEvent } from "../_types/derived.types.ts";
import { getSupabaseVectorStore } from "../_utils/supabase_client.ts";
import { Slack } from "../_shared/slack.ts";
import { getSlackTeamToken } from "../_shared/supabase.ts";
import { RetrievalQAChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";

serve(async (req) => {
    const { record }: SlackQAChatInsertEvent = await req.json();

    const model = new OpenAI({});
    const retriever = getSupabaseVectorStore().asRetriever();
    const chain = RetrievalQAChain.fromLLM(model, retriever);
    const response = await chain.call({ query: record.message });

    const slack = new Slack(await getSlackTeamToken(record.slack_team_id));
    await slack.postMessage({
        channel: record.slack_user_id,
        text: response.text,
    });

    return new Response(null);
});
