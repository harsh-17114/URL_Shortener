import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./features/authSlice.js"

// Create the Redux store
export const store = configureStore({
  // Combine all reducers into one Redux store
  reducer: {
    auth: authReducer, // It is managed by authReducer
  },
})

export default store