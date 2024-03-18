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
} from '@fortawesome/free-solid-svg-icons'
import { FormattedMessage } from 'react-intl'
import useRequest from '../../../../axios/apis/useRequest'
import { Wrapper } from './AutoRenewalList.styled'
import { useDispatch, useSelector } from 'react-redux'
import {
  cancelAutoRenewal,
  changeSubscriptionAttribute,
  deleteAutoRenewalById,
  setAllAutoRenewal,
} from '../../../../store/slices/workSpace'
import ThemeDialog from '../../Shared/ThemeDialog/ThemeDialog.jsx'
import RenewForm from '../../tenant/SubscriptionManagement/RenewForm/RenewForm.jsx' // Adjust import path as per your project structure
import WorkspaceRenewForm from '../SubscriptionsList/WorkspaceRenewForm/WorkspaceRenewForm.jsx'

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
  useEffect(() => {
    const fetchAutoRenewalData = async () => {
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
      <Card className="m-3 p-3 mt-0">
        <div>
          <Row>
            {autoRenewalData &&
              Object.values(autoRenewalData).map((autorenewal) => (
                <Col key={autorenewal.id} md={3}>
                  <Card className="mb-4">
                    <Card.Body>
                      <Card.Title>
                        <div className="d-flex justify-content-between">
                          {autorenewal.subscription.displayName}{' '}
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
                              <Dropdown.Item
                                onClick={() =>
                                  handleCancelAutoRenewal(
                                    autorenewal.id,
                                    autorenewal.subscription.id
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
                          </Dropdown>
                        </div>
                      </Card.Title>
                      <p>
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          className={`text-success`}
                        />{' '}
                        <strong>
                          <FormattedMessage id="Auto-Renewal" />
                        </strong>{' '}
                        <span className="text-success">{'Active'}</span>
                      </p>
                      <Card.Text>
                        <span>
                          <strong>
                            <FormattedMessage id="Plan" />
                          </strong>{' '}
                          {autorenewal.plan.displayName}
                        </span>
                      </Card.Text>
                      <Card.Text>
                        <div className="d-flex align-items-center">
                          <strong>
                            <FormattedMessage id="Created-Date" />
                          </strong>{' '}
                          {autorenewal.createdDate}
                        </div>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
          </Row>
        </div>
      </Card>

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
