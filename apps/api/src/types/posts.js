import { z } from "zod";

export const generatePostsReqSchema = z.object({
  contentId: z.string(),
  postCount: z.number(),
  platform: z.enum(["linkedin", "twitter"]),
});

export const ideaSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export const generateFromIdeaReqSchema = z.object({
  idea: ideaSchema,
  count: z.number(),
  platform: z.enum(["linkedin", "twitter"]),
});

export const postSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export const postsArraySchema = z.object({
  posts: z.array(postSchema),
});
