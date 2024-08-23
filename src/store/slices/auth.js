import { createSlice } from '@reduxjs/toolkit'
export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userInfo: {},
    redirectPath: '',
  },
  reducers: {
    logOut: (state) => {
      state.userInfo = {}
      localStorage.removeItem('token')
      window.location.href = '/'
    },
    addUserInfo: (state, action) => {
      state.userInfo = action.payload
    },
    signinRedirectPath: (state, action) => {
      state.redirectPath = action.payload
    },
    updateUserInfoAttribute: (state, action) => {
      const { key, value } = action.payload
      state.userInfo[key] = value
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  updateUserInfoAttribute,
  logOut,
  addUserInfo,
  signinRedirectPath,
} = authSlice.actions

export default authSlice.reducer
