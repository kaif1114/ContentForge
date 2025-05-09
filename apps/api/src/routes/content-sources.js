import express from "express";
import Content from "../models/Content.js";
const router = express.Router();

router.get("/", async (req, res) => {
  const userId = req.user;
  if (!userId) {
    res.status(400).json({ error: "User ID is required" });
    return;
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 3;
  const skip = (page - 1) * limit;

  try {
    const total = await Content.countDocuments({ user: userId });

    const contents = await Content.find({ user: userId })
      .select({ _id: 1, label: 1, type: 1, url: 1, createdAt: 1, content: 1 })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (contents.length === 0 && page === 1) {
      res.status(204).json({ error: "No content sources found" });
      return;
    }

    res.json({
      data: contents,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch content sources" });
  }
});

export default router;
