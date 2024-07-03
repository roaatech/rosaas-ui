import { Col, Container, Row } from '@themesberg/react-bootstrap'
import { FormattedMessage } from 'react-intl'
import logo from '../../assets/img/brand/rosas.svg'
import SignUp from '../../components/custom/SignUp/SignUp'
import { Wrapper } from './SignUpPage.styled'

const SignUpPage = () => {
  return (
    <Wrapper>
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
                    <FormattedMessage id="signUpTo" />{' '}
                    <span className="rosaas">RoSaaS</span>
                  </h3>
                </div>

                <SignUp />
              </div>
            </Col>
          </Row>

          <div className="copy">
            COPYRIGHT <span className="yellow">&copy;</span> 2023 ROAA
            INFORMATION TECHNOLOGY
          </div>
        </Container>
      </section>
    </Wrapper>
  )
}
export default SignUpPage
