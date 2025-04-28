import { z } from "zod";

export const postSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export const postsArraySchema = z.object({
  posts: z.array(postSchema),
});
