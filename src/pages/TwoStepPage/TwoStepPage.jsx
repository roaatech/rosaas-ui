import { Card, Row } from '@themesberg/react-bootstrap'
import { useEffect, useState } from 'react'
import CheckoutTenantReg from '../../components/custom/TenantRegForm/TenantRegForm'
import CheckoutPage from '../../components/custom/CheckoutStep/CheckoutStep'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Steps } from 'primereact/steps'
import {
  faInfoCircle,
  faMoneyCheckDollar,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'
import { FormattedMessage } from 'react-intl'
import { Wrapper } from './TwoStepPage.styled'

import { setStep } from '../../store/slices/tenants'
import useRequest from '../../axios/apis/useRequest'
import PaymentForm from '../../components/custom/PaymentForm/PaymentForm'
import MarketplaceNavBar from '../../components/Sidebar/MarketplaceNavBar/MarketplaceNavBar'
import { setProductOwner } from '../../store/slices/main'
import { deleteAllPlanPriceBySystemName } from '../../store/slices/products/productsSlice'

const TwoStepProcessPage = () => {
  const params = useParams()

  const hash = window.location.hash

  const array = hash.split('#')
  const orderIDParam = array.find(
    (element) => element !== '' && element !== 'start-with-trial'
  )

  const dispatch = useDispatch()
  const [displayName, setDisplayName] = useState()
  const step = useSelector((state) => state.tenants.currentStep)
  const [currentTenant, setCurrentTenant] = useState('')
  const [orderID, setOrderID] = useState('')
  const { getProductPlanPricePublic } = useRequest()
  const { productSystemName, productOwnerSystemName, priceName } = useParams()

  useEffect(() => {
    if (!orderIDParam) {
      return
    }
    dispatch(setStep(2))
  }, [orderIDParam])

  let userRole = useSelector((state) => state.auth.userInfo.userType)
  if (userRole == undefined) userRole = 'notAuth'

  useEffect(() => {
    if (!productOwnerSystemName) {
      return
    }
    dispatch(setProductOwner(productOwnerSystemName))
  }, [productOwnerSystemName])

  const [hasToPay, setHasToPay] = useState()
  const [priceData, setPriceData] = useState()
  const [trialPlanId, setTrialPlanId] = useState('')
  const currency = useSelector((state) => state.main.currency)
  // useEffect(() => {
  //   dispatch(deleteAllPlanPriceBySystemName({ systemName: productSystemName }))
  //   setPriceData(null)
  // }, [currency])
  useEffect(() => {
    // if (priceData || (priceData && Object.values(priceData).length) > 0) {
    //   return
    // }
    ;(async () => {
      const price = await getProductPlanPricePublic(
        productOwnerSystemName,
        productSystemName,
        priceName
      )
      setPriceData(price.data.data)
      price.data.data && setTrialPlanId(price.data.data?.product.trialPlanId)
    })()
  }, [productSystemName, priceName, currency])
  return (
    <Wrapper>
      <MarketplaceNavBar />

      <div className="main-container">
        {/* {userRole != 'notAuth' && (
          <BreadcrumbComponent breadcrumbInfo={'ProductList'} />
        )}{' '} */}
        <Row>
          <Card>
            <Card.Body>
              <div className="text-center">
                <Steps
                  model={[
                    {
                      label: (
                        <>
                          <FontAwesomeIcon icon={faInfoCircle} />{' '}
                          <FormattedMessage id="Subscribtion-Info" />
                        </>
                      ),
                    },
                    {
                      label: (
                        <>
                          <FontAwesomeIcon icon={faMoneyCheckDollar} />{' '}
                          <FormattedMessage id="Check-Out" />
                        </>
                      ),
                    },
                  ]}
                  activeIndex={step - 1}
                  readOnly={step != 1 ? false : true}
                />{' '}
              </div>
              {step === 1 && (
                <CheckoutTenantReg
                  type="create"
                  popupLabel={<FormattedMessage id="Enter-Your-Info" />}
                  setCurrentTenant={setCurrentTenant}
                  setHasToPay={setHasToPay}
                  setDisplayName={setDisplayName}
                  priceData={priceData}
                  setPriceData={setPriceData}
                />
              )}
              {step === 2 && (
                <CheckoutPage
                  currentTenant={currentTenant}
                  hasToPay={hasToPay}
                  setHasToPay={setHasToPay}
                  displayName={displayName}
                  priceData={priceData}
                  setPriceData={setPriceData}
                  trialPlanId={trialPlanId}
                />
              )}{' '}
            </Card.Body>
          </Card>
        </Row>
      </div>
    </Wrapper>
  )
}

export default TwoStepProcessPage
