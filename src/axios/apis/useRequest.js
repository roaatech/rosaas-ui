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

  const deleteTenantReq = async (data) => {
    return await Request.delete(`management/sadmin/v1/Tenants`, { data })
  }

  const editTenantStatus = async (data) => {
    return await Request.put('management/sadmin/v1/Tenants/status', data)
  }
  const getTimeLine = async (id, productId, queries) => {
    return await Request.get(
      `management/sadmin/v1/Tenants/${id}/products/${productId}/processes${queries}`
    )
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

  // Features

  const getProductFeatures = async (productId) => {
    return await Request.get(
      `management/sadmin/v1/Products/${productId}/Features`
    )
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

  const deleteFeatureReq = async (productId, data) => {
    return await Request.delete(
      `management/sadmin/v1/Products/${productId}/Features/${data.id}`
    )
  }

  // Plans

  const getProductPlans = async (productId) => {
    return await Request.get(`management/sadmin/v1/Products/${productId}/Plans`)
  }

  const createPlanRequest = async (productId, data) => {
    return await Request.post(
      `management/sadmin/v1/Products/${productId}/Plans`,
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

  // settings
  const getHeathCheckSettings = async () => {
    return await Request.get(`management/sadmin/v1/Settings/HealthCheck`)
  }
  const putHeathCheckSettings = async (data) => {
    return await Request.put(`management/sadmin/v1/Settings/HealthCheck`, data)
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
    getProductPlans,
    deletePlanReq,
    getFeaturePlanList,
    createFeaturePlanRequest,
    editFeaturePlanRequest,
    getFeaturePlan,
    deleteFeaturePlanReq,
    getProductFeatures,
    createFeatureRequest,
    editFeatureRequest,
    deleteFeatureReq,
  }
}
export default useRequest
