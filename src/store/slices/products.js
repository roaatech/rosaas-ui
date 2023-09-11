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

    setAllFeatures: (state, action) => {
      const allProduct = JSON.parse(JSON.stringify(current(state.products)))
      const allFeatures = {}
      action.payload.data.map((item) => {
        allFeatures[item.id] = item
      })
      allProduct[action.payload.productId].features = allFeatures
      state.products = allProduct
    },
    FeatureInfo: (state, action) => {
      const { productId, featureId, data } = action.payload
      const currentProducts = JSON.parse(
        JSON.stringify(current(state.products))
      )

      if (!currentProducts[productId].features) {
        currentProducts[productId].features = {}
      }
      if (currentProducts[productId].features[featureId]) {
        currentProducts[productId].features[featureId] = data
        delete currentProducts[productId].featurePlan
      } else {
        currentProducts[productId].features = {
          [featureId]: data,
          ...currentProducts[productId].features,
        }
      }
      state.products = currentProducts
    },

    deleteFeature: (state, action) => {
      const allProduct = JSON.parse(JSON.stringify(current(state.products)))
      delete allProduct[action.payload.productId].features[
        action.payload.FeatureId
      ]
      state.products = allProduct
    },

    // plan

    setAllPlans: (state, action) => {
      const allProduct = JSON.parse(JSON.stringify(current(state.products)))
      const allPlans = {}
      action.payload.data.map((item) => {
        allPlans[item.id] = item
      })
      allProduct[action.payload.productId].plans = allPlans
      state.products = allProduct
    },
    PlanInfo: (state, action) => {
      const { productId, planId, data } = action.payload
      const currentProducts = JSON.parse(
        JSON.stringify(current(state.products))
      )

      if (!currentProducts[productId].plans) {
        currentProducts[productId].plans = {}
      }
      if (currentProducts[productId].plans[planId]) {
        currentProducts[productId].plans[planId] = data
        delete currentProducts[productId].featurePlan
      } else {
        currentProducts[productId].plans = {
          [planId]: data,
          ...currentProducts[productId].plans,
        }
      }
      state.products = currentProducts
    },

    deletePlan: (state, action) => {
      const allProduct = JSON.parse(JSON.stringify(current(state.products)))
      delete allProduct[action.payload.productId].plans[action.payload.PlanId]
      state.products = allProduct
    },
    // planPrice

    setAllPlansPrice: (state, action) => {
      const allProduct = JSON.parse(JSON.stringify(current(state.products)))
      const allPlansPrice = {}
      action.payload.data.map((item) => {
        allPlansPrice[item.id] = item
      })
      allProduct[action.payload.productId].plansPrice = allPlansPrice
      state.products = allProduct
    },
    PlansPriceInfo: (state, action) => {
      const { productId, planPriceId, data } = action.payload
      const currentProducts = JSON.parse(
        JSON.stringify(current(state.products))
      )

      if (!currentProducts[productId].plansPrice) {
        currentProducts[productId].plansPrice = {}
      }
      if (currentProducts[productId].plansPrice[planPriceId]) {
        currentProducts[productId].plansPrice[planPriceId] = data
      } else {
        // for sort new in the top
        currentProducts[productId].plansPrice = {
          [planPriceId]: data,
          ...currentProducts[productId].plansPrice,
        }
      }
      state.products = currentProducts
    },
    PlansPricePublished: (state, action) => {
      const { productId, planPriceId, status } = action.payload
      const currentProducts = JSON.parse(
        JSON.stringify(current(state.products))
      )

      currentProducts[productId].plansPrice[planPriceId].isPublished = status

      state.products = currentProducts
    },

    deletePlanPrice: (state, action) => {
      const allProduct = JSON.parse(JSON.stringify(current(state.products)))
      delete allProduct[action.payload.productId].plansPrice[
        action.payload.PlanPriceId
      ]
      state.products = allProduct
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
      const { productId, data } = action.payload

      if (!allProduct[productId].featurePlan) {
        allProduct[productId].featurePlan = {}
      }
      if (allProduct[productId]?.featurePlan[data.id]) {
        allProduct[productId].featurePlan[data.id] = data
      } else {
        allProduct[productId].featurePlan = {
          [data.id]: data,
          ...allProduct[productId].featurePlan,
        }
      }

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
  FeatureInfo,
  featurePlanInfo,
  deleteFeaturePlan,
  setAllPlans,
  deleteFeature,
  setAllFeatures,
  PlanInfo,
  deletePlan,
  setAllPlansPrice,
  PlansPriceInfo,
  deletePlanPrice,
  PlansPricePublished,
} = productsSlice.actions
export default productsSlice.reducer
