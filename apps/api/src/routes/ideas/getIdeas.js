import mongoose from "mongoose";
import { Idea } from "../../models/Idea.js";
import Content from "../../models/Content.js";

async function getIdeas(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    // Count total ideas for pagination
    const totalIdeas = await Idea.countDocuments({
      user: mongoose.Types.ObjectId.createFromHexString(req.user),
    });

    if (totalIdeas === 0) {
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

    // Fetch paginated ideas with source information
    const ideas = await Idea.aggregate([
      {
        $match: {
          user: mongoose.Types.ObjectId.createFromHexString(req.user),
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "contents",
          localField: "content",
          foreignField: "_id",
          as: "sourceContent",
        },
      },
      { $unwind: "$sourceContent" },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          createdAt: 1,
          sourceId: "$content",
          sourceTitle: "$sourceContent.label",
        },
      },
    ]);

    res.json({
      data: ideas,
      pagination: {
        total: totalIdeas,
        page,
        limit,
        totalPages: Math.ceil(totalIdeas / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching ideas:", error);
    res.status(500).json({ error: "Failed to fetch ideas" });
  }
}

export default getIdeas;
