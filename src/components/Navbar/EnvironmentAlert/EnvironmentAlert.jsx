import React, { useEffect, useState } from 'react'
import { Alert } from '@themesberg/react-bootstrap'
import useRequest from '../../../axios/apis/useRequest'
import { useDispatch } from 'react-redux'
import { setEnvironmentAlertData } from '../../../store/slices/main'

import Label from '../../custom/Shared/label/Label'
import {
  getEnvironmentNameByApiHost,
  getEnvironmentNameByFrontendHost,
  getLabelDetails,
} from '../../custom/Shared/SharedFunctions/environmentFunctions'

const EnvironmentAlert = () => {
  const { getEnvironment } = useRequest()
  const [environmentData, setEnvironmentData] = useState(null)
  const [showAlert, setShowAlert] = useState(true)
  const dispatch = useDispatch()

  const currentUrl = window.location.href
  const urlObject = new URL(currentUrl)

  const _nodeEnv = process.env.REACT_APP_ENV 

  useEffect(() => {
    if (!currentUrl || !_nodeEnv) {
      return
    }
    const fetchEnvironmentData = async () => {
      try {
        const response = await getEnvironment()
        const endpointRequestUrl = response?.config.baseURL
        const endpointUrlObject = new URL(endpointRequestUrl)

        const frontendHost = String(urlObject.hostname).toLowerCase()
        const environmentDetails = {
          nodeEnv: process.env.REACT_APP_ENV,
          frontendHost: getEnvironmentNameByFrontendHost(frontendHost),
          apiEnv: response?.data,
          apiHost: getEnvironmentNameByApiHost(
            String(endpointUrlObject.hostname).toLowerCase()
          ),
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
        backgroundColor: 'var(--alert-background)',
        zIndex: 1000,
        borderRadius: 0,
        border: 'none',
        marginBottom: '0px',
      }}
    >
      <div className="d-flex flex-row justify-content-around">
        <div>
          <strong>Dashboard Host:</strong>
          <Label
            className={'mx-2'}
            {...getLabelDetails(environmentData.frontendHost)}
          />
        </div>
        <div>
          <strong>NODE ENVIRONMENT:</strong>
          <Label
            className={'mx-2'}
            {...getLabelDetails(environmentData.nodeEnv)}
          />
        </div>
        <div>
          <strong>API ENVIRONMENT:</strong>
          <Label
            className={'mx-2'}
            {...getLabelDetails(environmentData.apiEnv)}
          />
        </div>
        <div>
          <strong>API Host:</strong>
          <Label
            className={'mx-2'}
            {...getLabelDetails(environmentData.apiHost)}
          />
        </div>
      </div>
    </Alert>
  )
}

export default EnvironmentAlert
