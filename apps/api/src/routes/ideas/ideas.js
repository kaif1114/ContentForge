import express from "express";
import generateIdeas from "./generate.js";
import getIdeas from "./getIdeas.js";

const router = express.Router();
router.get("/", getIdeas);
router.post("/generate", generateIdeas);

export default router;
