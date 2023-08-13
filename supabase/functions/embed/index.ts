import serve = Deno.serve;
import { getPageContent } from "../_utils/get_page_content.ts";
import { supabase } from "../_utils/supabase_client.ts";
import { CrawlerInsertEvent } from "../_types/derived.types.ts";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { Slack } from "../_shared/slack.ts";
import { getSlackTeamToken } from "../_shared/supabase.ts";

serve(async (req) => {
    const { record }: CrawlerInsertEvent = await req.json();

    if (record.url_document_type !== "HTML") {
        throw new Error("HTML files are supported for now!");
    }

    // Use cheerio to get the text from the page
    const text = await getPageContent(record.url);

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
        {
            url: record.url,
            userId: record.slack_user_id,
            teamId: record.slack_team_id,
        },
        new OpenAIEmbeddings(),
        {
            client: supabase(),
            tableName: "documents",
            queryName: "search_documents",
        },
    );

    const slack = new Slack(await getSlackTeamToken(record.slack_team_id));
    await slack.postMessage({
        channel: record.slack_user_id,
        text: `We have successfully indexed ${record.url} into your personal knowledge base 🙌. You can now chat with it's content 🚀Ask something interesting!`,
    });

    return new Response(null, { status: 200 });
});
