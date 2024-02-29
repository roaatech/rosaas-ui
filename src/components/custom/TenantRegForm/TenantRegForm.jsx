import { useEffect, useState } from 'react'
import useRequest from '../../../axios/apis/useRequest'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'
import { FormattedMessage, useIntl } from 'react-intl'
import { useFormik } from 'formik'
import { validateSpecifications } from '../tenant/validateSpecifications/validateSpecifications'
import { Wrapper } from './TenantRegForm.styled'
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
} from '@themesberg/react-bootstrap'
import SpecificationInput from '../Product/CustomSpecification/SpecificationInput/SpecificationInput'
import { setStep } from '../../../store/slices/tenants'
import { cycle } from '../../../const'

const CheckoutTenantReg = ({
  type,
  tenantData,
  setVisible,
  popupLabel,
  setCurrentTenant,
  setHasToPay,
  setDisplayName,
  priceData,
  setPriceData,
}) => {
  const {
    createTenantRequestPublic,
    editTenantRequest,
    publicSpecificationByProductName,
  } = useRequest()
  const [submitLoading] = useState()
  const [specValidationErrors, setSpecValidationErrors] = useState({})
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { systemName, priceName } = useParams()
  const step = useSelector((state) => state.tenants.currentStep)

  const productId = priceData?.product?.id

  const currentPrice = priceData?.id

  const [uniqueName, setUniqueName] = useState('')
  const [title, setTitle] = useState('')
  useEffect(() => {
    if (!systemName || !priceName || !priceData) {
      return
    }

    const uniName = `${systemName}-tenant-${new Date().valueOf()}`

    setUniqueName(uniName.toLowerCase().replace(/[^a-z0-9_-]/g, '-'))

    setTitle(`${priceData?.product.displayName} Tenant ${new Date().valueOf()}`)
  }, [systemName, priceName, priceData])

  const createValidation = {}
  const editValidation = {
    displayName: Yup.string()
      .required(<FormattedMessage id="Display-Name-is-required" />)
      .max(100, <FormattedMessage id="Must-be-maximum-100-digits" />),
  }
  const validationSchema = Yup.object().shape(
    type === 'create' ? createValidation : editValidation
  )

  const initialValues = {
    displayName: tenantData ? tenantData.displayName : '',

    systemName: tenantData ? tenantData.systemName : '',
    plan: priceData?.plan?.id,
    price: tenantData ? tenantData.price : '',
    product: productId || '',
  }

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,

    onSubmit: async (values) => {
      const specificationsArray = priceData?.specifications
        ? Object.values(priceData?.specifications).map((specification) => {
            const specificationId = specification.id
            const value =
              specificationValues[specificationId] !== undefined
                ? specificationValues[specificationId]
                : ''
            return {
              specificationId,
              value,
              productId: values.product,
            }
          })
        : []
      const specErrors = validateSpecifications(
        filteredSpecificationsArray,
        specificationValues,
        intl,
        setSpecValidationErrors
      )
      formik.setErrors(specErrors.errors)
      if (
        Object.keys(formik.errors).length === 0 &&
        Object.keys(specErrors.errors).length === 0
      ) {
        if (type == 'create') {
          const createTenant = await createTenantRequestPublic({
            subscriptions: [
              {
                productId: productId,
                planId: priceData?.plan?.id,
                planPriceId: currentPrice,
                specifications: specificationsArray,
              },
            ],
            systemName: uniqueName,
            displayName: title,
          })

          if (
            !createTenant?.data.data?.hasToPay &&
            createTenant?.data.data.tenantId
          ) {
            return userRole != 'notAuth'
              ? navigate(`/tenants/${createTenant?.data.data.tenantId}`)
              : navigate(`/created-successfully`)
          } else {
            setDisplayName(title)
            setCurrentTenant(createTenant?.data.data.tenantId)
            setHasToPay(createTenant?.data.data?.hasToPay)
          }

          dispatch(setStep(2))
          const id = createTenant?.data?.data?.orderId
          if (id) {
            navigate(`#${id}`)
          }
        } else {
          const editTenant = await editTenantRequest({
            displayName: values.displayName,
            id: tenantData.id,
          })
        }
      }
      setVisible && setVisible(false)
      setVisible && setVisible(false)
    },
  })

  const intl = useIntl()

  const [specificationValues, setSpecificationValues] = useState({})
  const [specifications, setSpecifications] = useState({})
  let userRole = useSelector((state) => state.auth.userInfo.role)
  if (userRole == undefined) userRole = 'notAuth'

  useEffect(() => {
    if (!priceData || !systemName) {
      return
    }
    ;(async () => {
      formik.setFieldValue('plan', '')
      formik.setFieldValue('price', '')
      if (priceData) {
        if (!priceData.specifications) {
          const specifications =
            await publicSpecificationByProductName(systemName)

          setSpecifications(specifications.data.data)
        }
      }
    })()
  }, [priceData, systemName])

  const fetchData = async () => {
    try {
      const createTenant = await createTenantRequestPublic({
        subscriptions: [
          {
            productId: productId,
            planId: priceData?.plan?.id,
            planPriceId: currentPrice,
            specifications: [],
          },
        ],
        systemName: uniqueName,
        displayName: title,
      })
      setDisplayName(title)
      setCurrentTenant(createTenant?.data.data.id)
      setHasToPay(createTenant?.data.data?.hasToPay)

      dispatch(setStep(2))
    } catch (error) {
      console.error('Error in createTenantRequest:', error)
    }
  }

  const [filteredSpecificationsArray, setFilteredSpecificationsArray] =
    useState()
  useEffect(() => {
    if (!priceData || specifications.length <= 0) {
      return
    }
    const allSpecificationsArray = specifications
      ? Object.values(specifications)
      : []
    setFilteredSpecificationsArray(
      allSpecificationsArray.filter((spec) => spec.isPublished === true)
    )
  }, [specifications, priceData, currentPrice])

  useEffect(() => {
    if (
      filteredSpecificationsArray &&
      filteredSpecificationsArray.length === 0
    ) {
      const timeoutId = setTimeout(() => {
        fetchData()
      }, 1000)

      return () => clearTimeout(timeoutId)
    }
  }, [filteredSpecificationsArray])

  const handleSpecificationChange = (specificationId, event) => {
    const newValue = event.target.value
    setSpecificationValues((prevValues) => ({
      ...prevValues,
      [specificationId]: newValue,
    }))
  }

  return (
    <Wrapper>
      <Container className="card mt-3">
        <Row>
          <Col md={7} className="pr-3 border-right-1 border-light ">
            {priceData && (
              <Form onSubmit={formik.handleSubmit}>
                <Card.Header>
                  <Modal.Title className="h6">{popupLabel}</Modal.Title>
                </Card.Header>
                <Card.Body>
                  {type === 'create' &&
                    Array.isArray(filteredSpecificationsArray) &&
                    filteredSpecificationsArray.length > 0 && (
                      <>
                        <SpecificationInput
                          specifications={filteredSpecificationsArray}
                          specificationValues={specificationValues}
                          handleSpecificationChange={handleSpecificationChange}
                          tenantData={tenantData}
                          intl={intl}
                          specValidationErrors={specValidationErrors}
                        />
                      </>
                    )}

                  {formik.errors.specifications && (
                    <div className="text-danger">
                      {formik.errors.specifications}
                    </div>
                  )}
                </Card.Body>
                <Card.Footer>
                  <Button
                    variant="secondary"
                    type="submit"
                    disabled={submitLoading}
                  >
                    <FormattedMessage id="Submit" />
                  </Button>
                </Card.Footer>
              </Form>
            )}
          </Col>
          <Col md={5}>
            <Card.Header className="fw-bold">
              <FormattedMessage id="Your-Subscribe-Information" />
            </Card.Header>
            <Card.Body>
              {/* product */}
              <div className="d-flex align-items-center justify-content-between border-bottom border-light pb-2 ">
                <div className=" w-50 fw-bold">
                  <FormattedMessage id="Product" />
                </div>
                <div className=" card-stats">
                  {priceData?.product?.displayName}
                </div>
              </div>

              {/* plan */}
              <div className="d-flex align-items-center justify-content-between border-bottom border-light py-3 ">
                <div className=" w-50 fw-bold">
                  <FormattedMessage id="Plan" />
                </div>
                <div className=" card-stats">{priceData?.plan?.systemName}</div>
              </div>

              {/* subsc */}
              {((priceData?.product?.trialType == 2 &&
                priceData?.product?.trialPlanId != priceData?.plan?.id) ||
                priceData?.product?.trialType != 2) && (
                <div className="d-flex align-items-center justify-content-between border-bottom border-light py-3 ">
                  <div className=" w-50 fw-bold">
                    <FormattedMessage id="Subscription" />
                  </div>
                  {priceData && (
                    <div className=" card-stats">
                      ${priceData?.price} /{' '}
                      <FormattedMessage id={cycle[priceData?.cycle]} />
                    </div>
                  )}
                </div>
              )}
            </Card.Body>
          </Col>
        </Row>
      </Container>
    </Wrapper>
  )
}

export default CheckoutTenantReg
