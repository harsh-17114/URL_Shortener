import express from "express"
import shortUrlController from "../controllers/shortUrl.controller.js"
import authMiddleware from "../middlewares/auth.middleware.js"

const router = express.Router()

// Create Short URL
// POST /api/create/urls
router.post("/urls", shortUrlController.createShortUrlController)

// Create Custom Short URL
// POST /api/create/custom
router.post("/custom", authMiddleware, shortUrlController.createCustomShortUrlController)

export default router