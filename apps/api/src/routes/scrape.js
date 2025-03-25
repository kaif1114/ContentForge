import express from "express";
import { scrapeSchema } from "../types/scrape.js";
import getYoutubeTranscript from "../services/scrape/youtube.js";
import scrapeUrl from "../services/scrape/url.js";
import Content from "../models/Content.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const userId = req.user.id;
  const validation = scrapeSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({ error: validation.error.message });
    return;
  }
  const { url, type } = validation.data;
  const newContent = new Content({
    url,
    type,
    user: userId,
  });
  if (type === "youtube") {
    const content = await getYoutubeTranscript(url);
    newContent.content = content;
    await newContent.save();
    res.json({ id: newContent.id, content });
    return;
  }

  const content = await scrapeUrl(url);
  newContent.content = content;
  await newContent.save();
  res.json({ id: newContent.id, content });
  return;
});

export default router;
