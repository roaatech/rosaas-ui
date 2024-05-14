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
  faArrowDown,
  faArrowUp,
  faCheckCircle,
  faDownload,
  faEllipsisV,
  faExclamationCircle,
  faMoneyCheckDollar,
  faSyncAlt,
  faTimesCircle,
  faToggleOff,
  faToggleOn,
  faUpload,
} from '@fortawesome/free-solid-svg-icons'
import useRequest from '../../../../axios/apis/useRequest.js'
import { FormattedMessage } from 'react-intl'
import { formatDate } from '../../../../lib/sharedFun/Time.js'
import CreditCard from '../../CreditCard/CreditCard.jsx'
import { cardInfo } from '../../../../const/cardPayment.js'
import TableDate from '../../Shared/TableDate/TableDate.jsx'
import { Wrapper } from './SubscriptionsList.styled.jsx'
import UpperContent from '../../Shared/UpperContent/UpperContent.jsx'
import ThemeDialog from '../../Shared/ThemeDialog/ThemeDialog.jsx'
import { useDispatch, useSelector } from 'react-redux'
import {
  changeSubscriptionAttribute,
  deleteAutoRenewalById,
  setWorkspaceSubscriptionData,
} from '../../../../store/slices/workSpace.js'
import CardSaveFormWithStripe from '../../CardSaveForm/CardSaveForm.js'
import NoteInputConfirmation from '../../Shared/NoteInputConfirmation/NoteInputConfirmation.js'
import WorkspaceUpDowngradeForm from './WorkspaceUpDowngradeForm/WorkspaceUpDowngradeForm.jsx'
import WorkspaceRenewFormWithCycle from './WorkspaceRenewFormWithCycle/WorkspaceRenewFormWithCycle.jsx'
import DateLabel from '../../Shared/DateLabel/DateLabel.jsx'

export default function SubscriptionList() {
  const { getSubscriptionsList, cancelAutoRenewal } = useRequest() // Initializing request functions

  const [visible, setVisible] = useState(false) // State for modal visibility

  const dispatch = useDispatch() // Initializing useDispatch hook

  const subscriptionData = useSelector(
    (state) => state.workspace.subscriptionData
  ) // Getting subscription data from Redux store
  const autoRenewalData = useSelector(
    (state) => state.workspace.autoRenewalData
  )
  console.log({ autoRenewalData })
  // State variables for managing forms and confirmation dialog
  const [cards, setCards] = useState([])
  const [showAddCardForm, setShowAddCardForm] = useState(false)
  const [showUpDowngradeForm, setShowUpDowngradeForm] = useState(false)
  const [showDowngradeForm, setShowDowngradeForm] = useState(false)
  const [referenceId, setReferenceId] = useState('')
  const [currentSubscriptionId, setCurrentSubscriptionId] = useState('')
  const [currentSubscription, setCurrentSubscription] = useState()
  const [confirm, setConfirm] = useState(false)
  const [canceledCardId, setCanceledCardId] = useState(null)
  const [enabledCardId, setEnabledCardId] = useState(null)
  const [cardUpgradeId, setCardUpgradeId] = useState(null)
  const [cardDowngradeId, setCardDowngradeId] = useState(null)
  const [update, setUpdate] = useState(0)
  // Function to handle automatic renewal
  function automaticRenew(id) {
    setReferenceId(subscriptionData?.[id].paymentMethodCard?.referenceId)
    setVisible(true)
    setCurrentSubscriptionId(subscriptionData?.[id]?.id)
  }

  // Object for mapping active status to icons and colors
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

  // Function to handle confirmation and cancellation of auto-renewal
  const handleConfirmation = async (data = '', comment) => {
    try {
      await cancelAutoRenewal({
        subscriptionId: subscriptionData?.[currentSubscriptionId]?.id,
        SubscriptionRenewalId: subscriptionData?.[currentSubscriptionId]?.id,
        comment,
      })

      dispatch(deleteAutoRenewalById(currentSubscriptionId))
      setCanceledCardId(subscriptionData?.[currentSubscriptionId]?.id)
      setUpdate(update + 1)
      setTimeout(() => {
        setCanceledCardId(null)
      }, 2000)
      setConfirm(false)
    } catch (error) {
      console.error('Error cancelling auto-renewal:', error)
    }
  }

  // Function to handle click on toggle button for auto-renewal
  const handleToggleClick = (id) => {
    setConfirm(true)
    setCurrentSubscriptionId(id)
  }

  // Function to calculate days remaining for trial
  const calculateDaysRemaining = (endDate) => {
    const currentDate = new Date()
    const trialEndDate = new Date(endDate)
    const timeDifference = trialEndDate.getTime() - currentDate.getTime()
    const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))
    return daysRemaining >= 0 ? daysRemaining : 0
  }

  // Fetch subscriptions list on component mount
  useEffect(() => {
    // if (Object.values(subscriptionData).length > 0) {
    //   return
    // }
    const fetchData = async () => {
      try {
        const response = await getSubscriptionsList()
        dispatch(setWorkspaceSubscriptionData(response.data.data))
      } catch (error) {
        console.error('Error fetching subscription data:', error)
      }
    }
    fetchData()
  }, [update])

  // Function to handle opening the upgrade form for a subscription
  const handleOpenUpDowngradeForm = (subscription) => {
    setCurrentSubscription(subscription)
    setShowUpDowngradeForm(true)
  }

  // Function to handle opening the downgrade form for a subscription
  const handleOpenDowngradeForm = (subscription) => {
    setCurrentSubscription(subscription)
    setShowDowngradeForm(true)
  }

  // Fetch subscription data when component mounts
  // useEffect(() => {
  //   // Check if subscription data already exists
  //   if (Object.values(subscriptionData).length > 0) {
  //     return
  //   }
  //   // Fetch subscription data
  //   const fetchData = async () => {
  //     try {
  //       const response = await getSubscriptionsList()
  //       dispatch(setWorkspaceSubscriptionData(response.data.data))
  //     } catch (error) {
  //       console.error('Error fetching subscription data:', error)
  //     }
  //   }
  //   fetchData()
  // }, [])

  // This component renders the subscription list along with various actions and dialogs.

  return (
    <Wrapper>
      {/* UpperContent component for displaying the title */}
      <UpperContent>
        <h4>
          <FormattedMessage id="Subscription-List" />
        </h4>
      </UpperContent>

      {/* Subscription list */}
      <div>
        <Row className="mx-2">
          {subscriptionData &&
            Object.values(subscriptionData).map((subscription) => (
              <Col key={subscription.id} xl={3} lg={4} sm={6}>
                <Card
                  className={`mb-4 ${
                    subscription.id === canceledCardId
                      ? 'card-cancling-hover'
                      : ''
                  }
                  ${
                    subscription.id === enabledCardId
                      ? 'card-enabling-hover'
                      : ''
                  }
                  ${
                    subscription.id === cardUpgradeId
                      ? 'card-upgrade-hover'
                      : ''
                  }
                  ${
                    subscription.id === cardDowngradeId
                      ? 'card-downgrade-hover'
                      : ''
                  }
                  `}
                >
                  <Card.Body>
                    {/* Subscription title with dropdown menu */}
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
                          {/* Dropdown menu for subscription actions */}
                          <Dropdown.Menu>
                            {/* Toggle auto-renewal option */}
                            {subscription.subscriptionRenewalAction
                              .enableAutoRenual &&
                              !subscription.subscriptionRenewalAction
                                .cancelDowngrading &&
                              !subscription.subscriptionRenewalAction
                                .cancelUpgrading && (
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
                              )}{' '}
                            {subscription.subscriptionRenewalAction
                              .cancelAutoRenual && (
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
                                {/* Option 1: Cancel Auto-Renewal */}
                                <FormattedMessage id="Cancel-Auto-Renewal" />
                              </Dropdown.Item>
                            )}
                            {subscription.subscriptionRenewalAction
                              .cancelDowngrading && (
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
                                {/* Option 2: Cancel Downgrading */}
                                <FormattedMessage id="Cancel-Downgrading" />
                              </Dropdown.Item>
                            )}
                            {subscription.subscriptionRenewalAction
                              .cancelUpgrading && (
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
                                {/* Option 3: Cancel Upgrading */}
                                <FormattedMessage id="Cancel-Upgrading" />
                              </Dropdown.Item>
                            )}
                            {/* Upgrade subscription option */}
                            {subscription.subscriptionRenewalAction
                              .enabelUpgrading && (
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
                            )}
                            {/* Downgrade subscription option */}
                            {subscription.subscriptionRenewalAction
                              .enabelDowngrading && (
                              <Dropdown.Item
                                onClick={() =>
                                  handleOpenDowngradeForm(subscription)
                                }
                              >
                                <>
                                  <FontAwesomeIcon
                                    icon={faDownload}
                                    className="me-2"
                                  />
                                  <FormattedMessage id="Downgrade-Subscription" />
                                </>
                              </Dropdown.Item>
                            )}
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </Card.Title>

                    {/* Subscription status */}
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

                    {/* Subscription product */}
                    <Card.Text>
                      <span>
                        <strong>
                          <FormattedMessage id="Product" />
                        </strong>{' '}
                        {subscription.product.displayName}
                      </span>
                    </Card.Text>

                    {/* Subscription trial or plan */}
                    <Card.Text>
                      {subscription?.trial?.endDate ? (
                        <>
                          {' '}
                          <FontAwesomeIcon
                            icon={faExclamationCircle}
                            className="text-danger mr-2"
                          />
                          <strong>
                            <FormattedMessage id="Trial" />
                          </strong>{' '}
                          <span className="text-danger">
                            {calculateDaysRemaining(
                              subscription?.trial?.endDate
                            )}{' '}
                            <FormattedMessage id="Days Remaining" />
                          </span>
                        </>
                      ) : (
                        <span>
                          <strong>
                            <FormattedMessage id="Plan" />
                          </strong>{' '}
                          {subscription.plan.displayName}
                        </span>
                      )}
                    </Card.Text>

                    {/* Subscription creation date */}
                    <Card.Text>
                      <div className="d-flex align-items-center">
                        <strong>
                          <FormattedMessage id="Created-Date" />
                        </strong>

                        <TableDate
                          className="px-2 small"
                          createdDate={formatDate(subscription.createdDate)}
                          editedDate={formatDate(subscription.editedDate)}
                        />
                      </div>
                    </Card.Text>

                    <Card.Text>
                      <div className="d-flex align-items-center">
                        <strong>
                          <FormattedMessage id="Expiration-Date" />
                        </strong>
                        <span className="mx-2">
                          <DateLabel
                            className=" px-2"
                            endDate={subscription.endDate}
                          />
                        </span>
                      </div>
                    </Card.Text>
                    {/* Auto-renewal status */}
                    {subscription.autoRenewalIsEnabled &&
                      !subscription.subscriptionRenewalAction
                        .cancelDowngrading &&
                      !subscription.subscriptionRenewalAction
                        .cancelUpgrading && (
                        <p>
                          <FontAwesomeIcon
                            icon={faSyncAlt}
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
                      )}

                    {subscription.subscriptionRenewalAction
                      .cancelDowngrading && (
                      <p>
                        <FontAwesomeIcon
                          icon={faArrowDown}
                          className="text-info me-2"
                        />
                        <strong>
                          <FormattedMessage id="Downgrade" />
                        </strong>
                        <span className="text-info">
                          {' '}
                          <FormattedMessage id="Enabled" />
                        </span>{' '}
                        {formatDate(subscription.endDate)}
                        {subscription.autoRenewalIsEnabled && (
                          <span>
                            {' '}
                            (
                            <FormattedMessage id="Auto-Renewal" />{' '}
                            <FormattedMessage id="Enabled" />)
                          </span>
                        )}
                      </p>
                    )}

                    {subscription.subscriptionRenewalAction.cancelUpgrading && (
                      <p>
                        <FontAwesomeIcon
                          icon={faArrowUp}
                          className="text-warning me-2"
                        />
                        <strong>
                          <FormattedMessage id="Upgrade" />
                        </strong>
                        <span className="text-warning">
                          {' '}
                          <FormattedMessage id="Enabled" />
                        </span>{' '}
                        {formatDate(subscription.endDate)}
                        {subscription.autoRenewalIsEnabled && (
                          <span>
                            {' '}
                            (
                            <FormattedMessage id="Auto-Renewal" />{' '}
                            <FormattedMessage id="Enabled" />)
                          </span>
                        )}
                      </p>
                    )}

                    {/* If no renewal option is available */}
                    {!subscription.autoRenewalIsEnabled &&
                      !subscription.subscriptionRenewalAction
                        .cancelDowngrading &&
                      !subscription.subscriptionRenewalAction
                        .cancelUpgrading && (
                        <p>
                          <FontAwesomeIcon
                            icon={faTimesCircle}
                            className="text-danger me-2"
                          />
                          <strong>
                            <FormattedMessage id="Renewal-Options" />{' '}
                          </strong>
                          <strong className="text-danger">
                            {' '}
                            <FormattedMessage id="Disabled" />
                          </strong>
                        </p>
                      )}
                    {/* Payment method */}
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
                              cardInfo?.[subscription.paymentMethodCard?.brand]
                                ?.icon || faMoneyCheckDollar
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

      {/* Confirmation dialog for canceling auto-renewal */}
      {confirm && (
        <NoteInputConfirmation
          confirm={confirm}
          setConfirm={setConfirm}
          confirmFunction={handleConfirmation}
          message={<FormattedMessage id="cancel-renew-message" />}
          placeholder={'Comment'}
        />
      )}

      {/* Dialogs for various subscription actions */}
      <ThemeDialog visible={visible} setVisible={setVisible}>
        <>
          {/* Dialog for renewing subscription with cycle */}
          <WorkspaceRenewFormWithCycle
            referenceId={referenceId}
            popupLabel={<FormattedMessage id="Auto-Renewal" />}
            setVisible={setVisible}
            visible={visible}
            currentRenewal={currentSubscriptionId}
            cards={cards}
            setCards={setCards}
            showAddCardForm={showAddCardForm}
            setShowAddCardForm={setShowAddCardForm}
            setEnabledCardId={setEnabledCardId}
            setUpdate={setUpdate}
            update={update}
          />
        </>
      </ThemeDialog>
      <ThemeDialog visible={showAddCardForm} setVisible={setShowAddCardForm}>
        {/* Dialog for adding card and setting to auto-renewal */}
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
          {/* Dialog for upgrading subscription */}
          <WorkspaceUpDowngradeForm
            setEnabledCardId={setCardUpgradeId}
            subscriptionData={currentSubscription}
            setVisible={setShowUpDowngradeForm}
            type="upgrade"
            popupLabel={<FormattedMessage id="Upgrade" />}
            setUpdate={setUpdate}
            update={update}
          />
        </>
      </ThemeDialog>
      <ThemeDialog
        visible={showDowngradeForm}
        setVisible={setShowDowngradeForm}
      >
        <>
          {/* Dialog for downgrading subscription */}
          <WorkspaceUpDowngradeForm
            subscriptionData={currentSubscription}
            setCanceledCardId={setCardDowngradeId}
            setVisible={setShowDowngradeForm}
            type="downgrade"
            popupLabel={<FormattedMessage id="Downgarde" />}
            setUpdate={setUpdate}
            update={update}
          />
        </>
      </ThemeDialog>
    </Wrapper>
  )
}
