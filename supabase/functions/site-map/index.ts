import serve = Deno.serve;
import {
    SiteMapCrawlerConfiguration,
    UrlDocumentType,
} from "../_shared/crawler.ts";
import { supabase } from "../_utils/supabase_client.ts";
import { Crawler } from "../_types/derived.types.ts";

serve(async (req) => {
    const crawler: SiteMapCrawlerConfiguration = await req.json();

    if (!crawler) {
        return new Response(JSON.stringify({ error: "No site map provided" }), {
            headers: { "Content-Type": "application/json" },
            status: 400,
        });
    }

    const supportedUrlDocumentTypes = Object.keys(UrlDocumentType);

    if (!supportedUrlDocumentTypes.includes(crawler.url_document_type)) {
        return new Response(
            JSON.stringify({
                error: `Unsupported url document type ${crawler.url_document_type} (Supported types: ${supportedUrlDocumentTypes})`,
            }),
            {
                headers: { "Content-Type": "application/json" },
                status: 400,
            },
        );
    }

    await supabase()
        .from("crawlers")
        .insert(<Crawler["Insert"]>{
            url: crawler.url,
            url_document_type: crawler.url_document_type,
            priority: 100,
        });

    return new Response(
        JSON.stringify({ message: "Site index request accepted" }),
        {
            headers: { "Content-Type": "application/json" },
        },
    );
});
