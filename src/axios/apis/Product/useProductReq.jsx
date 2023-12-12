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
  const getProduct = async (id) => {
    return await Request.get(`management/sadmin/v1/Products/${id}`)
  }
  const getProductWarnings = async (id) => {
    return await Request.get(`management/sadmin/v1/Products/${id}/Warnings`)
  }
  const getProductList = async (params) => {
    return await Request.get(`management/sadmin/v1/Products${params}`)
  }
  const getProductListPublic = async (params) => {
    return await Request.get(`public/v1/Products/Lookup`)
  }
  const deleteProductReq = async (data) => {
    return await Request.delete(`management/sadmin/v1/Products/${data.id}`)
  }

  return {
    createProductRequest,
    getProductListPublic,
    editProductRequest,
    getProduct,
    getProductList,
    deleteProductReq,
    getProductWarnings,
  }
}

export default useTenantReq
