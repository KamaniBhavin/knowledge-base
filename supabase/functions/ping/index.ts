import { serve } from "http/server.ts";
import { OpenAI } from "langchain/llms/openai";

serve(async () => {
    const llm = new OpenAI({
        openAIApiKey: Deno.env.get("OPENAI_API_KEY"),
    });
    const result = await llm.predict({ prompt: "Hi" });

    return new Response(JSON.stringify({ result }), {
        headers: { "Content-Type": "application/json" },
    });
});
