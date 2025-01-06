import { createSlice, current } from '@reduxjs/toolkit'
import { set } from 'lodash'

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
    setDiscountHistory: (state, action) => {
      const { id, data } = action.payload

      if (!id) {
        console.error('Missing "id" in payload:', action.payload)
        return
      }

      if (!Array.isArray(data?.items)) {
        console.error('"data" is not an array:', data.items)
        return
      }

      if (!state.discounts[id]) {
        state.discounts[id] = {}
      }

      if (!state.discounts[id].usageHistories) {
        state.discounts[id].usageHistories = []
      }

      // Update usageHistories with the provided data
      state.discounts[id].usageHistories = [...data?.items]
    },
    setDiscountAllocation: (state, action) => {
      const { id, data } = action.payload

      if (!id) {
        console.error('Missing "id" in payload:', action.payload)
        return
      }

      if (!state.discounts[id]) {
        state.discounts[id] = {}
      }

      if (!state.discounts[id].allocations) {
        state.discounts[id].allocations = []
      }

      // Update allocations with the provided data
      state.discounts[id].allocations = [...data]
    },
    deleteDiscountLinkedByEntityId: (state, action) => {
      const { id, data: currentAllocationId } = action.payload

      if (!id || !currentAllocationId) {
        console.error(
          'Missing "id" or "currentAllocationId" in payload:',
          action.payload
        )
        return
      }

      if (!state.discounts[id]) {
        console.error(`No discount found for id: ${id}`)
        return
      }

      // Filter out the allocation ID
      const existingAllocations = state.discounts[id].allocations || []
      state.discounts[id].allocations = existingAllocations.filter(
        (allocationId) => allocationId !== currentAllocationId
      )
    },

    deleteDiscountHistory: (state, action) => {
      const { id } = action.payload

      if (!id) {
        console.error('Missing "id" in payload:', action.payload)
        return
      }

      if (!state.discounts[id]) {
        console.warn(`No discount found for id: ${id}`)
        return
      }

      // Check if usageHistories exists before attempting to delete
      if (!state.discounts[id].usageHistories) {
        console.warn(`No usageHistories to delete for id: ${id}`)
        return
      }

      // Delete the usageHistories
      delete state.discounts[id].usageHistories
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
  setDiscountHistory,
  deleteDiscountHistory,
  setDiscountAllocation,
  deleteDiscountLinkedByEntityId,
} = discountsSlice.actions

export default discountsSlice.reducer
