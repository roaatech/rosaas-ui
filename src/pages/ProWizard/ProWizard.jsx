import React, { useEffect, useRef, useState } from 'react'
import { QuickSetupWrapper, TableWrapper } from './ProWizard.styled'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'
import { Steps } from 'primereact/steps'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBox,
  faCode,
  faCogs,
  faEye,
  faInfoCircle,
  faMoneyCheckDollar,
  faNetworkWired,
  faPencilSquare,
  faPlug,
  faStar,
  faToggleOn,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons'
import SafeFormatMessage from '../../components/custom/Shared/SafeFormatMessage/SafeFormatMessage'
import TableHead from '../../components/custom/Shared/TableHead/TableHead'
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
} from '@themesberg/react-bootstrap'
import ProductForm from '../../components/custom/Product/ProductForm/ProductForm'
import { Form, useNavigate, useParams } from 'react-router-dom'
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
import ProductPlansPriceList from '../../components/custom/Product/ProductPlansPrice/ProductPlansPriceList'
import PlanPriceForm from '../../components/custom/Product/ProductPlansPrice/PlanPriceForm/PlanPriceForm'
import ProductCustomSpecificationList from '../../components/custom/Product/CustomSpecification/ProductCustomSpecificationList'
import CustomSpecificationForm from '../../components/custom/Product/CustomSpecification/CustomSpecificationForm/CustomSpecificationForm'
import IntegrationUrlsTab from '../../components/custom/Product/IntegrationUrlsTab/IntegrationUrlsTab'
import WebhookList from '../../components/custom/Product/WebhookList/WebhookList'
import CreateWebhookForm from '../../components/custom/Product/WebhookList/WebhookForm/WebhookForm'
import FrontendIntegrationUrlsTab from '../../components/custom/Product/FrontendIntegrationUrlsTab/FrontendIntegrationUrlsTab'
import ReviewAndLaunch from '../../components/custom/ReviewAndLaunch/ReviewAndLaunch'

const ProWizard = () => {
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
    { label: 'product-info', icon: <FontAwesomeIcon icon={faBox} /> }, // Step 1: Product Info
    { label: 'plan-info', icon: <FontAwesomeIcon icon={faPencilSquare} /> }, // Step 2: Plan Info
    { label: 'feature-info', icon: <FontAwesomeIcon icon={faStar} /> }, // Step 3: Feature Info
    { label: 'plan-feature', icon: <FontAwesomeIcon icon={faCogs} /> }, // Step 4: Plan Feature
    {
      label: 'plan-price',
      icon: <FontAwesomeIcon icon={faMoneyCheckDollar} />,
    }, // Step 5: Plan Price
    { label: 'specifications', icon: <FontAwesomeIcon icon={faInfoCircle} /> }, // Step 6: Specifications
    { label: 'integration-url', icon: <FontAwesomeIcon icon={faPlug} /> }, // Step 8: Integration URL
    { label: 'webhooks', icon: <FontAwesomeIcon icon={faNetworkWired} /> }, // Step 9: Webhooks
    { label: 'Launch-&-Preview', icon: <FontAwesomeIcon icon={faEye} /> }, // Step 7: Activate Product
    { label: 'frontend-integration', icon: <FontAwesomeIcon icon={faCode} /> }, // Step 10: Frontend Integration
  ]
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)
  const getVisibleSteps = (steps, activeIndex) => {
    return steps.map((step, index) => {
      if (screenWidth <= 748) {
        // For widths 748px or less: Current, one before, and one after
        return {
          ...step,
          className:
            index === activeIndex ||
            index === activeIndex - 1 ||
            index === activeIndex + 1
              ? 'wizard-step narrow-visible'
              : 'wizard-step',
        }
      } else if (screenWidth <= 1299) {
        // For widths 1299px or less: Current, two before, and one after

        return {
          ...step,
          className:
            index === activeIndex ||
            index === activeIndex - 1 ||
            index === activeIndex - 2 ||
            index === activeIndex + 1
              ? 'wizard-step visible'
              : 'wizard-step',
        }
      }
      // Default (show all for larger screens)
      return {
        ...step,
        className: 'wizard-step visible',
      }
    })
  }
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth)
    }

    // Listen for window resize
    window.addEventListener('resize', handleResize)

    // Clean up the event listener
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  const hash = window.location.hash.substring(1)
  useEffect(() => {
    if (!productId) {
      navigate('#product-info', { replace: true })
      dispatch(setQuickSetupStep(1))

      return
    }
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
  const formRef = useRef(null)
  useEffect(() => {
    if (visible && formRef.current) {
      formRef.current.scrollIntoView({
        behavior: 'smooth', // Smooth scrolling
        block: 'center', // Align to the center of the viewport
      })
    }
  }, [visible])
  // useEffect(() => {
  //   if (productId && step === 1) {
  //     navigate(Routes.NotFound.path)
  //   }
  // }, [step, productId])

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
  const [activeIndex, setActiveIndex] = useState(0)
  console.log({ activeIndex })

  return (
    <QuickSetupWrapper>
      <BreadcrumbComponent breadcrumbInfo={'QuickSetup'} />
      <div className="main-container">
        <TableHead
          search={false}
          title={
            <>
              <SafeFormatMessage id="Pro-Product-Wizard" />
              {currentProductData?.systemName ? (
                <span>: {currentProductData?.systemName}</span>
              ) : null}
            </>
          }
        />

        <Steps
          model={getVisibleSteps(ProWizardSteps, step - 1).map((step) => ({
            label: (
              <>
                {step.icon} <SafeFormatMessage id={step.label} />
              </>
            ),
            className: step.className,
          }))}
          activeIndex={step - 1}
          readOnly={productId ? false : true}
          onSelect={(e) => handleStepChange(e.index + 1, 'next', productId)}
          disabled={step == 1}
        />

        <Container>
          {step == 1 && (
            //   productId ? (
            //   navigate(Routes.NotFound.path)
            // ) : (
            <>
              <div className="my-7 ">
                <div className=" d-flex justify-content-between align-items-center my-4">
                  <h4
                    ref={formRef}
                    className=""
                    style={{ color: 'var(--primary4)' }}
                  >
                    {!currentProductData?.id ? (
                      <SafeFormatMessage id="Create-Product" />
                    ) : (
                      <SafeFormatMessage id="Edit-Product" />
                    )}
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
                <div className="d-flex justify-content-center">
                  <Col md={6} className="h-100">
                    <Card
                      style={{ backgroundColor: ' var(--themeBackground)' }}
                    >
                      <Card.Body ref={formRef}>
                        <ProductForm
                          quickSetup={true}
                          type={currentProductData?.id ? 'edit' : 'create'}
                          triggerSubmit={(submitFunction) =>
                            (handleSubmit.current = submitFunction)
                          }
                          step={step}
                          handleStepChange={handleStepChange}
                          productData={
                            currentProductData?.id ? currentProductData : null
                          }
                        />
                      </Card.Body>
                    </Card>
                  </Col>
                </div>{' '}
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
            // )
          )}
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
                <TableWrapper>
                  <ProductPlansList
                    productId={productId}
                    quickSetup={true}
                    setSelectedItemId={setSelectedItemId}
                    setVisibleQuickSetup={setVisible}
                    setFormType={setFormType}
                  />
                </TableWrapper>
              </div>
              {visible && (
                <>
                  <h4 className="" style={{ color: 'var(--primary4)' }}>
                    {formType == 'create' ? (
                      <SafeFormatMessage id="Create-Plan" />
                    ) : (
                      <SafeFormatMessage id="Edit-Plan" />
                    )}
                  </h4>
                  <div className="d-flex justify-content-center">
                    <Col md={6}>
                      <Card
                        className="mt-3"
                        style={{ backgroundColor: ' var(--themeBackground)' }}
                      >
                        <Card.Body ref={formRef}>
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
                <TableWrapper>
                  <ProductFeaturesList
                    productId={productId}
                    quickSetup={true}
                    setSelectedItemId={setSelectedItemId}
                    setVisibleQuickSetup={setVisible}
                    setFormType={setFormType}
                  />
                </TableWrapper>
              </div>
              {visible && (
                <>
                  <h4 className="" style={{ color: 'var(--primary4)' }}>
                    {formType == 'create' ? (
                      <SafeFormatMessage id="Create-Feature" />
                    ) : (
                      <SafeFormatMessage id="Edit-Feature" />
                    )}
                  </h4>
                  <div className="d-flex justify-content-center">
                    <Col md={6}>
                      <Card
                        className="mt-3"
                        style={{ backgroundColor: ' var(--themeBackground)' }}
                      >
                        <Card.Body ref={formRef}>
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
                <TableWrapper>
                  <ProductFeaturePlan
                    quickSetup={true}
                    setSelectedItemId={setSelectedItemId}
                    setVisibleQuickSetup={setVisible}
                    setFormType={setFormType}
                  />
                </TableWrapper>
              </div>
              {visible && (
                <>
                  <h4 className="" style={{ color: 'var(--primary4)' }}>
                    {formType == 'create' ? (
                      <SafeFormatMessage id="Create-Plan-Feature" />
                    ) : (
                      <SafeFormatMessage id="Edit-Plan-Feature" />
                    )}
                  </h4>
                  <div className="d-flex justify-content-center">
                    <Col md={6}>
                      <Card
                        className="mt-3"
                        style={{ backgroundColor: ' var(--themeBackground)' }}
                      >
                        <Card.Body ref={formRef}>
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

          {step == 5 && currentProductData && (
            <>
              <div className="my-7 ">
                <div className=" d-flex justify-content-between align-items-center my-4">
                  <h4 className="" style={{ color: 'var(--primary4)' }}>
                    <SafeFormatMessage id="Plans-Prices-List" />
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
                    <SafeFormatMessage id="Add-Plan-Price" />
                  </Button>
                </div>
                <TableWrapper>
                  <ProductPlansPriceList
                    quickSetup={true}
                    setSelectedItemId={setSelectedItemId}
                    setVisibleQuickSetup={setVisible}
                    setFormType={setFormType}
                  />
                  <Alert variant="warning" className="mt-3">
                    <div className="d-flex justify-content-center align-items-center">
                      <FontAwesomeIcon
                        icon={faTriangleExclamation}
                        className="mr-2"
                      />
                      <strong>
                        <SafeFormatMessage id={'Warning'} /> -
                      </strong>
                      {'  '}
                      <span className="mx-2">
                        <SafeFormatMessage
                          id="Plan-Or-Price-Not-Published"
                          defaultMessage="To preview on the pricing page, ensure the plan or price is active and visible by clicking the icon buttons."
                        />
                      </span>
                    </div>
                  </Alert>
                </TableWrapper>
              </div>
              {visible && (
                <>
                  <h4 className="" style={{ color: 'var(--primary4)' }}>
                    {formType == 'create' ? (
                      <SafeFormatMessage id="Create-plan-price" />
                    ) : (
                      <SafeFormatMessage id="Edit-plan-price" />
                    )}
                  </h4>
                  <div className="d-flex justify-content-center">
                    <Col md={6}>
                      <Card
                        className="mt-3"
                        style={{ backgroundColor: ' var(--themeBackground)' }}
                      >
                        <Card.Body ref={formRef}>
                          <PlanPriceForm
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
                            planPriceData={
                              formType == 'edit' &&
                              currentProductData?.plansPrice?.[selectedItemId]
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
          {step == 6 && currentProductData && (
            <>
              <div className="my-7 ">
                <div className=" d-flex justify-content-between align-items-center my-4">
                  <h4 className="" style={{ color: 'var(--primary4)' }}>
                    <SafeFormatMessage id="Specifications-List" />
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
                    <SafeFormatMessage id="Add-Specification" />
                  </Button>
                </div>
                <TableWrapper>
                  <ProductCustomSpecificationList
                    productId={productId}
                    quickSetup={true}
                    setSelectedItemId={setSelectedItemId}
                    setVisibleQuickSetup={setVisible}
                    setFormType={setFormType}
                  />
                </TableWrapper>
              </div>
              {visible && (
                <>
                  <h4 className="" style={{ color: 'var(--primary4)' }}>
                    {formType == 'create' ? (
                      <SafeFormatMessage id="Create-Specification" />
                    ) : (
                      <SafeFormatMessage id="Edit-Specification" />
                    )}
                  </h4>
                  <div className="d-flex justify-content-center">
                    <Col md={12}>
                      <Card
                        className="mt-3"
                        style={{ backgroundColor: ' var(--themeBackground)' }}
                      >
                        <Card.Body ref={formRef}>
                          <CustomSpecificationForm
                            quickSetup={true}
                            type={formType}
                            setVisible={setVisible}
                            specificationData={
                              formType == 'edit' &&
                              currentProductData?.specifications?.[
                                selectedItemId
                              ]
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
          {step == 7 && currentProductData && (
            <>
              <div className="my-7 ">
                <div className=" d-flex justify-content-between align-items-center my-4">
                  <h4 className="" style={{ color: 'var(--primary4)' }}>
                    <SafeFormatMessage id="API-INTEGRATION-URLs" />
                  </h4>
                </div>
                <TableWrapper>
                  <IntegrationUrlsTab data={currentProductData} />
                </TableWrapper>
              </div>
            </>
          )}

          {step == 8 && currentProductData && (
            <>
              <div className="my-7 ">
                <div className=" d-flex justify-content-between align-items-center my-4">
                  <h4 className="" style={{ color: 'var(--primary4)' }}>
                    <SafeFormatMessage id="Webhooks-List" />
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
                    <SafeFormatMessage id="Add-Webhook" />
                  </Button>
                </div>
                <TableWrapper>
                  <WebhookList quickSetup={true} />
                </TableWrapper>
              </div>
              {visible && (
                <>
                  <h4 className="" style={{ color: 'var(--primary4)' }}>
                    {formType == 'create' ? (
                      <SafeFormatMessage id="Create-Webhook" />
                    ) : (
                      <SafeFormatMessage id="Edit-Webhook" />
                    )}
                  </h4>
                  <div className="d-flex justify-content-center">
                    <Col md={6}>
                      <Card
                        className="mt-3"
                        style={{ backgroundColor: ' var(--themeBackground)' }}
                      >
                        <Card.Body ref={formRef}>
                          <CreateWebhookForm
                            quickSetup={true}
                            type={formType}
                            setVisible={setVisible}
                            specificationData={
                              formType == 'edit' &&
                              currentProductData?.specifications?.[
                                selectedItemId
                              ]
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
          {step == 9 && (
            <>
              <div className="my-7 ">
                <ReviewAndLaunch visible={visible} setVisible={setVisible} />
              </div>
            </>
          )}
          {step == 10 && currentProductData && (
            <>
              <div className="my-7 ">
                <div className=" d-flex justify-content-between align-items-center my-4">
                  <h4 className="" style={{ color: 'var(--primary4)' }}>
                    <SafeFormatMessage id="FRONTEND-INTEGRATION" />
                  </h4>
                </div>
                <TableWrapper>
                  {' '}
                  <TableWrapper>
                    {' '}
                    <FrontendIntegrationUrlsTab data={currentProductData} />
                  </TableWrapper>
                </TableWrapper>
              </div>
            </>
          )}
          {/* <Card.Footer></Card.Footer> */}
          <div
            className={
              step <= 1
                ? 'd-flex justify-content-end border-top-1 border-light my-6 py-2'
                : 'd-flex justify-content-between border-top-1 border-light my-6 py-2'
            }
          >
            {step > 1 && (
              <Button
                onClick={() => {
                  handleStepChange(step - 1, 'previous')
                }}
                variant="primary"
                className="px-4"
              >
                <SafeFormatMessage id="Previous" />
              </Button>
            )}
            {step != 10 ? (
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
                variant="primary"
                className="px-4"
              >
                <SafeFormatMessage id="Next" />
              </Button>
            ) : (
              <Button
                onClick={() => {
                  navigate(`${Routes.products.path}/${productId}`)
                }}
                variant="secondary"
                className="px-4"
              >
                {' '}
                <SafeFormatMessage id="End" />
              </Button>
            )}
          </div>
        </Container>
      </div>
    </QuickSetupWrapper>
  )
}

export default ProWizard
