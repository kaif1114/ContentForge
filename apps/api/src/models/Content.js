import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  platform: {
    type: String,
    enum: ["linkedin", "twitter"],
  },
});

const ideaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const contentSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    maxLength: 2048,
  },
  type: {
    type: String,
    enum: ["youtube", "url"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  posts: [postSchema],
  ideas: [ideaSchema],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Content = mongoose.model("Content", contentSchema);
export const Post = mongoose.model("Post", postSchema);
export const Idea = mongoose.model("Idea", ideaSchema);

export default Content;
