import { createSlice } from "@reduxjs/toolkit";

export const mainSlice = createSlice({
  name: "main",
  initialState: {
    darkMode: false,
    direction: "ltr",
    preloader: true,
  },
  reducers: {
    directionFun: (state, action) => {
      state.direction = action.payload;
    },
    changeMode: (state, action) => {
      console.log(action.payload, "ddddd");
      state.darkMode = action.payload;
    },
    changePreloader: (state, action) => {
      console.log("object");
      state.preloader = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { directionFun, changePreloader, changeMode } = mainSlice.actions;
export default mainSlice.reducer;
