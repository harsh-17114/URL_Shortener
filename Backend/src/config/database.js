import mongoose from "mongoose"

// Connect to MongoDB
async function connectDB() {
    try {
        // Connect using MongoDB URI
        await mongoose.connect(process.env.MONGODB_URI, {
            family: 4
        })
        console.log("Connection to Database Successful")
    }
    catch (err) {
        console.error("Connection to Database Failed", err)
        throw err
    }
}

export default connectDB