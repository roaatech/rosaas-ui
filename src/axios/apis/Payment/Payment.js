import useApi from '../../useApi'

const usePaymentReq = () => {
  const Request = useApi()

  const getOrderById = async (orderId) => {
    return await Request.get(`management/sadmin/v1/Orders/${orderId}`)
  }
  const getOrdersListByTenantId = async (tenantId) => {
    return await Request.get(`management/sadmin/v1/tenants/${tenantId}/orders`)
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
  }
}

export default usePaymentReq
