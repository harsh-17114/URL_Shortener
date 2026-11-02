import { useState } from "react"
import { loginUser } from "../api/user.api.js"
import { useDispatch } from "react-redux"
import { login } from "../redux/features/authSlice.js"
import { useNavigate } from "@tanstack/react-router"
import { queryClient } from "../main.jsx"

// Define the LoginForm component
const LoginForm = ({ state }) => {
    // Store the user's email
    const [email, setEmail] = useState("")

    // Store the user's password
    const [password, setPassword] = useState("")

    // Track the login loading state
    const [loading, setLoading] = useState(false)

    // Store any login error message
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const dispatch = useDispatch()

    // Handle the login form submission
    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!email.trim() || !password) {
            setError("Enter your email and password.")
            return
        }

        setLoading(true)
        setError("")
        try {
            const data = await loginUser(password, email)
            dispatch(login(data.user))
            queryClient.setQueryData(["currentUser"], data.user)
            navigate({ to: "/dashboard" })
        }
        catch (err) {
            setError(err.message || "Login failed. Please check your credentials.")
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                {/* Display the form heading */}
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                        {error}
                    </div>
                )}

                {/* Email input section */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="email" type="email" placeholder="Email" value={email} required />
                </div>

                {/* Password input section */}
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="password" type="password" placeholder="Password" value={password} required />
                </div>

                {/* Login button section */}
                <div className="flex items-center justify-between">
                    <button
                        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        type="submit" disabled={loading} >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </div>

                {/* Registration navigation section */}
                <div className="text-center mt-4">
                    <p className="cursor-pointer text-sm text-gray-600">
                        Don't have an account?
                        <span
                            onClick={() => state(false)}
                            className="text-blue-500 hover:text-blue-700">
                            Register
                        </span>
                    </p>
                </div>
            </form>
        </div>
    )
}

export default LoginForm