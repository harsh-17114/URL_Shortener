import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  user: null,
  isAuthenticated: false,
}

const authSlice = createSlice({
  name: "auth", // Name of this Redux slice
  initialState,

  // Reducers contain the functions that modify the state
  reducers: {
    // Store user data and mark the user as authenticated
    login: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = true
    },

    // Clear user data and mark the user as logged out
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
    },
  },
})

// Export the actions
export const { login, logout } = authSlice.actions
export default authSlice.reducer