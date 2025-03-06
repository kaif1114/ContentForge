import mongoose from "mongoose"

export const database = ()=>{
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING).then(() => {
        console.log("Connected to MongoDB")
      }).catch((err) => {
        console.log("Error connecting to MongoDB", err)
        process.exit(1)
      })
      
}