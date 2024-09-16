import React, { useEffect } from 'react'
import { Table, Card } from '@themesberg/react-bootstrap'
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

const EnvironmentInfo = () => {
  const dispatch = useDispatch()
  const { getEnvironment } = useRequest()

  // Extract environment data from the store
  const environmentData = useSelector(
    (state) => state.main.environmentAlertData
  )

  const getEnvironmentNameByFrontendHost = (apiHost) => {
    switch (apiHost) {
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
        return apiHost
    }
  }

  const getEnvironmentNameByApiHost = (frontendHost) => {
    switch (frontendHost) {
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
        return frontendHost
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
          frontendHost: getEnvironmentNameByFrontendHost(lowerCase(frontendHost)),
          apiHost: getEnvironmentNameByApiHost(lowerCase(apiHost)),
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
        return {
          color: '#ffffff',
          background: '#00b1f7',
          value: 'Development',
        }
      case 'stage':
        return {
          color: '#ffffff',
          background: '#9623db',
          value: 'Stage',
        }
      case 'production':
        return {
          color: '#963131',
          background: '#1ca57b',
          value: 'Production',
        }
      case 'sandbox':
        return {
          color: '#ffffff',
          background: '#f7a200',
          value: 'Sandbox',
        }
      case 'localhost':
        return {
          color: '#ffffff',
          background: '#db2323',
          value: 'Localhost',
        }
      default:
        return {
          color: '#171a26',
          background: '#c7c5c5',
          value: env,
        }
    }
  }

  return (
    <>
      {' '}
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

export default EnvironmentInfo
