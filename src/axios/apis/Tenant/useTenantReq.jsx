import useApi from '../../useApi'

const useTenantReq = () => {
  const Request = useApi()

  const createTenantRequest = async (data) => {
    return await Request.post('management/sadmin/v1/Tenants', data)
  }
  const editTenantRequest = async (data) => {
    return await Request.put('management/sadmin/v1/Tenants', data)
  }
  const editTenantSpecificationRequest = async (data, tenantId, productId) => {
    return await Request.put(
      `management/sadmin/v1/Tenants/${tenantId}/Products/${productId}/Specifications`,
      data
    )
  }
  const getTenant = async (id) => {
    return await Request.get(`management/sadmin/v1/Tenants/${id}`)
  }

  const getTenantList = async (params) => {
    return await Request.get(`management/sadmin/v1/Tenants${params}`)
  }

  const deleteTenantReq = async (data) => {
    return await Request.delete(`management/sadmin/v1/Tenants`, { data })
  }

  const getProductTenants = async (params) => {
    return await Request.get(`management/sadmin/v1/products/${params}`)
  }

  const editTenantStatus = async (data) => {
    return await Request.put('management/sadmin/v1/Tenants/status', data)
  }
  const getTimeLine = async (id, productId, queries) => {
    return await Request.get(
      `management/sadmin/v1/Tenants/${id}/products/${productId}/processes${queries}`
    )
  }
  const subscriptionDetails = async (productId, tenantId) => {
    return await Request.get(
      `management/sadmin/v1/products/${productId}/Tenants/${tenantId}`
    )
  }
  return {
    createTenantRequest,
    editTenantRequest,
    getTenant,
    getTenantList,
    deleteTenantReq,
    getProductTenants,
    editTenantStatus,
    getTimeLine,
    subscriptionDetails,
    editTenantSpecificationRequest,
  }
}

export default useTenantReq
