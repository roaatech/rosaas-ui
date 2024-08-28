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
import { setPublicCurrenciesList } from '../../../store/slices/currenciesSlice'

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
    { id: 1, displayName: 'US Dollar', currencyCode: 'USD' },
    { id: 2, displayName: 'Euro', currencyCode: 'EUR' },
    { id: 3, displayName: 'Saudi Riyal', currencyCode: 'SAR' },
    { id: 4, displayName: 'Japanese Yen', currencyCode: 'JPY' },
    { id: 5, displayName: 'British Pound', currencyCode: 'GBP' },
  ]

  const currencyItems = mockCurrenciesList.map((currency) => ({
    label: currency.displayName,
    command: () => {
      setCurrency(currency.currencyCode, currency.id)
      setSelectedCurrency(currency.currencyCode) // Update selected currency code in state
    },
  }))
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        // const response = await request('/currencies') // Adjust the endpoint as needed
        // if (response && response.data) {
        dispatch(setPublicCurrenciesList(mockCurrenciesList)) // Dispatch action to update the Redux store
        // }
      } catch (error) {
        console.error('Failed to fetch currencies:', error)
      }
    }

    fetchCurrencies()
  }, [mockCurrenciesList])

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
