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
const updateAllProduct = (state, action) => {
  const allProduct = JSON.parse(JSON.stringify(current(state.products)))
  action?.payload?.forEach((item) => {
    if (!{ ...current(state.products) }[item.id]) {
      allProduct[item.id] = item
    } else {
      allProduct[item.id] = { ...allProduct[item.id], ...item }
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
const clientCredentialsSecrets = (state, action) => {
  const currentProducts = JSON.parse(JSON.stringify(state.products))
  const { productId, clientId, data } = action.payload
  if (
    currentProducts[productId] &&
    currentProducts[productId].clientCredentials
  ) {
    if (!currentProducts[productId].clientCredentials[clientId]) {
      currentProducts[productId].clientCredentials[clientId] = {}
    }

    currentProducts[productId].clientCredentials[
      clientId
    ].clientCredentialsSecrets = {}

    Object.keys(data).forEach((key) => {
      const item = data[key]
      currentProducts[productId].clientCredentials[
        clientId
      ].clientCredentialsSecrets[item.id] = { ...item }
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
const clientSecretInfo = (state, action) => {
  const { data, productId, itemId, clientId } = action.payload
  const currentProducts = JSON.parse(JSON.stringify(state.products))
  const productToUpdate = currentProducts[productId]

  if (productToUpdate && productToUpdate.clientCredentials) {
    currentProducts[productId] = {
      ...productToUpdate,
      clientCredentials: {
        ...productToUpdate.clientCredentials,
        [clientId]: {
          ...productToUpdate.clientCredentials?.[clientId],
          clientCredentialsSecrets: {
            ...(productToUpdate.clientCredentials?.[clientId]
              ?.clientCredentialsSecrets || {}),
            [itemId]: { ...data },
          },
        },
      },
    }
  }

  state.products = currentProducts
}

const clientSecretAttr = (state, action) => {
  const { productId, clientId, itemId, attributeName, attributeValue } =
    action.payload

  const currentProducts = { ...state.products }
  const productToUpdate = currentProducts[productId]

  if (productToUpdate && productToUpdate.clientCredentials) {
    currentProducts[productId] = {
      ...productToUpdate,
      clientCredentials: {
        ...productToUpdate.clientCredentials,
        [clientId]: {
          ...productToUpdate.clientCredentials[clientId],
          clientCredentialsSecrets: {
            ...(productToUpdate.clientCredentials[clientId]
              ?.clientCredentialsSecrets || {}),
            [itemId]: {
              ...productToUpdate.clientCredentials[clientId]
                ?.clientCredentialsSecrets?.[itemId],
              [attributeName]: attributeValue,
            },
          },
        },
      },
    }

    state.products = currentProducts
  }
}
const updateClientCredentialAttr = (state, action) => {
  const { productId, itemId, attributeName, attributeValue } = action.payload

  const currentProducts = JSON.parse(JSON.stringify(state.products))
  const productToUpdate = currentProducts[productId]
  if (productToUpdate && productToUpdate.clientCredentials) {
    currentProducts[productId] = {
      ...productToUpdate,
      clientCredentials: {
        ...productToUpdate.clientCredentials,
        [itemId]: {
          ...productToUpdate.clientCredentials[itemId],
          [attributeName]: attributeValue,
        },
      },
    }

    state.products = currentProducts
  }
}
const deleteClientSecret = (state, action) => {
  const { productId, itemId, clientId } = action.payload

  const currentProducts = { ...state.products }
  const productToUpdate = currentProducts[productId]

  if (productToUpdate && productToUpdate.clientCredentials) {
    const updatedClientCredentials = {
      ...(productToUpdate.clientCredentials[clientId]
        ?.clientCredentialsSecrets || {}),
    }

    delete updatedClientCredentials[itemId]

    currentProducts[productId] = {
      ...productToUpdate,
      clientCredentials: {
        ...productToUpdate.clientCredentials,
        [clientId]: {
          ...productToUpdate.clientCredentials?.[clientId],
          clientCredentialsSecrets: updatedClientCredentials,
        },
      },
    }
  }

  state.products = currentProducts
}
const deleteClientCredentials = (state, action) => {
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
const AdminPrivileges = (state, action) => {
  const currentProducts = JSON.parse(JSON.stringify(state.products))
  const { id, data } = action.payload
  if (currentProducts[id]) {
    Object.keys(data).forEach((key) => {
      const item = data[key]
      currentProducts[id].AdminPrivileges = {
        ...currentProducts[id].AdminPrivileges,
        [item.id]: {
          ...item,
        },
      }
    })
  }

  state.products = currentProducts
}
const AdminPrivilegesChangeAttr = (state, action) => {
  const { productId, itemId, attr, value } = action.payload
  const currentProducts = JSON.parse(JSON.stringify(state.products))
  currentProducts[productId].AdminPrivileges[itemId][attr] = value
  state.products = currentProducts
}
const deleteProductAdminPrivileges = (state, action) => {
  const { productId, itemId } = action.payload
  const currentProducts = JSON.parse(JSON.stringify(state.products))
  const productToUpdate = currentProducts[productId]
  if (productToUpdate && productToUpdate.AdminPrivileges) {
    const updatedAdminPrivileges = {
      ...productToUpdate.AdminPrivileges,
    }
    delete updatedAdminPrivileges[itemId]
    productToUpdate.AdminPrivileges = updatedAdminPrivileges
  }

  state.products = currentProducts
}
const productsChangeAttr = (state, action) => {
  const { productId, attributes } = action.payload
  const currentProducts = JSON.parse(JSON.stringify(current(state.products)))
  if (currentProducts[productId]) {
    for (const [attr, value] of Object.entries(attributes)) {
      currentProducts[productId][attr] = value
    }

    state.products[productId] = { ...currentProducts[productId] }
  }
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
  AdminPrivileges,
  deleteProductAdminPrivileges,
  AdminPrivilegesChangeAttr,
  productsChangeAttr,
  clientCredentialsSecrets,
  deleteClientCredentials,
  clientSecretInfo,
  clientSecretAttr,
  updateClientCredentialAttr,
  updateAllProduct,
}
