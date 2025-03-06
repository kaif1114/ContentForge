import express, { Application } from "express";
import { errorHandler } from "middleware/error";

export const middleware = (app: Application) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(errorHandler);
};
