import React from 'react'
import { Card, Accordion } from '@themesberg/react-bootstrap'

const MetaDataAccordion = (props) => {
  const { defaultKey, data = [], className = '' } = props

  const AccordionItem = (item) => {
    const { eventKey, title, description } = item
    return (
      <Accordion.Item eventKey={eventKey}>
        <Accordion.Button
          variant="link"
          className="w-100 d-flex justify-content-between accordionButton"
        >
          <span className=" mb-0 fw-bold">{title}</span>
        </Accordion.Button>
        <Accordion.Body>
          <Card.Body className="py-0 px-0">
            <Card.Text className="mb-0">{description}</Card.Text>
          </Card.Body>
        </Accordion.Body>
      </Accordion.Item>
    )
  }

  return (
    <>
      {data && (
        <Accordion className={className} defaultActiveKey={defaultKey}>
          {data?.map((d, index) => (
            <AccordionItem key={`accordion-${index}`} {...d} />
          ))}
        </Accordion>
      )}
    </>
  )
}

export default MetaDataAccordion
