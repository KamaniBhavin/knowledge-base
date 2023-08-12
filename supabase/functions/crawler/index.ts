import serve = Deno.serve;
import { supabase } from "../_utils/supabase_client.ts";
import { Crawler } from "../_types/derived.types.ts";
import {
    crawl,
    crawlHTMLStrategy,
    crawlXMLStrategy,
} from "../_utils/crawl_strategies.ts";

serve(async (req) => {
    const crawlerId = new URL(req.url).searchParams.get("crawlerId");

    if (!crawlerId) {
        return new Response(
            JSON.stringify({ error: "No website to crawl provided" }),
            {
                headers: { "Content-Type": "application/json" },
            },
        );
    }

    const { data: crawler, error }: { data: Crawler["Row"]; error: any } =
        await supabase()
            .from("crawlers")
            .select()
            .eq("id", crawlerId)
            .limit(1)
            .single();

    if (!crawler || error) {
        return new Response(
            JSON.stringify({
                error: error ?? `No crawler found with id: ${crawlerId}`,
            }),
            {
                headers: { "Content-Type": "application/json" },
            },
        );
    }

    switch (crawler.url_document_type) {
        case "HTML":
            await crawl(crawler, crawlHTMLStrategy);
            break;
        case "XML":
            await crawl(crawler, crawlXMLStrategy);
            break;
    }
});
