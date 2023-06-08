import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    userInfo: {},
    // userInfo: { role: "superAdmin" },
  },
  reducers: {
    logOut: (state) => {
      state.userInfo = {};
      localStorage.removeItem("token");
    },
    addUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { logOut, addUserInfo } = authSlice.actions;

export default authSlice.reducer;
