import useApi from '../../useApi'

const usePOReq = () => {
  const Request = useApi()

  const createPORequest = async (data) => {
    return await Request.post('management/sadmin/v1/productowners', data)
  }
  const editPORequest = async (id, data) => {
    return await Request.put(`management/sadmin/v1/productowners/${id}`, data)
  }
  const getProductOwnersList = async (params) => {
    return await Request.get(
      `management/sadmin/v1/productowners/paged${params}`
    )
  }
  const getProductOwner = async (POId) => {
    return await Request.get(`management/sadmin/v1/productowners/${POId}`)
  }
  const deleteProductOwnerReq = async (POId) => {
    return await Request.delete(`management/sadmin/v1/productowners/${POId}`)
  }
  const isProductOwnerRegistered = async () => {
    return await Request.get(`management/sadmin/v1/productowners/is-registered`)
  }
  const GetCurrentProductOwnerByUserId = async (userId) => {
    return await Request.get(`management/sadmin/v1/productowners/current`)
  }

  return {
    createPORequest,
    editPORequest,
    getProductOwnersList,
    getProductOwner,
    deleteProductOwnerReq,
    isProductOwnerRegistered,
    GetCurrentProductOwnerByUserId,
  }
}

export default usePOReq
