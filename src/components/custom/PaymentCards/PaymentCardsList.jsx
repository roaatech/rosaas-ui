import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl' // Assuming you have the react-intl library set up for message formatting
import useRequest from '../../../axios/apis/useRequest'
import DeleteConfirmation from '../global/DeleteConfirmation/DeleteConfirmation'
import {
  Button,
  ButtonGroup,
  Card,
  Col,
  Dropdown,
  Row,
  Table,
} from '@themesberg/react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEllipsisH,
  faMoneyCheckDollar,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons'
import { cardInfo } from '../../../const/cardPayment'
import { Wrapper } from './PaymentCardsList.styled'
import { faCcMastercard } from '@fortawesome/free-brands-svg-icons'
import UpperContent from '../Shared/UpperContent/UpperContent'
import DynamicButtons from '../Shared/DynamicButtons/DynamicButtons'
import { BsPlusCircleFill } from 'react-icons/bs'
import { MdOutlineStar, MdOutlineStarBorder } from 'react-icons/md'
import Label from '../Shared/label/Label'
import CreditCard from '../CreditCard/CreditCard'

const PaymentCardsList = () => {
  const { getPaymentCardsList, detachPaymentMethodCard, markCardAsDefault } =
    useRequest()
  const [cards, setCards] = useState([])
  console.log(cards)
  const [confirm, setConfirm] = useState(false)
  const [update, setUpdate] = useState(1)
  const [selectedCardId, setSelectedCardId] = useState(null)
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const cardsData = await getPaymentCardsList()
        setCards(cardsData.data.data)
      } catch (error) {
        console.error('Error fetching payment cards:', error)
      }
    }

    fetchCards()
  }, [update])
  const deleteConfirm = (id) => {
    setSelectedCardId(id)
    setConfirm(true)
  }

  const deleteCard = async () => {
    try {
      await detachPaymentMethodCard(selectedCardId)
      setUpdate((prev) => prev + 1)
    } catch (error) {
      console.error('Error deleting payment card:', error)
    }
  }
  const defaultCard = async (id) => {
    const updatedCards = cards.map((card) => ({
      ...card,
      default: card.stripeCardId === id,
    }))

    try {
      await markCardAsDefault(id)
      setCards(updatedCards)
      setUpdate((prev) => prev + 1)
    } catch (error) {
      console.error('Error deleting payment card:', error)
    }
  }

  function formatExpirationDate(expirationMonth, expirationYear) {
    const expirationDate = new Date(expirationYear, expirationMonth - 1)

    const monthName = expirationDate.toLocaleString('en-US', {
      month: 'short',
    })
    const year = expirationDate.getFullYear()

    return `${monthName} ${year}`
  }
  return (
    <Wrapper>
      <UpperContent>
        <h4 className="m-0">
          <FormattedMessage id="Card-Management" />
        </h4>
        <DynamicButtons
          buttons={[
            {
              order: 1,
              type: 'form',
              label: 'Add-Card',
              component: 'addCard',
              icon: <BsPlusCircleFill />,
              setCards: setCards,
              cards: cards,
            },
          ]}
        />
      </UpperContent>

      <Card className=" mt-0">
        <Card.Body>
          <Row className="g-4">
            {cards.map((card) => (
              <Col key={card.stripeCardId} lg={3} sm={4}>
                <CreditCard
                  cardTypeIcon={
                    cardInfo?.[card.brand]?.icon || faMoneyCheckDollar
                  }
                  cardNumber={card.last4Digits}
                  expiryDate={`${card.expirationMonth} / ${card.expirationYear}`}
                  cardHolder={card.cardholderName}
                  isDefault={card.isDefault}
                  onSetAsDefault={() => defaultCard(card.stripeCardId)}
                  onDelete={() => deleteConfirm(card.stripeCardId)}
                />
              </Col>
            ))}
          </Row>

          <DeleteConfirmation
            message="Do you want to delete this Tenant?"
            icon="pi pi-exclamation-triangle"
            confirm={confirm}
            setConfirm={setConfirm}
            confirmFunction={deleteCard}
            update={update}
            setUpdate={setUpdate}
            sideBar={false}
          />
        </Card.Body>
      </Card>
    </Wrapper>
  )
}

export default PaymentCardsList
