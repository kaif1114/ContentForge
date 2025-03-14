import express from "express";
import Content, { Post } from "../models/Content.js";
import { generatePostsSchema } from "../types/posts.js";
import generatePosts from "../services/posts/generate.js";

const router = express.Router();

router.post("/generate", async (req, res) => {
  const validation = generatePostsSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({ error: validation.error.message });
    return;
  }
  const { contentId, postCount, platform } = validation.data;
  const c = await Content.findById(contentId);
  if (!c) {
    res.status(404).json({ error: "Content not found" });
    return;
  }
 
  const response = await generatePosts(c.content, c.type, postCount, platform);
  console.log(response.posts);

  const postsDoc = response.posts.map(
    (post) =>
      new Post({
        title: post.title,
        description: post.description,
        platform,
      })
  );
  c.posts.push(...postsDoc);
  await c.save();

  res.json(response.posts);
});

export default router;
