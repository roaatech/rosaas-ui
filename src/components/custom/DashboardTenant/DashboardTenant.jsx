import React, { useState } from 'react'
import { Carousel } from 'primereact/carousel'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Wrapper } from './DashboardTenant.styled'
import { Container } from '@themesberg/react-bootstrap'
import UpperContent from '../Shared/UpperContent/UpperContent'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import Tenant from '../../../pages/Tenant/Tenant'
import TenantList from './TenantList/TenantList'
import Profile from './Profile/Profile'
import InvoicesList from './InvoicesList/InvoicesList'
import CardPaymentManagement from '../../../pages/Settings/CardPaymentManagement/CardPaymentManagement'
import PaymentCardsList from '../PaymentCards/PaymentCardsList'

const DashboardTenant = () => {
  const [selectedCard, setSelectedCard] = useState(null)
  const userInfo = useSelector((state) => state.auth.userInfo)
  const cardData = [
    {
      id: 1,
      title: 'Profile',
      icon: '👤',
      link: '#profile',
      content: <Profile />,
    },
    {
      id: 2,
      title: 'Subscriptions',
      icon: '📦',
      link: '#subscribtions',
      content: 'Subscriptions content',
    },
    {
      id: 3,
      title: 'Tenants',
      icon: '🏠',
      link: '#tenants',
      content: <TenantList />,
    },
    {
      id: 4,
      title: 'AutoRenewal',
      icon: '🔄',
      link: '#autoRenewal',
      content: 'AutoRenewal content',
    },
    {
      id: 5,
      title: 'Invoices',
      icon: '💰',
      link: '#invoices',
      content: <InvoicesList />,
    },
    {
      id: 6,
      title: 'Payment Methods',
      icon: '💳',
      link: '#paymentMethods',
      content: <PaymentCardsList />,
    },
  ]

  const onCardSelect = (card) => {
    setSelectedCard(card)
  }

  const cardTemplate = (card) => {
    return (
      <div className="p-d-flex p-flex-column p-ai-center mx-2">
        <Card
          className={`custom-card p-m-2 ${
            selectedCard && selectedCard.id === card.id ? 'active-card' : ''
          }`}
          // className="custom-card p-m-2"
          onClick={() => onCardSelect(card)}
        >
          <span className="icon">{card.icon}</span>
          <div className="card-content">
            <span>{card.title}</span>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <Wrapper>
      {' '}
      <Carousel
        value={cardData}
        numVisible={5}
        numScroll={3}
        itemTemplate={cardTemplate}
      />
      <>
        {selectedCard && <>{selectedCard.content}</>}

        {/* <Button
          className="mx-3"
          label="Close"
          onClick={() => setSelectedCard(null)}
        /> */}
      </>
    </Wrapper>
  )
}

export default DashboardTenant
