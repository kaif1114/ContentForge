import { z } from "zod";

export const generatePostsSchema = z.object({
  contentId: z.string(),
  postCount: z.number(),
  platform: z.enum(["linkedin", "twitter"]),
});

const postSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export const postsArraySchema = z.object({
  posts: z.array(postSchema),
});
