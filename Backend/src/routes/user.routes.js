import express from "express"
import userController from "../controllers/user.controller.js"
import authMiddleware from "../middlewares/auth.middleware.js"

const router = express.Router()

// Get User's Short URLs
// POST /api/user/urls
router.get("/urls", authMiddleware, userController)

export default router