import { z } from "zod";

export const generateIdeasRequestSchema = z.object({
  contentId: z.string(),
  count: z.number(),
});

export const ideaSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export const ideasArraySchema = z.object({
  ideas: z.array(ideaSchema),
});
