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
export const sortSubscriptions = (state, action) => {
  const { productId, sortBy, order } = action.payload
  if (state.products[productId]?.subscribe) {
    state.products[productId].subscribe.sort((a, b) => {
      const fieldA = _.get(a, sortBy)
      const fieldB = _.get(b, sortBy)
      if (order === 'asc') {
        return fieldA > fieldB ? 1 : -1
      } else {
        return fieldA < fieldB ? 1 : -1
      }
    })
  }
}
export const filterSubscriptions = (state, action) => {
  const { productId } = action.payload
  const term = state.products[productId].searchTerm?.toLowerCase()
  console.log({ term })

  if (state.products[productId]?.subscribe) {
    state.products[productId].filtered = state.products[
      productId
    ].subscribe.filter(
      (sub) =>
        sub.displayName?.toLowerCase().includes(term) ||
        sub.systemName?.toLowerCase().includes(term) ||
        sub.plan.systemName?.toLowerCase().includes(term)
    )
  }
}
export const setSearchTerm = (state, action) => {
  const { productId, searchTerm } = action.payload

  state.products[productId].searchTerm = searchTerm
}

export const changeSubscriptionAttr = (state, action) => {
  const { productId, subscriptionId, attr, value } = action.payload

  if (state.products[productId]?.subscribe) {
    state.products[productId].subscribe[subscriptionId][attr] = value
  }
}
