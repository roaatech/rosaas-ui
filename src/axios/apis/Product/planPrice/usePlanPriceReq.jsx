import useApi from '../../../useApi'

const usePlanPriceReq = () => {
  const Request = useApi()

  const getProductPlanPriceList = async (productId) => {
    return await Request.get(
      `management/sadmin/v1/Products/${productId}/PlanPrices`
    )
  }

  const createPlanPriceRequest = async (productId, data) => {
    return await Request.post(
      `management/sadmin/v1/Products/${productId}/PlanPrices`,
      data
    )
  }
  const editPlanPriceRequest = async (productId, data) => {
    return await Request.put(
      `management/sadmin/v1/Products/${productId}/PlanPrices/${data.id}`,
      data.data
    )
  }

  const deletePlanPriceReq = async (productId, planPriceId) => {
    return await Request.delete(
      `management/sadmin/v1/Products/${productId}/PlanPrices/${planPriceId}`
    )
  }

  const PlansPricePublishedReq = async (productId, data) => {
    return await Request.post(
      `management/sadmin/v1/products/${productId}/PlanPrices/${data.id}/publish`,
      data.data
    )
  }

  return {
    getProductPlanPriceList,
    createPlanPriceRequest,
    editPlanPriceRequest,
    deletePlanPriceReq,
    PlansPricePublishedReq,
  }
}

export default usePlanPriceReq
