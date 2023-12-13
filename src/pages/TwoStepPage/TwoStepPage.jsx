import { Card, Container, ProgressBar, Row } from '@themesberg/react-bootstrap'
import { useEffect, useState } from 'react'
import { BsArrowBarDown, BsCheck2Circle, BsPersonFill } from 'react-icons/bs'
import CheckoutTenantReg from '../../components/custom/Checkout/CheckoutTenantReg'
import CheckoutPage from '../CheckoutPagePage/CheckoutPage'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Steps } from 'primereact/steps'
import {
  faArrowUpShortWide,
  faInfo,
  faInfoCircle,
  faMoneyCheckDollar,
  faPlus,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'
import { FormattedMessage } from 'react-intl'
import { setStep } from '../../store/slices/tenants'

const TwoStepProcessPage = () => {
  const [showTenantForm, setShowTenantForm] = useState(true)
  const { productId, subscribtionId } = useParams()
  const dispatch = useDispatch()

  const step = useSelector((state) => state.tenants.currentStep)
  const [currentTenant, setCurrentTenant] = useState('')
  const [orderID, setOrderID] = useState('')
  return (
    <div className="main-container">
      <BreadcrumbComponent breadcrumbInfo={'ProductList'} />{' '}
      <Row>
        <Card>
          <Card.Body>
            {/* Progress bar */}
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
              readOnly={true}
            />{' '}
            {/* Content based on the current step */}
            {step === 1 && (
              <CheckoutTenantReg
                type="create"
                updateTenant={() => {}}
                setVisible={setShowTenantForm}
                popupLabel="Enter Your Info"
                currentProduct={productId}
                currentPrice={subscribtionId}
                setCurrentTenant={setCurrentTenant}
                setOrderID={setOrderID}
              />
            )}
            {step === 2 && (
              <CheckoutPage currentTenant={currentTenant} orderID={orderID} />
            )}{' '}
          </Card.Body>
        </Card>
      </Row>
    </div>
  )
}

export default TwoStepProcessPage
