import useApi from '../../../useApi'

const useDiscountReq = () => {
  const Request = useApi()

  const getDiscounts = async () => {
    return await Request.get(`management/sadmin/v1/Discounts`)
  }

  const createDiscount = async (data) => {
    return await Request.post(`management/sadmin/v1/Discounts`, data)
  }
  const activeDiscount = async (id, data) => {
    return await Request.post(
      `management/sadmin/v1/Discounts/${id}/active`,
      data
    )
  }
  const editDiscountRequest = async (id, data) => {
    return await Request.put(`management/sadmin/v1/Discounts/${id}`, data)
  }

  const deleteDiscount = async (id) => {
    return await Request.delete(`management/sadmin/v1/Discounts/${id}`)
  }
  const deleteDiscountUsageHistoriesById = async (discountId, id) => {
    return await Request.delete(
      `/api/management/sadmin/v1/Discounts/${discountId}/UsageHistories/${id}`
    )
  }
  const getDiscountById = async (id) => {
    return await Request.get(`management/sadmin/v1/Discounts/${id}`)
  }
  const getDiscountUsageHistoriesByDiscountId = async (discountId) => {
    return await Request.get(
      `/api/management/sadmin/v1/Discounts/${discountId}/UsageHistories`
    )
  }
  return {
    getDiscounts,
    createDiscount,
    activeDiscount,
    editDiscountRequest,
    deleteDiscount,
    getDiscountById,
    deleteDiscountUsageHistoriesById,
    getDiscountUsageHistoriesByDiscountId,
  }
}

export default useDiscountReq
