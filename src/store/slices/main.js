import { createSlice } from "@reduxjs/toolkit";

export const mainSlice = createSlice({
  name: "main",
  initialState: {
    direction: "ltr",
    preloader: true,
  },
  reducers: {
    directionFun: (state, action) => {
      state.direction = action.payload;
    },
    changePreloader: (state, action) => {
      console.log("object");
      state.preloader = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { directionFun, changePreloader } = mainSlice.actions;
export default mainSlice.reducer;
