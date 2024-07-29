import axios from 'axios'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { logOut } from '../store/slices/auth'
import { changePreloader } from '../store/slices/main'
import { addUserInfo } from '../store/slices/auth'
import { Client_id } from '../const'
import { useNavigate } from 'react-router-dom'
import { Routes } from '../routes'

const useApi = () => {
  let axiosObject = {
    // baseURL: process.env.REACT_APP_API_URL,
    baseURL: window.localStorage.getItem('url'),
  }
  const navigate = useNavigate()
  const mainInstance = axios.create(axiosObject)

  const dispatch = useDispatch()

  mainInstance.interceptors.request.use(
    function (config) {
      dispatch(changePreloader(true))
      const noAuthRoutes = [
        'identity/tadmin/v1/Auth/Signup',
        'identity/product-owner-admin/v1/Auth/Signup',
        'identity/product-owner-admin/v1/Auth/Signin',
        'identity/tadmin/v1/Auth/Signin',
        'identity/sadmin/v1/Auth/Signin',
      ]
      //* add auth
      if (!noAuthRoutes.includes(config.url)) {
        const localStorageToken = localStorage.getItem('token')
        config.headers.Authorization = localStorageToken
          ? `Bearer ${localStorageToken}`
          : ''
      } else {
        config.headers['Client-Id'] = Client_id
      }
      //* end auth
      return config
    },
    (error) => {
      //if err don't do any thing and i will handel it in my global handel error
      return Promise.reject(error)
    }
  )
  mainInstance.interceptors.response.use(
    async (res) => {
      dispatch(changePreloader(false))
      res.data?.data?.token?.accessToken &&
        localStorage.setItem('token', res.data?.data?.token?.accessToken)
      const roles = [
        '',
        'superAdmin',
        'clientAdmin',
        'ProductAdmin',
        'tenantAdmin',
      ]
      if (res.data?.data?.userAccount?.email) {
        dispatch(
          addUserInfo({
            ...res.data?.data?.userAccount,
            userType: roles[res.data?.data?.userAccount?.userType],
          })
        )
      }
      return res
    },
    async (err) => {
      dispatch(changePreloader(false))
      const isSysCode2005 = err.response.data.metadata.errors.some(
        (element) => {
          return element.sysCode == 2005 ? true : false
        }
      )
      if (isSysCode2005) {
        return navigate(Routes.EmailConfirmationPage.path)
      }
      if (err?.response?.status == 401) {
        dispatch(logOut())
        return Promise.reject(err)
      }

      if (err?.response?.data?.metadata) {
        //when the Access Token is expired
        err.response.data.metadata.errors.map((element) => {
          toast.error(element.message, {
            position: toast.POSITION.TOP_CENTER,
          })
        })
      }
      return Promise.reject(err)
    }
  )
  return mainInstance
}

export default useApi
