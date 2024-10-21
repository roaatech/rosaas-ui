import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Routes } from '../../../../routes'

const Redirect = () => {
  const userRole =
    useSelector((state) => state.auth.userInfo.userType) || 'notAuth'
  const location = useLocation()
  const navigate = useNavigate()

  React.useEffect(() => {
    if (
      (userRole === 'superAdmin' || userRole === 'clientAdmin') &&
      location.pathname === Routes.SignInSuperAdmin.path
    ) {
      navigate(Routes.Dashboard.path, { replace: true })
    } else if (
      userRole === 'tenantAdmin' &&
      location.pathname === Routes.SignInTenantAdmin.path
    ) {
      navigate(Routes.workSpace.path, { replace: true }) // Use navigate instead of window.location.href
    }
  }, [userRole, location.pathname, navigate])

  // Default redirect if no conditions are met
  return (
    <Navigate
      to={
        userRole === 'notAuth'
          ? Routes.ProductManagementSignIn.path
          : Routes.NotFound.path
      }
      replace
    />
  )
}

export default Redirect
