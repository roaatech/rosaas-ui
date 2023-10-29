import { current } from '@reduxjs/toolkit'
const setAllFeatures = (state, action) => {
  const allProduct = JSON.parse(JSON.stringify(current(state.products)))
  const allFeatures = {}
  action.payload.data.map((item) => {
    allFeatures[item.id] = item
  })
  allProduct[action.payload.productId].features = allFeatures
  state.products = allProduct
}
const FeatureInfo = (state, action) => {
  const { productId, featureId, data } = action.payload
  const currentProducts = JSON.parse(JSON.stringify(current(state.products)))

  if (!currentProducts[productId].features) {
    currentProducts[productId].features = {}
  }
  if (currentProducts[productId].features[featureId]) {
    currentProducts[productId].features[featureId] = data
    delete currentProducts[productId].featurePlan
  } else {
    currentProducts[productId].features = {
      [featureId]: data,
      ...currentProducts[productId].features,
    }
  }
  state.products = currentProducts
}

const deleteFeature = (state, action) => {
  const allProduct = JSON.parse(JSON.stringify(current(state.products)))
  delete allProduct[action.payload.productId].features[action.payload.FeatureId]
  state.products = allProduct
}

export { setAllFeatures, FeatureInfo, deleteFeature }
