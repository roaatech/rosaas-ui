import useApi from '../../useApi'
import { useDispatch } from 'react-redux'
import { logOut as logOutRequest } from '../../../store/slices/auth'
const useUserReq = () => {
  const dispatch = useDispatch()
  const Request = useApi()

  // user
  const logOut = async () => {
    dispatch(logOutRequest())
    return await Request.get(`logout`)
  }

  const signIn = async (data) => {
    return await Request.post('identity/sadmin/v1/Auth/Signin', data)
  }
  const signUp = async (data) => {
    return await Request.post('identity/tadmin/v1/Auth/Signup', data)
  }
  const userData = async () => {
    return await Request.get('identity/sadmin/v1/Account')
  }
  return { signIn, userData, logOut, signUp }
}

export default useUserReq
