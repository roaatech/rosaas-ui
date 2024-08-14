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
import renderAutoRenewals from './renderAutoRenewals/renderAutoRenewals.jsx'
import renderUpgradeRenewals from './renderUpgradeRenewals/renderUpgradeRenewals.jsx'
import renderDowngradeRenewals from './renderDowngradeRenewals/renderDowngradeRenewals.jsx'
import WorkspaceRenewFormWithCycle from '../SubscriptionsList/WorkspaceRenewFormWithCycle/WorkspaceRenewFormWithCycle.jsx'

export default function RenewalsList() {
  const { getAutoRenewalList } = useRequest()
  const RenewalsData = useSelector((state) => state.workspace.autoRenewalData)
  const dispatch = useDispatch()
  const { cancelAutoRenewal } = useRequest()
  const [showRenewForm, setShowRenewForm] = useState(false)
  const [currentSubscription, setCurrentSubscription] = useState(null)
  const [cards, setCards] = useState()
  const [update, setUpdate] = useState(0)
  const [enabledCardId, setEnabledCardId] = useState(null)

  useEffect(() => {
    const fetchAutoRenewalData = async () => {
      if (Object.values(RenewalsData).length > 1) {
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
    setTimeout(() => {
      dispatch(deleteAllAutoRenewalIds())
    }, 5000)
  }, [])

  const handleCancelAutoRenewal = async (id, subscriptionId) => {
    try {
      await cancelAutoRenewal({ subscriptionId, subscriptionRenewalId: id })
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
  const [referenceId, setReferenceId] = useState('')
  const [visible, setVisible] = useState(false) // State for modal visibility
  const [currentSubscriptionId, setCurrentSubscriptionId] = useState('')

  function automaticRenew(id) {
    setReferenceId(RenewalsData?.[id].paymentMethodCard?.referenceId)
    setVisible(true)
    setCurrentSubscriptionId(RenewalsData?.[id]?.id)
  }
  const handleOpenRenewForm = (subscription) => {
    setCurrentSubscription(subscription.subscription)
    setShowRenewForm(true)
  }
  const renderRenewals = (renewal) => {
    switch (renewal?.type) {
      case 1:
        return renderUpgradeRenewals({
          renewal,
          RenewalsData,
          formatDate,
          handleCancelAutoRenewal,
          CreditCard,
          cardInfo,
          automaticRenew,
        })
      case 2:
        return renderDowngradeRenewals({
          renewal,
          formatDate,
          handleCancelAutoRenewal,
          CreditCard,
          cardInfo,
          RenewalsData,
          automaticRenew,
        })
      case 3:
        return renderAutoRenewals({
          renewal,
          RenewalsData,
          formatDate,
          handleCancelAutoRenewal,
          CreditCard,
          cardInfo,
        })
      default:
        return null
    }
  }
  const [updatedRenewalData, setUpdatedRenewalData] = useState()
  useEffect(() => {
    if (!RenewalsData) {
      return
    }
    const data = Object.values(RenewalsData).map((autorenewal) =>
      renderRenewals(autorenewal)
    )
    setUpdatedRenewalData(data)
  }, [RenewalsData])

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
          {RenewalsData &&
            Object.values(RenewalsData).map((renewal) => {
              return renderRenewals(renewal)
            })}
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
            setEnabledCardId={setEnabledCardId}
            setUpdate={setUpdate}
            update={update}
          />
        </>
      </ThemeDialog>
    </Wrapper>
  )
}
