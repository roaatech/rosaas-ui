import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Routes } from '../routes'
import useRequest from '../axios/apis/useRequest'
import { updateUserInfoAttribute } from '../store/slices/auth'
import { deleteProductOwner, setProductOwner } from '../store/slices/main'

const POwnerChecker = ({ page }) => {
  const userInfo = useSelector((state) => state.auth.userInfo)
  const userRole = userInfo?.userType
  const { isProductOwnerRegistered } = useRequest()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const productOwnerSystemName = useParams().productOwnerSystemName || ''

  const pOSystemName = useSelector((state) => state.main.pOSystemName) || ''

  useEffect(() => {
    if (productOwnerSystemName || productOwnerSystemName !== pOSystemName) {
      dispatch(setProductOwner(productOwnerSystemName))
    }
  }, [productOwnerSystemName, pOSystemName, dispatch])

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

  if (
    userRole === 'clientAdmin' &&
    userInfo.ProductOwnerInfo != null &&
    productOwnerSystemName === pOSystemName
  ) {
    return page
  }
  if (
    (!(userRole === 'clientAdmin') || !userInfo.id) &&
    productOwnerSystemName === pOSystemName
  ) {
    return page
  }
}

export default POwnerChecker
