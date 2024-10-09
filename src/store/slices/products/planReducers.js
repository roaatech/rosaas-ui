import { current } from '@reduxjs/toolkit'
const setAllPlans = (state, action) => {
  const allProduct = JSON.parse(JSON.stringify(current(state.products)))
  const allPlans = {}

  const sortedData = action.payload.data.sort(
    (a, b) => a.displayOrder - b.displayOrder
  )

  sortedData.map((item) => {
    allPlans[item.id] = item
  })

  allProduct[action.payload.productId].plans = allPlans
  state.products = allProduct
}
const setAllPlansLookup = (state, action) => {
  const allPlans = {}

  const planData = action.payload

  planData &&
    planData.map((item) => {
      allPlans[item.id] = item
    })

  state.lookup.plansLookup = allPlans
}

const PlanInfo = (state, action) => {
  const { productId, planId, data } = action.payload
  const currentProducts = JSON.parse(JSON.stringify(current(state.products)))

  if (!currentProducts[productId].plans) {
    currentProducts[productId].plans = {}
  }

  currentProducts[productId].plans[planId] = data
  delete currentProducts[productId].featurePlan

  const sortedPlans = Object.values(currentProducts[productId].plans).sort(
    (a, b) => a.displayOrder - b.displayOrder
  )

  const allPlans = {}
  sortedPlans.forEach((plan) => {
    allPlans[plan.id] = plan
  })

  currentProducts[productId].plans = allPlans

  state.products = currentProducts
}

const PlansChangeAttr = (state, action) => {
  const { productId, planId, attr, value } = action.payload
  const currentProducts = JSON.parse(JSON.stringify(current(state.products)))
  currentProducts[productId].plans[planId][attr] = value
  state.products = currentProducts
}

const deletePlan = (state, action) => {
  const allProduct = JSON.parse(JSON.stringify(current(state.products)))
  delete allProduct[action.payload.productId].plans[action.payload.PlanId]
  state.products = allProduct
}
const deleteAllPlan = (state, action) => {
  const allProduct = JSON.parse(JSON.stringify(current(state.products)))
  delete allProduct[action.payload.productId].plans
  state.products = allProduct
}
export {
  setAllPlans,
  PlanInfo,
  PlansChangeAttr,
  deletePlan,
  deleteAllPlan,
  setAllPlansLookup,
}
