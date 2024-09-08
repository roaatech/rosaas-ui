import React from 'react'
import { Col, Row, Container, Button, Card } from '@themesberg/react-bootstrap'
import { Wrapper } from './CreatedSuccess.styled'
import { Routes } from '../../routes'
import successImage from '../../assets/img/pages/createdSuccess.svg'
import { FormattedMessage } from 'react-intl'
import rosasLogo from '../../assets/img/brand/rosas.svg'
import { BsCheckCircleFill } from 'react-icons/bs'
import SafeFormatMessage from '../../components/custom/Shared/SafeFormatMessage/SafeFormatMessage'

const CreatedSuccess = () => {
  const handleButtonClick = () => {
    window.location.href = Routes.Dashboard.path
  }
  return (
    <Wrapper>
      <section className="d-flex align-items-center">
        <Container>
          <Row className="justify-content-center form-bg-image">
            <div className="  cardCont shadow-soft border border-round border-light p-4 p-lg-5 w-100">
              <div className="container">
                <div className="row align-items-center border-bottom-3 border-light">
                  <section className=" mt-4 mb-0 ">
                    <div className="row justify-content-center">
                      <div className="col-lg-12 text-center mb-3">
                        <h1 className="mt-0">
                          <img
                            src={rosasLogo}
                            alt="Logo"
                            width="100"
                            height="100"
                          />
                        </h1>
                      </div>
                      <div className="col-lg-12 text-center mb-1">
                        <h2 className="mt-0">
                          <BsCheckCircleFill
                            style={{ color: 'green', marginLeft: '5px' }}
                          />
                          <span style={{ color: 'green', marginLeft: '5px' }}>
                            Tenant Created Successfully.{' '}
                          </span>
                        </h2>
                      </div>{' '}
                      <div
                        className="col-lg-7 col-xl-6 text-center"
                        style={{ fontSize: 'var(--largeFont)' }}
                      >
                        {/* <span>Thank you for your payment.</span> */}

                        <span> Your order is</span>
                        <span
                          className="fw-bold"
                          style={{ color: 'green', marginLeft: '5px' }}
                        >
                          {' '}
                          confirmed
                        </span>
                      </div>
                    </div>
                  </section>

                  <img
                    src={successImage}
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
                  <SafeFormatMessage id="Go-Back-Home" />
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

export default CreatedSuccess
