import useApi from '../../useApi'

const useTenantReq = () => {
  const Request = useApi()

  const createProductRequest = async (data) => {
    return await Request.post('management/sadmin/v1/Products', data)
  }
  const editProductRequest = async (data) => {
    return await Request.put(
      `management/sadmin/v1/Products/${data.id}`,
      data.data
    )
  }
  const updateCompositeTemplateRequest = async (data) => {
    return await Request.put(
      `management/sadmin/v1/Products/${data.id}/CompositeTemplates`,
      data
    )
  }
  const getProduct = async (id) => {
    return await Request.get(`management/sadmin/v1/Products/${id}`)
  }
  const getProductsLookup = async () => {
    return await Request.get(`management/sadmin/v1/Products/Lookup`)
  }
  const getProductWarnings = async (id) => {
    return await Request.get(`management/sadmin/v1/Products/${id}/Warnings`)
  }
  const getProductList = async (params) => {
    return await Request.get(`management/sadmin/v1/Products${params}`)
  }
  const getProductListPublic = async (params) => {
    return await Request.get(`public/v1/Products`)
  }
  const deleteProductReq = async (data) => {
    return await Request.delete(`management/sadmin/v1/Products/${data.id}`)
  }
  const changeProductTrialType = async (productId, data) => {
    return await Request.post(
      `management/sadmin/v1/Products/${productId}/TrialType`,
      data
    )
  }
  const publishProduct = async (productId, data) => {
    return await Request.post(
      `management/sadmin/v1/Products/${productId}/publish`,
      data
    )
  }
  const visibleProduct = async (productId, data) => {
    return await Request.post(
      `management/sadmin/v1/Products/${productId}/Visibility`,
      data
    )
  }

  return {
    createProductRequest,
    getProductListPublic,
    editProductRequest,
    getProduct,
    getProductList,
    deleteProductReq,
    getProductWarnings,
    changeProductTrialType,
    publishProduct,
    visibleProduct,
    getProductsLookup,
    updateCompositeTemplateRequest,
  }
}

export default useTenantReq
