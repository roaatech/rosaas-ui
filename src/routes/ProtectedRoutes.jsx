import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import { Routes } from '../routes'
import useRequest from '../axios/apis/useRequest'
import { updateUserInfoAttribute } from '../store/slices/auth'

const POwnerChecker = ({ page }) => {
  const userInfo = useSelector((state) => state.auth.userInfo)
  console.log({ userInfo })
  const userRole = userInfo?.userType
  const { isProductOwnerRegistered } = useRequest()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    if (!(userRole === 'clientAdmin') || !userInfo.id) {
      return
    }
    ;(async () => {
      const ProductOwnerRegistered = await isProductOwnerRegistered()

      dispatch(
        updateUserInfoAttribute({
          key: 'ProductOwnerInfo',
          value: ProductOwnerRegistered.data.data,
        })
      )
      if (
        userRole === 'clientAdmin' &&
        ProductOwnerRegistered.data.data == null
      ) {
        return navigate(Routes.productsOwnerReg.path)
      }
    })()
  }, [userInfo?.id])

  if (userRole === 'clientAdmin' && userInfo.ProductOwnerInfo != null) {
    return page
  }
}

export default POwnerChecker
