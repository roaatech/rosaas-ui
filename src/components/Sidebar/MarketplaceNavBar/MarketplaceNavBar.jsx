import React, { useState, useEffect } from 'react'
import { Menubar } from 'primereact/menubar'
import { Wrapper } from './MarketplaceNavBar.styled'
import { useDispatch, useSelector } from 'react-redux'
import useRequest from '../../../axios/apis/useRequest'
import useGlobal from '../../../lib/hocks/global'
import { logOut } from '../../../store/slices/auth'
import { matchPath, useLocation, useNavigate } from 'react-router-dom'
import { Routes } from '../../../routes'
import { setPublicCurrenciesList } from '../../../store/slices/currenciesSlice'
import { Toast } from 'primereact/toast'
import SafeFormatMessage from '../../custom/Shared/SafeFormatMessage/SafeFormatMessage'
import { useIntl } from 'react-intl'
import EnvironmentAlert from '../../Navbar/EnvironmentAlert/EnvironmentAlert'

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
        end: true,
      },
      location.pathname
    )
  )
  const step = useSelector((state) => state.tenants.currentStep)
  const { locale } = useIntl()
  const isRtl = locale === 'ar'

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

          const primaryCurrency = Object.values(currencies).find(
            (currency) => currency.isPrimaryCurrency
          )
          if (
            primaryCurrency &&
            (!selectedCurrency || selectedCurrency == 'null')
          ) {
            setCurrency(primaryCurrency.currencyCode, primaryCurrency.id)
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
    setTimeout(() => setToast(null), 3000)
  }
  const signInShow = false

  // Left side menu items
  const leftSideItems = isRunningInIframe
    ? [
        {
          label: `Currency (${selectedCurrency})`,
          icon: 'pi pi-fw pi-money-bill',
          items: currencyItems,
        },
        {
          label:
            direction === 'rtl' ? (
              <SafeFormatMessage id="English" />
            ) : (
              <SafeFormatMessage id="Arabic" />
            ),
          icon: 'pi pi-fw pi-globe',
          command: () => changeDirection(direction === 'rtl' ? 'ltr' : 'rtl'),
        },
      ]
    : [
        {
          label: <SafeFormatMessage id="Home" />,
          icon: 'pi pi-fw pi-home',
          command: () => navigate(Routes.mainPage.path),
        },

        {
          label:
            direction === 'rtl' ? (
              <SafeFormatMessage id="English" />
            ) : (
              <SafeFormatMessage id="Arabic" />
            ),
          icon: 'pi pi-fw pi-globe',
          command: () => changeDirection(direction === 'rtl' ? 'ltr' : 'rtl'),
        },
        {
          label: (
            <span>
              <SafeFormatMessage id="Currency" /> ({selectedCurrency})
            </span>
          ),

          icon: 'pi pi-fw pi-money-bill',
          items: currencyItems,
        },
        {
          label: <SafeFormatMessage id="Marketplace" />,
          icon: 'pi pi-fw pi-shopping-cart',
          command: () => navigate(Routes.marketPlacePage.path),
        },
      ]

  // Right side menu items
  const rightSideItems = !isRunningInIframe && [
    ...(userInfo.email
      ? [
          {
            label: userInfo.email,
            icon: 'pi pi-fw pi-user',
            items: [
              {
                label: <SafeFormatMessage id="Logout" />,
                icon: 'pi pi-fw pi-sign-out',
                command: () => {
                  dispatch(logOut())
                  navigate(Routes.mainPage.path)
                },
              },
            ],
          },
          {
            icon: 'pi pi-fw pi-sign-out',
            command: () => {
              dispatch(logOut())
              navigate(Routes.mainPage.path)
            },
          },
        ]
      : signInShow
      ? [
          {
            label: <SafeFormatMessage id="Product-Management-Area" />,
            icon: 'pi pi-fw pi-cog',
            command: () => navigate(Routes.ProductManagementSignIn.path),
          },
          {
            label: <SafeFormatMessage id="signIn" />,
            icon: 'pi pi-fw pi-sign-in',
            command: () => navigate(Routes.SignInTenantAdmin.path),
          },
        ]
      : [
          {
            label: <SafeFormatMessage id="Product-Management-Area" />,
            icon: 'pi pi-fw pi-cog',
            command: () => navigate(Routes.ProductManagementSignIn.path),
          },
        ]),
  ]

  useEffect(() => {
    const storedCurrency = localStorage.getItem('currencyCode')
    if (storedCurrency) {
      setSelectedCurrency(storedCurrency)
    }
  }, [])
  const [mergedItems, setMergedItems] = useState(leftSideItems)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 960) {
        // Filter out the "sign out" item from rightSideItems
        const filteredRightSideItems = rightSideItems.filter(
          (item) => item.icon !== 'pi pi-fw pi-sign-out'
        )
        setMergedItems([...filteredRightSideItems, ...leftSideItems])
      } else {
        setMergedItems(leftSideItems)
      }
    }

    window.addEventListener('resize', handleResize)

    // Run initially to set the correct state on component mount
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [window.innerWidth])
  return (
    <Wrapper>
      <div className="card">
        {loading && <div className="progress-indicator">Loading...</div>}
        <Menubar
          model={mergedItems}
          end={
            <ul className="p-menubar-root-list">
              {rightSideItems &&
                rightSideItems.map((item, index) => (
                  <li
                    key={index}
                    onClick={item.command}
                    className="p-menuitem-link"
                    style={{
                      borderRadius: '6px',
                      padding: '8px 15px',
                      textAlign: isRtl ? 'right' : 'left',
                    }}
                  >
                    <span
                      className={item.icon}
                      style={{
                        marginRight: isRtl ? '0' : '5px',
                        marginLeft: isRtl ? '5px' : '0',
                      }}
                    ></span>
                    <span>{item.label}</span>
                  </li>
                ))}
            </ul>
          }
          style={{ justifyContent: 'space-between', display: 'flex' }}
        />

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
