import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod.mjs";

const openai = new OpenAI();

async function generate(content, contentType, promptFn, responseFormat) {
  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-2024-08-06",
    messages: [
      {
        role: "system",
        content: promptFn(),
      },
      {
        role: "user",
        content: `
        Content Type: ${contentType}
        Content: 
        ${content}`,
      },
    ],
    response_format: zodResponseFormat(
      responseFormat.schema,
      responseFormat.name
    ),
  });

  return completion.choices[0].message.parsed;
}

export default generate;
