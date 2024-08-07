import React from 'react'
import { Col, Container, Row } from '@themesberg/react-bootstrap'
import { FormattedMessage } from 'react-intl'
import logo from '../../assets/img/brand/rosas.svg'
import CreateProductOwner from '../../components/custom/ProductOwner/ProductOwnerSignUp/ProductOwnerSignUp'
import ProductOwnerReg from '../../components/custom/ProductOwner/ProductOwnerReg/ProductOwnerReg'
import { Wrapper } from './ProductManagementSignUpPage.styled'
import { useLocation } from 'react-router-dom'
import { Routes } from '../../routes'

const ProductManagementSignUpPage = () => {
  const location = useLocation()

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
                <FormattedMessage id="Product-Owner" />{' '}
                <FormattedMessage id="Registration" />
              </h4>
            </Col>
            <Col
              s={12}
              md={6}
              className="d-flex align-items-center justify-content-center p-4 "
            >
              <div className="">
                <div className=" mb-4 mt-md-0">
                  <h3 className="mb-0">
                    <FormattedMessage id="signUpTo" />{' '}
                    <span className="rosaas">RoSaaS</span>
                  </h3>
                </div>
                {location.pathname === Routes.POwnerSignUp.path ? (
                  <CreateProductOwner />
                ) : location.pathname === Routes.productsOwnerReg.path ? (
                  <ProductOwnerReg />
                ) : null}
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

export default ProductManagementSignUpPage
