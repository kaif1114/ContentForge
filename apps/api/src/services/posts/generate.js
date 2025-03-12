import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod.mjs";
import getLinkedinPrompt from "../../prompts/linkedin.js";
import getTwitterPrompt from "../../prompts/twitter.js";
import { postsArraySchema } from "../../types/posts.js";
const openai = new OpenAI();

async function generatePosts(content, contentType, postCount, platform) {
  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-2024-08-06",
    messages: [
      {
        role: "system",
        content:
          platform == "linkedin"
            ? getLinkedinPrompt(postCount, contentType)
            : getTwitterPrompt(postCount, contentType),
      },
      {
        role: "user",
        content: `Content: 
        ${content}`,
      },
    ],
    response_format: zodResponseFormat(postsArraySchema, "post"),
  });

  return completion.choices[0].message.parsed;
}

export default generatePosts;
