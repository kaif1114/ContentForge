import z from "zod";

export const scrapeSchema = z.object({
  url: z.string().url(),
  type: z.enum(["url", "youtube"]),
  userId: z.string(),
  //add .uuid() to userId later on if necessary
});
