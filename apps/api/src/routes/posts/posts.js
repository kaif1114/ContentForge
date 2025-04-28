import express from "express";
import getPosts from "./get-posts.js";
import generate from "./generate.js";
import generateFromIdea from "./generate-from-idea.js";

const router = express.Router();

router.get("/", getPosts);
router.post("/generate", generate);
router.post("/generate-from-idea", generateFromIdea);

export default router;
