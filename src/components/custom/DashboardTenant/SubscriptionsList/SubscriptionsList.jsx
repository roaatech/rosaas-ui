import React, { useState, useEffect } from 'react'
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
  faExchangeAlt,
  faMoneyCheckDollar,
  faTimesCircle,
  faToggleOff,
  faToggleOn,
  faUpload,
} from '@fortawesome/free-solid-svg-icons'
import useRequest from '../../../../axios/apis/useRequest.js'
import DataLabelWhite from '../../Shared/DateLabelWhite/DateLabelWhite.jsx'
import { FormattedMessage } from 'react-intl'
import DateLabel from '../../Shared/DateLabel/DateLabel.jsx'
import { formatDate } from '../../../../lib/sharedFun/Time.js'
import CreditCard from '../../CreditCard/CreditCard.jsx'
import { cardInfo } from '../../../../const/cardPayment.js'
import TableDate from '../../Shared/TableDate/TableDate.jsx'
import { Wrapper } from './SubscriptionsList.styled.jsx'
import UpperContent from '../../Shared/UpperContent/UpperContent.jsx'
import ThemeDialog from '../../Shared/ThemeDialog/ThemeDialog.jsx'
import { useDispatch, useSelector } from 'react-redux'
import RenewForm from '../../tenant/SubscriptionManagement/RenewForm/RenewForm.jsx'
import {
  changeSubscriptionAttribute,
  setWorkspaceSubscriptionData,
} from '../../../../store/slices/workSpace.js'
import CardSaveFormWithStripe from '../../CardSaveForm/CardSaveForm.js'
import WorkspaceRenewForm from './WorkspaceRenewForm/WorkspaceRenewForm.jsx'
import NoteInputConfirmation from '../../Shared/NoteInputConfirmation/NoteInputConfirmation.js'
import WorkspaceUpDowngradeForm from './WorkspaceUpDowngradeForm/WorkspaceUpDowngradeForm.jsx'

export default function SubscriptionList() {
  const { getSubscriptionsList, cancelAutoRenewal } = useRequest()
  const [visible, setVisible] = useState(false)
  const dispatch = useDispatch()
  const subscriptionData = useSelector(
    (state) => state.workspace.subscriptionData
  )
  const [cards, setCards] = useState([])
  const [showAddCardForm, setShowAddCardForm] = useState(false)
  const [showUpDowngradeForm, setShowUpDowngradeForm] = useState(false)
  const handleOpenUpDowngradeForm = (subscription) => {
    setCurrentSubscription(subscription)
    setShowUpDowngradeForm(true)
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getSubscriptionsList()
        dispatch(setWorkspaceSubscriptionData(response.data.data))
      } catch (error) {
        console.error('Error fetching subscription data:', error)
      }
    }
    fetchData()
  }, [])
  const [referenceId, setReferenceId] = useState('')
  const [currentSubscriptionId, setCurrentSubscriptionId] = useState('')
  const [currentSubscription, setCurrentSubscription] = useState()
  const [confirm, setConfirm] = useState(false)

  function automaticRenew(id) {
    setReferenceId(subscriptionData?.[id].paymentMethodCard?.referenceId)

    setVisible(true)
    setCurrentSubscriptionId(subscriptionData?.[id]?.id)
  }
  const activeStatus = {
    true: {
      text: <FormattedMessage id="Active" />,
      icon: faCheckCircle,
      color: 'success',
    },
    false: {
      text: <FormattedMessage id="Inactive" />,
      icon: faTimesCircle,
      color: 'danger',
    },
  }
  const handleConfirmation = async (data = '', comment) => {
    try {
      await cancelAutoRenewal({
        subscriptionId: subscriptionData?.[currentSubscriptionId]?.id,
        comment,
      })
      dispatch(
        changeSubscriptionAttribute({
          subscriptionId: subscriptionData?.[currentSubscriptionId]?.id,
          attributeName: 'autoRenewalIsEnabled',
          attributeValue: false,
        })
      )
      setConfirm(false)
    } catch (error) {
      console.error('Error cancelling auto-renewal:', error)
    }
  }

  const handleToggleClick = (id) => {
    setConfirm(true)
    setCurrentSubscriptionId(id)
  }
  return (
    <Wrapper>
      <UpperContent>
        <h4>
          <FormattedMessage id="Subscription-List" />
        </h4>
      </UpperContent>

      <Card className="m-3 p-3 mt-0">
        <div>
          <Row>
            {subscriptionData &&
              Object.values(subscriptionData).map((subscription) => (
                <Col key={subscription.id} md={3}>
                  <Card className="mb-4">
                    <Card.Body>
                      <Card.Title>
                        <div className="d-flex justify-content-between">
                          {subscription.displayName}{' '}
                          <Dropdown as={ButtonGroup}>
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
                              {!subscription.autoRenewalIsEnabled ? (
                                <Dropdown.Item
                                  onClick={() =>
                                    automaticRenew(subscription?.id)
                                  }
                                >
                                  <>
                                    <FontAwesomeIcon
                                      icon={faToggleOff}
                                      className="me-2"
                                    />
                                    <FormattedMessage id="Enable-Auto-Renewal" />
                                  </>
                                </Dropdown.Item>
                              ) : (
                                <Dropdown.Item
                                  onClick={() =>
                                    handleToggleClick(subscription?.id)
                                  }
                                  className="text-danger"
                                >
                                  <FontAwesomeIcon
                                    icon={faToggleOn}
                                    className="me-2"
                                  />
                                  <FormattedMessage id="Cancel-Auto-Renewal" />
                                </Dropdown.Item>
                              )}

                              {/* {subscription.autoRenewalIsEnabled && (
                                <Dropdown.Item
                                  onClick={() =>
                                    automaticRenew(subscription?.id)
                                  }
                                >
                                  <>
                                    <FontAwesomeIcon
                                      icon={faExchangeAlt}
                                      className="me-2"
                                    />
                                    <FormattedMessage id="Change-Auto-Renewal" />
                                  </>
                                </Dropdown.Item>
                              )} */}
                              <Dropdown.Item
                                onClick={() =>
                                  handleOpenUpDowngradeForm(subscription)
                                }
                              >
                                <>
                                  <FontAwesomeIcon
                                    icon={faUpload}
                                    className="me-2"
                                  />
                                  <FormattedMessage id="Upgrade-Subscription" />
                                </>
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </Card.Title>
                      <p>
                        <FontAwesomeIcon
                          icon={
                            activeStatus[
                              subscription.isActive
                                ? subscription.isActive
                                : false
                            ].icon
                          }
                          className={`text-${
                            activeStatus[
                              subscription.isActive
                                ? subscription.isActive
                                : false
                            ].color
                          } me-2`}
                        />
                        <strong>
                          <FormattedMessage id="Status" />
                        </strong>{' '}
                        <span
                          className={`text-${
                            activeStatus[
                              subscription.isActive
                                ? subscription.isActive
                                : false
                            ].color
                          }`}
                        >
                          {
                            activeStatus[
                              subscription.isActive
                                ? subscription.isActive
                                : false
                            ].text
                          }
                        </span>
                      </p>
                      <Card.Text>
                        <span>
                          <strong>
                            <FormattedMessage id="Plan" />
                          </strong>{' '}
                          {subscription.plan.displayName}
                        </span>
                      </Card.Text>

                      <Card.Text>
                        <div className="d-flex align-items-center">
                          <strong>
                            <FormattedMessage id="Created-Date" />
                          </strong>
                          <TableDate
                            className="px-2"
                            createdDate={subscription.createdDate}
                            editedDate={subscription.editedDate}
                          />
                        </div>
                      </Card.Text>

                      {subscription.autoRenewalIsEnabled ? (
                        <p>
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            className="text-success me-2"
                          />
                          <strong>
                            <FormattedMessage id="Auto-Renewal" />
                          </strong>
                          <span className="text-success">
                            {' '}
                            <FormattedMessage id="Enabled" />
                          </span>{' '}
                          {formatDate(subscription.endDate)}
                        </p>
                      ) : (
                        <p>
                          <FontAwesomeIcon
                            icon={faTimesCircle}
                            className="text-danger me-2"
                          />
                          <strong>
                            <FormattedMessage id="Auto-Renewal" />
                          </strong>
                          <strong className="text-danger">
                            {' '}
                            <FormattedMessage id="Disabled" />
                          </strong>
                        </p>
                      )}
                      {subscription.planChangingIsEnabled && (
                        <p>
                          <strong>
                            <FormattedMessage id="Plan-Changing" />:
                          </strong>{' '}
                          {subscription.planChangingType}
                        </p>
                      )}
                      <div>
                        <strong>
                          <FormattedMessage id="Payment-Method" />
                        </strong>
                        <div className="p-3">
                          <div>
                            <CreditCard
                              cardNumber={
                                subscription.paymentMethodCard?.last4Digits
                              }
                              expiryDate={`${subscription.paymentMethodCard?.expirationMonth}/${subscription.paymentMethodCard?.expirationYear}`}
                              cardHolder={
                                subscription.paymentMethodCard?.cardholderName
                              }
                              isDefault={subscription.isDefault}
                              cardTypeIcon={
                                cardInfo?.[
                                  subscription.paymentMethodCard?.brand
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
              ))}
          </Row>
        </div>
      </Card>
      {confirm && (
        <NoteInputConfirmation
          confirm={confirm}
          setConfirm={setConfirm}
          confirmFunction={handleConfirmation}
          message={<FormattedMessage id="cancel-renew-message" />}
          placeholder={'Comment'}
        />
      )}
      <ThemeDialog visible={visible} setVisible={setVisible}>
        <>
          <WorkspaceRenewForm
            referenceId={referenceId}
            popupLabel={<FormattedMessage id="Auto-Renewal" />}
            setVisible={setVisible}
            visible={visible}
            currentSubscription={currentSubscriptionId}
            cards={cards}
            setCards={setCards}
            showAddCardForm={showAddCardForm}
            setShowAddCardForm={setShowAddCardForm}
          />
        </>
      </ThemeDialog>
      <ThemeDialog visible={showAddCardForm} setVisible={setShowAddCardForm}>
        <CardSaveFormWithStripe
          setVisible={setShowAddCardForm}
          visible={showAddCardForm}
          setCards={setCards}
          cards={cards}
          autoRenewal={true}
          popupLabel="Add Card and Set to Auto Renewal"
          currentSubscription={currentSubscriptionId}
        />
      </ThemeDialog>
      <ThemeDialog
        visible={showUpDowngradeForm}
        setVisible={setShowUpDowngradeForm}
      >
        <>
          <WorkspaceUpDowngradeForm
            subscriptionData={currentSubscription}
            setVisible={setShowUpDowngradeForm}
            type="upgrade"
            popupLabel="Upgarde"
          />
        </>
      </ThemeDialog>
    </Wrapper>
  )
}
