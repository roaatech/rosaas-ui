import { createSlice, current } from '@reduxjs/toolkit'
export const productsOwners = createSlice({
  name: 'productsOwners',
  initialState: {
    productsOwners: {},
  },
  reducers: {
    setAllProductOwners: (state, action) => {
      const allProductOwners = JSON.parse(
        JSON.stringify(current(state.productsOwners))
      )
      action?.payload?.forEach((item) => {
        if (!{ ...current(state.productsOwners) }[item.id]) {
          allProductOwners[item.id] = item
        }
      })
      state.productsOwners = allProductOwners
    },
    productOwnerInfo: (state, action) => {
      const { id, data } = action.payload
      state.productsOwners[id] = data
    },
    removeProductOwnerStore: (state, action) => {
      const idToRemove = action.payload
      const updatedProductsOwners = { ...state.productsOwners }
      delete updatedProductsOwners[idToRemove]
      state.productsOwners = updatedProductsOwners
    },
    productOwnerChangeAttr: (state, action) => {
      const { productOwnerId, attributes } = action.payload
      const { productsOwners } = state

      if (productsOwners[productOwnerId]) {
        Object.assign(productsOwners[productOwnerId], attributes)
      }
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  setAllProductOwners,
  productOwnerInfo,
  removeProductOwnerStore,
  productOwnerChangeAttr,
} = productsOwners.actions

export default productsOwners.reducer
