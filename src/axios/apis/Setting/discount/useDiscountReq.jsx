import useApi from '../../../useApi'

const useDiscountReq = () => {
  const Request = useApi()

  const getDiscounts = async (query) => {
    return await Request.get(`management/sadmin/v1/Discounts${query}`)
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
      `management/sadmin/v1/Discounts/${discountId}/UsageHistories/${id}`
    )
  }
  const getDiscountById = async (id) => {
    return await Request.get(`management/sadmin/v1/Discounts/${id}`)
  }
  const getDiscountUsageHistoriesByDiscountId = async (discountId, query) => {
    return await Request.get(
      `management/sadmin/v1/Discounts/${discountId}/UsageHistories${query}`
    )
  }
  const linkEntitiesbyDiscountId = async (discountId, data) => {
    return await Request.post(
      `management/sadmin/v1/Discounts/${discountId}/EntityLinks`,
      data
    )
  }
  const discountEntityLinks = async (discountId, entityType) => {
    return await Request.get(
      `management/sadmin/v1/Discounts/${discountId}/EntityLinks/${entityType}`
    )
  }
  const deleteDiscountLinkedEntityId = async (discountId, entityId) => {
    return await Request.delete(
      `management/sadmin/v1/Discounts/${discountId}/EntityLinks/${entityId}`
    )
  }
  const getDiscountsRequirementsOptions = async () => {
    return await Request.get(`management/sadmin/v1/Discounts/RequirementRules`)
  }
  const createDiscountRequirementGeoLocation = async (discountId, data) => {
    return await Request.post(
      `management/sadmin/v1/Discounts/${discountId}/RequirementRules/GeoLocation`,
      data
    )
  }
  const editDiscountRequirementGeoLocation = async (
    discountId,
    data,
    requirementId
  ) => {
    return await Request.put(
      `management/sadmin/v1/Discounts/${discountId}/RequirementRules/${requirementId}/GeoLocation`,
      data
    )
  }
  const deleteDiscountRequirementGeoLocation = async (
    discountId,
    requirementId
  ) => {
    return await Request.delete(
      `management/sadmin/v1/Discounts/${discountId}/RequirementRules/${requirementId}/GeoLocation`
    )
  }
  const getDiscountRequirementByDiscountId = async (discountId) => {
    return await Request.get(
      `management/sadmin/v1/Discounts/${discountId}/RequirementRules/GeoLocation`
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
    linkEntitiesbyDiscountId,
    discountEntityLinks,
    deleteDiscountLinkedEntityId,
    getDiscountsRequirementsOptions,
    createDiscountRequirementGeoLocation,
    getDiscountRequirementByDiscountId,
    editDiscountRequirementGeoLocation,
    deleteDiscountRequirementGeoLocation,
  }
}

export default useDiscountReq
