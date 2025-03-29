import express from "express";
import getYoutubeTranscript from "../services/scrape/youtube.js";
import scrapeUrl from "../services/scrape/url.js";
import Content from "../models/Content.js";
import { auth } from "../middleware/auth.js";
import z from "zod";

const scrapeSchema = z.object({
  url: z.string().url(),
  type: z.enum(["url", "youtube"]),
  label: z.string().max(255),
});


const router = express.Router();

router.post("/", auth, async (req, res) => {
  const userId = req.user;
  if(!userId) {
    res.status(400).json({ error: "User ID is required" });
    return;
  }
  const validation = scrapeSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({ error: validation.error.message });
    return;
  }
  const { url, type, label } = validation.data;
  const newContent = new Content({
    url,
    type,
    label,
    user: userId,
  });
  if (type === "youtube") {
    const content = await getYoutubeTranscript(url);
    newContent.content = content;
    await newContent.save();
    res.json({ id: newContent.id, content, label });
    return;
  }

  const content = await scrapeUrl(url);
  newContent.content = content;
  await newContent.save();
  res.json({ id: newContent.id, content, label });
  return;
});

export default router;
