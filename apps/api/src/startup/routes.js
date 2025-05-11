import express from "express";
import postsRouter from "../routes/posts/index.js";
import ideasRouter from "../routes/ideas/index.js";
import scrape from "../routes/scrape.js";
import content from "../routes/content-sources.js";
import auth from "../routes/auth/index.js";
import authMiddleware from "../middleware/auth.js";
import { errorHandler } from "../middleware/error.js";
import schedule from "../routes/schedule/index.js";
export function routes(app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(errorHandler);

  app.use("/scrape", authMiddleware, scrape);
  app.use("/ideas", authMiddleware, ideasRouter);
  app.use("/posts", authMiddleware, postsRouter);
  app.use("/content-sources", authMiddleware, content);
  app.use("/schedule", authMiddleware, schedule);
  app.use("/auth", auth);
}
