import { createSlice, current } from '@reduxjs/toolkit'
const _ = require('lodash')

export const tenantsSlice = createSlice({
  name: 'tenants',
  initialState: {
    tenants: {},
    subscriptionData: {},
    currentTab: 0,
  },

  reducers: {
    setAllTenant: (state, action) => {
      const allTenant = JSON.parse(JSON.stringify(current(state.tenants)))
      action.payload.map((item) => {
        if (!{ ...current(state.tenants) }[item.id]) {
          allTenant[item.id] = item
        } else {
          allTenant[item.id] = { ...current(state.tenants) }[item.id]
        }
      })
      state.tenants = allTenant
    },

    tenantInfo: (state, action) => {
      const currentTenants = { ...current(state.tenants) }
      currentTenants[action.payload.id] = action.payload
      state.tenants = currentTenants
    },

    history: (state, action) => {
      const currentTenants = { ...current(state.tenants) }
      const tenant = JSON.parse(
        JSON.stringify(currentTenants[action.payload.tenantId])
      )

      const data = current(state.tenants)[action.payload.tenantId]
        .subscriptions[action.payload.productIndex].history?.items

      const listObject = data ? { ...data } : {}

      action.payload.data.items.map((item, index) => {
        listObject[index + action.payload.from] = item
      })

      tenant.subscriptions[parseInt(action.payload.productIndex)].history = {
        items: listObject,
        totalCount: action.payload.data.totalCount,
      }

      currentTenants[action.payload.tenantId] = tenant
      state.tenants = currentTenants
    },

    removeTenant: (state, action) => {
      const currentTenants = { ...current(state.tenants) }
      delete currentTenants[action.payload]
      state.tenants = currentTenants
    },
    setActiveIndex: (state, action) => {
      state.currentTab = action.payload
    },
    subscriptionData: (state, action) => {
      const currentTenants = JSON.parse(JSON.stringify(current(state.tenants)))
      currentTenants[action.payload.id].subscriptionData = { ...action.payload }
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
      console.log({
        ssssddddd: currentTenants[action.payload.id].subscriptionData.data,
      })
      state.tenants = currentTenants
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  setAllTenant,
  tenantInfo,
  removeTenant,
  history,
  setActiveIndex,
  subscriptionData,
  featuresData,
  subHistoryData,
} = tenantsSlice.actions
export default tenantsSlice.reducer
