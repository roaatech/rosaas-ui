import { Col, Container, Row } from '@themesberg/react-bootstrap'
import { FormattedMessage } from 'react-intl'
import logo from '../../assets/img/brand/rosas.svg'
import SignUp from '../../components/custom/SignUp/SignUp'
import { Wrapper } from './ConfirmAccountPage.styled'
import { useLocation, useNavigate } from 'react-router-dom'
import CreateProductOwner from '../../components/custom/ProductOwner/ProductOwnerSignUp/ProductOwnerSignUp'
import { Routes } from '../../routes'
import ProductOwnerReg from '../../components/custom/ProductOwner/ProductOwnerReg/ProductOwnerReg'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'
import { BsBoxSeam, BsCheckCircle } from 'react-icons/bs'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import useRequest from '../../axios/apis/useRequest'
const ConfirmAccountPage = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const code = queryParams.get('code')
  const email = queryParams.get('email')
  const { confirmEmail } = useRequest()

  const userInfo = useSelector((state) => state.auth.userInfo)
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

      if (data.data.metadata.success == true) {
        setTimeout(() => {
          navigate(Routes.SignInTenantAdmin.path)
        }, 5000)
      }
    }

    confirmEmailRes()
    !isVerified && navigate(Routes.NotFound.path)
  }, [email, code, navigate])

  return (
    <Wrapper>
      {code && email && isVerified && (
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
      )}
    </Wrapper>
  )
}

export default ConfirmAccountPage
