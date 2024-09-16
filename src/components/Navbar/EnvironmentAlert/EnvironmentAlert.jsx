import React, { useEffect, useState } from 'react'
import { Alert } from '@themesberg/react-bootstrap'
import useRequest from '../../../axios/apis/useRequest'
import { lowerCase } from 'lodash'
import { useDispatch } from 'react-redux'
import { setEnvironmentAlertData } from '../../../store/slices/main'
import {
  FaExclamationTriangle,
  FaInfoCircle,
  FaCheckCircle,
  FaCogs,
  FaHome,
} from 'react-icons/fa'
import Label from '../../custom/Shared/label/Label'

const EnvironmentAlert = () => {
  const { getEnvironment } = useRequest()
  const [environmentData, setEnvironmentData] = useState(null)
  const [showAlert, setShowAlert] = useState(true)
  const dispatch = useDispatch()

  const currentUrl = window.location.href
  const urlObject = new URL(currentUrl)
  const frontendHost = urlObject.hostname

  const nodeEnv = process.env.NODE_ENV

  const getEnvironmentNameByApiHost = (apiHost) => {
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

  const getEnvironmentNameByFrontendHost = (frontendHost) => {
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

  useEffect(() => {
    if (!currentUrl || !nodeEnv) {
      return
    }
    const fetchEnvironmentData = async () => {
      try {
        const response = await getEnvironment()
        const endpointRequestUrl = response?.config.baseURL
        const endpointUrlObject = new URL(endpointRequestUrl)
        const apiHost = endpointUrlObject.hostname

        const environmentDetails = {
          apiEnv: response?.data,
          nodeEnv,
          frontendHost: getEnvironmentNameByFrontendHost(lowerCase(frontendHost)),
          apiHost: getEnvironmentNameByApiHost(lowerCase(apiHost)),
        }

        setEnvironmentData(environmentDetails)

        dispatch(setEnvironmentAlertData(environmentDetails))
      } catch (error) {
        console.error('Error fetching environment data:', error)
      }
    }

    fetchEnvironmentData()
  }, [currentUrl, nodeEnv])

  if (
    nodeEnv &&
    (lowerCase(nodeEnv) === 'production' || lowerCase(nodeEnv) === 'prod')
  ) {
    return null
  }

  if (!environmentData || !showAlert) {
    return null
  }

  const { apiEnv, apiHost } = environmentData

  const currentEnvironment = getEnvironmentNameByApiHost(lowerCase(frontendHost))
  const requestEnvironment = getEnvironmentNameByFrontendHost(lowerCase(apiHost))

  return (
    <Alert
      variant={getLabelDetails(currentEnvironment).variant}
      dismissible
      onClose={() => setShowAlert(false)}
      style={{
        position: 'sticky',
        top: 0,
        left: 0,
        width: '100%',
        backgroundColor: 'var(--second-color-1)',
        zIndex: 1000,
        borderRadius: 0,
        border: 'none',
        marginBottom: '0px',
      }}
    >
      <div className="d-flex flex-row justify-content-around">
        <div>
          <strong>Dashboard Host:</strong>
          <Label className={'mx-2'} {...getLabelDetails(frontendHost)} />
        </div>
        <div>
          <strong>NODE ENVIRONMENT:</strong>
          <Label className={'mx-2'} {...getLabelDetails(nodeEnv)} />
        </div>
        <div>
          <strong>API ENVIRONMENT:</strong>
          <Label className={'mx-2'} {...getLabelDetails(apiEnv)} />
        </div>
        <div>
          <strong>API Host:</strong>
          <Label className={'mx-2'} {...getLabelDetails(requestEnvironment)} />
        </div>
      </div>
    </Alert>
  )
}

export default EnvironmentAlert
