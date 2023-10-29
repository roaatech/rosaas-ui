import { current } from '@reduxjs/toolkit'
const _ = require('lodash')
export const subscribe = (state, action) => {
  const currentProducts = { ...current(state.products) }
  const product = { ...currentProducts[action.payload.id] }
  product.subscribe = action.payload.data
  const mergedObject = _.mergeWith(
    {},
    currentProducts[action.payload.id],
    product,
    (objValue, srcValue) => {
      if (_.isObject(objValue)) {
        return _.merge({}, objValue, srcValue)
      }
    }
  )

  currentProducts[action.payload.id] = mergedObject
  state.products = currentProducts
}
