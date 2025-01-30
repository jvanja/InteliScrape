// server/api/scrape.post.ts

import { H3Event } from "h3";
import axios from "axios";
import * as cheerio from "cheerio";

export default defineEventHandler(async (event: H3Event) => {
  try {
    const { urls } = await readBody(event);

    type ParsedObject = {
      url: string;
      html?: string;
      error?: string;
    };
    const results: Array<ParsedObject> = [];

    for (const url of urls) {
      const resultData: ParsedObject = { url };

      try {
        // Fetch the raw HTML
        const response = await axios.get(url);
        const html = response.data;

        resultData.html = cleanHtml(html);
      } catch (err: any) {
        resultData.error = err.message || "Error fetching or parsing HTML.";
      }

      results.push(resultData);
    }

    // Return the aggregated results
    return {
      success: true,
      data: results,
      error: "",
    };
  } catch (error: any) {
    return {
      success: false,
      data: [],
      error: error.message || "Something went wrong.",
    };
  }
});

/**
 * Takes raw HTML and removes scripts, styles, and other unnecessary tags/attributes.
 * @param rawHtml - The original HTML string
 * @returns Cleaned HTML as a string
 */
function cleanHtml(rawHtml: string): string {
  const $ = cheerio.load(rawHtml);
  // Remove unwanted tags: script, style, link, meta, iframe, etc.
  $("head, iframe, footer, header, noscript, figure, aside").remove();

  // Remove all attributes like class, style, id, etc. from every element
  $("*").each(function (_, element) {
    const el = $(element);
    if (element.type === "tag" && element.attribs) {
      Object.keys(element.attribs).forEach((attr) => {
        el.removeAttr(attr);
      });
    }
  });
  return $.html();
}
