import { createSlice, current } from '@reduxjs/toolkit'
export const productsOwners = createSlice({
  name: 'productsOwners',
  initialState: {
    productsOwners: {},
    lookup: {},
  },
  reducers: {
    setAllProductOwners: (state, action) => {
      const allProductOwners = JSON.parse(
        JSON.stringify(current(state.productsOwners))
      )

      action?.payload?.forEach((item) => {
        if (allProductOwners[item.id]) {
          allProductOwners[item.id] = {
            ...allProductOwners[item.id],
            ...item,
          }
        } else {
          allProductOwners[item.id] = item
        }
      })

      state.productsOwners = allProductOwners
    },
    setAllProductOwnersLookup: (state, action) => {
      const allProductOwnersLookup = JSON.parse(
        JSON.stringify(current(state.lookup))
      )
      action?.payload?.forEach((item) => {
        if (allProductOwnersLookup[item.id]) {
          allProductOwnersLookup[item.id] = {
            ...allProductOwnersLookup[item.id],
            ...item,
          }
        } else {
          allProductOwnersLookup[item.id] = item
        }
      })
      state.lookup = allProductOwnersLookup
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

      // if (productsOwners[productOwnerId]) {
      Object.assign(productsOwners[productOwnerId], attributes)
      // }
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  setAllProductOwners,
  setAllProductOwnersLookup,
  productOwnerInfo,
  removeProductOwnerStore,
  productOwnerChangeAttr,
} = productsOwners.actions

export default productsOwners.reducer
