import { current } from '@reduxjs/toolkit'

const setAllWebhookEndpoints = (state, action) => {
  const allProduct = JSON.parse(JSON.stringify(current(state.products)))
  const allEndpoints = {}

  action.payload.data.forEach((item) => {
    allEndpoints[item.id] = item
  })

  allProduct[action.payload.productId].webhookEndpoints = allEndpoints
  state.products = allProduct
}

const WebhookEndpointInfo = (state, action) => {
  const { productId, endpointId, data } = action.payload
  const currentProducts = JSON.parse(JSON.stringify(current(state.products)))

  if (!currentProducts[productId].webhookEndpoints) {
    currentProducts[productId].webhookEndpoints = {}
  }

  currentProducts[productId].webhookEndpoints[endpointId] = data
  delete currentProducts[productId].featureWebhookEndpoint

  state.products = currentProducts
}

const WebhookEndpointsChangeAttr = (state, action) => {
  const { productId, endpointId, attr, value } = action.payload
  const currentProducts = JSON.parse(JSON.stringify(current(state.products)))
  currentProducts[productId].webhookEndpoints[endpointId][attr] = value
  state.products = currentProducts
}

const deleteWebhookEndpointById = (state, action) => {
  const allProduct = JSON.parse(JSON.stringify(current(state.products)))
  delete allProduct[action.payload.productId].webhookEndpoints[
    action.payload.webhookEndpointId
  ]
  state.products = allProduct
}

const deleteAllWebhookEndpoints = (state, action) => {
  const allProduct = JSON.parse(JSON.stringify(current(state.products)))
  delete allProduct[action.payload.productId].webhookEndpoints
  state.products = allProduct
}

export {
  setAllWebhookEndpoints,
  WebhookEndpointInfo,
  WebhookEndpointsChangeAttr,
  deleteWebhookEndpointById,
  deleteAllWebhookEndpoints,
}
