import express from "express";
import Content from "../models/Content.js";
import { auth } from "../middleware/auth.js";
const router = express.Router();

router.get("/", auth, async (req, res) => {
  const userId = req.user;
  if (!userId) {
    res.status(400).json({ error: "User ID is required" });
    return;
  }
  const contents = await Content.find({ user: userId }).select({_id:1, label: 1, type: 1, url: 1, createdAt: 1, content: 1});
  if(contents.length === 0) {
    res.status(204).json({ error: "No content sources found" });
    return;
  }
  res.json(contents);
});

export default router;

