import { Card, Container, ProgressBar, Row } from '@themesberg/react-bootstrap'
import { useState } from 'react'
import { BsArrowBarDown, BsCheck2Circle, BsPersonFill } from 'react-icons/bs'
import CheckoutTenantReg from '../../components/custom/Checkout/CheckoutTenantReg'
import CheckoutPage from '../CheckoutPagePage/CheckoutPage'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
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

const TwoStepProcessPage = () => {
  const [step, setStep] = useState(1)
  const [showTenantForm, setShowTenantForm] = useState(true)
  const { productId, subscribtionId } = useParams()
  const handleStep1Submit = (formData) => {
    // Handle any necessary logic related to the submission of the first step

    // Navigate to step 2 (CheckoutPage)
    setStep(2)
  }

  const [currentTenant, setCurrentTenant] = useState('')
  console.log({ currentTenant })
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
                setStep={setStep}
                setCurrentTenant={setCurrentTenant}
              />
            )}
            {step === 2 && <CheckoutPage currentTenant={currentTenant} />}{' '}
          </Card.Body>
        </Card>
      </Row>
    </div>
  )
}

export default TwoStepProcessPage
