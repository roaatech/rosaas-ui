import { current } from '@reduxjs/toolkit'
const _ = require('lodash')

const setAllProduct = (state, action) => {
  const allProduct = JSON.parse(JSON.stringify(current(state.products)))
  action?.payload?.forEach((item) => {
    if (!{ ...current(state.products) }[item.id]) {
      allProduct[item.id] = item
      // } else {
      //   allProduct[item.id] = { ...current(state.products) }[item.id]
    }
  })
  state.products = allProduct
}

const productInfo = (state, action) => {
  const currentProducts = { ...current(state.products) }

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
}

const clientCredentials = (state, action) => {
  const currentProducts = JSON.parse(JSON.stringify(current(state.products)))
  currentProducts[action.payload.id].clientCredentials = { ...action.payload }
  state.products = currentProducts
}

const deleteClientSecret = (state, action) => {
  const currentProducts = JSON.parse(JSON.stringify(state.products))

  const clientCredentials =
    currentProducts[action.payload.productId].clientCredentials.data
  console.log({ clientCredentials })
  console.log({ id: action.payload.id })
  const secretIndex = clientCredentials.findIndex(
    (secret) => secret.id === action.payload.id
  )
  console.log({ secretIndex })

  if (secretIndex !== -1) {
    const secretIdToDelete = Object.keys(clientCredentials)[secretIndex]
    clientCredentials[secretIdToDelete] = undefined
  }

  state.products = currentProducts
}

const productWarningsStore = (state, action) => {
  const currentProducts = JSON.parse(JSON.stringify(current(state.products)))
  currentProducts[action.payload.id].warnings = { ...action.payload.data }
  state.products = currentProducts
}
const removeProductWarningsStore = (state, action) => {
  const currentProducts = JSON.parse(JSON.stringify(current(state.products)))
  Object.keys(currentProducts).forEach((productId) => {
    currentProducts[productId].warnings = undefined
  })
  state.products = currentProducts
}

const removeProductStore = (state, action) => {
  const currentProducts = { ...current(state.products) }
  delete currentProducts[action.payload]
  state.products = currentProducts
}

export {
  productWarningsStore,
  setAllProduct,
  productInfo,
  removeProductStore,
  removeProductWarningsStore,
  clientCredentials,
  deleteClientSecret,
}
