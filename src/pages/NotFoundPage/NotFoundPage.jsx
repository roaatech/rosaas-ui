import React from 'react'
import { Col, Row, Container, Button } from '@themesberg/react-bootstrap'
import { Wrapper } from '../PaymentSuccess/paymentSuccess.styled' // Create a styled component if needed
import { Link } from 'react-router-dom'
import { Routes } from '../../routes'

import NotFoundImage from '../../assets/img/pages/404.svg'
import rosasLogo from '../../assets/img/brand/rosas.svg'

import { FormattedMessage } from 'react-intl'

const NotFound = () => {
  const handleButtonClick = () => {
    window.location.href = Routes.mainPage.path
  }
  return (
    <Wrapper>
      <section className="d-flex align-items-center">
        <Container>
          <Row className="justify-content-center form-bg-image">
            <div className="  cardCont shadow-soft border border-round border-light p-4 p-lg-5 w-100">
              <div className="container">
                <div className="row align-items-center border-bottom-3 border-light">
                  <div className="col-md-3 text-center  ">
                    <img
                      src={rosasLogo}
                      alt="Not Found"
                      className="img-fluid not-found-image "
                    />{' '}
                    <div className="p-3" style={{ textAlign: 'left' }}>
                      <span>404 Error. </span>
                      <span style={{ color: '#686868cc' }}>
                        Lost in the Clouds!
                      </span>
                      <div className="pt-3">
                        {' '}
                        <span> Redirect back</span>
                        <span style={{ color: '#686868cc' }}> to the</span>
                        <span> RoSaaS</span>
                        <span style={{ color: '#686868cc' }}>
                          {' '}
                          mission control and we'll guide you through the
                          digital sky once more.{' '}
                        </span>
                        <span> Safe travels!</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-9 text-center border-left-1 border-light">
                    <img
                      src={NotFoundImage}
                      alt="Not Found"
                      className="img-fluid not-found-image"
                    />
                  </div>
                </div>
              </div>

              <div className="text-center text-md-center mt-2 mb-4">
                <Button
                  variant="secondary"
                  icon="pi pi-trash"
                  onClick={handleButtonClick}
                >
                  <FormattedMessage id="Go-Back-Home" />
                </Button>
              </div>
              <div className="text-center text-md-center mb-4 mt-md-0">
                COPYRIGHT <span className="yellow">&copy;</span> 2023 ROAA
                INFORMATION TECHNOLOGY
              </div>
            </div>
          </Row>
        </Container>
      </section>
    </Wrapper>
  )
}

export default NotFound
