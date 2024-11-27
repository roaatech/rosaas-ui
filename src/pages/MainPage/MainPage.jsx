import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Col, Row } from '@themesberg/react-bootstrap'
import { Wrapper } from './MainPage.styled'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'
import { BsBoxSeam } from 'react-icons/bs'
import logoEn from '../../assets/img/brand/rosas.svg'
import logoAr from '../../assets/img/brand/rosas-ar.svg'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCogs,
  faSignInAlt,
  faStore,
  faTachometerAlt,
} from '@fortawesome/free-solid-svg-icons'
import { FormattedMessage } from 'react-intl'
import { signinRedirectPath } from '../../store/slices/auth'
import { Routes } from '../../routes'
import SafeFormatMessage from '../../components/custom/Shared/SafeFormatMessage/SafeFormatMessage'
import MarketplaceNavBar from '../../components/Sidebar/MarketplaceNavBar/MarketplaceNavBar'

const MainPage = () => {
  const dispatch = useDispatch()
  let direction = useSelector((state) => state.main.direction)
  let selectedLogo = direction === 'rtl' ? logoAr : logoEn

  const navigate = useNavigate()
  const [redirectPath, setRedirectPath] = useState('')
  useEffect(() => {
    if (redirectPath) {
      dispatch(signinRedirectPath({ redirectPath }))
    }
  }, [redirectPath, dispatch])

  const isRunningInIframe = window.self !== window.top
  let userRole = useSelector((state) => state.auth.userInfo.userType)

  return (
    <Wrapper>
      <section style={{ minHeight: '92vh' }}>
        <MarketplaceNavBar />
        <div className="main-container" style={{ marginTop: '12vh' }}>
          <section className="mt-4 mb-4 pb-3">
            <div className="row justify-content-center">
              <div className="col-lg-12 text-center mb-3">
                <h1 className="mt-0">
                  <img src={selectedLogo} alt="Logo" width="100" height="100" />
                </h1>
              </div>
              <div className="col-lg-12 text-center mb-1">
                <h2 className="mt-0">
                  <SafeFormatMessage id="Seamless-SaaS-Transformation" />
                </h2>
              </div>
              <div
                className="col-lg-7 col-xl-6 text-center"
                style={{ fontSize: 'var(--largeFont)' }}
              >
                <SafeFormatMessage id="Rosaas-Description" />
              </div>
            </div>
          </section>

          {!userRole && (
            <div className="additional-info">
              <div className="row justify-content-center text-center">
                <div className="col-lg-3 mx-3 my-3">
                  <h2 className="h4">SaaSification Made Easy</h2>
                  <p>
                    Effortlessly turn any system into a fully functional
                    Software as a Service (SaaS) with RoSaaS's comprehensive
                    services and utilities.
                  </p>
                </div>
                <div className="col-lg-3 mx-3 my-3">
                  <h2 className="h4">Flexible Plan Creation ⚡️</h2>
                  <p>
                    Define and create different plans and packages tailored to
                    suit the varying needs of your clients and tenants.
                  </p>
                </div>
                <div className="col-lg-3 mx-3 my-3">
                  <h2 className="h4">Efficient Tenant Management</h2>
                  <p>
                    Seamlessly manage multiple tenants within the platform,
                    grant or revoke licenses, and adjust access levels with
                    ease.
                  </p>
                </div>
              </div>
              <div className="row justify-content-center text-center">
                <div className="col-lg-3 mx-3 my-3">
                  <h2 className="h4">Real-time Usage Tracking</h2>
                  <p>
                    Gain valuable insights into your SaaS's performance by
                    monitoring tenant behavior and feature utilization.
                  </p>
                </div>
                <div className="col-lg-3 mx-3 my-3">
                  <h2 className="h4">Automated Subscription and Payment</h2>
                  <p>
                    Streamline the subscription process with automatic payment
                    methods and seamless integration with popular gateways.
                  </p>
                </div>
                <div className="col-lg-3 mx-3 my-3">
                  <h2 className="h4">Scalability and Growth</h2>
                  <p>
                    RoSaaS's SaaSification capabilities enable businesses to
                    scale rapidly and expand their customer base.
                  </p>
                </div>
              </div>
            </div>
          )}

          {userRole && (
            <div className="redirect-icons">
              {/* <Card
                onClick={() => navigate(Routes.marketPlacePage.path)}
                className="redirect-card"
              >
                <Card.Body>
                  <Row>
                    <span className="redirect-link">
                      <FontAwesomeIcon icon={faStore} />
                      <span>
                        <SafeFormatMessage id="Go-to-Marketplace" />
                      </span>
                    </span>
                  </Row>
                </Card.Body>
              </Card> */}
              <Card
                onClick={() =>
                  userRole
                    ? userRole === 'tenantAdmin'
                      ? navigate(Routes.workSpace.path)
                      : navigate(Routes.Dashboard.path)
                    : navigate(Routes.SignInTenantAdmin.path)
                }
                className="redirect-card"
              >
                <Card.Body>
                  <Row>
                    <span className="redirect-link">
                      {userRole ? (
                        <>
                          <FontAwesomeIcon icon={faTachometerAlt} />
                          <span>
                            <SafeFormatMessage id="Dashboard" />
                          </span>
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faSignInAlt} />
                          <span>
                            <SafeFormatMessage id="signIn" />
                          </span>
                        </>
                      )}
                    </span>
                  </Row>
                </Card.Body>
              </Card>
            </div>
          )}

          {/* {!userRole && (
            <div className="redirect-icons next-line">
              <Card
                onClick={() => navigate(Routes.ProductManagementSignIn.path)}
                className="redirect-card-product-management mt-3"
              >
                <Card.Body>
                  <Row className="justify-content-center">
                    <span className="redirect-link">
                      <FontAwesomeIcon icon={faCogs} />
                      <span>
                        <SafeFormatMessage id="Product-Management-Area" />
                      </span>
                    </span>
                  </Row>
                </Card.Body>
              </Card>
            </div>
          )} */}
        </div>
      </section>

      <div className="copy">
        COPYRIGHT <span className="yellow">&copy;</span> 2024 ROAA INFORMATION
        TECHNOLOGY
      </div>
    </Wrapper>
  )
}

export default MainPage
