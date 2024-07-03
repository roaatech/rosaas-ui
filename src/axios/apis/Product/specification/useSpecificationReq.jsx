import useApi from '../../../useApi'

const useSpecificationReq = () => {
  const Request = useApi()

  const getProductSpecification = async (productId) => {
    return await Request.get(
      `management/sadmin/v1/Products/${productId}/Specifications`
    )
  }

  const createSpecificationRequest = async (productId, data) => {
    return await Request.post(
      `management/sadmin/v1/Products/${productId}/Specifications`,
      data
    )
  }
  const publishSpecification = async (productId, data) => {
    return await Request.post(
      `management/sadmin/v1/Products/${productId}/Specifications/${data.id}/publish`,
      data
    )
  }
  const editSpecificationRequest = async (productId, data) => {
    return await Request.put(
      `management/sadmin/v1/Products/${productId}/Specifications/${data.id}`,
      data.data
    )
  }

  const deleteSpecificationReq = async (productId, data) => {
    return await Request.delete(
      `management/sadmin/v1/Products/${productId}/Specifications/${data.id}`
    )
  }
  const publicSpecificationByProductName = async (
    productOwnerName,
    productName
  ) => {
    return await Request.get(
      `/public/v1/ProductOwner/${productOwnerName}/Product/${productName}/Specifications`
    )
  }

  return {
    getProductSpecification,
    createSpecificationRequest,
    publishSpecification,
    editSpecificationRequest,
    deleteSpecificationReq,
    publicSpecificationByProductName,
  }
}

export default useSpecificationReq
