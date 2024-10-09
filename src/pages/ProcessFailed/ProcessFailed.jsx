import React from 'react'
import { Col, Row, Container, Button } from '@themesberg/react-bootstrap'
import { Wrapper } from '../PaymentSuccess/paymentSuccess.styled' // Create a styled component if needed
import { Routes } from '../../routes'
import processFailedImage from '../../assets/img/pages/ProcessFailedImage.svg' // Ensure this path is correct
import rosasLogo from '../../assets/img/brand/rosas.svg'
import { BsXCircleFill } from 'react-icons/bs'
import SafeFormatMessage from '../../components/custom/Shared/SafeFormatMessage/SafeFormatMessage'
import { useLocation } from 'react-router-dom'

const ProcessFailed = ({ title, message }) => {
  const handleButtonClick = () => {
    window.location.href = Routes.Dashboard.path // Update to the appropriate route
  }
  const location = useLocation()
  return (
    <Wrapper>
      <section className="d-flex align-items-center">
        <Container>
          <Row className="justify-content-center form-bg-image">
            <div className="cardCont shadow-soft border border-round border-light p-4 p-lg-5 w-100">
              <div className="container">
                <div className="row align-items-center border-bottom-3 border-light">
                  <div className="col-md-4 text-center">
                    <img
                      src={rosasLogo}
                      alt="Logo"
                      className="img-fluid"
                      width="100"
                      height="100"
                    />
                    <div className="p-3" style={{ textAlign: 'left' }}>
                      <h2 className="mt-0">
                        <BsXCircleFill
                          style={{ color: 'red', marginLeft: '5px' }}
                        />
                        <span style={{ color: 'red', marginLeft: '5px' }}>
                          {title ? (
                            <span>{title}</span>
                          ) : (
                            <span>Process Failed.</span>
                          )}
                        </span>
                      </h2>
                      <div className="pt-3">
                        {message ? (
                          <span>{message}</span>
                        ) : (
                          <>
                            <span>
                              Sorry, there was an issue processing your request.
                            </span>
                            <span> Please try again later.</span>
                          </>
                        )}
                        <span
                          className="fw-bold"
                          style={{ color: 'red', marginLeft: '5px' }}
                        >
                          {' '}
                          Failed
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-8 text-center border-left-1 border-light">
                    <img
                      src={processFailedImage}
                      alt="Process Failed"
                      className="img-fluid"
                      width="500"
                      height="500"
                    />
                  </div>
                </div>
              </div>
              {location.pathname == Routes.ProcessFailed.path && (
                <div>
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
                    COPYRIGHT <span className="yellow">&copy;</span> 2024 ROAA
                    INFORMATION TECHNOLOGY
                  </div>
                </div>
              )}
            </div>
          </Row>
        </Container>
      </section>
    </Wrapper>
  )
}

export default ProcessFailed
