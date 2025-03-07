import express, { Request, Response } from "express";
import { scrapeSchema } from "../types/scrape";
import getYoutubeTranscript from "../services/scrape/youtube";
import scrapeUrl from "../services/scrape/url";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const validation = scrapeSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({ error: validation.error.message });
    return;
  }
  const { url, type } = validation.data;
  if (type === "youtube") {
    const content = await getYoutubeTranscript(url);
    res.json(content);
    return;
  }
  if (type === "url") {
    const content = await scrapeUrl(url);
    res.json(content);
    return;
  }
});

export default router;
