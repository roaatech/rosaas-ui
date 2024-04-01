import React, { useEffect, useMemo, useState } from 'react'
import { Carousel } from 'primereact/carousel' // Importing Carousel component from PrimeReact
import { Card } from 'primereact/card' // Importing Card component from PrimeReact
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome' // Importing FontAwesomeIcon component from Font Awesome
import { Container } from '@themesberg/react-bootstrap' // Importing Container component from React Bootstrap
import { FormattedMessage } from 'react-intl' // Importing FormattedMessage component from react-intl
import { useSelector } from 'react-redux' // Importing useSelector hook from react-redux
import { useNavigate } from 'react-router-dom' // Importing useNavigate hook from react-router-dom
import { Wrapper } from './WorkSpace.styled' // Importing Wrapper component from WorkSpace.styled
import UpperContent from '../Shared/UpperContent/UpperContent' // Importing UpperContent component
import TenantList from './TenantList/TenantList' // Importing TenantList component
import Profile from './Profile/Profile' // Importing Profile component
import InvoicesList from './InvoicesList/InvoicesList' // Importing InvoicesList component
import PaymentCardsList from '../PaymentCards/PaymentCardsList' // Importing PaymentCardsList component
import SubscriptionList from './SubscriptionsList/SubscriptionsList' // Importing SubscriptionList component
import AutoRenewalList from './AutoRenewalList/AutoRenewalList' // Importing AutoRenewalList component
import {
  faBox,
  faClipboardList,
  faCreditCard,
  faMoneyBill,
  faSync,
  faTachometerAlt,
  faUser,
} from '@fortawesome/free-solid-svg-icons' // Importing Font Awesome icons

const WorkSpace = () => {
  const navigate = useNavigate() // Initializing useNavigate hook
  const cardData = useMemo(
    () => [
      // Memoizing card data
      {
        id: 1,
        title: <FormattedMessage id="tenantsTitle" />, // Localized title using FormattedMessage
        icon: <FontAwesomeIcon icon={faClipboardList} />, // Icon using FontAwesomeIcon
        link: '#tenants',
        content: <TenantList />, // Content for TenantList component
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
        content: <AutoRenewalList />,
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
  const [selectedCard, setSelectedCard] = useState(null) // State for selected card
  const [pageNum, setPageNum] = useState(0) // State for page number
  const numVisible = 5 // Number of visible items in the carousel

  // Function to handle card selection
  const onCardSelect = (card) => {
    setSelectedCard(card) // Set selected card
    navigate(`${card.link}`) // Navigate to the link associated with the selected card
  }

  const [activeIndex, setActiveIndex] = useState(0) // State for active index

  const hash = window.location.hash // Get hash from window location
  useEffect(() => {
    const selectedTab = cardData.find((card) => card.link === hash) // Find selected tab based on hash
    if (selectedTab) {
      setSelectedCard(selectedTab) // Set selected card
      const index = cardData.findIndex((item) => item.id === selectedTab.id) // Get index of selected tab
      setActiveIndex(index) // Set active index
    } else {
      setActiveIndex(0) // Set active index to default
    }
    setPageNum(Math.floor(activeIndex / numVisible)) // Set page number based on active index
  }, [cardData, activeIndex, hash])

  // Template for rendering each card in the carousel
  const cardTemplate = (card) => (
    <div className="p-d-flex p-flex-column p-ai-center mx-2">
      <Card
        className={`custom-card p-m-2 ${
          selectedCard && selectedCard.id === card.id ? 'active-card' : ''
        }`}
        onClick={() => onCardSelect(card)} // Handle click event
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
              {/* Render icon */}
              <FontAwesomeIcon icon={faTachometerAlt} className="mr-2" />{' '}
              <FormattedMessage id="Workspace" /> {/* Localized message */}
            </h1>
            <p>
              <FormattedMessage id="Welcome-to-your-dashboard" />{' '}
              {/* Localized message */}
            </p>
          </div>
        </div>
      </section>
      <Carousel
        value={cardData} // Set carousel value
        numVisible={numVisible} // Set number of visible items
        numScroll={3} // Set number of items to scroll
        itemTemplate={cardTemplate} // Set item template
        activeIndex={activeIndex} // Set active index
        page={pageNum} // Set page number
      />
      <div className="pb-2">
        {/* Render the content of the selected card if it exists */}
        {selectedCard && <>{selectedCard.content}</>}
      </div>{' '}
    </Wrapper>
  )
}

export default WorkSpace
