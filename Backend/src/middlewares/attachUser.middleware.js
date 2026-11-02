import userModel from "../models/user.model.js"
import jwt from "jsonwebtoken"

// Attach user if a valid authentication token exists
async function attachUser(req, res, next) {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1]

    // Continue as a guest if no token exists
    if (!token) {
        return next()
    }

    try {
        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // Find the user
        const user = await userModel.findById(decoded.id)

        // Continue as a guest if user doesn't exist
        if (!user) {
            return next()
        }

        // Attach user to request
        req.user = user

        return next()
    }
    catch (err) {
        console.log("Optional authentication error:", err)

        // Invalid token should not block guest URL creation
        return next()
    }
}

export default attachUser