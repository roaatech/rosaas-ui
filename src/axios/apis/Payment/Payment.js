import useApi from '../../useApi'

const usePaymentReq = () => {
  const Request = useApi()

  const getOrderById = async (orderId) => {
    return await Request.get(`management/sadmin/v1/Orders/${orderId}`)
  }
  const getOrderByIdPublic = async (orderId) => {
    return await Request.get(`/public/v1/orders/${orderId}`)
  }
  const getOrdersListByTenantId = async (tenantId) => {
    return await Request.get(`management/sadmin/v1/tenants/${tenantId}/orders`)
  }
  const getPaymentCardsList = async (tenantId) => {
    return await Request.get(`payment/v1/Cards`)
  }
  const attachPaymentMethodCard = async (id) => {
    return await Request.post(`payment/v1/Cards/${id}`)
  }
  const markCardAsDefault = async (id) => {
    return await Request.post(`payment/v1/Cards/${id}/Default`)
  }
  const detachPaymentMethodCard = async (id) => {
    return await Request.delete(`payment/v1/Cards/${id}`)
  }
  const getConfig = async () => {
    return Request.get('payment/v1/config')
  }
  const fetchPaymentIntent = async () => {
    return Request.get('payment/v1/create-payment-intent')
  }

  const paymentCheckout = async (data) => {
    return await Request.post(`payment/v1/Checkout`, data)
  }
  const paymentSuccess = async (data) => {
    return await Request.get(`payment/v1/success`)
  }
  const paymentFailed = async (data) => {
    return await Request.get(`payment/v1/failed`)
  }
  const changeOrderPlan = async (orderId, data) => {
    return await Request.put(
      `management/sadmin/v1/orders/${orderId}/plan`,
      data
    )
  }

  return {
    getOrderById,
    paymentCheckout,
    paymentSuccess,
    paymentFailed,
    getOrdersListByTenantId,
    changeOrderPlan,
    getOrderByIdPublic,
    getPaymentCardsList,
    getConfig,
    fetchPaymentIntent,
    detachPaymentMethodCard,
    attachPaymentMethodCard,
    markCardAsDefault,
  }
}

export default usePaymentReq
