import { createSlice } from '@reduxjs/toolkit'

export const publicSlice = createSlice({
  name: 'public',
  initialState: {
    public: [],
  },

  reducers: {
    addProductPlanPrice: (state, action) => {
      const { systemName, priceName, data } = action.payload

      if (!state.public[systemName]) {
        state.public[systemName] = {}
      }
      if (!state.public[systemName].planPrice) {
        state.public[systemName].planPrice = {}
      }
      if (!state.public[systemName].planPrice[priceName]) {
        state.public[systemName].planPrice[priceName] = {}
      }

      state.public[systemName].planPrice[priceName].data = data
    },
  },
})

export const { addProductPlanPrice } = publicSlice.actions
export default publicSlice.reducer
