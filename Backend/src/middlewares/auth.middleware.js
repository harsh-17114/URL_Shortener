import userModel from "../models/user.model.js"
import jwt from "jsonwebtoken"

// Authenticate normal user
async function authMiddleware(req, res, next) {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1]

    // Reject the request if the token is missing
    if (!token) {
        return res.status(401).json({
            message: "Unauthorized access, token is missing"
        })
    }

    try {
        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // Find user by ID
        const user = await userModel.findById(decoded.id)

        // If no user is found, return an authentication error
        if (!user) {
            return res.status(401).json({
                message: "Unauthorized access, user not found"
            })
        }

        // Attach user to request
        req.user = user
        return next()
    }
    catch (err) {
        console.error("Authentication error:", err)

        // Handle invalid token
        return res.status(401).json({
            message: "Unauthorized access, token is invalid"
        })
    }
}

export default authMiddleware