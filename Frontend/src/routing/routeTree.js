import { createRootRoute } from "@tanstack/react-router"
import { homePageRoute } from "./homepage.js"
import { authRoute } from "./auth.route.js"
import { dasboardRoute } from "./dashboard.js"
import RootLayout from "../App.jsx"

// Define the root route with the main layout
export const rootRoute = createRootRoute({
    component: RootLayout
})

// Add child routes to the root route
export const routeTree = rootRoute.addChildren([
    homePageRoute,
    authRoute,
    dasboardRoute
])