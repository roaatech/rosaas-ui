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
  const SignInAdminAsync = async (data) => {
    return await Request.post('identity/sadmin/v1/Auth/Signin', data)
  }
  const SignInTenantAdminAsync = async (data) => {
    return await Request.post('identity/tadmin/v1/Auth/Signin', data)
  }
  const SignInProductOwnerAsync = async (data) => {
    return await Request.post(
      'identity/product-owner-admin/v1/Auth/Signin',
      data
    )
  }
  const getAuditsList = async (query) => {
    return await Request.get(`management/sadmin/v1/Audits${query}`)
  }
  const getAditsActionListLookup = async () => {
    return await Request.get(`management/sadmin/v1/Audits/Actions`)
  }
  const getLogsList = async (query) => {
    return await Request.get(`management/sadmin/v1/Logs${query}`)
  }
  const getAuditById = async (id) => {
    return await Request.get(`management/sadmin/v1/Audits/${id}`)
  }
  const getLogById = async (id) => {
    return await Request.get(`management/sadmin/v1/Logs/${id}`)
  }
  const deleteLogBeforeDate = async (data) => {
    return await Request.delete(`management/sadmin/v1/Logs`, { data })
  }
  const signUp = async (data) => {
    return await Request.post('identity/tadmin/v1/Auth/Signup', data)
  }
  const requestPasswordReset = async (data) => {
    return await Request.post('identity/v1/Account/ForgotPassword', data)
  }
  const resetPassword = async (data) => {
    return await Request.post('identity/v1/Account/ResetPassword', data)
  }
  const confirmEmail = async (data) => {
    return await Request.post('identity/v1/Account/ConfirmEmail', data)
  }
  const signUpPOwner = async (data) => {
    return await Request.post(
      'identity/product-owner-admin/v1/Auth/Signup',
      data
    )
  }
  const userData = async () => {
    return await Request.get('identity/sadmin/v1/Account')
  }
  const getEnvironment = async () => {
    return await Request.get('v1/Environment')
  }

  return {
    getEnvironment,
    SignInAdminAsync,
    SignInProductOwnerAsync,
    SignInTenantAdminAsync,
    signUpPOwner,
    userData,
    logOut,
    signUp,
    confirmEmail,
    requestPasswordReset,
    resetPassword,
    getAuditsList,
    getAuditById,
    getLogsList,
    getLogById,
    deleteLogBeforeDate,
    getAditsActionListLookup,
  }
}

export default useUserReq
