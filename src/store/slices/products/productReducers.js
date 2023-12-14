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
  console.log({ ssssssssss: currentProducts[action.payload.id] })
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
  const currentProducts = JSON.parse(JSON.stringify(state.products))
  const { id, data } = action.payload

  if (currentProducts[id]) {
    Object.keys(data).forEach((key) => {
      const item = data[key]
      currentProducts[id].clientCredentials = {
        ...currentProducts[id].clientCredentials,
        [item.id]: {
          ...item,
        },
      }
    })
  }

  state.products = currentProducts
}

const clientCredentialsInfo = (state, action) => {
  const { data, productId, itemId } = action.payload
  const currentProducts = JSON.parse(JSON.stringify(state.products))
  const productToUpdate = currentProducts[productId]

  if (productToUpdate) {
    productToUpdate.clientCredentials = {
      ...productToUpdate.clientCredentials,
      [itemId]: { ...data },
    }
  }

  state.products = currentProducts
}
const deleteClientSecret = (state, action) => {
  const { productId, itemId } = action.payload
  const currentProducts = JSON.parse(JSON.stringify(state.products))
  const productToUpdate = currentProducts[productId]

  if (productToUpdate && productToUpdate.clientCredentials) {
    const updatedClientCredentials = { ...productToUpdate.clientCredentials }
    delete updatedClientCredentials[itemId]
    productToUpdate.clientCredentials = updatedClientCredentials
  }

  state.products = currentProducts
}

const productWarningsStore = (state, action) => {
  const currentProducts = JSON.parse(JSON.stringify(current(state.products)))
  currentProducts[action.payload.id].warnings = { ...action.payload }
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
  clientCredentialsInfo,
}
