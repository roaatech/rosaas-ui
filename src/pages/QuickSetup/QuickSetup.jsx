import React, { useEffect, useRef, useState } from 'react'
import { QuickSetupWrapper } from './QuickSetup.styled'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'
import { Steps } from 'primereact/steps'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBox,
  faInfoCircle,
  faMoneyCheckDollar,
  faPencilSquare,
} from '@fortawesome/free-solid-svg-icons'
import SafeFormatMessage from '../../components/custom/Shared/SafeFormatMessage/SafeFormatMessage'
import TableHead from '../../components/custom/Shared/TableHead/TableHead'
import { Button, Card, Col, Container } from '@themesberg/react-bootstrap'
import ProductForm from '../../components/custom/Product/ProductForm/ProductForm'
import { useNavigate, useParams } from 'react-router-dom'
import { Routes } from '../../routes'
import { use } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setQuickSetupStep } from '../../store/slices/main'
import PlanForm from '../../components/custom/Product/ProductPlansList/PlanForm/PlanForm'
import useRequest from '../../axios/apis/useRequest'
import { productInfo } from '../../store/slices/products/productsSlice'
import ProductPlansList from '../../components/custom/Product/ProductPlansList/ProductPlansList'
import { BsPlus, BsPlusCircleFill } from 'react-icons/bs'
import FeatureForm from '../../components/custom/Product/ProductFeaturesList/FeatureForm/FeatureForm'
import ProductFeaturesList from '../../components/custom/Product/ProductFeaturesList/ProductFeaturesList'
import ProductFeaturePlan from '../../components/custom/Product/ProductFeaturePlan/ProductFeaturePlan'
import FeaturePlanForm from '../../components/custom/Product/ProductFeaturePlan/FeaturePlanForm/FeaturePlanForm'

const QuickSetup = () => {
  const step = useSelector((state) => state.main.quickSetupStep)
  const handleSubmit = useRef()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { getProduct } = useRequest()
  const { productId } = useParams()
  const [selectedItemId, setSelectedItemId] = useState('')
  const [formType, setFormType] = useState('')
  const [visible, setVisible] = useState(false)
  const productsData = useSelector((state) => state.products.products)
  const currentProductData = productsData?.[productId]
  useEffect(() => {
    if (productId && !currentProductData) {
      const fetchProduct = async (productId) => {
        try {
          const response = await getProduct(productId)
          console.log({ response, productId })
          dispatch(productInfo(response?.data?.data))
        } catch (error) {
          console.error('Error fetching product data:', error)
        }
      }

      fetchProduct(productId)
    }
  }, [productId])

  const ProWizardSteps = [
    { label: 'product-info', icon: <FontAwesomeIcon icon={faBox} /> }, // Step 1
    { label: 'plan-info', icon: <FontAwesomeIcon icon={faPencilSquare} /> }, // Step 2
    { label: 'feature-info', icon: <FontAwesomeIcon icon={faInfoCircle} /> }, // Step 3
    { label: 'plan-feature', icon: <FontAwesomeIcon icon={faPencilSquare} /> }, // Step 4
    {
      label: 'plan-price',
      icon: <FontAwesomeIcon icon={faMoneyCheckDollar} />,
    }, // Step 5
    { label: 'specifications', icon: <FontAwesomeIcon icon={faInfoCircle} /> }, // Step 6
    {
      label: 'integration-url',
      icon: <FontAwesomeIcon icon={faPencilSquare} />,
    }, // Step 7
    { label: 'webhooks', icon: <FontAwesomeIcon icon={faInfoCircle} /> }, // Step 8
    {
      label: 'frontend-integration',
      icon: <FontAwesomeIcon icon={faPencilSquare} />,
    }, // Step 9
  ]
  const hash = window.location.hash.substring(1)
  useEffect(() => {
    if (!productId) return
    const currentStep =
      ProWizardSteps.findIndex((step) => step.label === hash) + 1

    if (hash) {
      // Navigate to the corresponding step if hash exists
      if (currentStep > 0) {
        dispatch(setQuickSetupStep(currentStep))
      } else {
        navigate('#product-info', { replace: true })
        dispatch(setQuickSetupStep(1))
      }
    } else if (productId) {
      // No hash, but productId exists -> Go to the second step
      navigate('#plan-info', { replace: true })
      dispatch(setQuickSetupStep(2))
    } else {
      // No hash and no productId -> Go to the first step
      navigate('#product-info', { replace: true })
      dispatch(setQuickSetupStep(1))
    }
  }, [productId, hash])

  useEffect(() => {
    if (productId && step === 1) {
      navigate(Routes.NotFound.path)
    }
  }, [step, productId])

  /**
   * Handles step navigation.
   * @param {number} newStep - The step number to navigate to.
   * @param {"next" | "previous"} type - The navigation type, either "next" or "previous".
   */
  const handleStepChange = (newStep, type, productId) => {
    const currentStep = ProWizardSteps[newStep - 1]
    setVisible(false)
    if (!currentStep) {
      console.error('Invalid step.')
      return
    }

    // Determine navigation logic based on type
    if (productId && type === 'next') {
      navigate(
        `${Routes.QuickProductWizard.path}/${productId}#${currentStep.label}`
      )
    } else if (type === 'next') {
      dispatch(setQuickSetupStep(newStep))
      if (newStep === 1) {
        navigate(
          `${Routes.QuickProductWizard.path}/${productId}#${currentStep.label}`
        )
      } else {
        navigate(`#${currentStep.label}`)
      }
    } else if (type === 'previous') {
      dispatch(setQuickSetupStep(newStep))
      navigate(`#${currentStep.label}`)
    } else {
      console.error("Invalid navigation type. Use 'next' or 'previous'.")
    }
  }
  console.log(currentProductData?.featurePlan?.[selectedItemId])

  return (
    <QuickSetupWrapper>
      <BreadcrumbComponent breadcrumbInfo={'QuickSetup'} />
      <div className="main-container">
        <TableHead
          search={false}
          title={<SafeFormatMessage id="QuickSetup" />}
        />
        <Container>
          <Steps
            model={ProWizardSteps.map((step) => ({
              label: (
                <>
                  {step.icon}{' '}
                  <SafeFormatMessage id={step.label.replace('-', '_')} />
                </>
              ),
            }))}
            activeIndex={step - 1}
            readOnly
          />
          {step == 1 &&
            (productId ? (
              navigate(Routes.NotFound.path)
            ) : (
              <>
                <Card.Header className="border-bottom  my-2 ">
                  {' '}
                  <div className="d-flex justify-content-between ">
                    <h4 className="" style={{ color: 'var(--primary4)' }}>
                      <SafeFormatMessage id="Create-Product" />
                    </h4>
                    {/* <Button
                      onClick={() => {
                        if (handleSubmit.current) {
                          handleSubmit.current()
                        } else {
                          console.error('handleSubmit is not set')
                        }
                      }}
                      variant="secondary"
                      className="px-4"
                    >
                      <SafeFormatMessage id="Next" />
                    </Button> */}
                  </div>
                </Card.Header>
                <div className="d-flex justify-content-center">
                  <Col md={6} className="h-100">
                    <Card
                      style={{ backgroundColor: ' var(--themeBackground)' }}
                    >
                      <Card.Body>
                        <ProductForm
                          quickSetup={true}
                          type={'create'}
                          triggerSubmit={(submitFunction) =>
                            (handleSubmit.current = submitFunction)
                          }
                          step={step}
                          handleStepChange={handleStepChange}
                        />
                      </Card.Body>
                    </Card>
                  </Col>
                </div>

                {/* <ProductForm
                  quickSetup={true}
                  type={'create'}
                  triggerSubmit={(submitFunction) =>
                    (handleSubmit.current = submitFunction)
                  }
                  step={step}
                  setStep={() => dispatch(setQuickSetupStep(step + 1))}
                /> */}
              </>
            ))}
          {step == 2 && currentProductData && (
            <>
              <div className="my-7 ">
                <div className=" d-flex justify-content-between align-items-center my-4">
                  <h4 className="" style={{ color: 'var(--primary4)' }}>
                    <SafeFormatMessage id="Plans-List" />
                  </h4>

                  {/* {!visible && ( */}
                  <Button
                    onClick={() => {
                      setFormType('create')
                      setVisible(true)
                    }}
                    variant="secondary"
                    className="px-3 "
                    disabled={visible}
                  >
                    <BsPlusCircleFill className="mx-2" />
                    <SafeFormatMessage id="Add-Plan" />
                  </Button>
                  {/* )} */}
                </div>
                <ProductPlansList
                  productId={productId}
                  quickSetup={true}
                  setSelectedItemId={setSelectedItemId}
                  setVisibleQuickSetup={setVisible}
                  setFormType={setFormType}
                />
              </div>
              {visible && (
                <>
                  <h4 className="" style={{ color: 'var(--primary4)' }}>
                    <SafeFormatMessage id="Create-Plan" />
                  </h4>
                  <div className="d-flex justify-content-center">
                    <Col md={6}>
                      <Card
                        className="mt-3"
                        style={{ backgroundColor: ' var(--themeBackground)' }}
                      >
                        <Card.Body>
                          <PlanForm
                            quickSetup={true}
                            type={formType}
                            triggerSubmit={(submitFunction) =>
                              (handleSubmit.current = submitFunction)
                            }
                            step={step}
                            setStep={() =>
                              dispatch(setQuickSetupStep(step + 1))
                            }
                            setVisible={setVisible}
                            planData={
                              formType == 'edit' &&
                              currentProductData?.plans?.[selectedItemId]
                            }
                          />
                        </Card.Body>
                      </Card>
                    </Col>
                  </div>
                </>
              )}
            </>
          )}

          {step == 3 && currentProductData && (
            <>
              <div className="my-7 ">
                <div className=" d-flex justify-content-between align-items-center my-4">
                  <h4 className="" style={{ color: 'var(--primary4)' }}>
                    <SafeFormatMessage id="Features-List" />
                  </h4>

                  <Button
                    onClick={() => {
                      setFormType('create')
                      setVisible(true)
                    }}
                    variant="secondary"
                    className="px-3 "
                    disabled={visible}
                  >
                    <BsPlusCircleFill className="mx-2" />
                    <SafeFormatMessage id="Add-Feature" />
                  </Button>
                </div>
                <ProductFeaturesList
                  productId={productId}
                  quickSetup={true}
                  setSelectedItemId={setSelectedItemId}
                  setVisibleQuickSetup={setVisible}
                  setFormType={setFormType}
                />
              </div>
              {visible && (
                <>
                  <h4 className="" style={{ color: 'var(--primary4)' }}>
                    <SafeFormatMessage id="Create-Feature" />
                  </h4>
                  <div className="d-flex justify-content-center">
                    <Col md={6}>
                      <Card
                        className="mt-3"
                        style={{ backgroundColor: ' var(--themeBackground)' }}
                      >
                        <Card.Body>
                          <FeatureForm
                            quickSetup={true}
                            type={formType}
                            triggerSubmit={(submitFunction) =>
                              (handleSubmit.current = submitFunction)
                            }
                            step={step}
                            setStep={() =>
                              dispatch(setQuickSetupStep(step + 1))
                            }
                            setVisible={setVisible}
                            featureData={
                              formType == 'edit' &&
                              currentProductData?.features?.[selectedItemId]
                            }
                          />
                        </Card.Body>
                      </Card>
                    </Col>
                  </div>
                </>
              )}
            </>
          )}
          {step == 4 && currentProductData && (
            <>
              <div className="my-7 ">
                <div className=" d-flex justify-content-between align-items-center my-4">
                  <h4 className="" style={{ color: 'var(--primary4)' }}>
                    <SafeFormatMessage id="Plans-Features-List" />
                  </h4>

                  <Button
                    onClick={() => {
                      setFormType('create')
                      setVisible(true)
                    }}
                    variant="secondary"
                    className="px-3 "
                    disabled={visible}
                  >
                    <BsPlusCircleFill className="mx-2" />
                    <SafeFormatMessage id="Add-Plan-Feature" />
                  </Button>
                </div>
                <ProductFeaturePlan
                  quickSetup={true}
                  setSelectedItemId={setSelectedItemId}
                  setVisibleQuickSetup={setVisible}
                  setFormType={setFormType}
                />
              </div>
              {visible && (
                <>
                  <h4 className="" style={{ color: 'var(--primary4)' }}>
                    <SafeFormatMessage id="Create-Plan-Feature" />
                  </h4>
                  <div className="d-flex justify-content-center">
                    <Col md={6}>
                      <Card
                        className="mt-3"
                        style={{ backgroundColor: ' var(--themeBackground)' }}
                      >
                        <Card.Body>
                          <FeaturePlanForm
                            quickSetup={true}
                            type={formType}
                            triggerSubmit={(submitFunction) =>
                              (handleSubmit.current = submitFunction)
                            }
                            step={step}
                            setStep={() =>
                              dispatch(setQuickSetupStep(step + 1))
                            }
                            setVisible={setVisible}
                            FeaturePlanData={
                              formType == 'edit'
                                ? currentProductData?.featurePlan?.[
                                    selectedItemId
                                  ]
                                : {}
                            }
                          />
                        </Card.Body>
                      </Card>
                    </Col>
                  </div>
                </>
              )}
            </>
          )}

          {/* <Card.Footer></Card.Footer> */}
          <div
            className={
              step <= 2
                ? 'd-flex justify-content-end border-top-1 border-light my-4 py-2'
                : 'd-flex justify-content-between border-top-1 border-light my-4 py-2'
            }
          >
            {step > 2 && (
              <Button
                onClick={() => {
                  handleStepChange(step - 1, 'previous')
                }}
                variant="secondary"
                className="px-4"
              >
                <SafeFormatMessage id="Previous" />
              </Button>
            )}
            <Button
              onClick={() => {
                if (handleSubmit.current && step === 1) {
                  handleSubmit.current()
                } else if (step > 1) {
                  handleStepChange(step + 1, 'next')
                } else {
                  console.error('handleSubmit is not set')
                }
              }}
              variant="secondary"
              className="px-4"
            >
              <SafeFormatMessage id="Next" />
            </Button>
          </div>
        </Container>
      </div>
    </QuickSetupWrapper>
  )
}

export default QuickSetup
