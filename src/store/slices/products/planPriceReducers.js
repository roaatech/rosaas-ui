import { current } from '@reduxjs/toolkit'

const setAllPlansPrice = (state, action) => {
  const allProduct = JSON.parse(JSON.stringify(current(state.products)))
  const allPlansPrice = {}
  action.payload.data.map((item) => {
    allPlansPrice[item.id] = item
  })
  allProduct[action.payload.productId].plansPrice = allPlansPrice
  state.products = allProduct
}
const PlansPriceInfo = (state, action) => {
  const { productId, planPriceId, data } = action.payload
  const currentProducts = JSON.parse(JSON.stringify(current(state.products)))

  if (!currentProducts[productId].plansPrice) {
    currentProducts[productId].plansPrice = {}
  }
  if (currentProducts[productId].plansPrice[planPriceId]) {
    currentProducts[productId].plansPrice[planPriceId] = data
  } else {
    currentProducts[productId].plansPrice = {
      [planPriceId]: data,
      ...currentProducts[productId].plansPrice,
    }
  }
  state.products = currentProducts
}

const PlansPriceChangeAttr = (state, action) => {
  const { productId, planPriceId, attr, value } = action.payload
  const currentProducts = JSON.parse(JSON.stringify(current(state.products)))

  currentProducts[productId].plansPrice[planPriceId][attr] = value

  state.products = currentProducts
}

const deletePlanPrice = (state, action) => {
  const allProduct = JSON.parse(JSON.stringify(current(state.products)))
  delete allProduct[action.payload.productId].plansPrice[
    action.payload.PlanPriceId
  ]
  state.products = allProduct
}
const deleteAllPlanPrice = (state, action) => {
  const allProduct = JSON.parse(JSON.stringify(current(state.products)))
  delete allProduct[action.payload.productId]?.plansPrice
  state.products = allProduct
}
const deleteAllPlanPriceBySystemName = (state, action) => {
  // Deep clone the current state products
  const allProduct = JSON.parse(JSON.stringify(current(state.products)))

  // Find the product by systemName
  const product = Object.values(allProduct).find(
    (product) => product.systemName === action.payload.systemName
  )

  // If the product is found, delete its plansPrice
  if (product) {
    delete product.plansPrice
  }

  // Update the state with the modified products
  state.products = allProduct
}

export {
  deleteAllPlanPriceBySystemName,
  setAllPlansPrice,
  PlansPriceInfo,
  PlansPriceChangeAttr,
  deletePlanPrice,
  deleteAllPlanPrice,
}
