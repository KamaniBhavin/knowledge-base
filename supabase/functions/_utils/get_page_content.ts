import * as cheerio from "cheerio";

export async function getPageContent(url: string): Promise<string> {
    const $ = cheerio.load(await (await fetch(url)).text());
    return $("p, h1, h2, h3, h4, h5, h6, li, dd, dt, td, caption")
        .map((_, el) => $(el).text())
        .get()
        .join("\n");
}
