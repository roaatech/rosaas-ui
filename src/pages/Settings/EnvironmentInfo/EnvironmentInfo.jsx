import React, { useEffect } from 'react'
import { Table, Card, Col, Row, Container } from '@themesberg/react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import useRequest from '../../../axios/apis/useRequest'
import { setEnvironmentAlertData } from '../../../store/slices/main'
import { lowerCase } from 'lodash'
import Label from '../../../components/custom/Shared/label/Label'
import { Wrapper } from './EnvironmentInfo.styled'
import BreadcrumbComponent from '../../../components/custom/Shared/Breadcrumb/Breadcrumb'
import { BsGearFill } from 'react-icons/bs'
import SafeFormatMessage from '../../../components/custom/Shared/SafeFormatMessage/SafeFormatMessage'
import UpperContent from '../../../components/custom/Shared/UpperContent/UpperContent'
import { object } from 'yup'
import {
  getEnvironmentNameByApiHost,
  getEnvironmentNameByFrontendHost,
  getLabelDetails,
} from '../../../components/custom/Shared/SharedFunctions/environmentFunctions'

const EnvironmentInfo = () => {
  const dispatch = useDispatch()
  const { getEnvironment } = useRequest()

  const environmentData = useSelector(
    (state) => state.main.environmentAlertData
  )

  useEffect(() => {
    if (environmentData || Object.values(environmentData).length > 0) {
      return
    }
    const fetchEnvironmentData = async () => {
      try {
        const response = await getEnvironment()
        const endpointRequestUrl = response?.config.baseURL
        const endpointUrlObject = new URL(
          endpointRequestUrl,
          window.location.origin
        )
        const apiHost = endpointUrlObject.hostname

        const currentUrl = window.location.href
        const urlObject = new URL(currentUrl)
        const frontendHost = urlObject.hostname

        const nodeEnv = process.env.REACT_APP_ENV

        const environmentDetails = {
          apiEnv: response?.data,
          nodeEnv,
          frontendHost: getEnvironmentNameByFrontendHost(
            lowerCase(frontendHost)
          ),
          apiHost: getEnvironmentNameByApiHost(lowerCase(apiHost)),
        }

        dispatch(setEnvironmentAlertData(environmentDetails))
      } catch (error) {
        console.error('Error fetching environment data:', error)
      }
    }

    fetchEnvironmentData()
  }, [Object.keys(environmentData).length > 0])

  return (
    <>
      {environmentData && (
        <Wrapper>
          <BreadcrumbComponent
            breadcrumbInfo={'EnvironmentInfo'}
            icon={BsGearFill}
          />
          <UpperContent>
            <h4 className="m-0">
              <SafeFormatMessage id="Environment Info" />
            </h4>
          </UpperContent>
          <Container>
            <Card border="light" className="shadow-sm">
              <Card.Body className="py-2">
                <Row className="border-bottom  align-items-center py-2">
                  <Col
                    xs={3}
                    className="fw-bold d-flex align-items-center justify-content-center"
                  >
                    <SafeFormatMessage id="Frontend Host" />
                  </Col>
                  <Col
                    xs={3}
                    className="d-flex align-items-center justify-content-center"
                  >
                    <Label {...getLabelDetails(environmentData.frontendHost)} />
                  </Col>
                  <Col
                    xs={3}
                    className="d-flex align-items-center justify-content-center fw-bold"
                  >
                    {' '}
                    <SafeFormatMessage id="Node Environment" />
                  </Col>
                  <Col
                    xs={3}
                    className="d-flex align-items-center justify-content-center"
                  >
                    <Label {...getLabelDetails(environmentData.nodeEnv)} />
                  </Col>
                </Row>

                <Row className="align-items-center py-2">
                  <Col
                    xs={3}
                    className="d-flex align-items-center justify-content-center fw-bold"
                  >
                    {' '}
                    <SafeFormatMessage id="API Environment" />
                  </Col>
                  <Col
                    xs={3}
                    className="d-flex align-items-center justify-content-center"
                  >
                    <Label {...getLabelDetails(environmentData.apiEnv)} />
                  </Col>
                  <Col
                    xs={3}
                    className="d-flex align-items-center justify-content-center fw-bold"
                  >
                    {' '}
                    <SafeFormatMessage id="API Host" />
                  </Col>
                  <Col
                    xs={3}
                    className="d-flex align-items-center justify-content-center"
                  >
                    <Label {...getLabelDetails(environmentData.apiHost)} />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Container>
        </Wrapper>
      )}
    </>
  )
}

export default EnvironmentInfo
