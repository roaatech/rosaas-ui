// ProductListPage.jsx

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Row } from '@themesberg/react-bootstrap'
import { Wrapper } from './MainPage.styled'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'
import { BsBoxSeam } from 'react-icons/bs'
import logoEn from '../../assets/img/brand/rosas.svg'
import logoAr from '../../assets/img/brand/rosas-ar.svg'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSignInAlt,
  faStore,
  faTachometerAlt,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons'
import { FormattedMessage } from 'react-intl'
import { signinRedirectPath } from '../../store/slices/auth'
import { Routes } from '../../routes'
const MainPage = () => {
  const dispatch = useDispatch()

  let direction = useSelector((state) => state.main.direction)
  let selectedLogo

  if (direction === 'rtl') {
    selectedLogo = logoAr
  } else {
    selectedLogo = logoEn
  }
  const navigate = useNavigate()
  const [redirectPath, setRedirectPath] = useState('')
  useEffect(() => {
    if (!redirectPath) {
      return
    }
    dispatch(signinRedirectPath({ redirectPath }))
  }, [redirectPath])

  const isRunningInIframe = window.self !== window.top
  let userRole = useSelector((state) => state.auth.userInfo.role)
  return (
    <Wrapper>
      <section style={{ minHeight: '92vh' }}>
        {!isRunningInIframe && (
          <BreadcrumbComponent breadcrumbInfo={'Home'} icon={BsBoxSeam} />
        )}{' '}
        <div className="main-container ">
          <section className=" mt-4 mb-4 pb-3">
            <div className="row justify-content-center">
              <div className="col-lg-12 text-center mb-3">
                <h1 className="mt-0">
                  <img src={selectedLogo} alt="Logo" width="100" height="100" />
                </h1>
              </div>
              <div className="col-lg-12 text-center mb-1">
                <h2 className="mt-0">
                  <FormattedMessage id="Seamless-SaaS-Transformation" />
                </h2>
              </div>{' '}
              <div
                className="col-lg-7 col-xl-6 text-center"
                style={{ fontSize: 'var(--largeFont)' }}
              >
                <FormattedMessage id="Rosaas-Description" />
              </div>
              <div className="col-lg-9 col-xl-8 text-center">
                {/* <p className="lead">{{ .Params.lead | safeHTML }}</p> */}
              </div>
            </div>
          </section>
          <div className="redirect-icons">
            <Card
              onClick={() => navigate(Routes.marketPlacePage.path)}
              className="redirect-card"
            >
              <Card.Body>
                <Row>
                  <span className="redirect-link ">
                    <FontAwesomeIcon icon={faStore} />
                    <span>
                      <FormattedMessage id="Go-to-Marketplace" />
                    </span>
                  </span>
                </Row>
              </Card.Body>
            </Card>
            <Card
              onClick={() =>
                userRole
                  ? userRole == 'tenantAdmin'
                    ? navigate(Routes.workSpace.path)
                    : navigate(Routes.Dashboard.path)
                  : navigate('/signin')
              }
              className="redirect-card"
            >
              <Card.Body>
                <Row>
                  <span className="redirect-link ">
                    {userRole ? (
                      <>
                        <FontAwesomeIcon icon={faTachometerAlt} />
                        <span>
                          <FormattedMessage id="Dashboard" />
                        </span>
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faSignInAlt} />
                        <span>
                          {' '}
                          <FormattedMessage id="signIn" />
                        </span>
                      </>
                    )}
                  </span>
                </Row>
              </Card.Body>
            </Card>
          </div>
        </div>{' '}
      </section>
      <div className="copy">
        COPYRIGHT <span className="yellow">&copy;</span> 2023 ROAA INFORMATION
        TECHNOLOGY
      </div>
    </Wrapper>
  )
}

export default MainPage
