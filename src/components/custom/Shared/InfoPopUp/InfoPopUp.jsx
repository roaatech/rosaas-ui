import React from 'react'

import { Modal, Button } from '@themesberg/react-bootstrap'
import { Form } from '@themesberg/react-bootstrap'
import { FormattedMessage } from 'react-intl'

const InfoPopUp = ({ setVisible, popupLabel, info }) => {
  return (
    <>
      <Form>
        <Modal.Header>
          <Modal.Title className="h6">{popupLabel}</Modal.Title>
          <Button
            variant="close"
            aria-label="Close"
            onClick={() => setVisible(false)}
          />
        </Modal.Header>
        <Modal.Body>{info}</Modal.Body>
      </Form>
    </>
  )
}

export default InfoPopUp
