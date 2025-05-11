import express from "express";
import schedulePost from "./schedule.js";
import getSchedule from "./getSchedule.js";

const router = express.Router();

router.post("/", schedulePost);
router.get("/", getSchedule);
export default router;
