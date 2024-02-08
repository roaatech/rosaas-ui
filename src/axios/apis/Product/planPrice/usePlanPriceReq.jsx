import useApi from '../../../useApi'

const usePlanPriceReq = () => {
  const Request = useApi()

  const getProductPlanPriceList = async (productId) => {
    return await Request.get(
      `management/sadmin/v1/Products/${productId}/PlanPrices`
    )
  }
  const getProductPlanPriceListPublic = async (productName) => {
    return await Request.get(`public/v1/Product/${productName}/PlanPrices`)
  }
  const getProductPlanPricePublic = async (productName, priceName) => {
    return await Request.get(
      `public/v1/Product/${productName}/PlanPrices/${priceName}`
    )
  }
  const getProductPlanPricePublicbyId = async (priceId) => {
    return await Request.get(`public/v1/PlanPrices/${priceId}`)
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
    getProductPlanPriceListPublic,
    getProductPlanPricePublic,
    getProductPlanPricePublicbyId,
  }
}

export default usePlanPriceReq
