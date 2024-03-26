import React, { useEffect, useState } from 'react'
import {
  Card,
  Row,
  Col,
  Dropdown,
  Button,
  ButtonGroup,
} from '@themesberg/react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCheckCircle,
  faEllipsisV,
  faToggleOff,
  faToggleOn,
  faExchangeAlt,
  faMoneyCheckDollar,
} from '@fortawesome/free-solid-svg-icons'
import { FormattedMessage } from 'react-intl'
import useRequest from '../../../../axios/apis/useRequest'
import { Wrapper } from './AutoRenewalList.styled'
import { useDispatch, useSelector } from 'react-redux'
import {
  cancelAutoRenewal,
  changeSubscriptionAttribute,
  deleteAllAutoRenewalIds,
  deleteAutoRenewalById,
  setAllAutoRenewal,
} from '../../../../store/slices/workSpace'
import ThemeDialog from '../../Shared/ThemeDialog/ThemeDialog.jsx'
import RenewForm from '../../tenant/SubscriptionManagement/RenewForm/RenewForm.jsx' // Adjust import path as per your project structure
import WorkspaceRenewForm from '../SubscriptionsList/WorkspaceRenewForm/WorkspaceRenewForm.jsx'
import CreditCard from '../../CreditCard/CreditCard.jsx'
import { cardInfo } from '../../../../const/cardPayment.js'
import { formatDate } from '../../../../lib/sharedFun/Time.js'
import UpperContent from '../../Shared/UpperContent/UpperContent.jsx'

export default function AutoRenewalList() {
  const { getAutoRenewalList } = useRequest()
  const autoRenewalData = useSelector(
    (state) => state.workspace.autoRenewalData
  )
  const dispatch = useDispatch()
  const { cancelAutoRenewal } = useRequest()
  const [showRenewForm, setShowRenewForm] = useState(false)
  const [currentSubscription, setCurrentSubscription] = useState(null)
  const [cards, setCards] = useState()
  setTimeout(() => {
    dispatch(deleteAllAutoRenewalIds())
  }, 5000)
  useEffect(() => {
    const fetchAutoRenewalData = async () => {
      if (Object.values(autoRenewalData).length > 1) {
        return
      }
      try {
        const response = await getAutoRenewalList()
        dispatch(setAllAutoRenewal(response.data.data))
      } catch (error) {
        console.error('Error fetching auto renewal data:', error)
      }
    }
    fetchAutoRenewalData()
  }, [])

  const handleAutoRenewal = async (id) => {
    try {
      console.log('Auto-renewal action triggered for subscription:', id)
    } catch (error) {
      console.error('Error processing auto-renewal:', error)
    }
  }

  const handleCancelAutoRenewal = async (id, subscriptionId) => {
    try {
      await cancelAutoRenewal({ subscriptionId })
      dispatch(
        changeSubscriptionAttribute({
          subscriptionId: subscriptionId,
          attributeName: 'autoRenewalIsEnabled',
          attributeValue: false,
        })
      )
      dispatch(deleteAutoRenewalById(id))
    } catch (error) {
      console.error('Error cancelling auto-renewal:', error)
    }
  }

  const handleOpenRenewForm = (subscription) => {
    setCurrentSubscription(subscription.subscription)
    setShowRenewForm(true)
  }

  return (
    <Wrapper>
      {/* <Card className="m-3 p-3 mt-0"> */}
      <UpperContent>
        <h4 className="m-0">
          <FormattedMessage id="Auto-Renewal" />{' '}
        </h4>
      </UpperContent>
      <div>
        <Row className="mx-2">
          {autoRenewalData &&
            Object.values(autoRenewalData).map(
              (autorenewal) =>
                autorenewal.id && (
                  <Col key={autorenewal.id} xl={4} lg={4} sm={6}>
                    <Card
                      className={`mb-4 ${
                        autoRenewalData.autoRenewalIds.includes(autorenewal.id)
                          ? 'new-added'
                          : ''
                      }`}
                    >
                      <Card.Header>
                        <div className="d-flex justify-content-between">
                          <Card.Title className="m-0 p-0">
                            <div>
                              <strong>
                                <FormattedMessage id="Auto-Renewal" />
                              </strong>{' '}
                            </div>
                          </Card.Title>
                          <div>
                            {/* <Card.Title className="m-0 p-0"> */}
                            <span className="mx-2">
                              <span className=" fw-normal">
                                {' '}
                                <FormattedMessage id="Billing-Date" />{' '}
                              </span>
                              <span className="billing-date">
                                {formatDate(
                                  autorenewal.subscriptionRenewalDate
                                )}
                              </span>
                            </span>
                            {'  '}
                            <Dropdown className="mx-2" as={ButtonGroup}>
                              <Dropdown.Toggle
                                as={Button}
                                split
                                variant="link"
                                className="text-dark m-0 p-0"
                              >
                                <span className="icon icon-sm">
                                  <FontAwesomeIcon
                                    icon={faEllipsisV}
                                    className="icon-dark"
                                  />
                                </span>
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item
                                  onClick={() =>
                                    handleCancelAutoRenewal(
                                      autorenewal.id,
                                      autorenewal.subscription?.id
                                        ? autorenewal.subscription.id
                                        : autorenewal.id
                                    )
                                  }
                                  className="text-danger"
                                >
                                  <FontAwesomeIcon
                                    icon={faToggleOn}
                                    className="me-2"
                                  />
                                  <FormattedMessage id="Cancel-Auto-Renewal" />
                                </Dropdown.Item>

                                {/* <Dropdown.Item
                                onClick={() => handleOpenRenewForm(autorenewal)}
                              >
                                <FontAwesomeIcon
                                  icon={faExchangeAlt}
                                  className="me-2"
                                />
                                <FormattedMessage id="Renew-Subscription" />
                              </Dropdown.Item> */}
                              </Dropdown.Menu>
                            </Dropdown>{' '}
                            {/* </Card.Title> */}
                          </div>
                        </div>
                      </Card.Header>
                      <Card.Body>
                        <Card.Text>
                          <span>
                            <strong>
                              <FormattedMessage id="Subscription" />
                            </strong>
                            {'  '}
                            {autorenewal.subscription?.displayName}{' '}
                          </span>
                        </Card.Text>

                        <Card.Text>
                          <span>
                            <strong>
                              <FormattedMessage id="Plan" />
                            </strong>{' '}
                            {autorenewal?.plan?.displayName}
                          </span>
                        </Card.Text>
                        <Card.Text>
                          <div className="d-flex align-items-center">
                            <strong>
                              <FormattedMessage id="Enabled-Date" /> {'   '}
                            </strong>
                            <span className="mx-1">
                              {formatDate(autorenewal.enabledDate)}
                            </span>
                          </div>
                        </Card.Text>
                        <div>
                          <strong>
                            <FormattedMessage id="Auto-Renewal-Payment-Method" />
                          </strong>

                          <div className="p-3 ">
                            <div>
                              <CreditCard
                                cardNumber={
                                  autorenewal.paymentMethodCard?.last4Digits
                                }
                                expiryDate={`${autorenewal.paymentMethodCard?.expirationMonth}/${autorenewal.paymentMethodCard?.expirationYear}`}
                                cardHolder={
                                  autorenewal.paymentMethodCard?.cardholderName
                                }
                                isDefault={autorenewal.isDefault}
                                cardTypeIcon={
                                  cardInfo?.[
                                    autorenewal.paymentMethodCard?.brand
                                  ]?.icon || faMoneyCheckDollar
                                }
                                cardView={true}
                              />
                            </div>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                )
            )}
        </Row>
      </div>
      {/* </Card> */}

      <ThemeDialog visible={showRenewForm} setVisible={setShowRenewForm}>
        <>
          <WorkspaceRenewForm
            currentSubscription={currentSubscription}
            onClose={() => setShowRenewForm(false)}
            setVisible={setShowRenewForm}
            cards={cards}
            setCards={setCards}
          />
        </>
      </ThemeDialog>
    </Wrapper>
  )
}
