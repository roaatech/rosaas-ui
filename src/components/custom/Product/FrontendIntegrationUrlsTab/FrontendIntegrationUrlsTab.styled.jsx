import React from 'react'
import { Card, Col, Row } from '@themesberg/react-bootstrap'
import { Wrapper } from './FrontendIntegrationUrlsTab.styled'
import NonEditableUrlItem from '../NonEditableUrlItem/NonEditableUrlItem'
import { Routes } from '../../../../routes'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism'

const FrontendIntegrationUrlsTab = ({ data }) => {
  const location = window.location.href

  // Constructing the pricing URL
  const pricingUrl = `${location}${Routes.marketPlacePage.path}/${data.client?.systemName}/${data?.systemName}`

  // Detailed code example for using the URL in an iframe
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
    <Wrapper>
      <div className="main">
        <div className="details">
          <Row>
            <Col md={12} className="my-2">
              <Card>
                <Card.Body>
                  <NonEditableUrlItem
                    data={{
                      method: 'PRICINGURL',
                      path: pricingUrl,
                    }}
                  />
                  <h5 className="mt-3">Usage Example:</h5>
                  <p>
                    This example shows how to embed the pricing page within an
                    iframe. Adjust the width and height as needed.
                  </p>
                  <SyntaxHighlighter language="html" style={solarizedlight}>
                    {iframeExample}
                  </SyntaxHighlighter>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </Wrapper>
  )
}

export default FrontendIntegrationUrlsTab
