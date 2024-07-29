import { Col, Container, Row } from '@themesberg/react-bootstrap'
import { FormattedMessage } from 'react-intl'
import logo from '../../assets/img/brand/rosas.svg'
import { Wrapper } from './ConfirmAccountPage.styled'
import { useLocation, useNavigate } from 'react-router-dom'
import { Routes } from '../../routes'
import { BsCheckCircle } from 'react-icons/bs'
import { useEffect, useState } from 'react'
import useRequest from '../../axios/apis/useRequest'
import NotFound from '../NotFoundPage/NotFoundPage'
const ConfirmAccountPage = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const code = queryParams.get('code')
  const email = queryParams.get('email')
  const { confirmEmail } = useRequest()
  const navigate = useNavigate()
  const [isVerified, setIsVerified] = useState(false)
  useEffect(() => {
    if (!email || !code) {
      navigate(Routes.NotFound.path)
      return
    }

    const confirmEmailRes = async () => {
      const data = await confirmEmail({ email, code })
      setIsVerified(data.data.metadata.success == true)

      setTimeout(() => {
        navigate(Routes.SignInTenantAdmin.path)
      }, 5000)
    }

    confirmEmailRes()
  }, [email, code, navigate])
  const [showNotFound, setShowNotFound] = useState(false)
  setTimeout(() => {
    setShowNotFound(true)
  }, 500)

  return (
    <>
      {code && email && isVerified ? (
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
                      <h3
                        style={{ color: 'green', marginRight: '10px' }}
                        className="mb-0"
                      >
                        <BsCheckCircle />
                        {'  '}
                        <FormattedMessage id="Account-Verified" />
                      </h3>
                    </div>
                    <p className="text-center">
                      <FormattedMessage id="Your-account-has-been-confirmed-successfully." />
                    </p>
                    <p className="text-center">
                      <FormattedMessage id="You-can-now-log-in-with-your-account." />
                    </p>
                  </div>
                </Col>
              </Row>
            </Container>
          </section>
        </Wrapper>
      ) : (
        <>{showNotFound && <NotFound />}</>
      )}
    </>
  )
}

export default ConfirmAccountPage
