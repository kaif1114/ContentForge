import express from "express";
import generatePosts from "../routes/posts.js";
import generateIdeas from "../routes/ideas.js";
import scrape from "../routes/scrape.js";
import content from "../routes/content-sources.js";
import auth from "../routes/auth/auth.js";
import { errorHandler } from "../middleware/error.js";

export function routes(app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(errorHandler);

  app.use("/scrape", scrape);
  app.use("/ideas", generateIdeas);
  app.use("/posts", generatePosts);
  app.use("/content-sources", content); 
  app.use("/auth", auth);
}
