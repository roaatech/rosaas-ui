import useApi from '../useApi'
import { useDispatch } from 'react-redux'
import { logOut as logOutRequest } from '../../store/slices/auth'
const useRequest = () => {
  const dispatch = useDispatch()
  const Request = useApi()

  const logOut = async () => {
    dispatch(logOutRequest())
    return await Request.get(`logout`)
  }

  const signIn = async (data) => {
    return await Request.post('identity/sadmin/v1/Auth/Signin', data)
  }
  const userData = async () => {
    return await Request.get('identity/sadmin/v1/Account')
  }
  const createTenantRequest = async (data) => {
    return await Request.post('management/sadmin/v1/Tenants', data)
  }
  const editTenantRequest = async (data) => {
    return await Request.put('management/sadmin/v1/Tenants', data)
  }
  const getTenant = async (id) => {
    return await Request.get(`management/sadmin/v1/Tenants/${id}`)
  }
  const getTenantList = async (params) => {
    return await Request.get(`management/sadmin/v1/Tenants${params}`)
  }
  const getProductTenants = async (params) => {
    return await Request.get(`management/sadmin/v1/products/${params}`)
  }
  const getProductFeatures = async (params) => {
    return await Request.get(`management/sadmin/v1/products/${params}`)
  }
  const deleteTenantReq = async (data) => {
    return await Request.delete(`management/sadmin/v1/Tenants`, { data })
  }
  const createProductRequest = async (data) => {
    return await Request.post('management/sadmin/v1/Products', data)
  }
  const editProductRequest = async (data) => {
    return await Request.put(
      `management/sadmin/v1/Products/${data.id}`,
      data.data
    )
  }
  const getProduct = async (id) => {
    return await Request.get(`management/sadmin/v1/Products/${id}`)
  }
  const getProductList = async (params) => {
    return await Request.get(`management/sadmin/v1/Products${params}`)
  }
  const deleteProductReq = async (data) => {
    return await Request.delete(`management/sadmin/v1/Products/${data.id}`)
  }
  const createFeatureRequest = async (productId, data) => {
    return await Request.post(
      `management/sadmin/v1/Products/${productId}/Features`,
      data
    )
  }
  const editFeatureRequest = async (productId, data) => {
    return await Request.put(
      `management/sadmin/v1/Products/${productId}/Features/${data.id}`,
      data.data
    )
  }
  const getFeature = async (id, productId) => {
    return await Request.get(
      `management/sadmin/v1/Products/${productId}/Features/${id}`
    )
  }
  const getFeatureList = async (productId) => {
    return await Request.get(
      `management/sadmin/v1/Products/${productId}/Features`
    )
  }
  const deleteFeatureReq = async (productId, data) => {
    return await Request.delete(
      `management/sadmin/v1/Products/${productId}/Features/${data.id}`
    )
  }
  const editTenantStatus = async (data) => {
    return await Request.put('management/sadmin/v1/Tenants/status', data)
  }
  const getTimeLine = async (id, productId, queries) => {
    return await Request.get(
      `management/sadmin/v1/Tenants/${id}/products/${productId}/processes${queries}`
    )
  }
  // const getTimeLine = async (id, productId) => {
  //   return await Request.get(
  //     `management/sadmin/v1/Tenants/${id}/products/${productId}/processes`
  //   )
  // }

  // settings
  const getHeathCheckSettings = async () => {
    return await Request.get(`management/sadmin/v1/Settings/HealthCheck`)
  }
  const putHeathCheckSettings = async (data) => {
    return await Request.put(`management/sadmin/v1/Settings/HealthCheck`, data)
  }

  //plan

  const createPlanRequest = async (data) => {
    return await Request.post('management/sadmin/v1/Plans', data)
  }
  const editPlanRequest = async (data) => {
    return await Request.put(`management/sadmin/v1/Plans/${data.id}`, data.data)
  }
  const getPlan = async (id) => {
    return await Request.get(`management/sadmin/v1/Plans/${id}`)
  }
  const getPlanList = async (productId) => {
    return await Request.get(`management/sadmin/v1/products/${productId}/Plans`)
  }
  const deletePlanReq = async (data) => {
    return await Request.delete(`management/sadmin/v1/Plans/${data.id}`)
  }

  // --------------------------------------

  const getFeaturePlanList = async (id) => {
    return await Request.get(`management/sadmin/v1/Products/${id}/PlanFeatures`)
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
    signIn,
    userData,
    logOut,
    createTenantRequest,
    editTenantRequest,
    getTenant,
    getTenantList,
    getProductTenants,
    editTenantStatus,
    deleteTenantReq,
    getTimeLine,
    createProductRequest,
    editProductRequest,
    getProduct,
    getProductList,
    deleteProductReq,
    getHeathCheckSettings,
    putHeathCheckSettings,
    createPlanRequest,
    editPlanRequest,
    getPlan,
    getPlanList,
    deletePlanReq,
    getFeaturePlanList,
    createFeaturePlanRequest,
    editFeaturePlanRequest,
    getFeaturePlan,
    deleteFeaturePlanReq,
    getProductFeatures,
    createFeatureRequest,
    editFeatureRequest,
    getFeature,
    getFeatureList,
    deleteFeatureReq,
  }
}
export default useRequest
