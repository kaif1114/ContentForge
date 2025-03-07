import FirecrawlApp, { ScrapeResponse } from "@mendable/firecrawl-js";

async function scrapeUrl(url: string) {
  const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
  const scrapeResult = (await firecrawl.scrapeUrl(url, {
    formats: ["markdown"],
    excludeTags: ["script", "style", "a", "img", "iframe"],
  })) as ScrapeResponse;
  if (!scrapeResult.success) {
    throw new Error("Failed to scrape");
  }
  const markdown = scrapeResult.markdown;
  return { content: markdown };
}

export default scrapeUrl;
