import { createSlice, current } from '@reduxjs/toolkit'
import * as productReducers from './productReducers'
import * as subscribeReducers from './subscribeReducers'
import * as planReducers from './planReducers'
import * as featureReducers from './featureReducers'
import * as specificationReducers from './specificationReducers'
import * as planPriceReducers from './planPriceReducers'
import * as featurePlanReducers from './featurePlanReducers'
const _ = require('lodash')

export const productsSlice = createSlice({
  name: 'products',
  initialState: {
    products: {},
  },

  reducers: {
    ...productReducers,

    ...subscribeReducers,

    ...featureReducers,

    ...planReducers,

    ...specificationReducers,

    ...planPriceReducers,

    ...featurePlanReducers,
  },
})

// Action creators are generated for each case reducer function
export const {
  setAllSpecifications,
  specificationInfo,
  specificationChangeAttr,
  deleteSpecification,
  setAllProduct,
  subscribe,
  productInfo,
  removeProductStore,
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
  PlansPriceChangeAttr,
  PlansChangeAttr,
  deleteAllPlan,
  deleteAllPlanPrice,
  PlansPublished,
} = productsSlice.actions
export default productsSlice.reducer
