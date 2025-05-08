import mongoose from "mongoose";
import { postSchema } from "./Content.js";

const ideaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  posts: [postSchema],
  content: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Content",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const Idea = mongoose.model("Idea", ideaSchema);
