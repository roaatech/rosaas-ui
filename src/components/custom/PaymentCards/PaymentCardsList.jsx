import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl' // Assuming you have the react-intl library set up for message formatting
import useRequest from '../../../axios/apis/useRequest'
import DeleteConfirmation from '../global/DeleteConfirmation/DeleteConfirmation'
import {
  Button,
  ButtonGroup,
  Card,
  Dropdown,
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

const PaymentCardsList = () => {
  const { getPaymentCardsList, detachPaymentMethodCard, markCardAsDefault } =
    useRequest()
  const [cards, setCards] = useState([])
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
  // const deleteCard = async () => {
  //   await detachPaymentMethodCard(selectedCardId)
  // }

  const deleteCard = async () => {
    try {
      await detachPaymentMethodCard(selectedCardId)
      // setCards(cards.filter((card) => card.id !== selectedCardId))
    } catch (error) {
      console.error('Error deleting payment card:', error)
    }
  }
  const defaultCard = async (id) => {
    const updatedCards = cards.map((card) => ({
      ...card,
      default: card.stripeCardId === id,
    }))

    setCards(updatedCards)

    try {
      await markCardAsDefault(id)
    } catch (error) {
      console.error('Error deleting payment card:', error)
    }
  }
  const mockPaymentCards = [
    {
      id: 1,
      cardType: 1,
      last4Digits: '1234',
      expireDate: 'Apr 2025',
      fullName: 'Name Name',
    },
    {
      id: 2,
      cardType: 2,
      last4Digits: '5678',
      expireDate: 'Dec 2023',
      fullName: 'Name Name',
    },
    {
      id: 3,
      cardType: 1,
      last4Digits: '9012',
      expireDate: 'Jun 2024',
      fullName: 'Name Name',
    },
  ]
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

      <Card className="m-3 mt-0">
        <Card.Body>
          <div className="payment-cards-container">
            <Table hover className="user-table align-items-center">
              {' '}
              <thead>
                <tr>
                  <th>
                    <FormattedMessage id="Card-Info" />
                  </th>
                  <th>
                    <FormattedMessage id="Full-Name" />
                  </th>
                  <th>
                    <FormattedMessage id="Expiration-Date" />
                  </th>

                  <th>
                    <FormattedMessage id="Actions" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {cards.map((card) => (
                  <tr key={card.stripeCardId}>
                    <td>
                      <div className="d-flex flex-row">
                        <div
                          className="d-flex justify-content-between w-20"
                          style={{ width: '33%' }}
                        >
                          <div className="mb-0">
                            {' '}
                            <span className="px- 1 ">
                              {cardInfo?.[card.brand] ? (
                                cardInfo?.[card.brand]?.icon
                              ) : (
                                <FontAwesomeIcon icon={faMoneyCheckDollar} />
                              )}
                            </span>{' '}
                            {card.brand}
                          </div>

                          <div className="">
                            {' '}
                            <FontAwesomeIcon icon={faEllipsisH} />
                            {card.last4Digits}
                          </div>
                        </div>
                        {card.default && (
                          <div className="px-3">
                            <Label
                              {...{
                                background: '#ffab032b',
                                value: <FormattedMessage id="Default" />,
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </td>
                    <td>{card.cardholderName}</td>
                    <td>
                      {formatExpirationDate(
                        card.expirationMonth,
                        card.expirationYear
                      )}
                    </td>
                    <td>
                      <Dropdown as={ButtonGroup}>
                        <Dropdown.Toggle
                          as={Button}
                          split
                          variant="link"
                          className="text-dark m-0 p-0"
                        >
                          <span className="icon icon-sm">
                            <FontAwesomeIcon
                              icon={faEllipsisH}
                              className="icon-dark"
                            />
                          </span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={() => defaultCard(card.stripeCardId)}
                          >
                            <MdOutlineStarBorder />
                            <FormattedMessage id="Set-As-Default" />
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="text-danger"
                            onClick={() => deleteConfirm(card.stripeCardId)}
                          >
                            <FontAwesomeIcon
                              icon={faTrashAlt}
                              className="mx-2"
                            />
                            <FormattedMessage id="Delete" />
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

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
          </div>
        </Card.Body>
      </Card>
    </Wrapper>
  )
}

export default PaymentCardsList
