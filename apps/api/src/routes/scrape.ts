import FirecrawlApp, { ScrapeResponse } from '@mendable/firecrawl-js';
import express, { Request, Response } from 'express';
import { scrapeSchema } from '../types/scrape';
import 'dotenv/config'
import asyncMiddleware from '../middleware/async';

const router = express.Router();
const firecrawl = new FirecrawlApp({apiKey: process.env.FIRECRAWL_API_KEY});

router.post('/', asyncMiddleware(async (req: Request, res: Response) => {
    const validation = scrapeSchema.safeParse(req.body);
    if(!validation.success) {
        res.status(400).json({ error: validation.error.message });
        return; 
    }
    const { url  } = validation.data;
    const scrapeResult = await firecrawl.scrapeUrl(url, { formats: ['markdown'], excludeTags: ['script', 'style', 'a', 'img', 'iframe'] }) as ScrapeResponse;
    if(!scrapeResult.success) {
     res.status(500).json({ error: 'Failed to scrape' });
     return;
    }
    const markdown = scrapeResult.markdown;
    res.json({scrapedContent: markdown});
}));

export default router;

