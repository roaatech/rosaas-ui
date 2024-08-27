import axios from 'axios'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { logOut, addUserInfo } from '../store/slices/auth'
import { changePreloader } from '../store/slices/main'
import { Client_id } from '../const'
import { useNavigate } from 'react-router-dom'
import { Routes } from '../routes'
import { useEffect } from 'react'

const useApi = () => {
  let axiosObject = {
    baseURL: process.env.REACT_APP_API_URL,
    // baseURL: window.localStorage.getItem('url'),
  }

  const pOSystemName = useSelector((state) => state.main.pOSystemName)
  const direction = useSelector((state) => state.main.direction)
  const currency = useSelector((state) => state.main.currency)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const mainInstance = axios.create(axiosObject)

  mainInstance.interceptors.request.use(
    function (config) {
      dispatch(changePreloader(true))

      const noAuthRoutes = [
        'identity/tadmin/v1/Auth/Signup',
        'identity/product-owner-admin/v1/Auth/Signup',
        'identity/product-owner-admin/v1/Auth/Signin',
        'identity/tadmin/v1/Auth/Signin',
        'identity/sadmin/v1/Auth/Signin',
        'identity/v1/Account/ConfirmEmail',
        'identity/v1/Account/ForgotPassword',
        'identity/v1/Account/ResetPassword',
        'public/v1',
      ]

      config.headers['Accept-Language'] = direction === 'rtl' ? 'ar' : 'en'
      config.headers['Currency-Code'] = currency
      config.headers['PO-System-Name'] = pOSystemName

      //* Add auth
      if (!noAuthRoutes.includes(config.url)) {
        const localStorageToken = localStorage.getItem('token')
        if (localStorageToken) {
          config.headers.Authorization = `Bearer ${localStorageToken}`
        } else {
          dispatch(logOut())
        }
      } else {
        config.headers['Client-Id'] = Client_id
      }
      //* End auth

      return config
    },
    (error) => {
      // Handle error
      return Promise.reject(error)
    }
  )

  mainInstance.interceptors.response.use(
    async (res) => {
      dispatch(changePreloader(false))

      if (res.data?.data?.token?.accessToken) {
        localStorage.setItem('token', res.data.data.token.accessToken)
      }

      const roles = [
        '',
        'superAdmin',
        'clientAdmin',
        'ProductAdmin',
        'tenantAdmin',
      ]

      if (
        res.data?.data?.token === null &&
        res.data?.data?.isUserMustConfirmEmail
      ) {
        return navigate(Routes.EmailConfirmationPage.path)
      }

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

      const isSysCode2005 = err.response?.data.metadata?.errors.some(
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
