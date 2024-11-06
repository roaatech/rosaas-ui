import React from 'react'
import { Card } from '@themesberg/react-bootstrap'
import NonEditableUrlItem from '../NonEditableUrlItem/NonEditableUrlItem'
import { Routes } from '../../../../routes'
import CodeBox from '../../Shared/CodeBox/CodeBox'
import SafeFormatMessage from '../../Shared/SafeFormatMessage/SafeFormatMessage' // Adjust import as needed

const FrontendIntegrationUrlsTab = ({ data }) => {
  const location = new URL(window.location.href)

  // Constructing the pricing URL
  const pricingUrl = `${location?.origin}${Routes.marketPlacePage.path}/${data.client?.systemName}/${data?.systemName}`

  // Code example for using the URL in an iframe
  const iframeExample = `
    <!-- This iframe embeds the pricing page directly into your application -->
    <iframe
      src="${pricingUrl}"           <!-- URL to the pricing page -->
      width="600"                   <!-- Width of the iframe -->
      height="400"                  <!-- Height of the iframe -->
      frameborder="0"               <!-- No border around the iframe -->
      allowfullscreen                <!-- Allow full-screen mode -->
      title="Pricing Page"          <!-- Title for accessibility -->
    >
      Your browser does not support iframes.
    </iframe>
  `

  return (
    <div className="main">
      <Card border="light" className="shadow-sm mb-4">
        <Card.Body className="p-4">
          <NonEditableUrlItem
            data={{
              method: 'PRICINGURL',
              path: pricingUrl,
            }}
          />
          <h5 className="mt-3">
            <SafeFormatMessage id="usage-example-title" />
          </h5>
          <p>
            <SafeFormatMessage id="usage-example-description" />
          </p>
          <CodeBox codeString={iframeExample.trim()} language="html" />
        </Card.Body>
      </Card>
    </div>
  )
}

export default FrontendIntegrationUrlsTab
