import express from "express";
import { database } from "./startup/database.js";
import { routes } from "./startup/routes.js";
import "dotenv/config";
import "express-async-errors";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  exposedHeaders: ["Authorization"]
}));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World");
});

database();
routes(app);

app.get("/ping", (req, res) => {
  res.status(200).send("Success");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
