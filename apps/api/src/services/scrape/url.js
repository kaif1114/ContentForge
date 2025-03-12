import FirecrawlApp from "@mendable/firecrawl-js";

async function scrapeUrl(url) {
  const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
  const scrapeResult = await firecrawl.scrapeUrl(url, {
    formats: ["markdown"],
    excludeTags: ["script", "style", "a", "img", "iframe"],
  });
  if (!scrapeResult.success) {
    throw new Error("Failed to scrape");
  }
  return scrapeResult.markdown;
}

export default scrapeUrl;
