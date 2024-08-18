import { createSlice, current } from '@reduxjs/toolkit'
import * as productReducers from './productReducers'
import * as subscribeReducers from './subscribeReducers'
import * as planReducers from './planReducers'
import * as featureReducers from './featureReducers'
import * as specificationReducers from './specificationReducers'
import * as planPriceReducers from './planPriceReducers'
import * as featurePlanReducers from './featurePlanReducers'
import * as WebhookEndpointsReducers from './WebhookEndpointsReducers'
const _ = require('lodash')

export const productsSlice = createSlice({
  name: 'products',
  initialState: {
    products: {},
    validationUrl: {
      path: 'https://example.com/validate',
      method: 'Post',
    },
  },

  reducers: {
    ...productReducers,

    ...subscribeReducers,

    ...featureReducers,

    ...planReducers,

    ...specificationReducers,

    ...planPriceReducers,

    ...featurePlanReducers,

    ...WebhookEndpointsReducers,
  },
})

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
  productWarningsStore,
  removeProductWarningsStore,
  clientCredentials,
  clientCredentialsSecrets,
  deleteClientSecret,
  clientCredentialsInfo,
  AdminPrivileges,
  deleteProductAdminPrivileges,
  AdminPrivilegesChangeAttr,
  productsChangeAttr,
  deleteClientCredentials,
  clientSecretInfo,
  clientSecretAttr,
  updateClientCredentialAttr,
  setAllWebhookEndpoints,
  WebhookEndpointInfo,
  WebhookEndpointsChangeAttr,
  deleteWebhookEndpointById,
  deleteAllWebhookEndpoints,
} = productsSlice.actions
export default productsSlice.reducer
