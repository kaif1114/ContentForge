import mongoose from "mongoose"

const contentSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        maxLength: 2048
    },
    type: {
        type: String,
        required: true
    },
    scrapedContent: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
})

const Content = mongoose.model("Content", contentSchema)

export default Content
