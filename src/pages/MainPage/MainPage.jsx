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
import { faStore, faUserPlus } from '@fortawesome/free-solid-svg-icons'
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

  return (
    <Wrapper>
      {!isRunningInIframe && (
        <BreadcrumbComponent breadcrumbInfo={'Home'} icon={BsBoxSeam} />
      )}{' '}
      <section className="" style={{ minHeight: '79vh' }}>
        <div className="main-container ">
          <section class=" mt-4 mb-4 pb-3">
            <div class="row justify-content-center">
              <div class="col-lg-12 text-center mb-3">
                <h1 class="mt-0">
                  <img src={selectedLogo} alt="Logo" width="100" height="100" />
                </h1>
              </div>
              <div class="col-lg-12 text-center mb-1">
                <h2 class="mt-0">
                  <FormattedMessage id="Seamless-SaaS-Transformation" />
                </h2>
              </div>{' '}
              <div
                class="col-lg-7 col-xl-6 text-center"
                style={{ fontSize: 'var(--largeFont)' }}
              >
                <FormattedMessage id="Rosaas-Description" />
              </div>
              <div class="col-lg-9 col-xl-8 text-center">
                {/* <p class="lead">{{ .Params.lead | safeHTML }}</p> */}
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
                    <span>Go to Marketplace</span>
                  </span>
                </Row>
              </Card.Body>
            </Card>
            <Card
              onClick={() => navigate('/sign-up')}
              className="redirect-card"
            >
              <Card.Body>
                <Row>
                  <span className="redirect-link ">
                    <FontAwesomeIcon icon={faUserPlus} />
                    <span>Register</span>
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
