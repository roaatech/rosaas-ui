import React from 'react'
import { Card, Accordion } from '@themesberg/react-bootstrap'
import Label from '../../Shared/label/Label'
import {
  BsFillCheckCircleFill,
  BsFillExclamationCircleFill,
} from 'react-icons/bs'

const HealthCheckAccordion = ({ defaultKey, data = [], className = '' }) => {
  const AccordionItem = (item) => {
    const HealthStatus = {
      true: {
        background: '#eff9f6',
        value: 'Healthy',
        color: '#00a675',
        icon: <BsFillCheckCircleFill />,
      },
      false: {
        background: '#f5e8e4',
        value: 'Unhealthy',
        color: '#d26b4e',
        icon: <BsFillExclamationCircleFill />,
      },
    }

    return (
      <Accordion.Item eventKey={'eventKey'}>
        <Accordion.Button
          variant="link"
          className="w-100 d-flex justify-content-between"
        >
          <span className="h6 mb-0 fw-bold d-flex justify-content-between  w-100">
            <span>Health Check Accordion</span>
            <span className="mr-2">
              <Label {...HealthStatus[item.healthCheckStatus.isHealthy]} />
            </span>
          </span>
        </Accordion.Button>
        <Accordion.Body>
          <Card.Body className="py-0 px-0">
            <Card.Text className="mb-0">
              {item.healthCheckStatus.healthCheckUrl}
            </Card.Text>
          </Card.Body>
        </Accordion.Body>
      </Accordion.Item>
    )
  }

  return (
    <Accordion className={className} defaultActiveKey={defaultKey}>
      {data.map((d) => (
        <AccordionItem key={`accordion-${d.id}`} {...d} />
      ))}
    </Accordion>
  )
}

export default HealthCheckAccordion
