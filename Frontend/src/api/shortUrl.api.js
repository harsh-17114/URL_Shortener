import axiosInstance from "../utils/axiosInstance"

// Create a short URL
export const createShortUrl = async (url) => {
    const { data } = await axiosInstance.post("/api/create/urls", { url })
    return data.shortUrl
}

// Create a custom short URL
export const createCustomShortUrl = async (url, slug) => {
    const { data } = await axiosInstance.post("/api/create/custom", { url, slug })
    return data.shortUrl
}