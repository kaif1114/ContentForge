import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";

async function generate(
  content,
  contentType,
  systemPromptFn,
  responseFormat,
  userPromptFn
) {
  const prompt = userPromptFn
    ? userPromptFn()
    : `Content Type: ${contentType}\nContent:\n${content}`;

  const { object } = await generateObject({
    model: openai("gpt-4o-2024-08-06", { structuredOutputs: true }),
    schema: responseFormat.schema,
    schemaName: responseFormat.name,
    prompt: `${systemPromptFn()}\n\n${prompt}`,
  });

  return object;
}

export default generate;
