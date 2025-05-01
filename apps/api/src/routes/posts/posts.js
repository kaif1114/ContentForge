import express from "express";
import getPosts from "./get-posts.js";
import generate from "./generate.js";
import generateFromIdea from "./generate-from-idea.js";
import deletePost from "./delete.js";
import modify from "./modify.js";

const router = express.Router();

router.get("/", getPosts);
router.post("/generate", generate);
router.post("/generate-from-idea", generateFromIdea);
router.delete("/:postId", deletePost);
router.patch("/:postId", modify);

export default router;
