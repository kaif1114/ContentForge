import express from "express";
import Content, { Post } from "../models/Content.js";
import { Idea } from "../models/Idea.js";
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
import { auth } from "../middleware/auth.js";
import mongoose from "mongoose";
const router = express.Router();

router.get("/", auth, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  try {
    const countPipeline = [
      { $match: { user: mongoose.Types.ObjectId.createFromHexString(req.user) } },
      { $unwind: "$posts" },
      { $count: "total" }
    ];
    
    const countResult = await Content.aggregate(countPipeline);
    const total = countResult.length > 0 ? countResult[0].total : 0;
    
    if (total === 0) {
      return res.status(404).json({ error: "No posts found" });
    }
    
    const pipeline = [
      { $match: { user: mongoose.Types.ObjectId.createFromHexString(req.user) } },
      { $unwind: "$posts" },
      { $sort: { "posts.createdAt": -1 } },
      { $skip: skip },
      { $limit: limit },
      { 
        $project: { 
          "_id": "$posts._id",
          "title": "$posts.title", 
          "description": "$posts.description", 
          "platform": "$posts.platform",
          "tags": "$posts.tags",
          "createdAt": "$posts.createdAt" 
        } 
      }
    ];
    
    const paginatedPosts = await Content.aggregate(pipeline);
    res.json({
      data: paginatedPosts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

router.post("/generate", auth, async (req, res) => {
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
  const { ideaId, count, platform } = validation.data;
  const idea = await Idea.findById(ideaId);
  if (!idea) {
    res.status(404).json({ error: "Idea not found" });
    return;
  }
  const response = await generate(
    undefined,
    undefined,
    platform === "linkedin" ? getLinkedinSysPrompt : getTwitterSysPrompt,
    { schema: postsArraySchema, name: "posts" },
    () => getUserPrompt(idea, count)
  );
  const postsDoc = response.posts.map(
    (post) =>
      new Post({
        title: post.title,
        description: post.description,
        platform,
      })
  );
  idea.posts.push(...postsDoc);
  await idea.save();

  res.json(response.posts);
});

export default router;
