import { createSlice } from '@reduxjs/toolkit'

export const mainSlice = createSlice({
  name: 'main',
  initialState: {
    darkMode: false,
    direction: localStorage.getItem('direction') || 'ltr',
    preloader: true,
    sidebar: 1,
    history: [],
  },
  reducers: {
    directionFun: (state, action) => {
      state.direction = action.payload
    },
    changeMode: (state, action) => {
      state.darkMode = action.payload
      localStorage.setItem('dark', action.payload)
    },
    changePreloader: (state, action) => {
      state.preloader = action.payload
    },
    addToHistory: (state, action) => {
      state.history = [...state.history, action.payload]
    },
  },
})

// Action creators are generated for each case reducer function
export const { directionFun, changePreloader, changeMode, addToHistory } =
  mainSlice.actions
export default mainSlice.reducer
