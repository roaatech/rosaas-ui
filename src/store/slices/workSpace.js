import { createSlice, current } from '@reduxjs/toolkit'
const _ = require('lodash')

export const workspaceSlice = createSlice({
  name: 'workspace',
  initialState: {
    tenants: {},
    products: {},
    autoRenewalData: { autoRenewalIds: [] },
    tenantsTotalCount: 0,
    createdTenant: {},
    subscriptionData: {},
    currentTab: 0,
    currentStep: 1,
    paymentCards: {},
    invoices: {},
  },

  reducers: {
    setWorkspaceTenant: (state, action) => {
      if (Array.isArray(action.payload)) {
        const allTenantWorkspace = { ...state.tenants }
        action.payload.forEach((item) => {
          allTenantWorkspace[item.id] = item
        })
        state.tenants = allTenantWorkspace
      } else {
        console.error('Payload is not an array')
      }
    },
    setWorkspaceSubscriptionData: (state, action) => {
      if (Array.isArray(action.payload)) {
        const allSubscriptionData = { ...state.subscriptionData }
        action.payload.forEach((item) => {
          allSubscriptionData[item.id] = item
        })
        state.subscriptionData = allSubscriptionData
      } else {
        console.error('Payload is not an array')
      }
    },
    changeSubscriptionAttribute: (state, action) => {
      const { subscriptionId, attributeName, attributeValue } = action.payload

      if (subscriptionId && state.subscriptionData) {
        if (state.subscriptionData[subscriptionId]) {
          if (attributeName === 'subscriptionFeaturesList') {
            // Add or update the subscriptionFeaturesList
            state.subscriptionData[subscriptionId][attributeName] =
              attributeValue
          } else {
            // Handle other attributes if necessary
            state.subscriptionData[subscriptionId][attributeName] =
              attributeValue
          }
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
      if (!currentProducts[action.payload?.id]) {
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

      action.payload.data.forEach((item) => {
        allPlans[item.id] = item
      })

      const productId = action.payload.productId
      if (allProduct[productId]) {
        allProduct[productId].plans = allPlans
      } else {
        console.error(`Product with ID ${productId} not found`)
      }

      state.products = allProduct
    },
    setAllAutoRenewal: (state, action) => {
      if (Array.isArray(action.payload)) {
        const allAutoRenewalWorkspace = { ...state.autoRenewalData }
        action.payload.forEach((item) => {
          allAutoRenewalWorkspace[item.id] = item
        })
        state.autoRenewalData = allAutoRenewalWorkspace
      } else {
        console.error('Payload is not an array')
      }
    },
    setAllInvoices: (state, action) => {
      if (Array.isArray(action.payload)) {
        const allInvoicesWorkspace = { ...state.invoices }
        action.payload.forEach((item) => {
          allInvoicesWorkspace[item.id] = item
        })
        state.invoices = allInvoicesWorkspace
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
    addAutoRenewal: (state, action) => {
      const autoRenewalToUpdate = action.payload
      if (autoRenewalToUpdate && autoRenewalToUpdate.id) {
        state.autoRenewalData = {
          [autoRenewalToUpdate.id]: autoRenewalToUpdate,
          ...state.autoRenewalData,
        }
      } else {
        console.error('Invalid auto-renewal data')
      }
    },
    addAutoRenewalIds: (state, action) => {
      const newAutoRenewalIds = action.payload
      if (Array.isArray(newAutoRenewalIds)) {
        state.autoRenewalData.autoRenewalIds = [
          ...state.autoRenewalData.autoRenewalIds,
          ...newAutoRenewalIds.filter(
            (id) => !state.autoRenewalData.autoRenewalIds.includes(id)
          ),
        ]
      } else {
        console.error('Invalid auto-renewal IDs')
      }
    },
    deleteAllAutoRenewalIds: (state, action) => {
      state.autoRenewalData.autoRenewalIds = []
    },
    updateAutoRenewal: (state, action) => {
      const updatedAutoRenewal = action.payload

      // Check if the payload contains valid data
      if (updatedAutoRenewal && updatedAutoRenewal.id) {
        // If the auto-renewal with the provided ID exists, update it
        if (state.autoRenewalData[updatedAutoRenewal.id]) {
          state.autoRenewalData = {
            ...state.autoRenewalData,
            [updatedAutoRenewal.id]: {
              ...state.autoRenewalData[updatedAutoRenewal.id],
              ...updatedAutoRenewal, // Update only the provided fields
            },
          }
        } else {
          console.error(
            `Auto-renewal with ID ${updatedAutoRenewal.id} not found`
          )
        }
      } else {
        console.error('Invalid auto-renewal data')
      }
    },

    setAllpaymentCards: (state, action) => {
      if (Array.isArray(action.payload)) {
        const allpaymentCards = { ...state.paymentCards }
        action.payload.forEach((item) => {
          allpaymentCards[item.stripeCardId] = item
        })
        state.paymentCards = allpaymentCards
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

    action.payload.data.forEach((item) => {
      allSubscriptions[item.id] = item
    })

    const productId = action.payload.productId
    if (allProduct[productId]) {
      allProduct[productId].subscriptions = allSubscriptions
    } else {
      console.error(`Product with ID ${productId} not found`)
    }

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
  addAutoRenewal,
  setAllInvoices,
  addAutoRenewalIds,
  deleteAllAutoRenewalIds,
  updateAutoRenewal,
} = workspaceSlice.actions
export default workspaceSlice.reducer
