import { createSlice, current } from '@reduxjs/toolkit'
const _ = require('lodash')

export const workspaceSlice = createSlice({
  name: 'workspace',
  initialState: {
    tenants: {},
    products: {},
    autoRenewalData: {},
    tenantsTotalCount: 0,
    createdTenant: {},
    subscriptionData: {},
    currentTab: 0,
    currentStep: 1,
    paymentCards: {},
  },

  reducers: {
    setWorkspaceTenant: (state, action) => {
      if (Array.isArray(action.payload)) {
        const allTenantWorkspace = { ...state.tenants } // Make a copy of the tenants object
        action.payload.forEach((item) => {
          allTenantWorkspace[item.id] = item
        })
        state.tenants = allTenantWorkspace // Update the tenants state
      } else {
        console.error('Payload is not an array')
      }
    },
    setWorkspaceSubscriptionData: (state, action) => {
      if (Array.isArray(action.payload)) {
        const allSubscriptionData = { ...state.subscriptionData } // Make a copy of the tenants object
        action.payload.forEach((item) => {
          allSubscriptionData[item.id] = item
        })
        state.subscriptionData = allSubscriptionData // Update the tenants state
      } else {
        console.error('Payload is not an array')
      }
    },
    changeSubscriptionAttribute: (state, action) => {
      const { subscriptionId, attributeName, attributeValue } = action.payload

      // Check if subscriptionId is provided and subscriptionData exists
      if (subscriptionId && state.subscriptionData) {
        // Check if the subscriptionId exists in subscriptionData
        if (state.subscriptionData[subscriptionId]) {
          // Update the specified attribute of the subscription
          state.subscriptionData[subscriptionId][attributeName] = attributeValue
        } else {
          console.error(`Subscription with id ${subscriptionId} not found`)
        }
      } else {
        console.error('Invalid payload or subscription data not available')
      }
    },
    setTenantsTotalCount: (state, action) => {
      state.tenantsTotalCount = action.payload
    },

    workspaceTenantInfo: (state, action) => {
      const currentTenants = { ...current(state.tenants) }
      currentTenants[action.payload.id] = action.payload
      state.tenants = currentTenants
    },
    workspaceUpdateProduct: (state, action) => {
      const currentProducts = { ...state.products }
      if (!currentProducts[action.payload.id]) {
        currentProducts[action.payload.id] = {}
      }

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
    wokspaceSetAllPlans: (state, action) => {
      const allProduct = JSON.parse(JSON.stringify(current(state.products)))
      const allPlans = {}

      // Iterate through the data and assign it to allPlans
      action.payload.data.forEach((item) => {
        allPlans[item.id] = item
      })

      // Assign allPlans to the plans property of the specified product
      const productId = action.payload.productId
      if (allProduct[productId]) {
        allProduct[productId].plans = allPlans
      } else {
        console.error(`Product with ID ${productId} not found`)
      }

      state.products = allProduct
    },
    setAllAutoRenewal: (state, action) => {
      console.log({ sssss: action })
      if (Array.isArray(action.payload)) {
        const allAutoRenewalWorkspace = { ...state.autoRenewalData } // Make a copy of the tenants object
        action.payload.forEach((item) => {
          allAutoRenewalWorkspace[item.id] = item
        })
        state.autoRenewalData = allAutoRenewalWorkspace // Update the tenants state
      } else {
        console.error('Payload is not an array')
      }
    },
    deleteAutoRenewalById: (state, action) => {
      const idToDelete = action.payload
      console.log({ idToDelete })
      const updatedAutoRenewalData = { ...state.autoRenewalData }

      if (updatedAutoRenewalData[idToDelete]) {
        delete updatedAutoRenewalData[idToDelete]
        state.autoRenewalData = updatedAutoRenewalData
      } else {
        console.error(`Auto-renewal with ID ${idToDelete} not found`)
      }
    },
    setAllpaymentCards: (state, action) => {
      console.log({ sssss: action })
      if (Array.isArray(action.payload)) {
        const allpaymentCards = { ...state.paymentCards } // Make a copy of the tenants object
        action.payload.forEach((item) => {
          allpaymentCards[item.stripeCardId] = item
        })
        state.paymentCards = allpaymentCards // Update the tenants state
      } else {
        console.error('Payload is not an array')
      }
    },
    setWorkspaceAllPlanPrices: (state, action) => {
      const allProduct = JSON.parse(JSON.stringify(current(state.products)))
      const allPlansPrices = {}

      action.payload.data.forEach((item) => {
        allPlansPrices[item.id] = item
      })

      const productId = action.payload.productId
      if (allProduct[productId]) {
        allProduct[productId].plansPrices = allPlansPrices
      } else {
        console.error(`Product with ID ${productId} not found`)
      }

      state.products = allProduct
    },
  },
  setAllSubscriptions: (state, action) => {
    const allProduct = JSON.parse(JSON.stringify(current(state.products)))
    const allSubscriptions = {}

    // Iterate through the data and assign it to allSubscriptions
    action.payload.data.forEach((item) => {
      allSubscriptions[item.id] = item
    })

    // Assign allSubscriptions to the subscriptions property of the specified product
    const productId = action.payload.productId
    if (allProduct[productId]) {
      allProduct[productId].subscriptions = allSubscriptions
    } else {
      console.error(`Product with ID ${productId} not found`)
    }

    // Update the products state with the modified allProduct object
    state.products = allProduct
  },
})

// Action creators are generated for each case reducer function
export const {
  setWorkspaceTenant,
  setTenantsTotalCount,
  workspaceTenantInfo,
  changeSubscriptionAttribute,
  setWorkspaceSubscriptionData,
  wokspaceSetAllPlans,
  workspaceUpdateProduct,
  setWorkspaceAllPlanPrices,
  setAllSubscriptions,
  setAllAutoRenewal,
  setAllpaymentCards,
  deleteAutoRenewalById,
} = workspaceSlice.actions
export default workspaceSlice.reducer
