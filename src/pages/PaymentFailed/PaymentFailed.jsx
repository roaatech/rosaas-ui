import React from 'react'
import { Col, Row, Container, Button, Card } from '@themesberg/react-bootstrap'
import { Routes } from '../../routes'

import failedImage from '../../assets/img/pages/paymentFailed.svg'
import { FormattedMessage } from 'react-intl'
import rosasLogo from '../../assets/img/brand/rosas.svg'
import { BsCheckCircleFill, BsXCircleFill } from 'react-icons/bs'

const PaymentFailed = () => {
  const handleButtonClick = () => {
    window.location.href = Routes.Dashboard.path
  }
  return (
    <section className="d-flex align-items-center">
      <Container>
        <Row className="justify-content-center form-bg-image">
          <div className="  cardCont shadow-soft border border-round border-light p-4 p-lg-5 w-100">
            <div className="container">
              <div className="row align-items-center border-bottom-3 border-light">
                <section class=" mt-4 mb-0 ">
                  <div class="row justify-content-center">
                    <div class="col-lg-12 text-center mb-3">
                      <h1 class="mt-0">
                        <img
                          src={rosasLogo}
                          alt="Logo"
                          width="100"
                          height="100"
                        />
                      </h1>
                    </div>
                    <div class="col-lg-12 text-center mb-1">
                      <h2 class="mt-0">
                        <BsXCircleFill
                          style={{ color: 'red', marginLeft: '5px' }}
                        />
                        <span style={{ color: 'red', marginLeft: '5px' }}>
                          Payment Failed.{' '}
                        </span>
                      </h2>
                    </div>{' '}
                    <div
                      class="col-lg-7 col-xl-6 text-center"
                      style={{ fontSize: 'var(--largeFont)' }}
                    >
                      <span>Sorry, your payment failed.</span>
                      <span> Please try again later.</span>
                      <span
                        className="fw-bold"
                        style={{ color: 'red', marginLeft: '5px' }}
                      >
                        {' '}
                        Failed
                      </span>
                    </div>
                  </div>
                </section>

                <img
                  src={failedImage}
                  alt="Success Payment"
                  className="success-payment-image"
                  width="500"
                  height="500"
                />
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
  )
}

export default PaymentFailed
