import { Card, Col, Row } from '@themesberg/react-bootstrap'
import { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { cycle } from '../../../../../const'
import { formatDate } from '../../../../../lib/sharedFun/Time'
import Label from '../../../Shared/label/Label'

import DateLabel from '../../../Shared/DateLabel/DateLabel'
import useRequest from '../../../../../axios/apis/useRequest'
import { subHistoryData } from '../../../../../store/slices/tenants'

export default function SubsGeneralHistoryData(data) {
  const { tenantsData, currentTabCycle } = data
  const routeParams = useParams()
  const { subscriptionCycleById } = useRequest()
  const dispatch = useDispatch()

  const subscriptionDatas = useSelector(
    (state) => state.tenants.tenants[routeParams.id]?.subscriptionData?.data
  )
  const subscriptionId = subscriptionDatas?.subscriptionId
  const currentCyc =
    subscriptionDatas?.currentSubscriptionCycleId === currentTabCycle
  const subHistory = subscriptionDatas?.subHistoryData?.data
  useEffect(() => {
    if (!subscriptionId || subHistory || !currentTabCycle || currentCyc) {
      return
    }
    ;(async () => {
      const response = await subscriptionCycleById(
        subscriptionId,
        currentTabCycle
      )
      dispatch(
        subHistoryData({
          id: routeParams.id,
          data: response.data.data,
        })
      )
    })()
  }, [currentTabCycle])

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
                <div className=" card-stats">{subHistory?.plan.displayName}</div>
              </div>

              {/* subsc */}
              <div className="d-flex align-items-center justify-content-between py-2 ">
                <div className="mb-0 w-25 fw-bold">
                  <FormattedMessage id="Subscription" />
                </div>
                <div className=" card-stats">
                  ${subHistory?.price} /{' '}
                  {subHistory?.cycle && (
                    <FormattedMessage id={cycle[subHistory?.cycle]} />
                  )}
                </div>
              </div>
            </Card.Body>
          </Col>
          <Col md={6}>
            <Card.Body className="py-0 px-0 ">
              {/* start date */}
              <div className="d-flex align-items-center justify-content-between  border-bottom border-light py-2 ">
                <div className="mb-0 w-25 fw-bold">
                  <FormattedMessage id="Start-Date" />
                </div>
                <div className=" card-stats">
                  {subHistory?.startDate && (
                    <Label
                      {...{
                        background: '#cccccc40',
                        value: formatDate(subHistory?.startDate),
                        lighter: true,
                      }}
                    />
                  )}{' '}
                </div>
              </div>

              {/* End Date */}
              <div className="d-flex align-items-center justify-content-between py-2 ">
                <div className="mb-0 w-25 fw-bold">
                  <FormattedMessage id="End-Date" />
                </div>
                <div className=" card-stats">
                  {subHistory?.endDate && (
                    <DateLabel endDate={subHistory?.endDate} />
                  )}
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
