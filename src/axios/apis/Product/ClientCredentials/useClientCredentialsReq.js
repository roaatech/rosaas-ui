import useApi from '../../../useApi'

const useClientCredentialsReq = () => {
  const Request = useApi()

  const getClientsListByProduct = async (productId, productOwnerClientId) => {
    return await Request.get(
      `identity/sadmin/v1/ClientCredential/${productOwnerClientId}/${productId}`
    )
  }
  const createClient = async (productId, productOwnerClientId, data) => {
    return await Request.post(
      `identity/sadmin/v1/ClientCredential/${productOwnerClientId}/${productId}`,
      data
    )
  }
  const updateClient = async (productId, clientId, data) => {
    return await Request.put(
      `identity/sadmin/v1/ClientCredential/${clientId}/${productId}`,
      data
    )
  }
  const deleteClient = async (productId, clientId) => {
    return await Request.delete(
      `identity/sadmin/v1/ClientCredential/${clientId}/${productId}`
    )
  }
  const activateClient = async (productId, clientId, data) => {
    return await Request.post(
      `identity/sadmin/v1/ClientCredential/${clientId}/${productId}/active`,
      data
    )
  }
  const createClientSecret = async (productId, id, data) => {
    return await Request.post(
      `identity/sadmin/v1/ClientCredential/${id}/${productId}/Secrets`,
      data
    )
  }
  const getClientSecrets = async (productId, id) => {
    return await Request.get(
      `identity/sadmin/v1/ClientCredential/${id}/${productId}/Secrets`
    )
  }
  const getClientId = async (productId, id) => {
    return await Request.get(
      `identity/sadmin/v1/ClientCredential/${id}/${productId}`
    )
  }

  const DeleteClientSecret = async (productId, ClientRecordId, id) => {
    return await Request.delete(
      `identity/sadmin/v1/ClientCredential/${ClientRecordId}/${productId}/Secrets/${id}`
    )
  }
  const editClientSecret = async (productId, ClientRecordId, id, data) => {
    return await Request.put(
      `identity/sadmin/v1/ClientCredential/${ClientRecordId}/${productId}/Secrets/${id}`,
      data
    )
  }
  const regenerateClientSecret = async (ClientRecordId, productId, id) => {
    return await Request.post(
      `identity/sadmin/v1/ClientCredential/${ClientRecordId}/${productId}/Secrets/${id}/Regenerate`
    )
  }

  return {
    createClientSecret,
    getClientSecrets,
    regenerateClientSecret,
    DeleteClientSecret,
    editClientSecret,
    getClientId,
    getClientsListByProduct,
    createClient,
    updateClient,
    deleteClient,
    activateClient,
  }
}

export default useClientCredentialsReq
