import express, { Application } from "express";
import scrape from "../routes/scrape";
import { errorHandler } from "../middleware/error";

export function routes(app: Application) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(errorHandler);

  app.use("/scrape", scrape);
}
