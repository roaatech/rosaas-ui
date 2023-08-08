import React from 'react'
import {
  Card,
  Accordion,
  OverlayTrigger,
  Tooltip,
  Table,
} from '@themesberg/react-bootstrap'
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
    const { DataTransform, timeDifferenceFromNow } = useGlobal()

    const timeDifferenceLastCheck = timeDifferenceFromNow(
      item.healthCheckStatus.lastCheckDate
    )
    const timeDifferenceCheck = timeDifferenceFromNow(
      item.healthCheckStatus.checkDate
    )

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
                {item.healthCheckStatus.isHealthy == true ? (
                  <>
                    <span className="fw-normal">
                      <OverlayTrigger
                        trigger={['hover', 'focus']}
                        overlay={
                          <Tooltip>
                            {DataTransform(
                              item.healthCheckStatus.lastCheckDate
                            )}
                          </Tooltip>
                        }
                      >
                        <span>
                          {timeDifferenceLastCheck.hours < 24
                            ? `last checked ${timeDifferenceLastCheck.hours} hours and 
                          ${timeDifferenceLastCheck.minutes} minutes ago`
                            : `last checked at ${DataTransform(
                                item.healthCheckStatus.lastCheckDate
                              )}`}
                        </span>
                      </OverlayTrigger>
                    </span>
                  </>
                ) : (
                  <span className="fw-normal">
                    <OverlayTrigger
                      trigger={['hover', 'focus']}
                      overlay={
                        <Tooltip>
                          {DataTransform(item.healthCheckStatus.checkDate)} :{' '}
                          {DataTransform(item.healthCheckStatus.lastCheckDate)}
                        </Tooltip>
                      }
                    >
                      <span>
                        {timeDifferenceCheck.hours < 24
                          ? `since ${timeDifferenceCheck.hours} hours and ${timeDifferenceCheck.minutes} minutes,
                           last checked  ${timeDifferenceLastCheck.hours} hours and ${timeDifferenceLastCheck.minutes} minutes`
                          : ` since ${DataTransform(
                              item.healthCheckStatus.checkDate
                            )} , last checked ${DataTransform(
                              item.healthCheckStatus.lastCheckDate
                            )}`}
                      </span>
                    </OverlayTrigger>
                  </span>
                )}
              </span>
            </span>
          </span>
        </Accordion.Button>
        <Accordion.Body>
          <Card.Body className="py-0 px-0">
            <Card.Text className="mb-0 ">
              <Table
                responsive
                className="table-centered table-nowrap rounded mb-0"
              >
                <tbody>
                  <tr>
                    <td className="fw-bold firstTd">Url: </td>
                    <td className="d-flex align-items-center">
                      {item.healthCheckStatus.healthCheckUrl}
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-bold firstTd">Duration: </td>
                    <td>{item.healthCheckStatus.duration}</td>
                  </tr>

                  {item.healthCheckStatus.isHealthy == false ? (
                    <>
                      <span className="tableTitle">
                        External System Dispatch
                      </span>
                      <tr>
                        <td className="fw-bold firstTd">Is Successful: </td>
                        <td>
                          {
                            item.healthCheckStatus?.externalSystemDispatch
                              ?.IsSuccessful
                          }
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold firstTd">Url: </td>
                        <td>
                          {item.healthCheckStatus?.externalSystemDispatch?.Url}
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold firstTd">Dispatch Date: </td>
                        <td>
                          {DataTransform(
                            item.healthCheckStatus?.externalSystemDispatch
                              ?.DispatchDate
                          )}
                        </td>
                      </tr>
                    </>
                  ) : null}
                </tbody>
              </Table>
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
