import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { Routes } from '../../../../routes'

const Redirect = () => {
  let userRole = useSelector((state) => state.auth.userInfo.userType)

  if (userRole == undefined) userRole = 'notAuth'
  return (
    <Navigate
      to={userRole == 'notAuth' ? Routes.Signin.path : Routes.NotFound.path}
    />
  )
}

export default Redirect
