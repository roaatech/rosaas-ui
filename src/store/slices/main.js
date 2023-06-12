import { createSlice } from "@reduxjs/toolkit";

export const mainSlice = createSlice({
  name: "main",
  initialState: {
    darkMode: false,
    direction: "ltr",
    preloader: true,
    sidebar: 1,
  },
  reducers: {
    directionFun: (state, action) => {
      state.direction = action.payload;
    },
    changeMode: (state, action) => {
      state.darkMode = action.payload;
      localStorage.setItem("dark", action.payload);
    },
    changePreloader: (state, action) => {
      console.log("object");
      state.preloader = action.payload;
    },
    updateSidebar: (state) => {
      console.log("object");
      state.sidebar++;
    },
  },
});

// Action creators are generated for each case reducer function
export const { directionFun, changePreloader, changeMode, updateSidebar } =
  mainSlice.actions;
export default mainSlice.reducer;
