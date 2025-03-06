import express from "express"
import repurpose from "./routes/repurpose"
import mongoose from "mongoose"
import 'dotenv/config'

mongoose.connect(process.env.MONGODB_CONNECTION_STRING).then(() => {
  console.log("Connected to MongoDB")
}).catch((err) => {
  console.log("Error connecting to MongoDB", err)
})

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/scrape", repurpose)

app.get("/", (req, res) => {
  res.send("Server is running")
})



app.listen(3001, () => {
  console.log("Server is running on port 3001")
})

