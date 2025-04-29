import Content from "../../models/Content.js";
import mongoose from "mongoose";

async function deletePost(req, res) {
    try {
        const { postId } = req.params;
        
        const result = await Content.findOneAndUpdate(
            { "posts._id": postId },
            { $pull: { posts: { _id: postId } } },
            { new: true }
        );
        
        if (!result) {
            return res.status(404).json({ error: "Post not found" });
        }
        
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ error: "Failed to delete post" });
    }
}

export default deletePost;
