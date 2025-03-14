import express from "express";
import Content, { Post } from "../models/Content.js";
import {
  generatePostsReqSchema,
  generateFromIdeaReqSchema,
} from "../types/posts.js";
import generate from "../services/generate.js";
import { getLinkedinPrompt, getTwitterPrompt } from "../prompts/repurpose.js";
import { postsArraySchema } from "../types/posts.js";
import {
  getUserPrompt,
  getLinkedinSysPrompt,
  getTwitterSysPrompt,
} from "../prompts/posts.js";

const router = express.Router();

router.post("/generate", async (req, res) => {
  const validation = generatePostsReqSchema.safeParse(req.body);
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

  const response = await generate(
    c.content,
    c.type,
    () =>
      platform === "linkedin"
        ? getLinkedinPrompt(postCount)
        : getTwitterPrompt(postCount),
    { schema: postsArraySchema, name: "posts" }
  );
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

router.post("/generate-from-idea", async (req, res) => {
  const validation = generateFromIdeaReqSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({ error: validation.error.message });
    return;
  }
  const { idea, count, platform } = validation.data;
  const response = await generate(
    undefined,
    undefined,
    platform === "linkedin" ? getLinkedinSysPrompt : getTwitterSysPrompt,
    { schema: postsArraySchema, name: "posts" },
    () => getUserPrompt(idea, count)
  );
  // const postsDoc = response.posts.map(
  //   (post) =>
  //     new Post({
  //       title: post.title,
  //       description: post.description,
  //       platform,
  //     })
  // );

  res.json(response.posts);
});

export default router;
