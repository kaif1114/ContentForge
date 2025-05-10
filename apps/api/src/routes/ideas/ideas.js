import express from "express";
import generateIdeas from "./generate.js";
import getIdeas from "./getIdeas.js";
import deleteIdea from "./deleteIdea.js";

const router = express.Router();
router.get("/", getIdeas);
router.post("/generate", generateIdeas);
router.delete("/:id", deleteIdea);

export default router;
