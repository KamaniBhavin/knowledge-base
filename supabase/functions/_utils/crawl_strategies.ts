import { Crawler } from "../_types/derived.types.ts";
import { supabase } from "./supabase_client.ts";
import {
    getPageContent,
    getXML,
    parseDocumentTypeFromUrl,
} from "./get_page_content.ts";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

type CrawlStrategy = (
    crawler: Crawler["Row"],
) => Promise<Crawler["Insert"][] | undefined>;

export const crawl = async (
    crawler: Crawler["Row"],
    strategy: CrawlStrategy,
) => {
    crawler.started_at = new Date().toDateString();

    try {
        const newCrawlers = await strategy(crawler);

        crawler.crawled_at = new Date().toDateString();

        if (!newCrawlers) {
            return;
        }

        await Promise.all(
            newCrawlers.map((crawler) => {
                return supabase()
                    .from("crawlers")
                    .insert(<Crawler["Insert"]>crawler);
            }),
        );
    } catch (error) {
        crawler.failed_at = new Date().toDateString();
    }

    await supabase().from("crawlers").update(crawler).eq("id", crawler.id);
};

export const crawlXMLStrategy: CrawlStrategy = async (
    crawler: Crawler["Row"],
) => {
    const xml = await getXML(crawler.url);
    const urls: string[] = xml("urlset > url")
        .find("loc")
        .contents()
        .text()
        .split("https://")
        .filter((url) => url);

    return urls.map((url) => {
        return <Crawler["Insert"]>{
            url: url,
            url_document_type: parseDocumentTypeFromUrl(url),
            priority: 50,
            parent_id: crawler.id,
            slack_team_id: crawler.slack_team_id,
            slack_user_id: crawler.slack_user_id,
        };
    });
};

export const crawlHTMLStrategy: CrawlStrategy = async (
    crawler: Crawler["Row"],
): Promise<undefined> => {
    // Use cheerio to get the text from the page
    const text = await getPageContent(crawler.url);

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
            url: crawler.url,
            userId: crawler.slack_user_id,
            teamId: crawler.slack_team_id,
        },
        new OpenAIEmbeddings(),
        {
            client: supabase(),
            tableName: "documents",
            queryName: "search_documents",
        },
    );
};
