import { current } from '@reduxjs/toolkit'

const setAllFeaturePlan = (state, action) => {
  const allProduct = JSON.parse(JSON.stringify(current(state.products)))

  const featurePlan = {}
  action.payload.data.map((item) => {
    featurePlan[item.id] = item
  })
  const currentProduct = allProduct[action.payload.productId]
  if (currentProduct) {
    currentProduct.featurePlan = featurePlan
    state.products = allProduct
  } else {
    return
  }
}
const featurePlanInfo = (state, action) => {
  const { productId, data } = action.payload
  const currentProduct = state.products[productId]

  if (!currentProduct.featurePlan) {
    currentProduct.featurePlan = {}
  }

  if (currentProduct.featurePlan[data.id]) {
    currentProduct.featurePlan[data.id] = data
  } else {
    currentProduct.featurePlan[data.id] = data
  }
}
const PlansPublished = (state, action) => {
  const { productId, planId, status } = action.payload
  const currentProducts = JSON.parse(JSON.stringify(current(state.products)))

  const product = currentProducts[productId]
  if (product && product.plans && product.plans[planId]) {
    product.plans[planId].isPublished = status
  }

  state.products = currentProducts
}
const deleteFeaturePlan = (state, action) => {
  const allProduct = JSON.parse(JSON.stringify(current(state.products)))
  delete allProduct[action.payload.productId].featurePlan[
    action.payload.PlanFeatureId
  ]
  state.products = allProduct
}
export { setAllFeaturePlan, featurePlanInfo, PlansPublished, deleteFeaturePlan }
