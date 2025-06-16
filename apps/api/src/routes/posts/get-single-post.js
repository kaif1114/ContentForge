import Post from "../../models/Post.js";

const getSinglePost = async (req, res) => {
  try {
    const { postId } = req.params;
    
    if (!postId) {
      return res.status(400).json({ 
        success: false, 
        message: "Post ID is required" 
      });
    }

    // Find the post by ID
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: "Post not found" 
      });
    }

    res.status(200).json({
      success: true,
      post: post
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