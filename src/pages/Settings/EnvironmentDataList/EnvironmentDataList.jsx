import React, { useEffect } from 'react'
import { Table, Card } from '@themesberg/react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import useRequest from '../../../axios/apis/useRequest'
import { setEnvironmentAlertData } from '../../../store/slices/main'
import { lowerCase } from 'lodash'
import Label from '../../../components/custom/Shared/label/Label'
import { Wrapper } from './EnvironmentDataList.styled'
import BreadcrumbComponent from '../../../components/custom/Shared/Breadcrumb/Breadcrumb'
import { BsGearFill } from 'react-icons/bs'
import SafeFormatMessage from '../../../components/custom/Shared/SafeFormatMessage/SafeFormatMessage'
import UpperContent from '../../../components/custom/Shared/UpperContent/UpperContent'
import { object } from 'yup'

const EnvironmentDataList = () => {
  const dispatch = useDispatch()
  const { getEnvironment } = useRequest()

  // Extract environment data from the store
  const environmentData = useSelector(
    (state) => state.main.environmentAlertData
  )

  const getEnvironmentNameFromDomain = (urlDomain) => {
    switch (urlDomain) {
      case 'dev.rosas.roaa.tech':
        return 'development'
      case 'api-stg.rosaas.app':
        return 'stage'
      case 'api-sb.rosaas.app':
        return 'sandbox'
      case 'api.rosaas.app':
        return 'production'
      case 'localhost':
        return 'localhost'
      default:
        return 'unknown'
    }
  }

  const getEnvironmentNameFromRequestDomain = (requestDomain) => {
    switch (requestDomain) {
      case 'dev-fe.rosas.roaatech.com':
        return 'development'
      case 'stg.rosaas.app':
        return 'stage'
      case 'sb.rosaas.app':
        return 'sandbox'
      case 'dashboard.rosaas.app':
        return 'production'
      case 'localhost':
        return 'localhost'
      default:
        return 'unknown'
    }
  }
  useEffect(() => {
    if (environmentData || Object.values(environmentData).length > 0) {
      return
    }
    const fetchEnvironmentData = async () => {
      try {
        const response = await getEnvironment()
        const endpointRequestUrl = response?.config.baseURL
        const endpointUrlObject = new URL(endpointRequestUrl)
        const apiHost = endpointUrlObject.hostname

        const currentUrl = window.location.href
        const urlObject = new URL(currentUrl)
        const frontendHost = urlObject.hostname

        const nodeEnv = process.env.NODE_ENV

        const environmentDetails = {
          apiEnv: response?.data,
          nodeEnv,
          frontendHost: getEnvironmentNameFromDomain(lowerCase(frontendHost)),
          apiHost: getEnvironmentNameFromRequestDomain(lowerCase(apiHost)),
        }

        dispatch(setEnvironmentAlertData(environmentDetails))
      } catch (error) {
        console.error('Error fetching environment data:', error)
      }
    }

    fetchEnvironmentData()
  }, [Object.keys(environmentData).length > 0])

  const getLabelDetails = (env) => {
    const lowerCasedEnv = lowerCase(env)
    switch (lowerCasedEnv) {
      case 'development':
        return { color: '#856404', background: '#fff3cd', value: 'Development' }
      case 'stage':
        return { color: '#0c5460', background: '#d1ecf1', value: 'Stage' }
      case 'production':
        return { color: '#155724', background: '#d4edda', value: 'Production' }
      case 'sandbox':
        return { color: '#383d41', background: '#e2e3e5', value: 'Sandbox' }
      case 'localhost':
        return { color: '#004085', background: '#cce5ff', value: 'Localhost' }
      default:
        return { color: '#004085', background: '#cce5ff', value: 'Unknown' }
    }
  }

  return (
    <>
      {' '}
      {environmentData && (
        <Wrapper>
          <BreadcrumbComponent
            breadcrumbInfo={'EnvironmentDataList'}
            icon={BsGearFill}
          />
          <UpperContent>
            <h4 className="m-0">
              <SafeFormatMessage id="Environment Info" />
            </h4>
          </UpperContent>
          <Card
            border="light"
            className="border-light table-wrapper table-responsive shadow-sm"
          >
            <Card.Body className="pt-0">
              <Table hover className="user-table align-items-center">
                <thead>
                  <tr>
                    <th>Frontend Host</th>
                    <th>Node Environment</th>
                    <th>API Environment</th>
                    <th>API Host</th>
                  </tr>
                </thead>
                <tbody>
                  {environmentData && (
                    <tr>
                      <td>
                        <Label
                          {...getLabelDetails(environmentData.frontendHost)}
                        />
                      </td>
                      <td>
                        <Label {...getLabelDetails(environmentData.nodeEnv)} />
                      </td>
                      <td>
                        <Label {...getLabelDetails(environmentData.apiEnv)} />
                      </td>
                      <td>
                        <Label {...getLabelDetails(environmentData.apiHost)} />
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Wrapper>
      )}
    </>
  )
}

export default EnvironmentDataList
