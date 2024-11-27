import React, { useState } from 'react'
import { Modal, Button, Form } from '@themesberg/react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FormattedMessage } from 'react-intl'
import { BsCheckCircleFill, BsInfoCircle } from 'react-icons/bs'
import { Wrapper } from './GenerateNavigationLinkModal.styled'
import { useSelector } from 'react-redux'
import SafeFormatMessage from '../../Shared/SafeFormatMessage/SafeFormatMessage'

const GenerateNavigationLinkModal = ({ setVisible, navigationLink }) => {
  const handleCopyToClipboard = () => {
    if (navigationLink) {
      navigator.clipboard.writeText(navigationLink)
    }
  }

  const direction = useSelector((state) => state.main.direction)

  return (
    <Wrapper>
      {navigationLink ? (
        <Form>
          <Modal.Header>
            <Modal.Title>
              <>
                <BsCheckCircleFill
                  style={{ color: 'green', marginLeft: '5px' }}
                />
                <span style={{ color: 'green', marginLeft: '5px' }}>
                  <SafeFormatMessage id="Link-generated-successfully" />{' '}
                </span>
              </>
            </Modal.Title>
            <Button
              variant="close"
              aria-label="Close"
              onClick={() => setVisible(false)}
            />
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>
                <SafeFormatMessage id="Navigation-Link" />
              </Form.Label>
              <div
                className={
                  direction === 'rtl'
                    ? 'input-group input-group-rtl'
                    : 'input-group'
                }
              >
                <input
                  type="text"
                  className="form-control"
                  value={navigationLink}
                  readOnly
                />
                <span className="input-group-text">
                  <FontAwesomeIcon
                    icon={faCopy}
                    onClick={handleCopyToClipboard}
                    style={{ cursor: 'pointer' }}
                  />
                </span>
              </div>
              <p className="font-small my-2">
                <BsInfoCircle style={{ color: 'orange' }} />{' '}
                <SafeFormatMessage id="The-validity-period-for-this-link-extends-for-a-duration-of-24-hours" />
              </p>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setVisible(false)}>
              <SafeFormatMessage id="Close" />
            </Button>
          </Modal.Footer>
        </Form>
      ) : (
        <Form>
          <Modal.Header>
            <Modal.Title>
              <>
                <FontAwesomeIcon
                  icon={faSpinner}
                  spin
                  style={{ color: 'orange', marginRight: '10px' }}
                />
                <span style={{ color: 'orange', marginRight: '10px' }}>
                  {' '}
                  <SafeFormatMessage id="Link-in-progress" />
                </span>
              </>
            </Modal.Title>
            <Button
              variant="close"
              aria-label="Close"
              onClick={() => setVisible(false)}
            />
          </Modal.Header>
          <Modal.Body>
            <p>
              <SafeFormatMessage id="The-navigation-link-is-being-generated-or-unavailable-please-await-or-try-again-later" />
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setVisible(false)}>
              <SafeFormatMessage id="Close" />
            </Button>
          </Modal.Footer>
        </Form>
      )}
    </Wrapper>
  )
}

export default GenerateNavigationLinkModal
