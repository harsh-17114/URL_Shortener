import userModel from "../models/user.model.js"
import jwt from "jsonwebtoken"

// Register a new user
async function userRegisterController(req, res) {
    const { username, email, password } = req.body
    try {
        // Validate required fields
        if (!email || !password || !username) {
            return res.status(400).json({
                message: "Email, password and username are required"
            })
        }

        // Check if user already exists
        const isUserAlreadyExists = await userModel.findOne({ email })

        // If the email is already registered, return an error
        if (isUserAlreadyExists) {
            return res.status(409).json({
                message: "User Already Exists"
            })
        }

        // Create new user
        const user = await userModel.create({
            username,
            email,
            password
        })

        // Generate JWT token
        const token = jwt.sign({
            id: user._id
        }, process.env.JWT_SECRET, {
            expiresIn: "3d"
        })

        // Store the token in cookie
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 3 * 24 * 60 * 60 * 1000
        })

        // Send successful registration response
        res.status(201).json({
            message: "User Registered Successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    }
    catch (err) {
        console.error("Registration error:", err)

        // Handle duplicate email race condition
        if (err.code === 11000) {
            return res.status(409).json({
                message: "User already exists with this email"
            })
        }

        // Return a server error response
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

// Login an existing user
async function userLoginController(req, res) {
    const { email, password } = req.body
    try {
        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            })
        }

        // Find user by email
        const user = await userModel.findOne({ email: email }).select("+password")

        // If no user is found, return an authentication error
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }

        // Compare the entered password
        const isValidPassword = await user.comparePassword(password)

        // If the password is incorrect, return an authentication error
        if (!isValidPassword) {
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }

        // Generate JWT token
        const token = jwt.sign({
            id: user._id
        }, process.env.JWT_SECRET, {
            expiresIn: "3d"
        })

        // Store the token in cookie
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 3 * 24 * 60 * 60 * 1000
        })

        // Send successful login response
        res.status(200).json({
            message: "User Logged In Successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    }
    catch (err) {
        console.error("Login error:", err)

        // Return a server error response
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

// Logout the current user
async function userLogoutController(req, res) {
    // Clear the authentication token cookie
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
    })

    // Send successful logout response
    res.status(200).json({
        message: "User Logged Out Successfully"
    })
}

async function getMeController(req, res) {
    const user = await userModel.findById(req.user.id)

    // Send successful details fetched response
    res.status(200).json({
        message: "User details fetched successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

export default { userRegisterController, userLoginController, userLogoutController, getMeController }