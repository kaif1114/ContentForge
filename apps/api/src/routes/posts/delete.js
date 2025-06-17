import Content from "../../models/Content.js";
import { Idea } from "../../models/Idea.js";
import mongoose from "mongoose";

async function deletePost(req, res) {
  try {
    const { postId } = req.params;
    const user = req.user;

    // Try to delete from Content first
    const contentResult = await Content.findOneAndUpdate(
      { "posts._id": postId, user: user },
      { $pull: { posts: { _id: postId } } },
      { new: true }
    );

    if (contentResult) {
      return res.status(200).json({ message: "Post deleted successfully" });
    }

    // If not found in Content, try to delete from Ideas
    const ideaResult = await Idea.findOneAndUpdate(
      { "posts._id": postId, user: user },
      { $pull: { posts: { _id: postId } } },
      { new: true }
    );

    if (ideaResult) {
      return res.status(200).json({ message: "Post deleted successfully" });
    }

    // If not found in either collection
    return res.status(404).json({ error: "Post not found" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Failed to delete post" });
  }
}

export default deletePost;
