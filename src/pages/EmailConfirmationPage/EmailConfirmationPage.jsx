import { Button, Col, Container, Row } from '@themesberg/react-bootstrap'
import { FormattedMessage } from 'react-intl'
import logo from '../../assets/img/brand/rosas.svg'
import SignUp from '../../components/custom/SignUp/SignUp'
import { Wrapper } from './EmailConfirmationPage.styled'
import { useLocation } from 'react-router-dom'
import CreateProductOwner from '../../components/custom/ProductOwner/ProductOwnerSignUp/ProductOwnerSignUp'
import { Routes } from '../../routes'
import ProductOwnerReg from '../../components/custom/ProductOwner/ProductOwnerReg/ProductOwnerReg'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'
import { BsBoxSeam, BsCheckCircle } from 'react-icons/bs'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
const EmailConfirmationPage = () => {
  const userInfo = useSelector((state) => state.auth.userInfo)
  const handleButtonClick = () => {
    window.location.href = Routes.mainPage.path
  }
  return (
    <Wrapper>
      <section
        className="d-flex align-items-center"
        style={{ minHeight: '100vh' }}
      >
        <Container>
          <Row className="justify-content-center">
            <Col
              xs={12}
              className="d-flex align-items-center justify-content-center"
            >
              <div className="cardCont shadow-soft border border-round border-light p-4 p-lg-5 w-100 fmxw-500 pb-0">
                <div className="text-center text-md-center  mt-md-0">
                  <img src={logo} alt="RoSaaS Logo" className="logo" />
                  <h2
                    className="mb-0 mt-2"
                    style={{ color: 'var(--primary-color-1)' }}
                  >
                    Email Confirmation
                  </h2>
                  <br className="my-4" />
                </div>

                <p className="text-center">
                  {userInfo.email ? (
                    <div style={{ color: 'green' }}>
                      <BsCheckCircle size={24} style={{ marginRight: '8px' }} />
                      <FormattedMessage id={'We-Have-Sent-Email-To'} />
                      {'  '}
                      <span className="email">{userInfo.email}</span>
                      {'  '}
                      <FormattedMessage
                        id={'to-confirm-the validity-of-your-email-address.'}
                      />
                    </div>
                  ) : (
                    <div style={{ color: 'green' }}>
                      <BsCheckCircle size={24} style={{ marginRight: '8px' }} />
                      <FormattedMessage id="your-link-has-been-sent-to-your-email-please-activate-it" />
                      {'  '}
                    </div>
                  )}
                  <FormattedMessage
                    id={
                      'After-receicing-the-email-follow-the-link-provided-to-complete-your-progress.'
                    }
                  />
                </p>
                <br className="my-4" />
                <div className="text-center text-md-center mt-2 mb-4">
                  <Button
                    variant="secondary"
                    icon="pi pi-trash"
                    onClick={handleButtonClick}
                  >
                    <FormattedMessage id="Go-Back-Home" />
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Wrapper>
  )
}

export default EmailConfirmationPage
