import { createSlice, current } from '@reduxjs/toolkit'

export const discountsSlice = createSlice({
  name: 'discounts',
  initialState: {
    discounts: {},
  },
  reducers: {
    setAllDiscounts: (state, action) => {
      const allDiscounts = JSON.parse(JSON.stringify(current(state.discounts)))

      const discountsArray = action.payload?.items // Extract items array
      if (Array.isArray(discountsArray)) {
        discountsArray.forEach((item) => {
          if (!current(state.discounts)[item.id]) {
            allDiscounts[item.id] = item
          }
        })
      } else {
        console.error('Payload items are not an array:', discountsArray)
      }

      state.discounts = allDiscounts
    },
    discountInfo: (state, action) => {
      const { id, data } = action.payload
      state.discounts[id] = data
    },
    removeDiscount: (state, action) => {
      const idToRemove = action.payload
      const updatedDiscounts = { ...state.discounts }
      delete updatedDiscounts[idToRemove]
      state.discounts = updatedDiscounts
    },
    discountChangeAttr: (state, action) => {
      const { discountId, attributes } = action.payload
      const { discounts } = state

      if (discounts[discountId]) {
        Object.assign(discounts[discountId], attributes)
      }
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  setAllDiscounts,
  discountInfo,
  removeDiscount,
  discountChangeAttr,
} = discountsSlice.actions

export default discountsSlice.reducer
