import useApi from '../../../useApi'

const useClientCredentialsReq = () => {
  const Request = useApi()

  const createClientSecret = async (productId, id, data) => {
    return await Request.post(
      `identity/sadmin/v1/ClientCredential/Secrets/${id}/${productId}`,
      data
    )
  }
  const getClientSecrets = async (productId, id) => {
    return await Request.get(
      `identity/sadmin/v1/ClientCredential/Secrets/${id}/${productId}`
    )
  }

  const DeleteClientSecret = async (ClientRecordId, id) => {
    return await Request.delete(
      `identity/sadmin/v1/ClientCredential/${ClientRecordId}/Secrets/${id}`
    )
  }

  return {
    createClientSecret,
    getClientSecrets,
    DeleteClientSecret,
  }
}

export default useClientCredentialsReq
