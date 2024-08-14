import React, { useState } from 'react'
import { Modal, Button, Form } from '@themesberg/react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { FormattedMessage } from 'react-intl'
import { BsCheckCircleFill, BsInfoCircle } from 'react-icons/bs'
import { Wrapper } from './GenerateNavigationLinkModal.styled'
import { useSelector } from 'react-redux'

const GenerateNavigationLinkModal = ({ setVisible, navigationLink }) => {
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(navigationLink)
  }
  const direction = useSelector((state) => state.main.direction)

  return (
    <Wrapper>
      <Form>
        <Modal.Header>
          <Modal.Title>
            <>
              <FormattedMessage id="Link-generated-successfully" />{' '}
              <BsCheckCircleFill
                style={{ color: 'green', marginLeft: '5px' }}
              />
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
              <FormattedMessage id="Navigation-Link" />
            </Form.Label>
            <div
              className={
                direction == 'rtl'
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
              <FormattedMessage id="The-validity-period-for-this-link-extends-for-a-duration-of-24-hours" />
            </p>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setVisible(false)}>
            <FormattedMessage id="Close" />
          </Button>
        </Modal.Footer>
      </Form>
    </Wrapper>
  )
}

export default GenerateNavigationLinkModal
