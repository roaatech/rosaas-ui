import useApi from '../../../useApi'

const usePlanFeatureReq = () => {
  const Request = useApi()

  const getFeaturePlanList = async (id) => {
    return await Request.get(`management/sadmin/v1/Products/${id}/PlanFeatures`)
  }
  const getFeaturePlanListPublic = async (name) => {
    return await Request.get(`public/v1/Product/${name}/PlanFeatures`)
  }
  const getFeaturePlanPublic = async (name, planName) => {
    return await Request.get(
      `public/v1/Product/${name}/plan/${planName}/PlanFeatures`
    )
  }
  const createFeaturePlanRequest = async (data) => {
    return await Request.post(
      `management/sadmin/v1/Products/${data.productId}/PlanFeatures`,
      data.data
    )
  }
  const editFeaturePlanRequest = async (data) => {
    return await Request.put(
      `management/sadmin/v1/Products/${data.productId}/PlanFeatures/${data.featurePlanId}`,
      data.data
    )
  }
  const getFeaturePlan = async (id) => {
    return await Request.get(`management/sadmin/v1/Products/${id}/PlanFeatures`)
  }

  const deleteFeaturePlanReq = async (data) => {
    return await Request.delete(
      `management/sadmin/v1/Products/${data.productId}/PlanFeatures/${data.PlanFeatureId}`
    )
  }

  return {
    getFeaturePlanList,
    createFeaturePlanRequest,
    editFeaturePlanRequest,
    getFeaturePlan,
    deleteFeaturePlanReq,
    getFeaturePlanListPublic,
    getFeaturePlanPublic,
  }
}

export default usePlanFeatureReq
