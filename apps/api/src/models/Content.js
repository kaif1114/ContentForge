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
  tags: {
    type: [String],
  },
  platform: {
    type: String,
    enum: ["linkedin", "twitter", "both"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const contentSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    maxLength: 255,
  },
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Content = mongoose.model("Content", contentSchema);
export const Post = mongoose.model("Post", postSchema);

export default Content;
