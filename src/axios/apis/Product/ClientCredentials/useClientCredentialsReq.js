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
  const editClientSecret = async (ClientRecordId, id, data) => {
    return await Request.put(
      `identity/sadmin/v1/ClientCredential/${ClientRecordId}/Secrets/${id}`,
      data
    )
  }
  const regenerateClientSecret = async (ClientRecordId, id) => {
    return await Request.post(
      `identity/sadmin/v1/ClientCredential/${ClientRecordId}/Secrets/${id}/Regenerate`
    )
  }

  return {
    createClientSecret,
    getClientSecrets,
    regenerateClientSecret,
    DeleteClientSecret,
    editClientSecret,
  }
}

export default useClientCredentialsReq
