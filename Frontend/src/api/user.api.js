import axiosInstance from "../utils/axiosInstance"

// Log in a user
export const loginUser = async (password, email) => {
    const { data } = await axiosInstance.post("/api/auth/login", { email, password })
    return data
}

// Register a new user
export const registerUser = async (username, password, email) => {
    const { data } = await axiosInstance.post("/api/auth/register", { username, email, password })
    return data
}

// Log out the current user
export const logoutUser = async () => {
    const { data } = await axiosInstance.post("/api/auth/logout")
    return data
}

// Fetch the current user
export const getCurrentUser = async () => {
    const { data } = await axiosInstance.get("/api/auth/get-me")
    return data.user
}

// Fetch all URLs belonging to the user
export const getAllUserUrls = async () => {
    const { data } = await axiosInstance.get("/api/user/urls")
    return data
}