import serve = Deno.serve;
import { CrawlerInsertEvent } from "../_types/derived.types.ts";
import { Slack } from "../_shared/slack.ts";
import { getSlackTeamToken } from "../_shared/supabase.ts";
import {
    crawl,
    crawlHTMLStrategy,
    crawlXMLStrategy,
} from "../_utils/crawl_strategies.ts";

/**
 * This function is a database webhook that is triggered when a new URL index request is added to the database.
 * It will fetch the page content, split it into chunks, embed the chunks and store them in Supabase.
 *
 * @param req: The request object from the database webhook
 *
 * @returns A response object
 */
serve(async (req) => {
    const { record: crawler }: CrawlerInsertEvent = await req.json();

    switch (crawler.url_document_type) {
        case "HTML":
            await crawl(crawler, crawlHTMLStrategy);
            break;
        case "XML":
            await crawl(crawler, crawlXMLStrategy);
            break;
    }

    const slack = new Slack(await getSlackTeamToken(crawler.slack_team_id));
    await slack.postMessage({
        channel: crawler.slack_user_id,
        text: `We have successfully indexed ${crawler.url} into your personal knowledge base 🙌. You can now chat with it's content 🚀Ask something interesting!`,
    });

    return new Response(null, { status: 200 });
});
