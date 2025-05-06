import { z } from "zod";
import Content from "../../models/Content.js";
import mongoose from "mongoose";

const modifyPostSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    platform: z.enum(["linkedin", "x", "both"]).optional(),
    tone: z
      .enum([
        "professional",
        "narrative",
        "informative",
        "persuasive",
        "casual",
      ])
      .optional(),
    length: z.enum(["short", "medium", "long"]).optional(),
    customLength: z.number().min(100).max(1000).optional(),
  })
  .refine(
    (data) => {
      return Object.keys(data).length > 0;
    },
    {
      message: "At least one field to update must be provided",
    }
  )
  .refine(
    (data) => {
      return !(data.length !== undefined && data.customLength !== undefined);
    },
    {
      message: "Cannot provide both length and customLength",
    }
  );

export default async function modify(req, res) {
  const { postId } = req.params;

  if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ error: "Valid post ID is required" });
  }

  const validation = modifyPostSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.message });
  }

  const updateData = {};
  const unsetData = {};
  const { title, description, tags, platform, tone, length, customLength } =
    validation.data;

  if (title !== undefined) updateData["posts.$.title"] = title;
  if (description !== undefined)
    updateData["posts.$.description"] = description;
  if (tags !== undefined) updateData["posts.$.tags"] = tags;
  if (platform !== undefined) updateData["posts.$.platform"] = platform;
  if (tone !== undefined) updateData["posts.$.tone"] = tone;

  // Handle length and customLength mutually exclusively
  if (length !== undefined) {
    updateData["posts.$.length"] = length;
    unsetData["posts.$.customLength"] = "";
  } else if (customLength !== undefined) {
    updateData["posts.$.customLength"] = customLength;
    unsetData["posts.$.length"] = "";
  }

  const updateQuery = {};
  if (Object.keys(updateData).length > 0) {
    updateQuery.$set = updateData;
  }
  if (Object.keys(unsetData).length > 0) {
    updateQuery.$unset = unsetData;
  }

  const updatedContent = await Content.findOneAndUpdate(
    { "posts._id": postId, user: req.user },
    updateQuery,
    { new: true }
  );

  if (!updatedContent) {
    return res.status(404).json({ error: "Post not found" });
  }

  const updatedPost = updatedContent.posts.find(
    (post) => post._id.toString() === postId
  );

  return res.status(200).json({
    message: "Post updated successfully",
    post: {
      _id: updatedPost._id,
      title: updatedPost.title,
      description: updatedPost.description,
      platform: updatedPost.platform,
      tags: updatedPost.tags,
      createdAt: updatedPost.createdAt,
      sourceTitle: updatedContent.label,
      sourceId: updatedContent._id,
      tone: updatedPost.tone,
      length: updatedPost.length,
      customLength: updatedPost.customLength,
    },
  });
}
