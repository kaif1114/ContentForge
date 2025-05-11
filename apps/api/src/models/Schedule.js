import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  platform: {
    type: String,
    enum: ["linkedin", "x", "both"],
    required: true,
  },
  scheduleDate: {
    type: Date,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Schedule = mongoose.model("Schedule", scheduleSchema);

export default Schedule;
