import { createSlice, current } from '@reduxjs/toolkit'
import * as productReducers from './products/productReducers'
import * as subscribeReducers from './products/subscribeReducers'
import * as planReducers from './products/planReducers'
import * as featureReducers from './products/featureReducers'
import * as specificationReducers from './products/specificationReducers'
import * as planPriceReducers from './products/planPriceReducers'
import * as featurePlanReducers from './products/featurePlanReducers'
import * as WebhookEndpointsReducers from './products/WebhookEndpointsReducers'
const _ = require('lodash')

export const publicProductsSlice = createSlice({
  name: 'publicProducts',
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
  updateAllProduct: updateAllProductPublic,
  setAllSpecifications: setAllSpecificationsPublic,
  specificationInfo: specificationInfoPublic,
  specificationChangeAttr: specificationChangeAttrPublic,
  deleteSpecification: deleteSpecificationPublic,
  setAllProduct: setAllProductPublic,
  subscribe: subscribePublic,
  sortSubscriptions: sortSubscriptionsPublic,
  productInfo: productInfoPublic,
  removeProductStore: removeProductStorePublic,
  setAllFeaturePlan: setAllFeaturePlanPublic,
  FeatureInfo: FeatureInfoPublic,
  featurePlanInfo: featurePlanInfoPublic,
  deleteFeaturePlan: deleteFeaturePlanPublic,
  setAllPlans: setAllPlansPublic,
  deleteFeature: deleteFeaturePublic,
  setAllFeatures: setAllFeaturesPublic,
  PlanInfo: PlanInfoPublic,
  deletePlan: deletePlanPublic,
  setAllPlansPrice: setAllPlansPricePublic,
  PlansPriceInfo: PlansPriceInfoPublic,
  deletePlanPrice: deletePlanPricePublic,
  PlansPriceChangeAttr: PlansPriceChangeAttrPublic,
  PlansChangeAttr: PlansChangeAttrPublic,
  deleteAllPlan: deleteAllPlanPublic,
  deleteAllPlanPrice: deleteAllPlanPricePublic,
  PlansPublished: PlansPublishedPublic,
  productWarningsStore: productWarningsStorePublic,
  removeProductWarningsStore: removeProductWarningsStorePublic,
  clientCredentials: clientCredentialsPublic,
  clientCredentialsSecrets: clientCredentialsSecretsPublic,
  deleteClientSecret: deleteClientSecretPublic,
  clientCredentialsInfo: clientCredentialsInfoPublic,
  AdminPrivileges: AdminPrivilegesPublic,
  deleteProductAdminPrivileges: deleteProductAdminPrivilegesPublic,
  AdminPrivilegesChangeAttr: AdminPrivilegesChangeAttrPublic,
  productsChangeAttr: productsChangeAttrPublic,
  deleteClientCredentials: deleteClientCredentialsPublic,
  clientSecretInfo: clientSecretInfoPublic,
  clientSecretAttr: clientSecretAttrPublic,
  updateClientCredentialAttr: updateClientCredentialAttrPublic,
  setAllWebhookEndpoints: setAllWebhookEndpointsPublic,
  WebhookEndpointInfo: WebhookEndpointInfoPublic,
  WebhookEndpointsChangeAttr: WebhookEndpointsChangeAttrPublic,
  deleteWebhookEndpointById: deleteWebhookEndpointByIdPublic,
  deleteAllWebhookEndpoints: deleteAllWebhookEndpointsPublic,
  deleteAllPlanPriceBySystemName: deleteAllPlanPriceBySystemNamePublic,
  filterSubscriptions: filterSubscriptionsPublic,
  setSearchTerm: setSearchTermPublic,
  changeSubscriptionAttr: changeSubscriptionAttrPublic,
} = publicProductsSlice.actions
export default publicProductsSlice.reducer
