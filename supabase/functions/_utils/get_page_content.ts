import * as cheerio from "cheerio";
import { Database } from "../_types/generated.types.ts";

/**
 * Fetches the content of a page parses it using cheerio.
 *
 * @param url - URL of the page to fetch
 *
 * @returns Promise - Content of all the text elements in the page.
 */
export async function getPageContent(url: string): Promise<string> {
    const $ = cheerio.load(await (await fetch(url)).text());
    return $("p, h1, h2, h3, h4, h5, h6, li, dd, dt, td, caption")
        .map((_, el) => $(el).text())
        .get()
        .join("\n");
}

export const getXML = async (url: string) => {
    return cheerio.load(await (await fetch(url)).text());
};

export const parseDocumentTypeFromUrl = (
    url: string,
): Database["public"]["Enums"]["url_document_type"] => {
    if (url.endsWith(".xml")) {
        return "XML";
    }

    return "HTML";
};
