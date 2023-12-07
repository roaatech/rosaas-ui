import React from 'react'
import { Col, Row, Container, Button } from '@themesberg/react-bootstrap'
import { Wrapper } from './paymentSuccess.styled' // Create a styled component if needed
import { Link } from 'react-router-dom'
import { Routes } from '../../routes'

import NotFoundImage from '../../assets/img/pages/paymentSuccess.png'
import { FormattedMessage } from 'react-intl'

const PaymentSuccess = () => {
  const handleButtonClick = () => {
    window.location.href = Routes.Dashboard.path
  }
  return (
    <Wrapper>
      <section className="d-flex align-items-center">
        <Container>
          <Row className="justify-content-center form-bg-image">
            <div className="  cardCont shadow-soft border border-round border-light p-4 p-lg-5 w-100">
              <h1 className="text-center text-md-center mb-4 mt-md-0">
                Payment Successful!
              </h1>
              <p className="  text-center text-md-center mb-4 mt-md-0">
                Thank you for your payment. Your order is confirmed.
              </p>

              <img
                src={NotFoundImage}
                alt="Not Found"
                className="not-found-image"
              />
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

export default PaymentSuccess
