import express from "express"
import scrape from "./routes/scrape"
import mongoose from "mongoose"
import 'dotenv/config'
import 'express-async-errors'
import { errorHandler } from "./middleware/error"


mongoose.connect(process.env.MONGODB_CONNECTION_STRING).then(() => {
  console.log("Connected to MongoDB")
}).catch((err) => {
  console.log("Error connecting to MongoDB", err)
})

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/scrape", scrape)

app.use(errorHandler)

app.get("/", (req, res) => {
  res.send("Server is running")
})



app.listen(3001, () => {
  console.log("Server is running on port 3001")
})

