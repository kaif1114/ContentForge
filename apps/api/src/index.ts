import "dotenv/config";
import express from "express";
import "express-async-errors";
import { database } from "startup/database";
import { middleware } from "startup/middleware";
import { routes } from "startup/routes";

const app = express();

middleware(app);
database();
routes(app);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
