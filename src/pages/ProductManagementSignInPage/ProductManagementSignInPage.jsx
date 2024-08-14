import React from 'react'
import { Col, Row, Container } from '@themesberg/react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import SignInProductManagement from '../../components/custom/SignInProductManagement/SignInProductManagement'
import { Wrapper } from './ProductManagementSignInPage.styled'
import logo from '../../assets/img/brand/rosas.svg'

const ProductManagementSignInPage = () => {
  const navigate = useNavigate()

  return (
    <Wrapper>
      <section
        className="d-flex align-items-center"
        style={{ minHeight: '100vh' }}
      >
        <Container className="fmxw-900">
          <Row className="justify-content-center form-bg-image cardCont shadow-soft border border-round border-light p-0 p-lg-5 w-100 ">
            <Col
              s={12}
              md={6}
              className="d-flex flex-column align-items-center justify-content-center logo-col p-4"
            >
              <img
                src={logo}
                alt="RoSaaS Logo"
                className="logo"
                style={{ maxWidth: '200px' }}
              />
              <h4 className="text-center mt-2">
                <FormattedMessage id="Product-Management-Area" />
              </h4>
            </Col>
            <Col
              s={12}
              md={6}
              className="d-flex align-items-center justify-content-center p-4"
            >
              <div className="">
                <div className=" mb-4 mt-md-0">
                  <h3 className="mb-0">
                    <FormattedMessage id="singInTo" />{' '}
                    <span className="rosaas">RoSaaS</span>
                  </h3>
                </div>
                <SignInProductManagement />
              </div>
            </Col>
          </Row>
          <div className="copy text-center mt-4">
            COPYRIGHT <span className="yellow">&copy;</span> 2023 ROAA
            INFORMATION TECHNOLOGY
          </div>
        </Container>
      </section>
    </Wrapper>
  )
}

export default ProductManagementSignInPage
