import Content from "../../models/Content.js";
import { Idea } from "../../models/Idea.js";
import { generateIdeasRequestSchema } from "../../types/ideas.js";
import generate from "../../services/generate.js";
import getGenerateIdeasPrompt from "../../prompts/ideas.js";
import { ideasArraySchema } from "../../types/ideas.js";
import mongoose from "mongoose";

async function generateIdeas(req, res) {
  const validation = generateIdeasRequestSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({ error: validation.error.message });
    return;
  }
  const { contentId, count } = validation.data;
  const c = await Content.findById(contentId);
  if (!c) {
    res.status(404).json({ error: "Content not found" });
    return;
  }

  const response = await generate(
    c.content,
    c.type,
    () => getGenerateIdeasPrompt(count),
    { schema: ideasArraySchema, name: "ideas" }
  );

  const ideaObjects = response.ideas.map(
    (idea) =>
      new Idea({
        title: idea.title,
        description: idea.description,
        content: c._id,
        user: mongoose.Types.ObjectId.createFromHexString(req.user),
      })
  );

  const savedIdeas = await Promise.all(ideaObjects.map((idea) => idea.save()));

  const formattedIdeas = savedIdeas.map((idea) => ({
    _id: idea._id,
    title: idea.title,
    description: idea.description,
    sourceId: c._id,
    sourceTitle: c.label,
  }));

  res.json(formattedIdeas);
}

export default generateIdeas;
