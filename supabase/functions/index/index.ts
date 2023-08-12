import serve = Deno.serve;
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { supabase } from "../_utils/supabase_client.ts";
import { getPageContent } from "../_utils/get_page_content.ts";

serve(async (req) => {
    const form = await req.formData();
    const triggerId = form.get("trigger_id");
    const userId = form.get("user_id");
    const teamId = form.get("team_id");
    const url = form.get("text");

    if (!triggerId || !userId || !teamId || !url) {
        return new Response(null, { status: 400 });
    }

    if (!url || typeof url !== "string") {
        return new Response("No url provided", { status: 400 });
    }

    if (!url.match(/^[a-zA-Z]+:\/\//)) {
        return new Response("URL must start with http:// or https://", {
            status: 400,
        });
    }

    // Use cheerio to get the text from the page
    const text = getPageContent(url);

    // Split the text into chunks
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });

    // Create documents from the chunks
    const documents = await splitter.createDocuments([text]);
    const texts = documents.map((doc) => doc.pageContent);

    // Embed the documents with metadata and store them in Supabase
    await SupabaseVectorStore.fromTexts(
        texts,
        { url, userId, teamId: userId },
        new OpenAIEmbeddings(),
        {
            client: supabase(),
            tableName: "documents",
            queryName: "search_documents",
        },
    );

    return new Response(null, { status: 200 });
});
