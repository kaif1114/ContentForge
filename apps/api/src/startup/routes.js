import express from "express";
import generate from "../routes/posts.js";
import scrape from "../routes/scrape.js";
import { errorHandler } from "../middleware/error.js";

export function routes(app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(errorHandler);

  app.use("/scrape", scrape);
  app.use("/posts", generate);
}
