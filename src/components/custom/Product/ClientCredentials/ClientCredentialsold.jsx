import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faCopy } from '@fortawesome/free-solid-svg-icons'
import { Col, Row } from '@themesberg/react-bootstrap'

const ClientCredentialsOld = () => {
  const clientId = 'roaa_osos_external_system'
  const clientSecret =
    'EHMcQfTjWnZr4u7ADFJaNdRgUkXp2s5v8yBEHKbPeShVmYq3t6wZH3B4M9'
  const [showSecret, setShowSecret] = useState(false)

  const handleToggleShowSecret = () => {
    setShowSecret(!showSecret)
  }

  const handleCopyToClipboard = (value) => {
    navigator.clipboard.writeText(value)
  }

  return (
    <div>
      <Row>
        <Col sm={6} className="mb-3">
          <label>Client ID:</label>

          <div className="input-group">
            <input
              type="text"
              className="form-control"
              value={clientId}
              readOnly
            />

            <span className="input-group-text">
              <FontAwesomeIcon
                icon={faCopy}
                onClick={() => handleCopyToClipboard(clientId)}
              />
            </span>
          </div>
        </Col>

        <Col sm={6} className="mb-3">
          <label>Client Secret:</label>
          <div className="input-group">
            <input
              type={showSecret ? 'text' : 'password'}
              value={showSecret ? clientSecret : '******'}
              className="form-control"
              readOnly
            />
          </div>{' '}
          <span className="input-group-text">
            <FontAwesomeIcon
              icon={showSecret ? faEyeSlash : faEye}
              onClick={handleToggleShowSecret}
            />
            <FontAwesomeIcon
              icon={faCopy}
              onClick={() => handleCopyToClipboard(clientSecret)}
            />{' '}
          </span>
        </Col>
      </Row>
    </div>
  )
}

export default ClientCredentialsOld
