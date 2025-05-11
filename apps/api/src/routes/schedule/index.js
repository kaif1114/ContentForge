import express from "express";
import schedulePost from "./schedule.js";
const router = express.Router();

router.post("/", schedulePost);

export default router;
