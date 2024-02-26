import useApi from '../../useApi'
import { useDispatch } from 'react-redux'
import { logOut as logOutRequest } from '../../../store/slices/auth'
const useAccountReq = () => {
  const Request = useApi()

  const updateProfile = async (data) => {
    return await Request.put('identity/sadmin/v1/account/profile', data)
  }
  const changePassword = async (data) => {
    return await Request.post('identity/sadmin/v1/account/ChangePassword', data)
  }
  const getCurrentProfile = async () => {
    return await Request.get('identity/sadmin/v1/account/profile')
  }
  return { updateProfile, getCurrentProfile, changePassword }
}

export default useAccountReq
