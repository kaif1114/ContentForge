import mongoose from "mongoose";
import "dotenv/config";

export function database() {
  mongoose
    .connect(process.env.MONGODB_CONNECTION_STRING)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.log("Error connecting to MongoDB", err);
      process.exit(1);
    });
}
