import React from 'react'
import {
  Modal,
  Button,
  Card,
  Table,
  Container,
  Row,
  Col,
} from '@themesberg/react-bootstrap'
import { Wrapper } from './ShowDetails.styled.jsx'
import SafeFormatMessage from '../SafeFormatMessage/SafeFormatMessage.jsx'
import ReactJson from 'react-json-view'

const ShowDetails = ({
  data,
  setVisible,
  popupLabel,
  style = {},
  titleStyle = {},
  className = {},
}) => {
  const RowExpansionTemplate = ({ data }) => {
    let parsedData
    try {
      parsedData = JSON.parse(data)
    } catch (error) {
      console.error('Error parsing JSON:', error)
      parsedData = { ERROR: 'Invalid JSON data' }
    }

    return (
      <div>
        <Card border="light" className="border-0">
          <Card.Body className="p-0 description">
            <ReactJson src={parsedData} name={false} />
          </Card.Body>
        </Card>
      </div>
    )
  }

  const renderField = (key, value) => {
    if (key === 'Action Details') {
      return <RowExpansionTemplate data={value} />
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
                    <td style={titleStyle[key] || {}}>
                      <SafeFormatMessage id={key} />
                    </td>
                    <td
                      className={`fw-bold ${className[key] || ''} ${
                        key === 'Description' || key === 'Action Details'
                          ? 'description'
                          : ''
                      }`}
                      style={style[key] || {}}
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
