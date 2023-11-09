import useApi from '../../useApi'

const useSubManagementReq = () => {
  const Request = useApi()
  const subscriptionDetails = async (productId, tenantId) => {
    return await Request.get(
      `management/sadmin/v1/products/${productId}/Tenants/${tenantId}`
    )
  }
  const subscriptionDetailsRenew = async (productId, tenantId, data) => {
    return await Request.post(
      `management/sadmin/v1/products/${productId}/Tenants/${tenantId}/Renew`,
      data
    )
  }
  const subscriptionDetailsResetSub = async (data) => {
    return await Request.post(`management/sadmin/v1/Subscriptions/Reset`, data)
  }

  const subscriptionDetailsLimitReset = async (data) => {
    return await Request.post(
      `management/sadmin/v1/Subscriptions/Features/Reset`,
      data
    )
  }
  const setAutoRenewal = async (data) => {
    return await Request.post(
      `management/sadmin/v1/Subscriptions/AutoRenewal`,
      data
    )
  }
  const cancelAutoRenewal = async (data) => {
    return await Request.delete(
      `management/sadmin/v1/Subscriptions/AutoRenewal`,
      { data }
    )
  }
  return {
    subscriptionDetails,
    subscriptionDetailsRenew,
    subscriptionDetailsResetSub,
    subscriptionDetailsLimitReset,
    setAutoRenewal,
    cancelAutoRenewal,
  }
}
export default useSubManagementReq
