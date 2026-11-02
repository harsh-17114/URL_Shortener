import { createRoute } from "@tanstack/react-router"
import { rootRoute } from "./routeTree"
import DashboardPage from "../pages/DashboardPage.jsx"
import { checkAuth } from "../utils/helper.js"

// Define the dashboard route
export const dasboardRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/dashboard",
    component: DashboardPage,
    beforeLoad: checkAuth
})