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
  const isHour = (hour) => (hour.hours > 0 ? `${hour.hours} hours and` : '')

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
    const time = (date) => {
      const timeDifference = timeDifferenceFromNow(date)

      return timeDifference.hours < 24
        ? `last checked ${isHour(timeDifference.hours)}
    
        ${
          timeDifference.minutes < 1
            ? 'a few seconds'
            : timeDifference.minutes + ' minutes'
        }  `
        : `last checked at ${DataTransform(date)}`
    }

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
                          {time(item.healthCheckStatus.lastCheckDate)}
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
                          Since{' '}
                          {DataTransform(item.healthCheckStatus.checkDate)},
                          last checked{' '}
                          {DataTransform(item.healthCheckStatus.lastCheckDate)}
                        </Tooltip>
                      }
                    >
                      <span>
                        {timeDifferenceCheck.hours < 24
                          ? `since ${isHour(timeDifferenceCheck.hours)} ${
                              timeDifferenceCheck.minutes < 1
                                ? 'a few seconds'
                                : timeDifferenceCheck.minutes + ' minutes'
                            } minutes,
                           last checked  ${isHour(
                             timeDifferenceLastCheck.hours
                           )}   ${
                              timeDifferenceLastCheck.minutes < 1
                                ? 'a few seconds'
                                : timeDifferenceLastCheck.minutes + ' minutes'
                            } `
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
                </tbody>
              </Table>
              {item.healthCheckStatus.isHealthy == false &&
              item.healthCheckStatus?.externalSystemDispatch ? (
                <div className="dispatchCont">
                  <Card border="light" className="shadow-sm mt-3">
                    <Card.Body>
                      <div className="d-flex align-items-center justify-content-between border-bottom border-light pb-3">
                        <div>
                          <h6>External System Dispatch</h6>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between border-bottom border-light py-3">
                        <div className="mb-0">Is Successful:</div>
                        <div className="small card-stats">
                          {item.healthCheckStatus?.externalSystemDispatch?.isSuccessful.toString()}
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between border-bottom border-light py-3">
                        <div className="mb-0">Url:</div>
                        <div className="small card-stats">
                          {item.healthCheckStatus?.externalSystemDispatch?.url}
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between border-bottom border-light py-3">
                        <div className="mb-0">Dispatch Date:</div>
                        <div className="small card-stats">
                          {DataTransform(
                            item.healthCheckStatus?.externalSystemDispatch
                              ?.dispatchDate
                          )}
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              ) : null}
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
