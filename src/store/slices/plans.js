import { createSlice, current } from '@reduxjs/toolkit'
const _ = require('lodash')

export const plansSlice = createSlice({
  name: 'plans',
  initialState: {
    plans: {},
  },

  reducers: {
    setAllPlans: (state, action) => {
      const allPlans = {}
      action.payload.map((item) => {
        if (!{ ...current(state.plans) }[item.id]) {
          allPlans[item.id] = item
        } else {
          allPlans[item.id] = { ...current(state.plans) }[item.id]
        }
      })
      state.plans = allPlans
    },
    planInfo: (state, action) => {
      const currentPlans = { ...current(state.plans) }

      const mergedObject = _.mergeWith(
        {},
        currentPlans[action.payload.id],
        action.payload,
        (objValue, srcValue) => {
          if (_.isObject(objValue)) {
            return _.merge({}, objValue, srcValue)
          }
        }
      )

      currentPlans[action.payload.id] = mergedObject
      state.plans = currentPlans
    },

    removePlan: (state, action) => {
      const currentPlans = { ...current(state.plans) }
      delete currentPlans[action.payload]
      state.plans = currentPlans
    },
  },
})

// Action creators are generated for each case reducer function
export const { setAllPlans, subscribe, planInfo, removePlan } =
  plansSlice.actions
export default plansSlice.reducer
