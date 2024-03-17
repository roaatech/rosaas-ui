import React, { useEffect, useMemo, useState } from 'react'
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBox,
  faClipboardList,
  faCreditCard,
  faHome,
  faMoneyBill,
  faSync,
  faTachometerAlt,
  faUser,
  faUsers,
  faUsersBetweenLines,
} from '@fortawesome/free-solid-svg-icons'
import SubscriptionList from './SubscriptionsList/SubscriptionsList'
import { useNavigate } from 'react-router-dom'

const DashboardTenant = () => {
  const userInfo = useSelector((state) => state.auth.userInfo)
  const navigate = useNavigate()
  const cardData = useMemo(
    () => [
      {
        id: 1,
        title: <FormattedMessage id="tenantsTitle" />,
        icon: <FontAwesomeIcon icon={faClipboardList} />,
        link: '#tenants',
        content: <TenantList />,
      },
      {
        id: 2,
        title: <FormattedMessage id="subscriptionsTitle" />,
        icon: <FontAwesomeIcon icon={faBox} />,
        link: '#subscriptions',
        content: <SubscriptionList />,
      },
      {
        id: 3,
        title: <FormattedMessage id="autoRenewalTitle" />,
        icon: <FontAwesomeIcon icon={faSync} />,
        link: '#autoRenewal',
        content: 'AutoRenewal content',
      },
      {
        id: 4,
        title: <FormattedMessage id="invoicesTitle" />,
        icon: <FontAwesomeIcon icon={faMoneyBill} />,
        link: '#invoices',
        content: <InvoicesList />,
      },
      {
        id: 5,
        title: <FormattedMessage id="paymentMethodsTitle" />,
        icon: <FontAwesomeIcon icon={faCreditCard} />,
        link: '#paymentMethods',
        content: <PaymentCardsList />,
      },
      {
        id: 6,
        title: <FormattedMessage id="profileTitle" />,
        icon: <FontAwesomeIcon icon={faUser} />,
        link: '#profile',
        content: <Profile />,
      },
    ],
    []
  )
  const [selectedCard, setSelectedCard] = useState(null)
  const [pageNum, setPageNum] = useState(0)
  const numVisible = 5
  const onCardSelect = (card) => {
    setSelectedCard(card)
    navigate(`${card.link}`)
  }
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const hash = window.location.hash
    const selectedTab = cardData.find((card) => card.link === hash)
    if (selectedTab) {
      setSelectedCard(selectedTab)
      const index = cardData.findIndex((item) => item.id === selectedTab.id)
      setActiveIndex(index)
    } else {
      setActiveIndex(0)
    }
    setPageNum(Math.floor(activeIndex / numVisible))
  }, [cardData, activeIndex])

  const cardTemplate = (card) => (
    <div className="p-d-flex p-flex-column p-ai-center mx-2">
      <Card
        className={`custom-card p-m-2 ${
          selectedCard && selectedCard.id === card.id ? 'active-card' : ''
        }`}
        onClick={() => onCardSelect(card)}
      >
        <span className="icon">{card.icon}</span>
        <div className="card-content">{card.title}</div>
      </Card>
    </div>
  )

  return (
    <Wrapper>
      <section className=" mt-4 mb-4 pb-3">
        <div className="row justify-content-center">
          <div className="col-lg-12 text-center mb-3">
            <h1>
              <FontAwesomeIcon icon={faTachometerAlt} className="mr-2" />
              <FormattedMessage id="Workspace" />
            </h1>
            <p>
              <FormattedMessage id="Welcome-to-your-dashboard" />
            </p>
          </div>
        </div>
      </section>
      <Carousel
        value={cardData}
        numVisible={numVisible}
        numScroll={3}
        itemTemplate={cardTemplate}
        activeIndex={activeIndex}
        page={pageNum}
      />
      <div className="pb-2">{selectedCard && <>{selectedCard.content}</>}</div>
    </Wrapper>
  )
}

export default DashboardTenant
