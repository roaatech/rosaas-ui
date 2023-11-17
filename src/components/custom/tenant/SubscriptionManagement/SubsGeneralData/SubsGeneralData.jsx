import {
  faArrowRotateBackward,
  faToggleOff,
  faToggleOn,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Card, Col, Row } from '@themesberg/react-bootstrap'
import { FormattedMessage } from 'react-intl'
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
                </div>
                <div className=" card-stats">
                  {tenantsData[routeParams.id]?.subscriptions[0]?.productName}
                </div>
              </div>

              {/* plan */}
              <div className="d-flex align-items-center justify-content-between border-bottom border-light py-2 ">
                <div className="mb-0 w-25 fw-bold">
                  <FormattedMessage id="Plan" />
                </div>
                <div className=" card-stats">{subscriptionDatas.planName}</div>
              </div>

              {/* subsc status */}
              <div className="d-flex align-items-center justify-content-between border-bottom  border-light py-2 ">
                <div className="mb-0 w-25 fw-bold">
                  <FormattedMessage id="Subscription-Status" />
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
                  <FontAwesomeIcon
                    icon={
                      subscriptionDatas.autoRenewal ? faToggleOn : faToggleOff
                    }
                    className={
                      subscriptionDatas.autoRenewal
                        ? 'active-toggle  ml-2'
                        : 'passive-toggle ml-2'
                    }
                    onClick={handleToggleClick}
                  />
                </div>
                <div className=" card-stats">
                  {subscriptionDatas?.autoRenewal &&
                    `$${subscriptionDatas?.autoRenewal?.price} / ${
                      cycle[subscriptionDatas?.autoRenewal?.cycle]
                    }`}
                </div>
              </div>

              {/* Reset Limits */}
              <div className="d-flex align-items-center justify-content-between border-bottom border-light py-2">
                <div className="mb-0 fw-bold">
                  <FormattedMessage id="Reset-Limit" />

                  <FontAwesomeIcon
                    className={`${
                      hasResetableValue
                        ? 'ml-3 mr-3  icon-container active-reset'
                        : 'ml-3 mr-3  icon-container passive-reset'
                    }`}
                    icon={faArrowRotateBackward}
                    onClick={handleResetLimit}
                  />
                </div>

                <div className=" card-stats">
                  {subscriptionDatas.lastLimitsResetDate ? (
                    <span>
                      {/* <FormattedMessage id="Reseted-At" />:{' '} */}
                      {DataTransform(subscriptionDatas.lastLimitsResetDate)}
                    </span>
                  ) : (
                    'not reset yet'
                  )}
                </div>
              </div>

              {/* Reset Subs */}
              <div className="d-flex align-items-center justify-content-between  py-2  border-bottom  border-light ">
                <div className="mb-0 fw-bold">
                  <FormattedMessage id="Reset-Subs" />
                  <FontAwesomeIcon
                    className={`${
                      ResettableAllowed
                        ? 'ml-3 mr-3  icon-container active-reset'
                        : 'ml-3 mr-3  icon-container passive-reset'
                    }`}
                    icon={faArrowRotateBackward}
                    onClick={handleResetSubscription}
                  />
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
                      )}
                    </div>
                  ) : (
                    'not reset yet'
                  )}
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
                                <FormattedMessage
                                  id={
                                    subscriptionDatas.subscriptionPlanChange
                                      .planDisplayName
                                  }
                                />
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
