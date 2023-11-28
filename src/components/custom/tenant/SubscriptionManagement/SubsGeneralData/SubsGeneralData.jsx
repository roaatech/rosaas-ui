import {
  faArrowRotateBackward,
  faToggleOff,
  faToggleOn,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Card,
  Col,
  Row,
  OverlayTrigger,
  Tooltip,
} from '@themesberg/react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { cycle } from '../../../../../const'
import { DataTransform, formatDate } from '../../../../../lib/sharedFun/Time'
import Label from '../../../Shared/label/Label'
import {
  PlanChangingType,
  SubscriptionPlanChangeStatus,
  SubscriptionResetStatus,
} from '../../../../../const/subscriptionManagement'
import DateLabel from '../../../Shared/DateLabel/DateLabel'
import { subscriptionStatus } from '../../../../../const/product'
import { BsFillQuestionCircleFill } from 'react-icons/bs'

export default function SubsGeneralData(data) {
  const {
    tenantsData,
    handleToggleClick,
    ResettableAllowed,
    handleResetSubscription,
    hasSubsFeatsLimitsResettable,
    handleResetLimit,
    hasResetableValue,
  } = data
  const routeParams = useParams()
  const intl = useIntl()
  const direction = useSelector((state) => state.main.direction)
  const subscriptionDatas = useSelector(
    (state) => state.tenants.tenants[routeParams.id]?.subscriptionData?.data
  )
  return (
    <div className="info-card">
      <Card border="light" className="shadow-sm p-3">
        <Row>
          <Col md={6}>
            <Card.Body className="py-0 px-0">
              {/* product */}
              <div className="d-flex align-items-center justify-content-between border-bottom border-light py-2 ">
                <div className="mb-0 w-25 fw-bold">
                  <FormattedMessage id="Product" />
                  <OverlayTrigger
                    trigger={['hover', 'focus']}
                    overlay={
                      <Tooltip>
                        <FormattedMessage id="Subscription-Managenent-Product" />
                      </Tooltip>
                    }
                  >
                    <span>
                      <BsFillQuestionCircleFill
                        style={{ color: '#6c757d' }}
                        className={
                          direction == 'rtl' ? 'ar-questionCircle mr-2' : 'ml-2'
                        }
                      />
                    </span>
                  </OverlayTrigger>
                </div>
                <div className=" card-stats">
                  {tenantsData[routeParams.id]?.subscriptions[0]?.productName}
                </div>
              </div>

              {/* plan */}
              <div className="d-flex align-items-center justify-content-between border-bottom border-light py-2 ">
                <div className="mb-0 w-25 fw-bold">
                  <FormattedMessage id="Plan" />
                  <OverlayTrigger
                    trigger={['hover', 'focus']}
                    overlay={
                      <Tooltip>
                        <FormattedMessage id="Subscription-Managenent-Plan" />
                      </Tooltip>
                    }
                  >
                    <span>
                      <BsFillQuestionCircleFill
                        style={{ color: '#6c757d' }}
                        className={
                          direction == 'rtl' ? 'ar-questionCircle mr-2' : 'ml-2'
                        }
                      />
                    </span>
                  </OverlayTrigger>
                </div>
                <div className=" card-stats">{subscriptionDatas.planName}</div>
              </div>

              {/* subsc status */}
              <div className="d-flex align-items-center justify-content-between border-bottom  border-light py-2 ">
                <div className="mb-0 w-25 fw-bold">
                  <FormattedMessage id="Subscription-Status" />
                  <OverlayTrigger
                    trigger={['hover', 'focus']}
                    overlay={
                      <Tooltip>
                        <FormattedMessage id="Subscription-Managenent-Subscription-Status" />
                      </Tooltip>
                    }
                  >
                    <span>
                      <BsFillQuestionCircleFill
                        style={{ color: '#6c757d' }}
                        className={
                          direction == 'rtl' ? 'ar-questionCircle mr-2' : 'ml-2'
                        }
                      />
                    </span>
                  </OverlayTrigger>
                </div>
                <div className=" card-stats">
                  <Label
                    {...subscriptionStatus[
                      subscriptionDatas.subscriptionStatus
                    ]}
                  />
                </div>
              </div>

              {/* subsc */}
              <div className="d-flex align-items-center justify-content-between border-bottom border-light py-2 ">
                <div className="mb-0 w-25 fw-bold">
                  <FormattedMessage id="Subscription" />
                  <OverlayTrigger
                    trigger={['hover', 'focus']}
                    overlay={
                      <Tooltip>
                        <FormattedMessage id="Subscription-Managenent-Subscription" />
                      </Tooltip>
                    }
                  >
                    <span>
                      <BsFillQuestionCircleFill
                        style={{ color: '#6c757d' }}
                        className={
                          direction == 'rtl' ? 'ar-questionCircle mr-2' : 'ml-2'
                        }
                      />
                    </span>
                  </OverlayTrigger>
                </div>
                <div className=" card-stats">
                  ${subscriptionDatas.planPrice} /{' '}
                  <FormattedMessage id={cycle[subscriptionDatas.planCycle]} />
                </div>
              </div>

              {/* start date */}
              <div className="d-flex align-items-center justify-content-between  py-2 ">
                <div className="mb-0 w-25 fw-bold">
                  <FormattedMessage id="Start-Date" />
                  <OverlayTrigger
                    trigger={['hover', 'focus']}
                    overlay={
                      <Tooltip>
                        <FormattedMessage id="Subscription-Managenent-Start-Date" />
                      </Tooltip>
                    }
                  >
                    <span>
                      <BsFillQuestionCircleFill
                        style={{ color: '#6c757d' }}
                        className={
                          direction == 'rtl' ? 'ar-questionCircle mr-2' : 'ml-2'
                        }
                      />
                    </span>
                  </OverlayTrigger>
                </div>
                <div className=" card-stats">
                  <Label
                    {...{
                      background: '#cccccc40',
                      value: formatDate(subscriptionDatas.startDate),
                      lighter: true,
                    }}
                  />{' '}
                </div>
              </div>
            </Card.Body>
          </Col>
          <Col md={6}>
            <Card.Body className="py-0 px-0 ">
              {/* Auto-Renewal */}
              <div className="d-flex align-items-center justify-content-between border-bottom border-light py-2 ">
                <div className="mb-0 w-25 fw-bold">
                  <FormattedMessage id="Auto-Renewal" />{' '}
                  <OverlayTrigger
                    trigger={['hover', 'focus']}
                    overlay={
                      <Tooltip>
                        <FormattedMessage id="Subscription-Managenent-Auto-Renewal" />
                      </Tooltip>
                    }
                  >
                    <span>
                      <BsFillQuestionCircleFill
                        style={{ color: '#6c757d' }}
                        className={
                          direction == 'rtl' ? 'ar-questionCircle mr-2' : 'ml-2'
                        }
                      />
                    </span>
                  </OverlayTrigger>
                </div>
                <div className=" card-stats">
                  {subscriptionDatas?.autoRenewal ? (
                    <Label
                      {...{
                        background: 'rgb(239, 249, 246)',
                        value:
                          subscriptionDatas?.autoRenewal &&
                          `$${subscriptionDatas?.autoRenewal?.price} / ${
                            cycle[subscriptionDatas?.autoRenewal?.cycle]
                          }`,
                        lighter: true,
                        color: 'rgb(0, 166, 117)',
                      }}
                    />
                  ) : (
                    <Label
                      {...{
                        background: '#ccc',
                        value: intl.formatMessage({ id: 'disabled' }),

                        lighter: true,
                        color: '#000000',
                      }}
                    />
                  )}

                  <FontAwesomeIcon
                    icon={
                      subscriptionDatas.autoRenewal ? faToggleOn : faToggleOff
                    }
                    className={
                      subscriptionDatas.autoRenewal
                        ? 'active-toggle  ml-2 pl-2 border-left-1 border-light'
                        : 'passive-toggle ml-2 pl-2 border-left-1 border-light'
                    }
                    onClick={handleToggleClick}
                  />
                </div>
              </div>

              {/* Reset Limits */}
              <div className="d-flex align-items-center justify-content-between border-bottom border-light py-2">
                <div className="mb-0 fw-bold">
                  <FormattedMessage id="Reset-Limit" />
                  <OverlayTrigger
                    trigger={['hover', 'focus']}
                    overlay={
                      <Tooltip>
                        <FormattedMessage id="Subscription-Managenent-Reset-Limit" />
                      </Tooltip>
                    }
                  >
                    <span>
                      <BsFillQuestionCircleFill
                        style={{ color: '#6c757d' }}
                        className={
                          direction == 'rtl' ? 'ar-questionCircle mr-2' : 'ml-2'
                        }
                      />
                    </span>
                  </OverlayTrigger>
                </div>

                <div className=" card-stats">
                  {subscriptionDatas.lastLimitsResetDate ? (
                    <span>
                      {/* <FormattedMessage id="Reseted-At" />:{' '} */}
                      <Label
                        {...{
                          background: '#ffab032b',
                          value: DataTransform(
                            subscriptionDatas.lastLimitsResetDate
                          ),
                          lighter: true,
                        }}
                      />
                    </span>
                  ) : (
                    <Label
                      {...{
                        background: '#ccc',
                        value: intl.formatMessage({ id: 'Not-Reset-Yet' }),

                        lighter: true,
                        color: '#000000',
                      }}
                    />
                  )}
                  <FontAwesomeIcon
                    className={`${
                      hasResetableValue
                        ? '  icon-container ml-2 pl-2 border-left-1 border-light active-reset'
                        : '   icon-container ml-2 pl-2 border-left-1 border-light passive-reset'
                    }`}
                    icon={faArrowRotateBackward}
                    onClick={handleResetLimit}
                  />
                </div>
              </div>

              {/* Reset Subs */}
              <div className="d-flex align-items-center justify-content-between  py-2  border-bottom  border-light ">
                <div className="mb-0 fw-bold">
                  <FormattedMessage id="Reset-Subs" />
                  <OverlayTrigger
                    trigger={['hover', 'focus']}
                    overlay={
                      <Tooltip>
                        <FormattedMessage id="Subscription-Managenent-Reset-Subscription" />
                      </Tooltip>
                    }
                  >
                    <span>
                      <BsFillQuestionCircleFill
                        style={{ color: '#6c757d' }}
                        className={
                          direction == 'rtl' ? 'ar-questionCircle mr-2' : 'ml-2'
                        }
                      />
                    </span>
                  </OverlayTrigger>
                </div>
                <div className=" card-stats">
                  {subscriptionDatas.subscriptionReset.lastResetDate ||
                  subscriptionDatas.subscriptionReset
                    .subscriptionResetStatus ? (
                    <div>
                      {subscriptionDatas.subscriptionReset
                        .subscriptionResetStatus && (
                        <span>
                          {' '}
                          <Label
                            {...SubscriptionResetStatus[
                              subscriptionDatas?.subscriptionReset
                                .subscriptionResetStatus
                            ]}
                          />
                        </span>
                      )}
                      {subscriptionDatas.subscriptionReset.lastResetDate && (
                        <span>
                          <FormattedMessage id="Reseted-At" />:{' '}
                          {subscriptionDatas?.subscriptionReset.lastResetDate
                            ? DataTransform(
                                subscriptionDatas?.subscriptionReset
                                  .lastResetDate
                              )
                            : ''}
                        </span>
                      )}{' '}
                      <FontAwesomeIcon
                        className={`${
                          ResettableAllowed
                            ? ' ml-2 pl-2 border-left-1 border-light  icon-container active-reset'
                            : '  ml-2 pl-2 border-left-1 border-light icon-container passive-reset'
                        }`}
                        icon={faArrowRotateBackward}
                        onClick={handleResetSubscription}
                      />
                    </div>
                  ) : (
                    <div>
                      <Label
                        {...{
                          background: '#ccc',
                          value: intl.formatMessage({ id: 'Not-Reset-Yet' }),

                          lighter: true,
                          color: '#000000',
                        }}
                      />
                      <FontAwesomeIcon
                        className={`${
                          ResettableAllowed
                            ? ' ml-2 pl-2 border-left-1 border-light  icon-container active-reset'
                            : '  ml-2 pl-2 border-left-1 border-light icon-container passive-reset'
                        }`}
                        icon={faArrowRotateBackward}
                        onClick={handleResetSubscription}
                      />
                    </div>
                  )}{' '}
                </div>
              </div>

              {/* up-downgrade */}
              <div className="d-flex align-items-center justify-content-between  py-2 border-bottom  border-light ">
                <div className="mb-0 w-25 fw-bold">
                  {subscriptionDatas?.subscriptionPlanChange &&
                  subscriptionDatas?.subscriptionPlanChange.type ? (
                    <FormattedMessage
                      id={
                        PlanChangingType[
                          subscriptionDatas.subscriptionPlanChange.type
                        ]
                      }
                    />
                  ) : (
                    ''
                  )}{' '}
                  <FormattedMessage id="info" />
                  <OverlayTrigger
                    trigger={['hover', 'focus']}
                    overlay={
                      <Tooltip>
                        <FormattedMessage id="Subscription-Managenent-Info" />
                      </Tooltip>
                    }
                  >
                    <span>
                      <BsFillQuestionCircleFill
                        className={
                          direction == 'rtl' ? 'ar-questionCircle mr-2' : 'ml-2'
                        }
                        style={{ color: '#6c757d' }}
                      />
                    </span>
                  </OverlayTrigger>
                </div>
                <div className=" card-stats">
                  {subscriptionDatas &&
                    subscriptionDatas.subscriptionPlanChange && (
                      <>
                        {subscriptionDatas.subscriptionPlanChange
                          .SubscriptionPlanChangeStatus && (
                          <Label
                            {...SubscriptionPlanChangeStatus[
                              subscriptionDatas?.subscriptionReset
                                .SubscriptionPlanChangeStatus
                            ]}
                          />
                        )}
                        <Label
                          {...{
                            background: 'rgba(255, 201, 102, 0.4)',
                            value: (
                              <>
                                {
                                  subscriptionDatas.subscriptionPlanChange
                                    .planDisplayName
                                }
                                :{' $'}
                                {
                                  subscriptionDatas?.subscriptionPlanChange
                                    ?.price
                                }
                                {' / '}
                                {
                                  cycle[
                                    subscriptionDatas?.subscriptionPlanChange
                                      ?.cycle
                                  ]
                                }
                              </>
                            ),
                            color: '#5c472e',
                          }}
                        />
                      </>
                    )}
                </div>
              </div>

              {/* End Date */}
              <div className="d-flex align-items-center justify-content-between py-2 ">
                <div className="mb-0 w-25 fw-bold">
                  <FormattedMessage id="End-Date" />
                  <OverlayTrigger
                    trigger={['hover', 'focus']}
                    overlay={
                      <Tooltip>
                        <FormattedMessage id="Subscription-Managenent-End-Date" />
                      </Tooltip>
                    }
                  >
                    <span>
                      <BsFillQuestionCircleFill
                        className={
                          direction == 'rtl' ? 'ar-questionCircle mr-2' : 'ml-2'
                        }
                        style={{ color: '#6c757d' }}
                      />
                    </span>
                  </OverlayTrigger>
                </div>
                <div className=" card-stats">
                  <DateLabel endDate={subscriptionDatas.endDate} />
                </div>
              </div>
            </Card.Body>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Card.Body className="py-0 px-0 "></Card.Body>
          </Col>
        </Row>
      </Card>
    </div>
  )
}
