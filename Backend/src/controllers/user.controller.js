import shortUrlModel from "../models/shortUrl.model.js"

// Get all URLs of the logged-in user
async function getAllUrls(req, res) {
    const { _id } = req.user
    try {
        // Find URLs belonging to the user
        const urls = await shortUrlModel.find({ user: _id })
        
        // Send user URLs
        res.status(200).json({
            message: "success",
            urls
        })
    }
    catch (err) {
        console.error("Get user URLs error:", err)

        // Return a server error response
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

export default getAllUrls