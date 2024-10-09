import { Button, Col, Container, Row } from '@themesberg/react-bootstrap'
import { FormattedMessage } from 'react-intl'
import logo from '../../assets/img/brand/rosas.svg'
import { Wrapper } from './ResetPasswordPage.styled'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Routes } from '../../routes'
import SafeFormatMessage from '../../components/custom/Shared/SafeFormatMessage/SafeFormatMessage'

const ResetPasswordPage = () => {
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
                <div className="text-center text-md-center mt-md-0">
                  <img src={logo} alt="RoSaaS Logo" className="logo" />
                  <h2
                    className="mb-0 mt-2"
                    style={{ color: 'var(--primary-color-1)' }}
                  >
                    Reset Password
                  </h2>
                  <br className="my-4" />
                </div>

                <p className="text-center">
                  {userInfo.email ? (
                    <>
                      <SafeFormatMessage
                        id={'We-Have-Sent-Reset-Password-Email-To'}
                      />
                      {'  '}
                      <span className="email">{userInfo.email}</span>
                      {'  '}
                      <SafeFormatMessage id={'to-reset-your-password.'} />
                    </>
                  ) : (
                    <>
                      A reset link has been sent to your email, please check
                      your inbox.{'  '}
                    </>
                  )}
                  <SafeFormatMessage
                    id={
                      'After-receiving-the-email-follow-the-link-provided-to-reset-your-password.'
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
                    <SafeFormatMessage id="Go-Back-Home" />
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

export default ResetPasswordPage
