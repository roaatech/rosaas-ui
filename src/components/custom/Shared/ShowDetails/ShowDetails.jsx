import React from 'react'
import { Modal, Button, Card, Table } from '@themesberg/react-bootstrap'
import { Wrapper } from './ShowDetails.styled.jsx'
import SafeFormatMessage from '../SafeFormatMessage/SafeFormatMessage.jsx'
import MetaDataAccordion from '../../tenant/MetaDataAccordion/MetaDataAccordion.jsx'
import DescriptionCell from '../DescriptionCell/DescriptionCell.jsx'

const ShowDetails = ({ data, setVisible, popupLabel }) => {
  // Render logic for specific fields like 'Action Details' or 'Description'
  const renderField = (key, value) => {
    console.log({ key })
    if (key === 'Action Details') {
      // Return the DescriptionCell component
      return <DescriptionCell data={{ description: value }} />
    }
    return value
  }

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
                {Object.keys(data).map((key, index) => (
                  <tr key={index}>
                    <td>
                      <SafeFormatMessage id={key} />
                    </td>
                    <td
                      className={`fw-bold ${
                        key === 'Description' || key == 'Action Details'
                          ? 'description'
                          : ''
                      }`}
                    >
                      {renderField(key, data[key])}
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
