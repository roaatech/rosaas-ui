import useApi from '../../useApi'

const usePOReq = () => {
  const Request = useApi()

  const createPORequest = async (data) => {
    return await Request.post('management/sadmin/v1/productowners', data)
  }
  const editPORequest = async (data) => {
    return await Request.put('management/sadmin/v1/productowners', data)
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
  return {
    createPORequest,
    editPORequest,
    getProductOwnersList,
    getProductOwner,
    deleteProductOwnerReq,
  }
}

export default usePOReq
