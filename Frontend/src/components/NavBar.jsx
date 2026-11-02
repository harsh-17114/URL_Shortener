import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { useNavigate } from "@tanstack/react-router"
import { useDispatch, useSelector } from "react-redux"
import { logoutUser } from "../api/user.api.js"
import { logout } from "../redux/features/authSlice.js"

// Define the Navbar component
const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState("")
  const { user, isAuthenticated } = useSelector(
    (state) => state.auth
  )

  // Log out the current user
  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to log out?")) {
      return
    }

    setLoggingOut(true)
    setLogoutError("")

    try {
      await logoutUser()
      dispatch(logout())
      navigate({ to: "/" })
    }
    catch (error) {
      console.error("Logout failed:", error)
      setLogoutError(error.message || "Logout failed. Please try again.")
    }
    finally {
      setLoggingOut(false)
    }
  }

  return (
    <nav className="bg-white border border-b-black">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">

          {/* Left side - App Name */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              URL Shortener
            </Link>
          </div>

          {/* Right side - Auth buttons */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Welcome, {user?.username || "User"}
                </span>
                <Link to="/dashboard"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white px-4 py-2 rounded-md text-sm font-medium">
                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
                {logoutError && (
                  <span className="text-sm text-red-600" role="alert">
                    {logoutError}
                  </span>
                )}
              </div>
            ) : (
              <Link to="/auth"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                Login / Register
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar