import React from 'react'
import { Container, Row, Col } from '@themesberg/react-bootstrap'
import { FaExclamationCircle } from 'react-icons/fa'
import styled from 'styled-components'
import {
  CanceledAccountIcon,
  CanceledAccountMessage,
  CanceledAccountWrapper,
} from './CanceledAccount.styled'

const CanceledAccount = () => {
  return (
    <CanceledAccountWrapper fluid>
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <CanceledAccountMessage>
            <CanceledAccountIcon />
            <h3>Your Account Has Been Deactivated</h3>
            <p>
              We regret to inform you that your account has been deactivated.
              For more details or assistance, please contact our support team.
            </p>
          </CanceledAccountMessage>
        </Col>
      </Row>
    </CanceledAccountWrapper>
  )
}

export default CanceledAccount
