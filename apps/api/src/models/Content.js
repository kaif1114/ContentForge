import mongoose from "mongoose";

export const postSchema = new mongoose.Schema({
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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const Content = mongoose.model("Content", contentSchema);
export const Post = mongoose.model("Post", postSchema);

export default Content;
