import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import authRouter from "./routes/auth.routes.js"
import userRouter from "./routes/user.routes.js"
import shortUrlRouter from "./routes/shortUrl.routes.js"
import shortUrlController from "./controllers/shortUrl.controller.js"
import attachUserMiddleware from "./middlewares/attachUser.middleware.js"

// create our Express app
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

// API Routes
app.get("/", (req, res) => {
    res.send("URL Shortener Service is up and running")
})
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)

// Attach logged-in user for URL routes
app.use(attachUserMiddleware)

app.use("/api/create", shortUrlRouter)
app.get("/:id", shortUrlController.redirectFromShortUrlController)

export default app