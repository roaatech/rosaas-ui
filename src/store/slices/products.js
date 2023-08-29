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

    removeProduct: (state, action) => {
      const currentProducts = { ...current(state.products) }
      delete currentProducts[action.payload]
      state.products = currentProducts
    },

    // subscribe

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

    // feature

    features: (state, action) => {
      const currentProducts = { ...current(state.products) }
      const product = { ...currentProducts[action.payload.productId] }

      const allFeatures = {}
      action.payload.data.map((item) => {
        allFeatures[item.id] = item
      })

      product.features = allFeatures
      currentProducts[action.payload.productId] = product
      state.products = currentProducts
    },
    FeatureInfo: (state, action) => {
      const { productId, featureId, data } = action.payload
      const currentProducts = JSON.parse(
        JSON.stringify(current(state.products))
      )
      currentProducts[productId].features[featureId] = data
      state.products = currentProducts
    },

    // featurePlan

    setAllFeaturePlan: (state, action) => {
      const allProduct = JSON.parse(JSON.stringify(current(state.products)))

      const featurePlan = {}
      action.payload.data.map((item) => {
        featurePlan[item.id] = item
      })

      allProduct[action.payload.productId].featurePlan = featurePlan
      state.products = allProduct
    },
    featurePlanInfo: (state, action) => {
      const allProduct = JSON.parse(JSON.stringify(current(state.products)))
      allProduct[action.payload.productId].featurePlan[action.payload.data.id] =
        action.payload.data
      state.products = allProduct
    },
    deleteFeaturePlan: (state, action) => {
      const allProduct = JSON.parse(JSON.stringify(current(state.products)))
      delete allProduct[action.payload.productId].featurePlan[
        action.payload.PlanFeatureId
      ]
      state.products = allProduct
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  setAllProduct,
  subscribe,
  productInfo,
  removeProduct,
  setAllFeaturePlan,
  features,
  FeatureInfo,
  storeFeatureDelete,
  featurePlanInfo,
  deleteFeaturePlan,
} = productsSlice.actions
export default productsSlice.reducer
