import { createSlice, current } from '@reduxjs/toolkit'
import { forEach, set } from 'lodash'

export const discountsSlice = createSlice({
  name: 'discounts',
  initialState: {
    requirementsOptions: {},
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
    setAllRequirementsOptions: (state, action) => {
      const allRequirementsOptions = JSON.parse(
        JSON.stringify(current(state.requirementsOptions))
      )

      const requirementsOptionsArray = action.payload
      if (Array.isArray(requirementsOptionsArray)) {
        requirementsOptionsArray.forEach((item) => {
          if (!current(state.requirementsOptions)[item.systemName]) {
            allRequirementsOptions[item.systemName] = item
          }
        })
      } else {
        console.error(
          'Payload items are not an array:',
          requirementsOptionsArray
        )
      }

      state.requirementsOptions = allRequirementsOptions
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
    setDiscountRequirement: (state, action) => {
      const { id, data } = action.payload

      if (!id) {
        console.error('Missing "id" in payload:', action.payload)
        return
      }

      if (!state.discounts[id]) {
        state.discounts[id] = {}
      }

      if (!state.discounts[id].requirement) {
        state.discounts[id].requirement = {}
      }
      if (Array.isArray(data)) {
        forEach(data, (item) => {
          if (!state.discounts[id].requirement[item.id]) {
            state.discounts[id].requirement[item.id] = item
          }
        })
      }
    },
    setDiscountRequirementInfo: (state, action) => {
      const { discountId, id, data } = action.payload

      if (!id || !discountId) {
        console.error(
          'Missing "id" or "discountId" in payload:',
          action.payload
        )
        return
      }

      if (!state.discounts?.[discountId]) {
        state.discounts[discountId] = {}
      }

      if (!state.discounts?.[discountId]?.requirement) {
        state.discounts[discountId].requirement = {}
      }

      // Update or add the data
      state.discounts[discountId].requirement[id] = {
        ...state.discounts[discountId].requirement[id],
        ...data,
      }
    },
    deleteDiscountRequirementInfo: (state, action) => {
      const { discountId, id } = action.payload

      if (!id || !discountId) {
        console.error(
          'Missing "id" or "discountId" in payload:',
          action.payload
        )
        return
      }

      if (!state.discounts?.[discountId]?.requirement?.[id]) {
        console.warn(
          `No requirement found for discountId: ${discountId}, id: ${id}`
        )
        return
      }

      // Delete the requirement by id
      delete state.discounts[discountId].requirement[id]

      // Optionally clean up empty objects
      if (Object.keys(state.discounts[discountId].requirement).length === 0) {
        delete state.discounts[discountId].requirement
      }
      if (Object.keys(state.discounts[discountId]).length === 0) {
        delete state.discounts[discountId]
      }
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
  setAllRequirementsOptions,
  setDiscountRequirement,
  setDiscountRequirementInfo,
  deleteDiscountRequirementInfo,
} = discountsSlice.actions

export default discountsSlice.reducer
