import mongoose from "mongoose";
import Content from "../../models/Content.js";

async function getPosts(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    try {
      const countPipeline = [
        { $match: { user: mongoose.Types.ObjectId.createFromHexString(req.user) } },
        { $unwind: "$posts" },
        { $count: "total" }
      ];
      
      const countResult = await Content.aggregate(countPipeline);
      const total = countResult.length > 0 ? countResult[0].total : 0;
      
      if (total === 0) {
        return res.json({
          data: [],
          pagination: {
            total: 0,
            page,
            limit,
            totalPages: 0
          }
        });
      }
      
      const pipeline = [
        { $match: { user: mongoose.Types.ObjectId.createFromHexString(req.user) } },
        { $unwind: "$posts" },
        { $sort: { "posts.createdAt": -1 } },
        { $skip: skip },
        { $limit: limit },
        { 
          $project: { 
            "_id": "$posts._id",
            "title": "$posts.title", 
            "description": "$posts.description", 
            "platform": "$posts.platform",
            "tags": "$posts.tags",
            "createdAt": "$posts.createdAt",
            "sourceTitle": "$label",
            "sourceId": "$_id"
          } 
        }
      ];
      
      const paginatedPosts = await Content.aggregate(pipeline);
      res.json({
        data: paginatedPosts,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  }

  export default getPosts;