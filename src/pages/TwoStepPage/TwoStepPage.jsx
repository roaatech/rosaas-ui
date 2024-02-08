import { Card, Row } from '@themesberg/react-bootstrap'
import { useEffect, useState } from 'react'
import CheckoutTenantReg from '../../components/custom/Checkout/CheckoutTenantReg'
import CheckoutPage from '../CheckoutPagePage/CheckoutPage'
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

const TwoStepProcessPage = () => {
  const params = useParams()
  const { orderIDParam } = params

  const dispatch = useDispatch()
  const [displayName, setDisplayName] = useState()
  const step = useSelector((state) => state.tenants.currentStep)
  const [currentTenant, setCurrentTenant] = useState('')
  const [orderID, setOrderID] = useState('')
  const { getProductPlanPricePublic } = useRequest()
  const { systemName, priceName } = useParams()
  useEffect(() => {
    if (!orderIDParam) {
      return
    }
    dispatch(setStep(2))
  }, [orderIDParam])
  let userRole = useSelector((state) => state.auth.userInfo.role)
  if (userRole == undefined) userRole = 'notAuth'

  const [hasToPay, setHasToPay] = useState()
  const [priceData, setPriceData] = useState()
  useEffect(() => {
    if (priceData || (priceData && Object.values(priceData).length) > 0) {
      return
    }
    ;(async () => {
      const price = await getProductPlanPricePublic(systemName, priceName)
      setPriceData(price.data.data)
    })()
  }, [systemName, priceName])
  return (
    <Wrapper>
      <div className="main-container">
        {userRole != 'notAuth' && (
          <BreadcrumbComponent breadcrumbInfo={'ProductList'} />
        )}{' '}
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
                  setOrderID={setOrderID}
                  setHasToPay={setHasToPay}
                  setDisplayName={setDisplayName}
                  priceData={priceData}
                  setPriceData={setPriceData}
                />
              )}
              {step === 2 && (
                <CheckoutPage
                  currentTenant={currentTenant}
                  orderID={orderID || orderIDParam}
                  hasToPay={hasToPay}
                  setHasToPay={setHasToPay}
                  displayName={displayName}
                  priceData={priceData}
                  setPriceData={setPriceData}
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
