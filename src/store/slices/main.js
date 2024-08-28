import { createSlice } from '@reduxjs/toolkit'

export const mainSlice = createSlice({
  name: 'main',
  initialState: {
    darkMode: false,
    direction: localStorage.getItem('direction') || 'ltr',
    preloader: true,
    sidebar: 1,
    history: [],
    currency: {
      currencyCode: localStorage.getItem('currencyCode'),
      id: localStorage.getItem('currencyId'),
    } || { id: 1, currencyCode: 'USD' },
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
    setCurrentCurrencyCodeAndId: (state, action) => {
      const { id, currencyCode } = action.payload
      state.currentCurrency = { id, currencyCode }
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
  setCurrentCurrencyCodeAndId,
  setProductOwner,
} = mainSlice.actions
export default mainSlice.reducer
