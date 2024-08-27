import { createSlice } from '@reduxjs/toolkit'

export const mainSlice = createSlice({
  name: 'main',
  initialState: {
    darkMode: false,
    direction: localStorage.getItem('direction') || 'ltr',
    preloader: true,
    sidebar: 1,
    history: [],
    currency: localStorage.getItem('selectedCurrency') || 'USD',
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
    setCurrencyCode: (state, action) => {
      state.currency = action.payload
      localStorage.setItem('selectedCurrency', action.payload)
    },
    setProductOwner: (state, action) => {
      state.pOSystemName = action.payload

      // PO-System-Name
    },
    deleteProductOwner: (state) => {
      state.pOSystemName = null // Resetting pOSystemName to null
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  directionFun,
  changePreloader,
  deleteProductOwner,
  changeMode,
  addToHistory,
  setCurrencyCode,
  setProductOwner,
} = mainSlice.actions
export default mainSlice.reducer
