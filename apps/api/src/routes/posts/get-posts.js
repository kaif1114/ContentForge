import mongoose from "mongoose";
import Content from "../../models/Content.js";
import { Idea } from "../../models/Idea.js";

async function getPosts(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    // Get posts from Content sources
    const contentPostsPipeline = [
      {
        $match: { user: mongoose.Types.ObjectId.createFromHexString(req.user) },
      },
      { $unwind: "$posts" },
      {
        $project: {
          _id: "$posts._id",
          title: "$posts.title",
          description: "$posts.description",
          platform: "$posts.platform",
          tags: "$posts.tags",
          length: "$posts.length",
          customLength: "$posts.customLength",
          tone: "$posts.tone",
          createdAt: "$posts.createdAt",
          sourceTitle: "$label",
          sourceId: "$_id",
          sourceType: "content",
        },
      },
    ];

    // Get posts from Ideas
    const ideaPostsPipeline = [
      {
        $match: { user: mongoose.Types.ObjectId.createFromHexString(req.user) },
      },
      { $unwind: "$posts" },
      {
        $project: {
          _id: "$posts._id",
          title: "$posts.title",
          description: "$posts.description",
          platform: "$posts.platform",
          tags: "$posts.tags",
          length: "$posts.length",
          customLength: "$posts.customLength",
          tone: "$posts.tone",
          createdAt: "$posts.createdAt",
          sourceTitle: "$title",
          sourceId: "$_id",
          sourceType: "idea",
        },
      },
    ];

    // Execute both pipelines
    const [contentPosts, ideaPosts] = await Promise.all([
      Content.aggregate(contentPostsPipeline),
      Idea.aggregate(ideaPostsPipeline),
    ]);

    // Combine and sort all posts by creation date
    const allPosts = [...contentPosts, ...ideaPosts].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    const total = allPosts.length;

    if (total === 0) {
      return res.json({
        data: [],
        pagination: {
          total: 0,
          page,
          limit,
          totalPages: 0,
        },
      });
    }

    // Apply pagination
    const paginatedPosts = allPosts.slice(skip, skip + limit);

    res.json({
      data: paginatedPosts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
}

export default getPosts;
