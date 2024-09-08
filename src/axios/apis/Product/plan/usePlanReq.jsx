import useApi from '../../../useApi'

const usePlanReq = () => {
  const Request = useApi()

  const getProductPlans = async (productId) => {
    return await Request.get(`management/sadmin/v1/Products/${productId}/Plans`)
  }
  const getProductPlansPublic = async (productOwnerName, productName) => {
    return await Request.get(
      `/public/v1/productOwner/${productOwnerName}/Product/${productName}/Plans`
    )
  }

  const createPlanRequest = async (productId, data) => {
    return await Request.post(
      `management/sadmin/v1/Products/${productId}/Plans`,
      data
    )
  }
  const publishPlan = async (productId, data) => {
    return await Request.post(
      `management/sadmin/v1/Products/${productId}/Plans/${data.id}/publish`,
      data
    )
  }
  const visiblePlan = async (productId, data) => {
    return await Request.post(
      `management/sadmin/v1/products/${productId}/Plans/${data.id}/Visibility`,
      data
    )
  }
  const editPlanRequest = async (productId, data) => {
    return await Request.put(
      `management/sadmin/v1/Products/${productId}/Plans/${data.id}`,
      data.data
    )
  }

  const deletePlanReq = async (productId, data) => {
    return await Request.delete(
      `management/sadmin/v1/Products/${productId}/Plans/${data.id}`
    )
  }

  return {
    getProductPlans,
    createPlanRequest,
    publishPlan,
    editPlanRequest,
    deletePlanReq,
    getProductPlansPublic,
    visiblePlan,
  }
}

export default usePlanReq
