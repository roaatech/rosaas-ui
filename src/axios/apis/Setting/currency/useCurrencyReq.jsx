import useApi from '../../../useApi'

const useCurrencyReq = () => {
  const Request = useApi()

  const getCurrencies = async () => {
    return await Request.get(`management/sadmin/v1/Currencies`)
  }

  const createCurrency = async (data) => {
    return await Request.post(`management/sadmin/v1/Currencies`, data)
  }

  const editCurrency = async (id, data) => {
    return await Request.put(`management/sadmin/v1/Currencies/${id}`, data)
  }

  const deleteCurrency = async (id) => {
    return await Request.delete(`management/sadmin/v1/Currencies/${id}`)
  }

  const getCurrencyById = async (id) => {
    return await Request.get(`management/sadmin/v1/Currencies/${id}`)
  }

  const publishCurrency = async (id, data) => {
    return await Request.post(
      `management/sadmin/v1/Currencies/${id}/publish`,
      data
    )
  }
  const markAsPrimaryCurrency = async (id) => {
    return await Request.post(
      `management/sadmin/v1/Currencies/${id}/MarkAsPrimary`
    )
  }
  const getCurrenciesPublishList = async () => {
    return await Request.get(`public/v1/Currencies`)
  }

  const markAsPrimaryExchangeRateCurrency = async (id) => {
    return await Request.post(
      `management/sadmin/v1/Currencies/${id}/MarkAsPrimaryExchangeRate`
    )
  }

  // Product Owner Specific Endpoints

  const markAsPrimaryCurrencyForProductOwner = async (productOwnerId, id) => {
    return await Request.post(
      `management/product-owner-admin/v1/productowners/${productOwnerId}/Currencies/${id}/MarkAsPrimary`
    )
  }

  const markAsPrimaryExchangeRateCurrencyForProductOwner = async (
    productOwnerId,
    id
  ) => {
    return await Request.post(
      `management/product-owner-admin/v1/productowners/${productOwnerId}/Currencies/${id}/MarkAsPrimaryExchangeRate`
    )
  }

  return {
    getCurrencies,
    createCurrency,
    editCurrency,
    deleteCurrency,
    getCurrencyById,
    publishCurrency,
    markAsPrimaryCurrency,
    markAsPrimaryExchangeRateCurrency,
    markAsPrimaryCurrencyForProductOwner,
    markAsPrimaryExchangeRateCurrencyForProductOwner,
    getCurrenciesPublishList,
  }
}

export default useCurrencyReq
