import dotenv from "dotenv"
import app from "./src/app.js"
import connectDB from "./src/config/database.js"
dotenv.config()

async function startServer() {
    try {
        // Connect to database
        await connectDB()

        // Start app
        app.listen(3000, () => {
            console.log("Server Started Successfully")
        })
    }
    catch (err) {
        console.error("Server startup error:", err)

        // Exit the process 
        process.exit(1)
    }
}

startServer()