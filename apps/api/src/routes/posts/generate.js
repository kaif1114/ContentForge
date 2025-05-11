import Content, { Post } from "../../models/Content.js";
import { getRepurposePrompt } from "../../prompts/repurpose.js";
import { z } from "zod";
import { postsArraySchema } from "../../types/posts.js";
import generate from "../../services/generate.js";

const generatePostsReqSchema = z
  .object({
    contentId: z.string(),
    postCount: z.number(),
    platform: z.enum(["linkedin", "x", "both"]),
    tone: z.enum([
      "professional",
      "narrative",
      "informative",
      "persuasive",
      "casual",
      "formal",
      "neutral",
    ]),
  })
  .and(
    z.union([
      z.object({
        length: z.enum(["short", "medium", "long"]),
        customLength: z.undefined(),
      }),
      z.object({
        length: z.undefined(),
        customLength: z.number().min(100).max(1000),
      }),
    ])
  );

async function generatePosts(req, res) {
  const validation = generatePostsReqSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.message });
  }
  const { contentId, postCount, platform, length, tone, customLength } =
    validation.data;
  const c = await Content.findById(contentId);
  if (!c) {
    return res.status(404).json({ error: "Content not found" });
  }

  const response = await generate(
    c.content,
    c.type,
    () => getRepurposePrompt(platform, postCount),
    { schema: postsArraySchema, name: "posts" }
  );
  const postsDoc = response.posts.map((post) => {
    const postData = {
      title: post.title,
      description: post.description,
      platform,
      tone,
      user: req.user,
    };

    if (length !== undefined) {
      postData.length = length;
    } else if (customLength !== undefined) {
      postData.customLength = customLength;
    }

    return new Post(postData);
  });
  c.posts.push(...postsDoc);
  await c.save();

  const apiResponseData = postsDoc.map((doc) => {
    return {
      sourceTitle: c.label,
      sourceId: c._id,
      _id: doc._id,
      title: doc.title,
      description: doc.description,
      platform,
      tags: doc.tags,
      createdAt: doc.createdAt,
      tone,
      length,
      customLength,
    };
  });
  res.json(apiResponseData);
}

export default generatePosts;
