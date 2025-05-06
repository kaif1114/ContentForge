import { Post } from "../../models/Content.js";
import { Idea } from "../../models/Idea.js";
import generate from "../../services/generate.js";
import { postsArraySchema } from "../../types/posts.js";
import { getSysPrompt, getUserPrompt } from "../../prompts/posts.js";
import { z } from "zod";

const generateFromIdeaReqSchema = z
  .object({
    ideaId: z.string(),
    count: z.number(),
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

async function generateFromIdea(req, res) {
  const validation = generateFromIdeaReqSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({ error: validation.error.message });
    return;
  }
  const { ideaId, count, platform, tone, length, customLength } =
    validation.data;
  const idea = await Idea.findById(ideaId);
  if (!idea) {
    res.status(404).json({ error: "Idea not found" });
    return;
  }
  const response = await generate(
    undefined,
    undefined,
    () => getSysPrompt(platform),
    { schema: postsArraySchema, name: "posts" },
    () => getUserPrompt(idea, count)
  );
  const postsDoc = response.posts.map(
    (post) =>
      new Post({
        title: post.title,
        description: post.description,
        platform,
        length,
        tone,
        customLength,
      })
  );
  idea.posts.push(...postsDoc);
  await idea.save();

  res.json(response.posts);
}

export default generateFromIdea;
