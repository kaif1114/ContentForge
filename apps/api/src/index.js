import express from "express";
import { database } from "./startup/database.js";
import { routes } from "./startup/routes.js";
import "dotenv/config";
import "express-async-errors";

const app = express();

database();
routes(app);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
