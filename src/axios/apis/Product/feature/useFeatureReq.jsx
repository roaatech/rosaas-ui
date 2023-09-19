import useApi from '../../../useApi'

const useFeatureReq = () => {
  const Request = useApi()

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

  return {
    getProductFeatures,
    createFeatureRequest,
    editFeatureRequest,
    deleteFeatureReq,
  }
}

export default useFeatureReq
