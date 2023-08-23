import { createSlice, current } from '@reduxjs/toolkit'
const _ = require('lodash')

export const productsSlice = createSlice({
  name: 'products',
  initialState: {
    products: {},
  },

  reducers: {
    setAllProduct: (state, action) => {
      const allProduct = {}
      action.payload.map((item) => {
        if (!{ ...current(state.products) }[item.id]) {
          allProduct[item.id] = item
        } else {
          allProduct[item.id] = { ...current(state.products) }[item.id]
        }
      })
      state.products = allProduct
    },

    productInfo: (state, action) => {
      const currentProducts = { ...current(state.products) }

      const mergedObject = _.mergeWith(
        {},
        currentProducts[action.payload.id],
        action.payload,
        (objValue, srcValue) => {
          if (_.isObject(objValue)) {
            return _.merge({}, objValue, srcValue)
          }
        }
      )

      currentProducts[action.payload.id] = mergedObject
      state.products = currentProducts
    },
    subscribe: (state, action) => {
      const currentProducts = { ...current(state.products) }
      const product = { ...currentProducts[action.payload.id] }
      product.subscribe = action.payload.data
      const mergedObject = _.mergeWith(
        {},
        currentProducts[action.payload.id],
        product,
        (objValue, srcValue) => {
          if (_.isObject(objValue)) {
            return _.merge({}, objValue, srcValue)
          }
        }
      )

      currentProducts[action.payload.id] = mergedObject
      state.products = currentProducts
    },
    features: (state, action) => {
      const currentProducts = { ...current(state.products) }
      const product = { ...currentProducts[action.payload.id] }

      const allFeatures = {}
      action.payload.data.map((item) => {
        allFeatures[item.id] = item
      })

      product.features = allFeatures
      currentProducts[action.payload.id] = product
      state.products = currentProducts
    },

    deleteFeature: (state, action) => {
      const currentProducts = { ...current(state.products) }
      const productId = action.payload.productId
      const featureIdToDelete = action.payload.featureId

      if (currentProducts[productId] && currentProducts[productId].features) {
        currentProducts[productId].features = {
          ...currentProducts[productId].features,
        }

        delete currentProducts[productId].features[featureIdToDelete]
      }

      state.products = currentProducts
    },
    // FeatureInfo: (state, action) => {
    //   const { productId, featureId, data } = action.payload

    //   // Create a new copy of the products object to avoid direct mutation
    //   const updatedProducts = {
    //     ...state.products,
    //     [productId]: {
    //       ...state.products[productId],
    //       features: {
    //         ...state.products[productId].features,
    //         [featureId]: data,
    //       },
    //     },
    //   }

    //   return {
    //     ...state,
    //     products: updatedProducts,
    //   }
    // },
    FeatureInfo: (state, action) => {
      const { productId, featureId, data } = action.payload
      const currentProducts = JSON.parse(
        JSON.stringify(current(state.products))
      )
      currentProducts[productId].features[featureId] = data
      state.products = currentProducts
    },
    // const currentProducts = { ...current(state.products) }
    // const product = { ...currentProducts[action.payload.id] }
    // product.features = action.payload.data

    // const mergedObject = _.mergeWith(
    //   {},
    //   currentProducts[action.payload.id],
    //   action.payload.data,
    //   (objValue, srcValue) => {
    //     if (_.isObject(objValue)) {
    //       return _.merge({}, objValue, srcValue)
    //     }
    //   }
    // )

    // currentProducts[action.payload.id] = mergedObject
    // state.products = currentProducts
    // const currentProduct = { ...currentProducts[productId] }
    // const currentFeatures = { ...currentProduct.features }

    // console.log(currentProducts, '****')
    // if (currentFeatures[featureId]) {
    //   currentFeatures[featureId] = action.payload

    // }

    removeProduct: (state, action) => {
      const currentProducts = { ...current(state.products) }
      delete currentProducts[action.payload]
      state.products = currentProducts
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  setAllProduct,
  subscribe,
  productInfo,
  removeProduct,
  features,
  FeatureInfo,
  deleteFeature,
} = productsSlice.actions
export default productsSlice.reducer
