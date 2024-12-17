import useApi from '../../useApi'

const useStatisticsReq = () => {
  const Request = useApi()

  const getStatisticsDetailsList = async () => {
    return await Request.get(
      `management/sadmin/v1/Statistics/Details/Subscriptions`
    )
  }
  const getStatisticsDetailsListByProductId = async (productId) => {
    return await Request.get(
      `management/sadmin/v1/Statistics/Details/Subscriptions/${productId}`
    )
  }
  const getStatisticsCountsList = async () => {
    return await Request.get(
      `management/sadmin/v1/Statistics/Counts/Subscriptions`
    )
  }
  const getStatisticsCountsListByProductId = async (productId) => {
    return await Request.get(
      `management/sadmin/v1/Statistics/Counts/Subscriptions/${productId}`
    )
  }
  return {
    getStatisticsDetailsList,
    getStatisticsDetailsListByProductId,
    getStatisticsCountsList,
    getStatisticsCountsListByProductId,
  }
}
export default useStatisticsReq
