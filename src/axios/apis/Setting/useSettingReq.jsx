import useApi from '../../useApi'

const useSettingsReq = () => {
  const Request = useApi()

  const getHeathCheckSettings = async () => {
    return await Request.get(`management/sadmin/v1/Settings/HealthCheck`)
  }
  const putHeathCheckSettings = async (data) => {
    return await Request.put(`management/sadmin/v1/Settings/HealthCheck`, data)
  }
  const getSubscriptionsSettings = async () => {
    return await Request.get(`management/sadmin/v1/Settings/Subscription`)
  }
  const putSubscriptionsSettings = async (data) => {
    return await Request.put(`management/sadmin/v1/Settings/Subscription`, data)
  }
  const getProductWarningsSettings = async () => {
    return await Request.get(`management/sadmin/v1/Settings/Product/Warnings`)
  }
  const putProductWarningsSettings = async (data) => {
    return await Request.put(
      `management/sadmin/v1/Settings/Product/Warnings`,
      data
    )
  }

  return {
    getHeathCheckSettings,
    putHeathCheckSettings,
    getSubscriptionsSettings,
    putSubscriptionsSettings,
    getProductWarningsSettings,
    putProductWarningsSettings,
  }
}

export default useSettingsReq
