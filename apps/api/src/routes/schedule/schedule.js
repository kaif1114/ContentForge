import { z } from "zod";
import Schedule from "../../models/Schedule.js";
import Content from "../../models/Content.js";
import mongoose from "mongoose";

const schedulePostSchema = z.object({
  postId: z.string(),
  scheduleDate: z
    .string()
    .transform((str) => new Date(str))
    .refine((date) => date > new Date() && !isNaN(date), {
      message: "Schedule date must be a valid date in the future",
    }),
  platform: z.enum(["linkedin", "x", "both"]),
});

async function schedulePost(req, res) {
  const validation = schedulePostSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.message });
  }
  const { postId, scheduleDate, platform } = validation.data;

  try {
    const postObjectId = new mongoose.Types.ObjectId(postId);

    const result = await Content.aggregate([
      { $match: { "posts._id": postObjectId } },
      {
        $project: {
          user: 1,
          post: {
            $filter: {
              input: "$posts",
              as: "post",
              cond: { $eq: ["$$post._id", postObjectId] },
            },
          },
        },
      },
      { $unwind: "$post" },
    ]);

    if (!result.length) {
      return res.status(404).json({ error: "Post not found" });
    }

    const { user, post } = result[0];

    if (user.toString() !== req.user.toString()) {
      return res
        .status(403)
        .json({ error: "You are not authorized to schedule this post" });
    }

    const existingSchedule = await Schedule.findOne({
      userId: req.user,
      postId,
      platform,
    });
    if (existingSchedule) {
      return res.status(400).json({
        error: "Post already scheduled",
        scheduleDetails: {
          scheduleDate: existingSchedule.scheduleDate,
          platform: existingSchedule.platform,
          postId: existingSchedule.postId,
        },
      });
    }
    await Schedule.create({
      userId: req.user,
      postId,
      scheduleDate,
      platform,
    });
    res.status(201).json({
      message: "Post scheduled successfully",
      scheduleDate,
      platform,
      postId,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ error: "Invalid post ID format" });
    }
    return res
      .status(500)
      .json({ error: "Server error", details: error.message });
  }
}

export default schedulePost;
