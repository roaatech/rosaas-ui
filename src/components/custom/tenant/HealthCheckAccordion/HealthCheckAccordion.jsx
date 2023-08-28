import React from 'react'
import {
  Card,
  Accordion,
  OverlayTrigger,
  Tooltip,
  Table,
} from '@themesberg/react-bootstrap'
import Label from '../../Shared/label/Label'
import { HealthStatus } from '../../../../const'
import {
  BsFillCheckCircleFill,
  BsFillExclamationCircleFill,
} from 'react-icons/bs'
import {
  Time,
  DataTransform,
  timeDifferenceFromNow,
} from '../../../../lib/sharedFun/Time'
import { FormattedMessage, useIntl } from 'react-intl'

const HealthCheckAccordion = ({ defaultKey, data = [], className = '' }) => {
  const intl = useIntl()

  const AccordionItem = (item) => {
    // const timeDifferenceLastCheck = timeDifferenceFromNow(
    //   item.healthCheckStatus.lastCheckDate
    // )

    const timeDifferenceCheck = timeDifferenceFromNow(
      item.healthCheckStatus.checkDate
    )

    return (
      <Accordion.Item eventKey={'eventKey'}>
        <Accordion.Button
          variant="link"
          className="w-100 d-flex justify-content-between"
        >
          <span className=" mb-0 fw-bold d-flex  align-items-center  w-100">
            <span className="firstTd">
              <FormattedMessage id="Health-Check-Status" />
            </span>
            <span className="mr-2 tabHolder">
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
                          {Time(
                            item.healthCheckStatus.lastCheckDate,
                            intl.formatMessage({ id: 'Last-checked' })
                          )}
                        </span>
                      </OverlayTrigger>
                    </span>
                  </>
                ) : (
                  <>
                    <OverlayTrigger
                      trigger={['hover', 'focus']}
                      overlay={
                        <Tooltip>
                          <FormattedMessage id="Since" />{' '}
                          {DataTransform(item.healthCheckStatus.checkDate)},
                          <FormattedMessage id="last-checked" />{' '}
                          {DataTransform(item.healthCheckStatus.lastCheckDate)}
                        </Tooltip>
                      }
                    >
                      <span className="date">
                        {Time(
                          item.healthCheckStatus.checkDate,
                          intl.formatMessage({ id: 'Since' })
                        )}
                        ,{' '}
                        {Time(
                          item.healthCheckStatus.lastCheckDate,
                          intl.formatMessage({ id: 'last-checked' })
                        )}
                      </span>
                    </OverlayTrigger>
                  </>
                )}
              </span>
            </span>
          </span>
        </Accordion.Button>
        <Accordion.Body>
          <Card.Body className="py-0 px-0">
            <Card.Text className="mb-0 ">
              <div className="dispatchCont">
                <Card border="light" className="shadow-sm mt-3">
                  <Card.Body>
                    <div className="d-flex align-items-center justify-content-between border-bottom border-light pb-3">
                      <div>
                        <h6>
                          <FormattedMessage id="Health-Check-Status-Info" />
                        </h6>
                      </div>
                    </div>
                    <div className="checksCount d-flex align-items-center justify-content-between border-bottom border-light py-2 ml-5">
                      <div className="mb-0 w-25">
                        <FormattedMessage id="Checks-Count" />
                      </div>
                      <div className="small card-stats">
                        <OverlayTrigger
                          trigger={['hover', 'focus']}
                          overlay={
                            <Tooltip>
                              <FormattedMessage id={'Health-Checks-Count'} />{' '}
                              {item.healthCheckStatus.healthyCount} <br />
                              <FormattedMessage
                                id={'Unavailable-Checks-Count'}
                              />{' '}
                              {item.healthCheckStatus.unhealthyCount}
                            </Tooltip>
                          }
                        >
                          <span className="">
                            {item.healthCheckStatus.healthyCount}{' '}
                            <BsFillCheckCircleFill
                              style={{ color: '#00a675' }}
                            />{' '}
                            / {item.healthCheckStatus.unhealthyCount}{' '}
                            <BsFillExclamationCircleFill
                              style={{ color: '#d26b4e' }}
                            />
                          </span>
                        </OverlayTrigger>
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between border-bottom border-light py-2 ml-5">
                      <div className="mb-0 w-25">
                        <FormattedMessage id="Url" />
                      </div>
                      <div className="small card-stats">
                        {item.healthCheckStatus.healthCheckUrl}
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between pt-2 ml-5">
                      <div className="mb-0 w-25">
                        <FormattedMessage id="Duration" />
                      </div>
                      <div className="small card-stats">
                        {item.healthCheckStatus.duration}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>

              {item.healthCheckStatus.isHealthy == false &&
              item.healthCheckStatus?.externalSystemDispatch ? (
                <div className="dispatchCont">
                  <Card border="light" className="shadow-sm mt-3">
                    <Card.Body>
                      <div className="d-flex align-items-center justify-content-between border-bottom border-light pb-3">
                        <div>
                          <h6>
                            <FormattedMessage id="External-System-Dispatch" />
                          </h6>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between border-bottom border-light py-2 ml-5">
                        <div className="mb-0 w-25">
                          <FormattedMessage id="Is-Successful" />
                        </div>
                        <div className="small card-stats uppercase">
                          {item.healthCheckStatus?.externalSystemDispatch?.isSuccessful.toString()}
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between border-bottom border-light py-2 ml-5">
                        <div className="mb-0 w-25">
                          <FormattedMessage id="Url" />
                        </div>
                        <div className="small card-stats">
                          {item.healthCheckStatus?.externalSystemDispatch?.url}
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between  pt-2 ml-5">
                        <div className="mb-0 w-25">
                          <FormattedMessage id="Dispatch-Date" />
                        </div>
                        <div className="small card-stats">
                          {Time(
                            item.healthCheckStatus?.externalSystemDispatch
                              ?.dispatchDate,
                            intl.formatMessage({ id: 'Last-checked' })
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
