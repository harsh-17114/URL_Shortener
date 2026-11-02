import mongoose from "mongoose"

// Define short url schema
const shortUrlSchema = new mongoose.Schema({
    full_url: {
        type: String,
        required: true
    },
    short_url: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    clicks: {
        type: Number,
        required: true,
        default: 0,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    }
})

// Create short url model
const shortUrlModel = mongoose.model("shortUrl", shortUrlSchema)

export default shortUrlModel