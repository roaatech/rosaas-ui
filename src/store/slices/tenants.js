import { createSlice, current } from '@reduxjs/toolkit'
const _ = require('lodash')

export const tenantsSlice = createSlice({
  name: 'tenants',
  initialState: {
    tenants: {},
    currentTab: 0,
  },

  reducers: {
    setAllTenant: (state, action) => {
      const allTenant = {}
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
      // const currentTenants = { ...current(state.tenants) }

      // const mergedObject = _.mergeWith(
      //   {},
      //   currentTenants[action.payload.id],
      //   action.payload,
      //   (objValue, srcValue) => {
      //     if (_.isObject(objValue)) {
      //       return _.merge({}, objValue, srcValue)
      //     }
      //   }
      // )

      // currentTenants[action.payload.id] = mergedObject
      // state.tenants = currentTenants

      const currentTenants = { ...current(state.tenants) }
      currentTenants[action.payload.id] = action.payload
      state.tenants = currentTenants
    },
    history: (state, action) => {
      const currentTenants = { ...current(state.tenants) }
      const tenant = JSON.parse(
        JSON.stringify(currentTenants[action.payload.tenantId])
      )

      tenant.products[parseInt(action.payload.productIndex)].history =
        action.payload.data

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
  },
})

// Action creators are generated for each case reducer function
export const {
  setAllTenant,
  tenantInfo,
  removeTenant,
  history,
  setActiveIndex,
} = tenantsSlice.actions
export default tenantsSlice.reducer
