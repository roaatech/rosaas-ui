import { createSlice } from "@reduxjs/toolkit";

export const mainSlice = createSlice({
  name: "main",
  initialState: {
    direction: "ltr",
  },
  reducers: {
    directionFun: (state, action) => {
      state.direction = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { directionFun } = mainSlice.actions;

export default mainSlice.reducer;
