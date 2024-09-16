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
} from 'react-icons/fa' // Icons for different environments
import Label from '../../custom/Shared/label/Label'

const EnvironmentAlert = () => {
  const { getEnvironment } = useRequest()
  const [environmentData, setEnvironmentData] = useState(null)
  const [showAlert, setShowAlert] = useState(true) // State to control alert visibility
  const dispatch = useDispatch() // Initialize dispatch

  const currentUrl = window.location.href // Get the current URL
  const urlObject = new URL(currentUrl)
  const domain = urlObject.hostname // Extract the domain

  const environmentFromEnv =
    process.env.NODE_ENV || process.env.ASPNETCORE_ENVIRONMENT // Get environment from process.env

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

  const getLabelDetails = (env) => {
    const lowerCasedEnv = lowerCase(env)
    switch (lowerCasedEnv) {
      case 'development':
        return {
          color: '#856404',
          background: '#fff3cd',
          value: 'Development',
        }
      case 'stage':
        return {
          color: '#0c5460',
          background: '#d1ecf1',
          value: 'Stage',
        }
      case 'production':
        return {
          color: '#155724',
          background: '#d4edda',
          value: 'Production',
        }
      case 'sandbox':
        return {
          color: '#383d41',
          background: '#e2e3e5',
          value: 'Sandbox',
        }
      case 'localhost':
        return {
          color: '#004085',
          background: '#cce5ff',
          value: 'Localhost',
        }
      default:
        return {
          color: '#004085',
          background: '#cce5ff',
          value: 'Unknown',
        }
    }
  }

  useEffect(() => {
    if (!currentUrl || !environmentFromEnv) {
      return
    }
    const fetchEnvironmentData = async () => {
      try {
        const response = await getEnvironment()
        const endpointRequestUrl = response?.config.baseURL
        const endpointUrlObject = new URL(endpointRequestUrl)
        const requestDomain = endpointUrlObject.hostname

        const environmentDetails = {
          environmentFromRequest: response?.data,
          environmentFromProcessEnv: environmentFromEnv,
          urlDomain: domain,
          requestDomain,
        }

        setEnvironmentData(environmentDetails)

        dispatch(setEnvironmentAlertData(environmentDetails)) // Dispatch to Redux store
      } catch (error) {
        console.error('Error fetching environment data:', error)
      }
    }

    fetchEnvironmentData()
  }, [currentUrl, environmentFromEnv])

  if (environmentFromEnv === 'production') {
    return null
  }

  if (!environmentData || !showAlert) {
    return null
  }

  const { environmentFromRequest, requestDomain } = environmentData
  const currentEnvironment = getEnvironmentNameFromDomain(domain)
  const requestEnvironment = getEnvironmentNameFromRequestDomain(
    lowerCase(requestDomain)
  )

  return (
    <Alert
      variant={getLabelDetails(currentEnvironment).variant}
      dismissible
      onClose={() => setShowAlert(false)} // Handle closing of the alert
      style={{
        position: 'sticky',
        top: 0,
        left: 0,
        width: '100%',
        backgroundColor: 'var(--second-color-1)',
        zIndex: 1000,
        borderRadius: 0,
        border: 'none',
      }}
    >
      <div className="d-flex flex-row justify-content-around">
        <div>
          <strong>Dashboard:</strong>
          <Label className={'mx-2'} {...getLabelDetails(domain)} />
        </div>
        <div>
          <strong>NODE ENVIRONMENT:</strong>
          <Label className={'mx-2'} {...getLabelDetails(environmentFromEnv)} />
        </div>
        <div>
          <strong>API ENVIRONMENT:</strong>
          <Label
            className={'mx-2'}
            {...getLabelDetails(environmentFromRequest)}
          />
        </div>
        <div>
          <strong>API URL:</strong>
          <Label className={'mx-2'} {...getLabelDetails(requestEnvironment)} />
        </div>
      </div>
    </Alert>
  )
}

export default EnvironmentAlert
