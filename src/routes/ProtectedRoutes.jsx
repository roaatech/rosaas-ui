import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { Routes } from '../routes'
import useRequest from '../axios/apis/useRequest'
import { updateUserInfoAttribute } from '../store/slices/auth'

const POwnerChecker = ({ page }) => {
  const userInfo = useSelector((state) => state.auth.userInfo)
  console.log({ userInfo })
  const userRole = userInfo?.userType
  const { isProductOwnerRegistered } = useRequest()
  const dispatch = useDispatch()
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
    })()
  }, [userInfo?.id])

  if (
    userInfo.ProductOwnerInfo &&
    userRole === 'clientAdmin' &&
    userInfo.ProductOwnerInfo == null
  ) {
    return <Navigate to={Routes.productsOwnerReg.path} />
  } else if (userRole === 'clientAdmin' && userInfo.ProductOwnerInfo != null) {
    return page
  }
}

export default POwnerChecker
