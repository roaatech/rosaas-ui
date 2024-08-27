import React, { useState, useEffect } from 'react'
import { Menubar } from 'primereact/menubar'
import { Wrapper } from './MarketplaceNavBar.styled'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import useRequest from '../../../axios/apis/useRequest'
import { directionFun } from '../../../store/slices/main'
import useGlobal from '../../../lib/hocks/global'
import { logOut } from '../../../store/slices/auth'
import { useNavigate } from 'react-router-dom'
import { Routes } from '../../../routes'

const MarketplaceNavBar = ({ profile }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const direction = useSelector((state) => state.main.direction)
  const userInfo = useSelector((state) => state.auth.userInfo)
  const { currenciesList } = useRequest()
  const { setCurrency } = useGlobal()

  // State to keep track of the selected currency code
  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    return localStorage.getItem('selectedCurrency') || 'USD' // Default to USD or fetch from localStorage
  })

  const mockCurrenciesList = [
    { displayName: 'US Dollar', currencyCode: 'USD' },
    { displayName: 'Euro', currencyCode: 'EUR' },
    { displayName: 'Saudi Riyal', currencyCode: 'SAR' },
    { displayName: 'Japanese Yen', currencyCode: 'JPY' },
    { displayName: 'British Pound', currencyCode: 'GBP' },
  ]

  const currencyItems = mockCurrenciesList.map((currency) => ({
    label: currency.displayName,
    command: () => {
      setCurrency(currency.currencyCode)
      setSelectedCurrency(currency.currencyCode) // Update selected currency code in state
    },
  }))

  const items = [
    // Profile email and logout options as the first item if profile is true
    ...(profile && userInfo.email
      ? [
          {
            label: userInfo.email,
            icon: 'pi pi-fw pi-user',
            items: [
              {
                label: <FormattedMessage id="Logout" />,
                icon: 'pi pi-fw pi-sign-out',
                command: () => {
                  dispatch(logOut())
                },
              },
            ],
          },
        ]
      : []),
    {
      label: <FormattedMessage id="Home" />,
      icon: 'pi pi-fw pi-home',
      command: () => {
        navigate(Routes.mainPage.path) // Navigate to the home page
      },
    },
    {
      label: <FormattedMessage id="Marketplace" />,
      icon: 'pi pi-fw pi-shopping-cart',
      command: () => {
        navigate(Routes.marketPlacePage.path) // Navigate to the marketplace page
      },
    },
    {
      label:
        direction === 'rtl' ? (
          <FormattedMessage id="English" />
        ) : (
          <FormattedMessage id="Arabic" />
        ),
      icon: 'pi pi-fw pi-globe',
      command: () => {
        dispatch(directionFun(direction === 'rtl' ? 'ltr' : 'rtl'))
      },
    },
    {
      label: `Currency (${selectedCurrency})`, // Dynamically display selected currency
      icon: 'pi pi-fw pi-money-bill',
      items: currencyItems,
    },
  ]

  useEffect(() => {
    const storedCurrency = localStorage.getItem('selectedCurrency')
    if (storedCurrency) {
      setSelectedCurrency(storedCurrency)
    }
  }, [])

  return (
    <Wrapper>
      <div className="card">
        <Menubar model={items} />
      </div>
    </Wrapper>
  )
}

export default MarketplaceNavBar
