import useApi from '../../useApi'

const useSettingsReq = () => {
  const Request = useApi()

  const getHeathCheckSettings = async () => {
    return await Request.get(`management/sadmin/v1/Settings/HealthCheck`)
  }
  const putHeathCheckSettings = async (data) => {
    return await Request.put(`management/sadmin/v1/Settings/HealthCheck`, data)
  }
  return { getHeathCheckSettings, putHeathCheckSettings }
}

export default useSettingsReq
