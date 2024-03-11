import { createSlice, current } from '@reduxjs/toolkit'
const _ = require('lodash')

export const workspaceSlice = createSlice({
  name: 'workspace',
  initialState: {
    tenants: {},
    tenantsTotalCount: 0,
    createdTenant: {},
    subscriptionData: {},
    currentTab: 0,
    currentStep: 1,
  },

  reducers: {
    setWorkspaceTenant: (state, action) => {
      console.log('Action Payload:', action.payload)
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
      console.log(state, action)
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
    setTenantsTotalCount: (state, action) => {
      state.tenantsTotalCount = action.payload
    },

    workspaceTenantInfo: (state, action) => {
      const currentTenants = { ...current(state.tenants) }
      currentTenants[action.payload.id] = action.payload
      state.tenants = currentTenants
    },

    setAllOrders: (state, action) => {
      const allTenants = JSON.parse(JSON.stringify(state.tenants))
      const { tenantId, data } = action.payload

      if (allTenants[tenantId]) {
        const allOrders = {}

        data.forEach((item) => {
          allOrders[item.id] = {
            ...item,
          }
        })

        allTenants[tenantId].orders = allOrders
        state.tenants = allTenants
      }
    },

    changeOrderAttribute: (state, action) => {
      const { tenantId, orderId, updatedAttributes } = action.payload

      if (state.tenants[tenantId] && state.tenants[tenantId].orders[orderId]) {
        const existingOrder = state.tenants[tenantId].orders[orderId]

        const updatedOrder = {
          ...existingOrder,
          ...updatedAttributes.else,
          orderItems: existingOrder.orderItems.map((item, index) => {
            if (
              updatedAttributes.orderItems &&
              updatedAttributes.orderItems[index]
            ) {
              return {
                ...item,
                ...updatedAttributes.orderItems[index],
              }
            }
            return item
          }),
        }

        state.tenants[tenantId].orders = {
          ...state.tenants[tenantId].orders,
          [orderId]: updatedOrder,
        }
      }
    },

    removeSubscriptionDataByProductId: (state, action) => {
      const currentTenants = JSON.parse(JSON.stringify(current(state.tenants)))
      const productIdToRemove = action.payload.productId

      for (const tenantId in currentTenants) {
        if (currentTenants.hasOwnProperty(tenantId)) {
          const subscriptionData = currentTenants[tenantId].subscriptionData

          if (
            subscriptionData &&
            subscriptionData.data &&
            subscriptionData.data.productId === productIdToRemove
          ) {
            delete currentTenants[tenantId].subscriptionData
          }
        }
      }

      state.tenants = currentTenants
    },
    featuresData: (state, action) => {
      const currentTenants = JSON.parse(JSON.stringify(current(state.tenants)))
      currentTenants[action.payload.id].subscriptionData.data.features = {
        ...action.payload,
      }
      state.tenants = currentTenants
    },
    subHistoryData: (state, action) => {
      const currentTenants = JSON.parse(JSON.stringify(current(state.tenants)))
      currentTenants[action.payload.id].subscriptionData.data.subHistoryData = {
        ...action.payload,
      }

      state.tenants = currentTenants
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  setWorkspaceTenant,
  setTenantsTotalCount,
  workspaceTenantInfo,
  removeTenant,
  history,
  setActiveIndex,
  setWorkspaceSubscriptionData,
  featuresData,
  subHistoryData,
  removeSubscriptionDataByProductId,
  setStep,
  setTenantCreateData,
  AdminPrivileges,
  deleteTenantAdminPrivileges,
  AdminPrivilegesChangeAttr,
  setAllOrders,
  changeOrderAttribute,
} = workspaceSlice.actions
export default workspaceSlice.reducer
