import FirecrawlApp, { ScrapeResponse } from '@mendable/firecrawl-js';
import express, { Request, Response } from 'express';
import 'dotenv/config'

const router = express.Router();

const firecrawl = new FirecrawlApp({apiKey: process.env.FIRECRAWL_API_KEY});


router.post('/scrape', async (req: Request, res: Response) => {
    const { url } = req.body;
    if(!url) {
        res.status(400).json({ error: 'URL is required' });
        return;
    }
    const scrapeResult = await firecrawl.scrapeUrl(url, { formats: ['markdown'], excludeTags: ['script', 'style', 'a', 'img', 'iframe'] }) as ScrapeResponse;
    if(!scrapeResult.success) {
     res.status(500).json({ error: 'Failed to scrape' });
     return;
    }
    const markdown = scrapeResult.markdown;
    console.log(markdown);
    res.json(markdown);
});

export default router;

