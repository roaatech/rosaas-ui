import {
  faArrowRotateBackward,
  faToggleOff,
  faToggleOn,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Card,
  Col,
  OverlayTrigger,
  Row,
  Table,
} from '@themesberg/react-bootstrap'
import { Tooltip } from 'bootstrap'
import { useEffect, useState } from 'react'
import { BsFillQuestionCircleFill } from 'react-icons/bs'
import { FormattedMessage, useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import ThemeDialog from '../../../Shared/ThemeDialog/ThemeDialog'
import { cycle, featureResetMap, featureUnitMap } from '../../../../../const'
import { DataTransform, formatDate } from '../../../../../lib/sharedFun/Time'
import Label from '../../../Shared/label/Label'
import {
  PlanChangingType,
  SubscriptionPlanChangeStatus,
  SubscriptionResetStatus,
} from '../../../../../const/subscriptionManagement'
import DateLabel from '../../../Shared/DateLabel/DateLabel'
import useRequest from '../../../../../axios/apis/useRequest'
import {
  subscriptionData,
  featuresData,
} from '../../../../../store/slices/tenants'

export default function SubsFeatures(data) {
  const { subscriptionId, update, setHasResetableValue } = data
  const { subscriptionFeturesList } = useRequest()
  const routeParams = useParams()
  const dispatch = useDispatch()

  const subscriptionFeatures = useSelector(
    (state) =>
      state.tenants.tenants[routeParams.id]?.subscriptionData?.data?.features
        ?.data
  )
  console.log({ subscriptionFeatures })
  useEffect(() => {
    if (subscriptionFeatures) {
      setHasResetableValue(
        subscriptionFeatures.some((item) => item.reset !== 1)
      )
    }
  }, [subscriptionFeatures])
  const fetchDataAndUpdateFeatures = async () => {
    try {
      const response = await subscriptionFeturesList(subscriptionId)
      dispatch(
        featuresData({
          id: routeParams.id,
          data: response.data.data,
        })
      )
    } catch (error) {
      console.error('Error fetching and updating features:', error)
    }
  }

  useEffect(() => {
    if (update > 0 && !subscriptionFeatures) {
      fetchDataAndUpdateFeatures()
    }
  }, [update, subscriptionFeatures])
  useEffect(() => {
    if (!subscriptionFeatures) {
      fetchDataAndUpdateFeatures()
    }
  }, [])

  return (
    <div className="pr-2 pl-2">
      <Card.Body className="py-0 px-0">
        <Table responsive className="feat-table">
          <thead>
            <tr>
              <th>
                <FormattedMessage id="Feature" />
              </th>
              <th>
                <FormattedMessage id="Reset" />
              </th>
              <th>
                <FormattedMessage id="Start-Date" />
              </th>
              <th>
                <FormattedMessage id="End-Date" />
              </th>
              <th>
                <FormattedMessage id="Remind/Limit" />
              </th>
            </tr>
          </thead>

          <tbody>
            {subscriptionFeatures &&
              Array.isArray(subscriptionFeatures) &&
              subscriptionFeatures?.map((subscription, index) => (
                <tr key={`subscription-${index}`}>
                  <td>{subscription.feature.name}</td>

                  <td>{featureResetMap[subscription.reset]}</td>

                  <td>
                    {' '}
                    {subscription.reset != 1 ? (
                      <Label
                        {...{
                          background: '#cccccc40',
                          value: formatDate(subscription.startDate),
                          lighter: true,
                        }}
                      />
                    ) : (
                      '-'
                    )}
                  </td>

                  <td>
                    {subscription.reset != 1 ? (
                      <DateLabel endDate={formatDate(subscription.endDate)} />
                    ) : (
                      '-'
                    )}
                  </td>

                  <td className="remind-value">
                    {`${subscription.limit}${
                      featureUnitMap[subscription.unit]
                    } / ${subscription.remainingUsage}${
                      featureUnitMap[subscription.unit]
                    }` === 'nullundefined / nullundefined'
                      ? '-'
                      : `${subscription.limit}${
                          featureUnitMap[subscription.unit]
                        } / ${subscription.remainingUsage}${
                          featureUnitMap[subscription.unit]
                        }`}
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Card.Body>
    </div>
  )
}
