import { Col, Container, Row } from '@themesberg/react-bootstrap'
import { FormattedMessage } from 'react-intl'
import logo from '../../assets/img/brand/rosas.svg'
import SignUp from '../../components/custom/SignUp/SignUp'
import { Wrapper } from './SignUpPage.styled'
import { useLocation } from 'react-router-dom'
import CreateProductOwner from '../../components/custom/ProductOwner/ProductOwnerSignUp/ProductOwnerSignUp'
import { Routes } from '../../routes'
import ProductOwnerReg from '../../components/custom/ProductOwner/ProductOwnerReg/ProductOwnerReg'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'
import { BsBoxSeam } from 'react-icons/bs'
import SafeFormatMessage from '../../components/custom/Shared/SafeFormatMessage/SafeFormatMessage'
const SignUpPage = () => {
  const location = useLocation()
  return (
    <Wrapper>
      {location.pathname == Routes.productsOwnerReg.path && (
        <BreadcrumbComponent icon={BsBoxSeam} />
      )}
      <section
        className="d-flex align-items-center"
        style={{ minHeight: '100vh' }}
      >
        <Container>
          <Row className="justify-content-center form-bg-image">
            <Col
              xs={12}
              className="d-flex align-items-center justify-content-center"
            >
              <div className="cardCont shadow-soft border border-round border-light p-4 p-lg-5 w-100 fmxw-500">
                <div className="text-center text-md-center mb-4 mt-md-0">
                  <img src={logo} alt="" className="logo" />

                  <h3 className="mb-0">
                    {location.pathname != Routes.productsOwnerReg.path &&
                    location.pathname != Routes.POwnerSignUp.path ? (
                      <div>
                        <span className="rosaas">
                          {' '}
                          {location.pathname === Routes.POwnerSignUp.path && (
                            <SafeFormatMessage id={'Admin'} />
                          )}{' '}
                        </span>
                        <SafeFormatMessage id={'signUpTo'} />{' '}
                        <span className="rosaas">RoSaaS</span>
                      </div>
                    ) : (
                      <div>
                        {/* <span className="rosaas"> */}
                        <SafeFormatMessage id={'Product-Owner'} />
                        {/* </span> */}
                        {'  '}
                        <SafeFormatMessage id={'Registeration'} />{' '}
                        {/* <span className="rosaas">RoSaaS</span> */}
                      </div>
                    )}
                  </h3>
                </div>

                {location.pathname == Routes.POwnerSignUp.path ? (
                  <CreateProductOwner />
                ) : location.pathname == Routes.productsOwnerReg.path ? (
                  <ProductOwnerReg />
                ) : (
                  <SignUp />
                )}
              </div>
            </Col>
          </Row>

          <div className="copy">
            COPYRIGHT <span className="yellow">&copy;</span> 2024 ROAA
            INFORMATION TECHNOLOGY
          </div>
        </Container>
      </section>
    </Wrapper>
  )
}
export default SignUpPage
