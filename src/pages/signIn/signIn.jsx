import React from 'react'
import { Col, Row, Card, Container } from '@themesberg/react-bootstrap'
import { useNavigate, useLocation } from 'react-router-dom'
import { Routes } from '../../routes'
import { FormattedMessage } from 'react-intl'
import SignInTenantAdmin from '../../components/custom/SignInTenantAdmin/SignInTenantAdmin'
import SignInProductManagement from '../../components/custom/SignInProductManagement/SignInProductManagement'
import SignInSuperAdmin from '../../components/custom/SignInSuperAdmin/SignInSuperAdmin'
import { Wrapper } from './signIn.styled'
import logo from '../../assets/img/brand/rosas.svg'
import ResetPassword from '../../components/custom/ResetPassword/ResetPassword'

const SignInPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const renderSignInComponent = () => {
    switch (location.pathname) {
      case Routes.SignInTenantAdmin.path:
        return <SignInTenantAdmin />
      case Routes.ProductManagementSignIn.path:
        return <SignInProductManagement />
      case Routes.SignInSuperAdmin.path:
        return <SignInSuperAdmin />
      case Routes.ResetPasswordConfirm.path:
        return <ResetPassword />
      case Routes.setPassword.path:
        return <ResetPassword />
      case Routes.ResetPasswordRequest.path:
        return <ResetPassword />
      default:
        return null
    }
  }

  const renderHeaderText = () => {
    switch (location.pathname) {
      case Routes.ProductManagementSignIn.path:
        return (
          <>
            <br />
            <FormattedMessage id="Product-Management-Area" />
            <div>
              <FormattedMessage id="singInTo" />{' '}
              <span className="rosaas">RoSaaS</span>
            </div>
          </>
        )
      case Routes.SignInTenantAdmin.path:
        return (
          <>
            <div>
              <FormattedMessage id="singInTo" />{' '}
              <span className="rosaas">RoSaaS</span>
            </div>
          </>
        )
      case Routes.SignInSuperAdmin.path:
        return (
          <>
            {'  '}
            <FormattedMessage id="Admin-Panel" />
            <div>
              <FormattedMessage id="singInTo" />{' '}
              <span className="rosaas">RoSaaS</span>
            </div>
          </>
        )
      case Routes.ResetPasswordRequest.path:
        return (
          <>
            {'  '}
            <h3>
              <FormattedMessage id="Forgot your password?" />
            </h3>
            <p>
              <FormattedMessage id="Enter your email address and we will send you instructions to reset your password." />
            </p>{' '}
          </>
        )
      case Routes.ResetPasswordConfirm.path:
        return (
          <>
            {'  '}
            <div>
              <FormattedMessage id="Reset-Account-password" />
            </div>{' '}
          </>
        )
      case Routes.setPassword.path:
        return (
          <>
            {'  '}
            <div>
              <FormattedMessage id="Set-Your-password" />
            </div>{' '}
          </>
        )
      default:
        return null
    }
  }

  const shouldRenderCopyLink =
    location.pathname == Routes.SignInTenantAdmin.path

  return (
    (location.pathname === Routes.SignInSuperAdmin.path ||
      location.pathname === Routes.ResetPasswordRequest.path ||
      location.pathname === Routes.ResetPasswordConfirm.path ||
      location.pathname === Routes.SignInTenantAdmin.path ||
      location.pathname === Routes.setPassword.path ||
      location.pathname === Routes.ProductManagementSignIn.path) && (
      <Wrapper>
        <section
          className="d-flex align-items-center"
          style={{ minHeight: '100vh' }}
        >
          <Container>
            <Row className="justify-content-center form-bg-image">
              <Col
                xs={12}
                className="d-flex align-items-center justify-content-center"
              >
                <div
                  className={`cardCont shadow-soft border border-round border-light p-4 p-lg-5 w-100 fmxw-500 ${
                    location.pathname === Routes.SignInSuperAdmin.path
                      ? 'super-admin-card'
                      : ''
                  }`}
                >
                  <div className="text-center text-md-center mb-4 mt-md-0">
                    <img src={logo} alt="RoSaaS Logo" className="logo" />
                    <h3 className="mb-0">
                      {location.pathname.includes('sign-in') && <></>}
                      {renderHeaderText()}
                    </h3>
                  </div>
                  {renderSignInComponent()}
                </div>
              </Col>
            </Row>
            {shouldRenderCopyLink && (
              <div className="copy">
                <span
                  className="custom-div fw-bold"
                  onClick={() => navigate(Routes.ProductManagementSignIn.path)}
                >
                  <FormattedMessage id="Product-Management-Area" />
                </span>
              </div>
            )}
            <div className="copy">
              COPYRIGHT <span className="yellow">&copy;</span> 2023 ROAA
              INFORMATION TECHNOLOGY
            </div>
          </Container>
        </section>
      </Wrapper>
    )
  )
}

export default SignInPage
