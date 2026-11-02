import axios from "axios"

// Create a configured Axios instance
const axiosInstance = axios.create({
    baseURL: "http://localhost:3000",
    timeout: 10000,
    withCredentials: true
})

// Handle successful and failed responses
axiosInstance.interceptors.response.use(
    // Return the successful response
    (response) => {
        return response
    },

    // Handle errors from failed requests
    (error) => {
        // Check if the server sent a response
        if (error.response) {
            // Extract the status code and response data
            const { status, data } = error.response

            // Handle different HTTP status codes
            switch (status) {
                case 400:
                    console.error("Bad Request:", data)
                    break
                case 401:
                    console.error("Unauthorized:", data)
                    break
                case 403:
                    console.error("Forbidden:", data)
                    break
                case 404:
                    console.error("Not Found:", data)
                    break
                case 500:
                    console.error("Server Error:", data)
                    break
                default:
                    console.error(`Error (${status}):`, data)
            }
        }

        // Handle requests that received no response
        else if (error.request) {
            console.error("Network Error: No response received", error.request)
        }

        // Handle errors that occurred while setting up the request
        else {
            console.error("Error:", error.message);
        }

        // Reject the promise with formatted error details
        return Promise.reject({
            message: error.response?.data?.message || error.message || "Unknown error occurred",
            status: error.response?.status,
            data: error.response?.data,
        })
    }
)

export default axiosInstance