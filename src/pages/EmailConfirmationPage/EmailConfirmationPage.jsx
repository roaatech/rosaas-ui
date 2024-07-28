import { Col, Container, Row } from '@themesberg/react-bootstrap'
import { FormattedMessage } from 'react-intl'
import logo from '../../assets/img/brand/rosas.svg'
import SignUp from '../../components/custom/SignUp/SignUp'
import { Wrapper } from './EmailConfirmationPage.styled'
import { useLocation } from 'react-router-dom'
import CreateProductOwner from '../../components/custom/ProductOwner/ProductOwnerSignUp/ProductOwnerSignUp'
import { Routes } from '../../routes'
import ProductOwnerReg from '../../components/custom/ProductOwner/ProductOwnerReg/ProductOwnerReg'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'
import { BsBoxSeam } from 'react-icons/bs'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
const EmailConfirmationPage = () => {
  const userInfo = useSelector((state) => state.auth.userInfo)
  console.log({ userInfo: userInfo.email })
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
                <div className="text-center text-md-center mb-4 mt-md-0">
                  <img src={logo} alt="RoSaaS Logo" className="logo" />
                  <h3 className="mb-0">Email Confirmation</h3>
                </div>
                <p className="text-center">
                  <FormattedMessage id={'We-Have-Sent-Email-To'} />
                  {'  '}
                  <span className="email">{userInfo.email}</span>
                  {'  '}
                  <FormattedMessage
                    id={'to-confirm-the validity-of-your-email-address.'}
                  />
                  <FormattedMessage
                    id={
                      'After-receicing-the-email-follow-the-link-provided-to-complete-you-registration.'
                    }
                  />
                </p>
                <br className="my-1" />
                <p className="text-center">
                  <FormattedMessage id={'If-you-not-get-any-email, '} />
                  <Link className="resend-link">Resend confirmation mail</Link>.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Wrapper>
  )
}

export default EmailConfirmationPage
