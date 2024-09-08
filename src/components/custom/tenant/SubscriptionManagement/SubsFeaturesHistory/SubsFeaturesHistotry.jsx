import { Card, Col, Nav, Row, Table, Tab } from '@themesberg/react-bootstrap'
import { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { featureResetMap, featureUnitMap } from '../../../../../const'
import { formatDate } from '../../../../../lib/sharedFun/Time'
import Label from '../../../Shared/label/Label'

import DateLabel from '../../../Shared/DateLabel/DateLabel'
import useRequest from '../../../../../axios/apis/useRequest'
import { subHistoryData } from '../../../../../store/slices/tenants'
import SafeFormatMessage from '../../../Shared/SafeFormatMessage/SafeFormatMessage'

export default function SubsFeaturesHistory(data) {
  const { subscriptionId, currentTabFeatures, currentTabCycle, update } = data
  const { subscriptionCycleById } = useRequest()
  const routeParams = useParams()
  const dispatch = useDispatch()

  const subscriptionDatas = useSelector(
    (state) => state.tenants.tenants[routeParams.id]?.subscriptionData?.data
  )

  const subscriptionFeaturesHistory = subscriptionDatas?.subHistoryData?.data
  const fetchSubscriptionCycleData = async () => {
    try {
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
    } catch (error) {
      console.error('Error fetching subscription cycle data:', error)
    }
  }
  useEffect(() => {
    if (
      !subscriptionId ||
      !currentTabCycle ||
      subscriptionFeaturesHistory ||
      update > 0
    ) {
      return
    }
    fetchSubscriptionCycleData()
  }, [currentTabFeatures])

  useEffect(() => {
    if (subscriptionFeaturesHistory) {
      return
    }
    if (update > 0 && !subscriptionFeaturesHistory) {
      fetchSubscriptionCycleData()
    }
    return
  }, [update, subscriptionFeaturesHistory])

  const groupedFeatures = {}

  subscriptionFeaturesHistory?.subscriptionFeaturesCycles?.forEach(
    (featureCycle) => {
      const featureId = featureCycle.feature.id
      if (!groupedFeatures[featureId]) {
        groupedFeatures[featureId] = []
      }
      groupedFeatures[featureId].push(featureCycle)
    }
  )
  const firstTab = Object.keys(groupedFeatures)?.[0]

  return (
    <div className="pr-2 pl-2 ">
      {' '}
      {groupedFeatures && firstTab && (
        <Tab.Container defaultActiveKey={firstTab}>
          <Row>
            <Col md={2} className="feat-tab pr-0">
              <Nav
                fill
                variant="pills"
                className={`  flex-column vertical-tab custom-nav-link mb-3 mr-0 ${
                  window.innerWidth <= 768 ? 'custom-horizontal-tab' : ''
                }`}
              >
                {Object.keys(groupedFeatures).map((featureId, index) => (
                  <Nav.Item key={`feature-nav-${index}`}>
                    <Nav.Link eventKey={featureId}>
                      {groupedFeatures[featureId][0].feature.systemName}
                    </Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>
            </Col>
            <Col md={10}>
              <Tab.Content>
                {Object.keys(groupedFeatures).map((featureId, index) => (
                  <Tab.Pane key={`feature-${index}`} eventKey={featureId}>
                    <Card.Body className="py-0 px-0">
                      <div
                        style={{
                          maxWidth: '100%',
                          overflowX: 'auto',
                        }}
                        className="table-container"
                      >
                        <div className="feat-table">
                          <Table responsive>
                            <thead>
                              <tr>
                                <th>
                                  <SafeFormatMessage id="Feature" />
                                </th>
                                <th>
                                  <SafeFormatMessage id="Reset" />
                                </th>
                                <th>
                                  <SafeFormatMessage id="Start-Date" />
                                </th>
                                <th>
                                  <SafeFormatMessage id="End-Date" />
                                </th>
                                <th>
                                  <SafeFormatMessage id="usage" />
                                </th>
                                <th>
                                  <SafeFormatMessage id="Remind/Limit" />
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {groupedFeatures[featureId].map(
                                (cycle, cycleIndex) => (
                                  <tr key={`cycle-${cycleIndex}`}>
                                    {/* Feature */}
                                    <td>{cycle.feature.systemName}</td>

                                    {/* Reset */}
                                    <td>
                                      <SafeFormatMessage
                                        id={featureResetMap[cycle.reset]}
                                      />
                                    </td>

                                    {/* Start-Date */}
                                    <td>
                                      {cycle.reset != 1 ? (
                                        <Label
                                          background="var(--misty-gray)"
                                          value={formatDate(cycle.startDate)}
                                          lighter={true}
                                        />
                                      ) : (
                                        '-'
                                      )}
                                    </td>

                                    {/* End-Date */}
                                    <td>
                                      {cycle.reset != 1 ? (
                                        <DateLabel
                                          formatedDate={true}
                                          endDate={
                                            cycle.endDate
                                              ? formatDate(cycle.endDate)
                                              : formatDate(
                                                  subscriptionDatas.endDate
                                                )
                                          }
                                        />
                                      ) : (
                                        '-'
                                      )}
                                    </td>

                                    {/* usage */}
                                    <td>{cycle.totalUsage}</td>

                                    {/* Remind/Limit */}
                                    <td className="remind-value">
                                      {`${cycle.remainingUsage}${
                                        featureUnitMap[cycle.unit]
                                      } / ${cycle.limit}${
                                        featureUnitMap[cycle.unit]
                                      }` == 'nullundefined / nullundefined'
                                        ? '-'
                                        : `${cycle.remainingUsage}${
                                            featureUnitMap[cycle.unit]
                                          } / ${cycle.limit}${
                                            featureUnitMap[cycle.unit]
                                          }`}
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </Table>
                        </div>
                      </div>
                    </Card.Body>
                  </Tab.Pane>
                ))}
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      )}
    </div>
  )
}
