import useApi from '../../useApi'

const useSubManagementReq = () => {
  const Request = useApi()
  const subscriptionDetails = async (productId, tenantId) => {
    return await Request.get(
      `management/sadmin/v1/products/${productId}/Tenants/${tenantId}`
    )
  }
  const subscriptionFeturesList = async (subscriptionId) => {
    return await Request.get(
      `management/sadmin/v1/Subscriptions/${subscriptionId}/Features`
    )
  }
  const subscriptionCycleById = async (subscriptionId, cycleId) => {
    return await Request.get(
      `management/sadmin/v1/Subscriptions/${subscriptionId}/Cycles/${cycleId}`
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
  const upgradeSubscription = async (data) => {
    return await Request.post(
      `management/sadmin/v1/Subscriptions/Upgrade`,
      data
    )
  }
  const downgradeSubscription = async (data) => {
    return await Request.post(
      `management/sadmin/v1/Subscriptions/Downgrade`,
      data
    )
  }
  const getSubscriptionsList = async () => {
    return await Request.get(`management/sadmin/v1/Subscriptions`)
  }

  return {
    subscriptionDetails,
    subscriptionDetailsRenew,
    subscriptionDetailsResetSub,
    subscriptionDetailsLimitReset,
    setAutoRenewal,
    cancelAutoRenewal,
    upgradeSubscription,
    downgradeSubscription,
    subscriptionFeturesList,
    subscriptionCycleById,
    getSubscriptionsList,
  }
}
export default useSubManagementReq
