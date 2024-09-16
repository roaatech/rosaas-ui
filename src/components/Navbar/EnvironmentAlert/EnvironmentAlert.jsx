import React, { useEffect, useState } from 'react'
import { Alert } from '@themesberg/react-bootstrap'
import useRequest from '../../../axios/apis/useRequest'
import { lowerCase } from 'lodash'
import { useDispatch } from 'react-redux' // Import dispatch
import { setEnvironmentAlertData } from '../../../store/slices/main' // Import the action

const EnvironmentAlert = () => {
  const { getEnvironment } = useRequest()
  const [environmentData, setEnvironmentData] = useState(null)
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

  const getVariant = (env) => {
    const lowerCasedEnv = lowerCase(env)

    switch (lowerCasedEnv) {
      case 'development':
        return 'warning'
      case 'stage':
        return 'info'
      case 'production':
        return 'success'
      case 'sandbox':
        return 'secondary'
      case 'localhost':
        return 'primary'
      default:
        return 'primary'
    }
  }

  if (environmentFromEnv === 'production') {
    return null // Do not render the alert in production
  }

  if (!environmentData) {
    return null
  }

  const { environmentFromRequest, requestDomain } = environmentData
  const currentEnvironment = getEnvironmentNameFromDomain(domain)
  const requestEnvironment = getEnvironmentNameFromRequestDomain(
    lowerCase(requestDomain)
  )

  const alertVariant = getVariant(currentEnvironment || environmentFromEnv)

  return (
    <Alert variant={alertVariant} style={{ width: '100% !important' }}>
      <div className="d-flex flex-row justify-content-around">
        <div>
          <strong>Environment from Request:</strong>{' '}
          {environmentFromRequest || 'Not available'}
        </div>

        <div>
          <strong>Environment from process.env:</strong>{' '}
          {environmentFromEnv || 'Not available'}
        </div>

        <div>
          <strong>Current URL:</strong> {domain}
        </div>

        <div>
          {' '}
          <strong>Request Domain:</strong> {requestEnvironment}
        </div>
      </div>
    </Alert>
  )
}

export default EnvironmentAlert
