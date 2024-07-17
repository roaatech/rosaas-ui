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
          </>
        )
      case Routes.SignInSuperAdmin.path:
        return (
          <>
            {'  '}
            <FormattedMessage id="Admin-Panel" />
          </>
        )
      default:
        return null
    }
  }

  const shouldRenderCopyLink =
    location.pathname !== Routes.ProductManagementSignIn.path &&
    location.pathname !== Routes.SignInSuperAdmin.path

  return (
    (location.pathname === Routes.SignInSuperAdmin.path ||
      location.pathname === Routes.SignInTenantAdmin.path ||
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
                <div className="cardCont shadow-soft border border-round border-light p-4 p-lg-5 w-100 fmxw-500">
                  <div className="text-center text-md-center mb-4 mt-md-0">
                    <img src={logo} alt="RoSaaS Logo" className="logo" />
                    <h3 className="mb-0">
                      <FormattedMessage id="singInTo" />{' '}
                      <span className="rosaas">RoSaaS</span>
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
                  className="custom-div"
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
