import { redirect } from "@tanstack/react-router"
import { getCurrentUser } from "../api/user.api"
import { login } from "../redux/features/authSlice.js"

export const checkAuth = async ({ context }) => {
    try {
        // Get the query client and Redux store from the context
        const { queryClient, store } = context

        // Fetch the current user and cache the result
        const user = await queryClient.ensureQueryData({
            queryKey: ["currentUser"],
            queryFn: getCurrentUser,
        })

        // Return false if no user is found
        if (!user) {
            return false
        }
        store.dispatch(login(user))

        // Check the current authentication status
        const { isAuthenticated } = store.getState().auth

        // Return false if the user is not authenticated
        if (!isAuthenticated) {
            return false
        }
        return true
    }
    catch {
        return redirect({ to: "/auth", })
    }
}