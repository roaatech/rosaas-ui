import React, { useState, useEffect } from 'react'
import { Menubar } from 'primereact/menubar'
import { Wrapper } from './MarketplaceNavBar.styled'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import useRequest from '../../../axios/apis/useRequest'
import { directionFun } from '../../../store/slices/main'
import useGlobal from '../../../lib/hocks/global'
import { logOut } from '../../../store/slices/auth'
import { matchPath, useLocation, useNavigate } from 'react-router-dom'
import { Routes } from '../../../routes'
import { setPublicCurrenciesList } from '../../../store/slices/currenciesSlice'
import { Toast } from 'primereact/toast'

const MarketplaceNavBar = ({ profile }) => {
  const isRunningInIframe = window.self !== window.top
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const direction = useSelector((state) => state.main.direction)
  const userInfo = useSelector((state) => state.auth.userInfo)
  const { getCurrenciesPublishList, checkOrderCurrencyChange } = useRequest()
  const { setCurrency, changeDirection } = useGlobal()
  const isMatch = Boolean(
    matchPath(
      {
        path: Routes.CheckOut.path,
        end: true, // or false if you want partial match
      },
      location.pathname
    )
  )
  const step = useSelector((state) => state.tenants.currentStep)

  const [selectedCurrency, setSelectedCurrency] = useState(() =>
    localStorage.getItem('currencyCode')
  )
  const [loading, setLoading] = useState(false)

  const [toast, setToast] = useState(null)

  const publicCurrenciesList = useSelector(
    (state) => state.currenciesSlice?.publicCurrenciesList
  )
  const hash = window.location.hash
  const orderId = hash.split('#')

  const currencyItems =
    publicCurrenciesList &&
    Object.values(publicCurrenciesList).map((currency) => ({
      label: currency.displayName,
      command: async () => {
        if (isMatch && step === 2) {
          setLoading(true)
          try {
            const response = await checkOrderCurrencyChange(orderId[1], {
              currencyId: currency.id,
            })

            if (response.status == 200) {
              console.log('**************8888888888')

              setCurrency(currency.currencyCode, currency.id)
              setSelectedCurrency(currency.currencyCode)
              localStorage.setItem('currencyCode', currency.currencyCode)
              localStorage.setItem('currencyId', currency.id)
              showToast('Currency changed successfully!', 'success')
            } else {
              showToast('Failed to change currency. Please try again.', 'error')
            }
          } catch (error) {
            console.error('Error changing currency:', error)
            showToast('An error occurred while changing currency.', 'error')
          } finally {
            setLoading(false)
          }
        } else {
          setCurrency(currency.currencyCode, currency.id)
          setSelectedCurrency(currency.currencyCode)
          localStorage.setItem('currencyCode', currency.currencyCode)
          localStorage.setItem('currencyId', currency.id)
        }
      },
    }))

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await getCurrenciesPublishList('/currencies')
        if (response && response.data) {
          const currencies = response.data.data
          dispatch(setPublicCurrenciesList(currencies))

          // Find and store the primary currency
          const primaryCurrency = Object.values(currencies).find(
            (currency) => currency.isPrimaryCurrency
          )
          if (primaryCurrency && !selectedCurrency) {
            localStorage.setItem('currencyCode', primaryCurrency.currencyCode)
            localStorage.setItem('currencyId', primaryCurrency.id)
            setSelectedCurrency(primaryCurrency.currencyCode)
          }
        }
      } catch (error) {
        console.error('Failed to fetch currencies:', error)
      }
    }

    fetchCurrencies()
  }, [dispatch, selectedCurrency])

  const showToast = (message, severity) => {
    setToast({ message, severity })
    setTimeout(() => setToast(null), 3000) // Hide toast after 3 seconds
  }

  const items = isRunningInIframe
    ? [
        {
          label: `Currency (${selectedCurrency})`,
          icon: 'pi pi-fw pi-money-bill',
          items: currencyItems,
        },
        {
          label:
            direction === 'rtl' ? (
              <FormattedMessage id="English" />
            ) : (
              <FormattedMessage id="Arabic" />
            ),
          icon: 'pi pi-fw pi-globe',
          command: () => changeDirection(direction === 'rtl' ? 'ltr' : 'rtl'),
        },
      ]
    : [
        ...(profile && userInfo.email
          ? [
              {
                label: userInfo.email,
                icon: 'pi pi-fw pi-user',
                items: [
                  {
                    label: <FormattedMessage id="Logout" />,
                    icon: 'pi pi-fw pi-sign-out',
                    command: () => dispatch(logOut()),
                  },
                ],
              },
            ]
          : []),
        {
          label: <FormattedMessage id="Home" />,
          icon: 'pi pi-fw pi-home',
          command: () => navigate(Routes.mainPage.path),
        },
        {
          label: <FormattedMessage id="Marketplace" />,
          icon: 'pi pi-fw pi-shopping-cart',
          command: () => navigate(Routes.marketPlacePage.path),
        },
        {
          label:
            direction === 'rtl' ? (
              <FormattedMessage id="English" />
            ) : (
              <FormattedMessage id="Arabic" />
            ),
          icon: 'pi pi-fw pi-globe',
          command: () =>
            dispatch(directionFun(direction === 'rtl' ? 'ltr' : 'rtl')),
        },
        {
          label: `Currency (${selectedCurrency})`,
          icon: 'pi pi-fw pi-money-bill',
          items: currencyItems,
        },
      ]

  useEffect(() => {
    const storedCurrency = localStorage.getItem('currencyCode')
    if (storedCurrency) {
      setSelectedCurrency(storedCurrency)
    }
  }, [])

  return (
    <Wrapper>
      <div className="card">
        {loading && <div className="progress-indicator">Loading...</div>}{' '}
        {/* Show a progress indicator */}
        <Menubar model={items} />
        {toast && (
          <Toast
            severity={toast.severity}
            summary={toast.message}
            detail={''}
            className="p-toast-bottom-right"
          />
        )}
      </div>
    </Wrapper>
  )
}

export default MarketplaceNavBar
