import React from 'react'
import { Card, Accordion } from '@themesberg/react-bootstrap'
import Label from '../../Shared/label/Label'
import useGlobal from '../../../../lib/hocks/global'
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
    const { DataTransform } = useGlobal()

    return (
      <Accordion.Item eventKey={'eventKey'}>
        <Accordion.Button
          variant="link"
          className="w-100 d-flex justify-content-between"
        >
          <span className=" mb-0 fw-bold d-flex   w-100">
            <span className="firstTd">Health Check Status </span>
            <span className="mr-2">
              <span className="mr-2">
                <Label
                  className="mr-2"
                  {...HealthStatus[item.healthCheckStatus.isHealthy]}
                />
              </span>
              <span>
                {item.healthCheckStatus.isHealthy == true
                  ? `last checked at ${DataTransform(
                      item.healthCheckStatus.lastCheckDate
                    )}`
                  : ` since ${DataTransform(
                      item.healthCheckStatus.checkDate
                    )} , last checked ${DataTransform(
                      item.healthCheckStatus.lastCheckDate
                    )}`}
              </span>
            </span>
          </span>
        </Accordion.Button>
        <Accordion.Body>
          <Card.Body className="py-0 px-0">
            <Card.Text className="mb-0 ">
              <span className="">
                <span>Url: </span>
                <span>{item.healthCheckStatus.healthCheckUrl}</span>
              </span>
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
