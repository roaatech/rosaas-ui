import { createSlice, current } from '@reduxjs/toolkit'

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
    },
    pOSystemName: null,
    isLoading: false,
    environmentAlertData: [],
    audits: { items: [], totalCount: 0 },
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
      state.currency = { id, currencyCode }
    },
    setProductOwner: (state, action) => {
      state.pOSystemName = action.payload
    },
    deleteProductOwner: (state) => {
      state.pOSystemName = null
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setEnvironmentAlertData: (state, action) => {
      state.environmentAlertData = action.payload
    },
    setAuditsData: (state, action) => {
      const allAudits = JSON.parse(JSON.stringify(current(state.audits)))
      if (action?.payload?.items) {
        action.payload.items.forEach((item) => {
          // Add new item if it doesn't already exist
          if (!allAudits.items[item.id]) {
            allAudits.items[item.id] = item
          }
        })
      }

      state.audits.items = allAudits.items
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
  setLoading,
  setEnvironmentAlertData,
  setAuditsData,
} = mainSlice.actions

export default mainSlice.reducer
