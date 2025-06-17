import mongoose from "mongoose";
import Content from "../../models/Content.js";
import { Idea } from "../../models/Idea.js";

const getSinglePost = async (req, res) => {
  try {
    const { postId } = req.params;
    
    if (!postId) {
      return res.status(400).json({ 
        success: false, 
        message: "Post ID is required" 
      });
    }

    // Search for the post in Content sources
    const contentPost = await Content.findOne(
      { "posts._id": mongoose.Types.ObjectId.createFromHexString(postId) },
      { 
        "posts.$": 1, 
        "label": 1,
        "_id": 1 
      }
    );

    if (contentPost && contentPost.posts.length > 0) {
      const post = contentPost.posts[0];
      return res.status(200).json({
        success: true,
        post: {
          _id: post._id,
          title: post.title,
          description: post.description,
          platform: post.platform,
          tags: post.tags,
          length: post.length,
          customLength: post.customLength,
          tone: post.tone,
          createdAt: post.createdAt,
          sourceTitle: contentPost.label,
          sourceId: contentPost._id,
          sourceType: "content",
        }
      });
    }

    // Search for the post in Ideas
    const ideaPost = await Idea.findOne(
      { "posts._id": mongoose.Types.ObjectId.createFromHexString(postId) },
      { 
        "posts.$": 1, 
        "title": 1,
        "_id": 1 
      }
    );

    if (ideaPost && ideaPost.posts.length > 0) {
      const post = ideaPost.posts[0];
      return res.status(200).json({
        success: true,
        post: {
          _id: post._id,
          title: post.title,
          description: post.description,
          platform: post.platform,
          tags: post.tags,
          length: post.length,
          customLength: post.customLength,
          tone: post.tone,
          createdAt: post.createdAt,
          sourceTitle: ideaPost.title,
          sourceId: ideaPost._id,
          sourceType: "idea",
        }
      });
    }

    // Post not found in either collection
    return res.status(404).json({ 
      success: false, 
      message: "Post not found" 
    });

  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch post" 
    });
  }
};

export default getSinglePost;