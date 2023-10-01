import React from 'react'
import { Modal, Button, Card, Table } from '@themesberg/react-bootstrap'
import { Wrapper } from './ShowDetails.styled.jsx'
import { FormattedMessage } from 'react-intl'

const ShowDetails = ({ data, setVisible, popupLabel }) => {
  console.log({ data })
  return (
    <Wrapper>
      <div>
        <Modal.Header>
          <Modal.Title className="h6">{popupLabel}</Modal.Title>
          <Button
            variant="close"
            aria-label="Close"
            onClick={() => setVisible(false)}
          />
        </Modal.Header>
        <Modal.Body>
          <Card.Body className="p-0">
            <Table
              responsive
              className="table-centered table-nowrap rounded mb-0"
              style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
            >
              <tbody>
                {Object.keys(data).map((item, index) => (
                  <tr key={index}>
                    <td>
                      <FormattedMessage id={item} />
                    </td>
                    <td
                      className={`fw-bold ${
                        item === 'Description' ? 'description' : ''
                      }`}
                    >
                      {data[item]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Modal.Body>
      </div>
    </Wrapper>
  )
}

export default ShowDetails
