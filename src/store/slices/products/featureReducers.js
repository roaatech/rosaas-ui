import { current } from '@reduxjs/toolkit'
const setAllFeatures = (state, action) => {
  const allProduct = JSON.parse(JSON.stringify(current(state.products)))
  const allFeatures = {}
  const sortedFeatures = action.payload.data.sort(
    (a, b) => a.displayOrder - b.displayOrder
  )
  sortedFeatures.map((item) => {
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
  const sortedFeatures = Object.values(
    currentProducts[productId].features
  ).sort((a, b) => a.displayOrder - b.displayOrder)
  const allFeatures = {}
  sortedFeatures.forEach((feature) => {
    allFeatures[feature.id] = feature
  })
  currentProducts[productId].features = allFeatures
  state.products = currentProducts
}

const deleteFeature = (state, action) => {
  const allProduct = JSON.parse(JSON.stringify(current(state.products)))
  delete allProduct[action.payload.productId].features[action.payload.FeatureId]
  state.products = allProduct
}

export { setAllFeatures, FeatureInfo, deleteFeature }
