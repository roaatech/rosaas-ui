import useApi from '../../../useApi'

const useWebhookEndpointReq = () => {
  const Request = useApi()

  const getWebhookEndpointsList = async (productId) => {
    return await Request.get(
      `management/sadmin/v1/Products/${productId}/WebhookEndpoints`
    )
  }
  const getWebhookEndpointbyId = async (productId, webhookEndpointId) => {
    return await Request.get(
      `management/sadmin/v1/products/${productId}/WebhookEndpoints/${webhookEndpointId}/change-status`
    )
  }

  const createWebhookEndpoint = async (productId, data) => {
    return await Request.post(
      `management/sadmin/v1/products/${productId}/WebhookEndpoints`,
      data
    )
  }
  const activateWebhookEndpoint = async (
    productId,
    webhookEndpointId,
    data
  ) => {
    return await Request.post(
      `management/sadmin/v1/products/${productId}/WebhookEndpoints/${webhookEndpointId}/activation-status`,
      data
    )
  }
  const editWebhookEndpoint = async (productId, webhookEndpointId, data) => {
    return await Request.put(
      `management/sadmin/v1/products/${productId}/WebhookEndpoints/${webhookEndpointId}`,
      data
    )
  }

  const deleteWebhookEndpoint = async (productId, webhookEndpointId) => {
    return await Request.delete(
      `management/sadmin/v1/products/${productId}/WebhookEndpoints/${webhookEndpointId}`
    )
  }
  return {
    getWebhookEndpointsList,
    getWebhookEndpointbyId,
    createWebhookEndpoint,
    activateWebhookEndpoint,
    editWebhookEndpoint,
    deleteWebhookEndpoint,
  }
}
export default useWebhookEndpointReq
