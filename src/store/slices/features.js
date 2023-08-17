import { createSlice, current } from '@reduxjs/toolkit'
const _ = require('lodash')

export const featuresSlice = createSlice({
  name: 'features',
  initialState: {
    features: {},
  },

  reducers: {
    setAllFeature: (state, action) => {
      const allFeature = {}
      action.payload.map((item) => {
        if (!{ ...current(state.features) }[item.id]) {
          allFeature[item.id] = item
        } else {
          allFeature[item.id] = { ...current(state.features) }[item.id]
        }
      })
      state.features = allFeature
    },
    featureInfo: (state, action) => {
      const currentFeatures = { ...current(state.features) }

      const mergedObject = _.mergeWith(
        {},
        currentFeatures[action.payload.id],
        action.payload,
        (objValue, srcValue) => {
          if (_.isObject(objValue)) {
            return _.merge({}, objValue, srcValue)
          }
        }
      )

      currentFeatures[action.payload.id] = mergedObject
      state.features = currentFeatures
    },
    subscribe: (state, action) => {
      const currentFeatures = { ...current(state.features) }
      const feature = { ...currentFeatures[action.payload.id] }
      feature.subscribe = action.payload.data
      const mergedObject = _.mergeWith(
        {},
        currentFeatures[action.payload.id],
        feature,
        (objValue, srcValue) => {
          if (_.isObject(objValue)) {
            return _.merge({}, objValue, srcValue)
          }
        }
      )

      currentFeatures[action.payload.id] = mergedObject
      state.features = currentFeatures
    },
    removeFeature: (state, action) => {
      const currentFeatures = { ...current(state.features) }
      delete currentFeatures[action.payload]
      state.features = currentFeatures
    },
  },
})

// Action creators are generated for each case reducer function
export const { setAllFeature, subscribe, featureInfo, removeFeature } =
  featuresSlice.actions
export default featuresSlice.reducer
