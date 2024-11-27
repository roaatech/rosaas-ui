import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Routes } from '../../../../routes'

const Redirect = () => {
  const userRole = useSelector(
    (state) => state.auth.userInfo.userType || 'notAuth'
  )
  const location = useLocation()
  const navigate = useNavigate()

  // Helper function to check if current path matches any in the provided paths
  const isPathMatch = (paths) => paths.includes(location.pathname)

  // Handles redirection logic based on user roles and paths
  const handleRedirect = () => {
    const { path: dashboardPath } = Routes.Dashboard
    const { path: workspacePath } = Routes.workSpace
    const { path: mainPagePath } = Routes.mainPage

    const adminSignInPaths = [
      Routes.SignInSuperAdmin.path,
      Routes.ProductManagementSignIn.path,
    ]

    const tenantSignInPath = Routes.SignInTenantAdmin.path

    if (['superAdmin', 'clientAdmin'].includes(userRole)) {
      if (isPathMatch([...adminSignInPaths, mainPagePath])) {
        navigate(dashboardPath, { replace: true })
      }
    } else if (userRole === 'tenantAdmin' && isPathMatch([tenantSignInPath])) {
      navigate(workspacePath, { replace: true })
    }
  }

  // Trigger the redirection logic on component mount and when dependencies change
  useEffect(() => {
    handleRedirect()
  }, [userRole, location.pathname, navigate])

  // Determine the default redirect path if no match is found
  const getDefaultRedirectPath = () =>
    userRole === 'notAuth'
      ? Routes.ProductManagementSignIn.path
      : Routes.NotFound.path

  return <Navigate to={getDefaultRedirectPath()} replace />
}

export default Redirect
