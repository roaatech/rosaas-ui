import React, { useState } from 'react'
import {
  Card,
  Modal,
  OverlayTrigger,
  Tooltip,
} from '@themesberg/react-bootstrap'
import NonEditableUrlItem from '../NonEditableUrlItem/NonEditableUrlItem'
import { Routes } from '../../../../routes'
import CodeBox from '../../Shared/CodeBox/CodeBox'
import SafeFormatMessage from '../../Shared/SafeFormatMessage/SafeFormatMessage' // Adjust import as needed
import { AiOutlineEye } from 'react-icons/ai'
import { useIntl } from 'react-intl'

const FrontendIntegrationUrlsTab = ({ data }) => {
  const [showPreview, setShowPreview] = useState(false)
  const location = new URL(window.location.href)
  const intl = useIntl()
  // Constructing the pricing URL
  const pricingUrl = `${location?.origin}${Routes.marketPlacePage.path}/${data.client?.systemName}/${data?.systemName}`

  // Code example for using the URL in an iframe
  const iframeExample = `
  <!-- This iframe embeds the pricing page directly into your application -->
  <iframe
    src="${pricingUrl}?lang=${intl.locale}"           <!-- URL to the pricing page -->
    width="600"                   <!-- Width of the iframe -->
    height="400"                  <!-- Height of the iframe -->
    frameborder="0"               <!-- No border around the iframe -->
    allowfullscreen                <!-- Allow full-screen mode -->
    title="Pricing Page"          <!-- Title for accessibility -->
  >
    Your browser does not support iframes.
  </iframe>

  <!-- Note: 
       The 'lang' query parameter determines the default language of the embedded page. 
       Supported values: 
         - 'en' for English
         - 'ar' for Arabic 
  -->
`

  const handlePreview = () => {
    setShowPreview(true)
  }

  const handleClosePreview = () => {
    setShowPreview(false)
  }

  return (
    <div className="main">
      <Card border="light" className="shadow-sm mb-4">
        <Card.Body className="p-4">
          <NonEditableUrlItem
            data={{
              method: 'PRICINGURL',
              path: pricingUrl,
            }}
            showNavigationIcon={true}
          />
          <h5 className="mt-3">
            <SafeFormatMessage id="usage-example-title" />
            <OverlayTrigger
              trigger={['hover', 'focus']}
              placement="top"
              overlay={
                <Tooltip>
                  <div style={{ minWidth: '100px' }}>
                    <SafeFormatMessage id="Preview-Description" />
                  </div>
                </Tooltip>
              }
            >
              <span
                className="preview-icon ml-3"
                style={{ cursor: 'pointer' }}
                onClick={handlePreview}
              >
                <AiOutlineEye size={20} />
              </span>
            </OverlayTrigger>
          </h5>
          <p>
            <SafeFormatMessage id="usage-example-description" />
          </p>
          <CodeBox codeString={iframeExample.trim()} language="html" />
        </Card.Body>
      </Card>

      {/* Modal for Preview */}
      <Modal show={showPreview} onHide={handleClosePreview} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <SafeFormatMessage id="preview-title" defaultMessage="Preview" />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <iframe
            src={`${pricingUrl}?lang=${intl.locale}`}
            width="100%"
            height="400"
            frameBorder="0"
            allowFullScreen
            title="Pricing Page"
          >
            Your browser does not support iframes.
          </iframe>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleClosePreview}>
            <SafeFormatMessage id="close-button" defaultMessage="Close" />
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default FrontendIntegrationUrlsTab
