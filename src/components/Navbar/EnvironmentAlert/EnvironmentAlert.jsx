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

  const _nodeEnv = process.env.NODE_ENV 


  const getEnvironmentNameByApiHost = (apiHost) => {
    switch (apiHost) {
      case 'dev.rosas.roaa.tech':
        return 'development'
      case "api-stg.rosaas.app":
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
    const lowerCasedEnv =  String(env).toLowerCase()
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
          color: '#ffffff',
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
          color: '#ffffff',
          background: '#c7c5c5',
          value: env,
        }
    }
  }

  useEffect(() => {
    if (!currentUrl || !_nodeEnv) {
      return
    }
    const fetchEnvironmentData = async () => {
      try {
        const response = await getEnvironment()
        const endpointRequestUrl = response?.config.baseURL
        const endpointUrlObject = new URL(endpointRequestUrl)

        const environmentDetails = {
          nodeEnv: process.env.NODE_ENV,
          frontendHost: getEnvironmentNameByFrontendHost(String(urlObject.hostname).toLowerCase()) ,
          apiEnv: response?.data,
          apiHost: getEnvironmentNameByApiHost(String(endpointUrlObject.hostname).toLowerCase()),
        }

        setEnvironmentData(environmentDetails)

        dispatch(setEnvironmentAlertData(environmentDetails))
      } catch (error) {
        console.error('Error fetching environment data:', error)
      }
    }

    fetchEnvironmentData()
  }, [currentUrl, _nodeEnv])
/*
  if (
    _nodeEnv &&
    ( String(_nodeEnv).toLowerCase() === 'production' || String(_nodeEnv).toLowerCase()  === 'prod')
  ) {
    return null
  }
*/
  if (!environmentData || !showAlert) {
    return null
  }

  return (
    <Alert
      variant={getLabelDetails(environmentData.apiHost).variant}
      dismissible
      onClose={() => setShowAlert(false)}
      style={{
        position: 'sticky',
        top: 0,
        left: 0,
        width: '100%',
        backgroundColor: '#ffab03d4',
        zIndex: 1000,
        borderRadius: 0,
        border: 'none',
        marginBottom: '0px',
      }}
    >
      <div className="d-flex flex-row justify-content-around">
        <div>
          <strong>Dashboard Host:</strong>
          <Label className={'mx-2'} {...getLabelDetails(environmentData.frontendHost)} />
        </div>
        <div>
          <strong>NODE ENVIRONMENT:</strong>
          <Label className={'mx-2'} {...getLabelDetails(environmentData.nodeEnv)} />
        </div>
        <div>
          <strong>API ENVIRONMENT:</strong>
          <Label className={'mx-2'} {...getLabelDetails(environmentData.apiEnv)} />
        </div>
        <div>
          <strong>API Host:</strong>
          <Label className={'mx-2'} {...getLabelDetails(environmentData.apiHost)} />
        </div>
      </div>
    </Alert>
  )
}

export default EnvironmentAlert
