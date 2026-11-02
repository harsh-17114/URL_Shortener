import { nanoid } from "nanoid"
import shortUrlModel from "../models/shortUrl.model.js"

// Validate and normalize a destination URL
function normalizeUrl(value) {
    // Ensure the value is a string
    if (typeof value !== "string") {
        return null
    }

    // Remove extra spaces
    const trimmedUrl = value.trim()

    // Reject empty URLs
    if (!trimmedUrl) {
        return null
    }

    // Reject unsupported protocols
    const hasProtocol = /^[a-z][a-z\d+.-]*:/i.test(trimmedUrl)
    if (hasProtocol && !/^https?:\/\//i.test(trimmedUrl)) {
        return null
    }

    // Add HTTPS if no protocol is provided
    const urlWithProtocol = /^https?:\/\//i.test(trimmedUrl) ? trimmedUrl : `https://${trimmedUrl}`

    try {
        // Parse the URL
        const parsedUrl = new URL(urlWithProtocol)

        // Allow only HTTP and HTTPS
        if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
            return null
        }

        // Return the normalized URL
        return parsedUrl.href
    }
    catch {
        // Return null for invalid URLs
        return null
    }
}

// Create Short URL
async function createShortUrlController(req, res) {
    const { url } = req.body
    try {
        const normalizedUrl = normalizeUrl(url)

        // Reject invalid URLs
        if (!normalizedUrl) {
            return res.status(400).json({
                message: "A valid HTTP or HTTPS URL is required"
            })
        }

        // Generate Short URL
        const shortUrl = nanoid(7)

        // Check if Short URL is generated
        if (!shortUrl) {
            throw new Error("Short URL not generated")
        }

        // Save URL for logged-in user
        if (req.user) {
            await shortUrlModel.create({
                full_url: normalizedUrl,
                short_url: shortUrl,
                user: req.user._id
            })
        }
        else {
            await shortUrlModel.create({
                full_url: normalizedUrl,
                short_url: shortUrl
            })
        }

        // Send Short URL
        res.status(200).json({
            shortUrl: process.env.APP_URL + shortUrl
        })
    }
    catch (err) {
        console.error("Short URL creation error:", err)

        // Return a server error response
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

// Create Custom Short URL
async function createCustomShortUrlController(req, res) {
    const { url, slug } = req.body
    try {
        const normalizedUrl = normalizeUrl(url)

        // Reject invalid URLs and slugs
        if (!normalizedUrl || typeof slug !== "string" || !slug.trim()) {
            return res.status(400).json({
                message: "A valid HTTP or HTTPS URL and slug are required"
            })
        }

        // Remove extra spaces
        const normalizedSlug = slug.trim()

        // Check whether custom URL already exists
        const existingUrl = await shortUrlModel.findOne({ short_url: normalizedSlug })

        // Check if the custom URL already exists
        if (existingUrl) {
            return res.status(409).json({
                message: "This custom URL already exists"
            })
        }

        // Save Custom Short URL
        await shortUrlModel.create({
            full_url: normalizedUrl,
            short_url: normalizedSlug,
            user: req.user?._id
        })

        // Send Custom Short URL
        res.status(200).json({
            shortUrl: process.env.APP_URL + normalizedSlug
        })
    }
    catch (err) {
        console.error("Custom short URL creation error:", err)

        // Return a server error response
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

// Redirect from short URL
async function redirectFromShortUrlController(req, res) {
    const { id } = req.params
    
    try {
        // Validate id
        if (!id) {
            return res.status(400).json({
                message: "Short URL ID is required"
            });
        }
        
        // Find Short URL
        const url = await shortUrlModel.findOne({ short_url: id })

        // Check if Short URL exists
        if (!url) {
            return res.status(404).json({
                message: "Short URL not found"
            })
        }
        
        // Validate original URL
        let originalUrl = url.full_url?.trim()
        if (!originalUrl) {
            return res.status(400).json({
                message: "Original URL is missing"
            })
        }
        
        // Add protocol if missing
        if (!/^https?:\/\//i.test(originalUrl)) {
            originalUrl = `https://${originalUrl}`
        }
        
        // Validate the destination URL
        let parsedUrl;
        try {
            parsedUrl = new URL(originalUrl)
        }
        catch {
            return res.status(400).json({
                message: "Invalid original URL"
            })
        }
        
        // Validate the protocol of the destination URL
        if ( parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
            return res.status(400).json({
                message: "Unsupported URL protocol"
            });
        }

        // Increase click count
        await shortUrlModel.updateOne(
            { _id: url._id },
            { $inc: { clicks: 1 } }
        )
        
        // Redirect to original URL
        res.redirect(302, parsedUrl.href)
    }
    catch (err) {
        console.error("URL redirect error:", err)

        // Return a server error response
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

export default { createShortUrlController, createCustomShortUrlController, redirectFromShortUrlController }