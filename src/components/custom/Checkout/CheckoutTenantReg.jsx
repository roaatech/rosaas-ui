import { useEffect, useState } from 'react'
import useRequest from '../../../axios/apis/useRequest'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  deleteAllPlan,
  deleteAllPlanPrice,
  setAllProduct,
  setAllPlans,
  setAllPlansPrice,
  setAllSpecifications,
} from '../../../store/slices/products/productsSlice'
import * as Yup from 'yup'
import { FormattedMessage, useIntl } from 'react-intl'
import { useFormik } from 'formik'
import { validateSpecifications } from '../tenant/validateSpecifications/validateSpecifications'
import { cycle } from '../../../const'
import { Wrapper } from './CheckoutTenantReg.styled'
import {
  Button,
  Card,
  Container,
  Form,
  Modal,
  Row,
} from '@themesberg/react-bootstrap'
import AutoGenerateInput from '../Shared/AutoGenerateInput/AutoGenerateInput'
import SpecificationInput from '../Product/CustomSpecification/SpecificationInput/SpecificationInput'
import { setStep } from '../../../store/slices/tenants'

const CheckoutTenantReg = ({
  type,
  tenantData,
  update,
  updateTenant,
  setVisible,
  popupLabel,
  currentPrice,
  setCurrentTenant,
  setOrderID,
}) => {
  const {
    createTenantRequest,
    editTenantRequest,
    getProductPlanPriceList,
    getProductSpecification,
    getProductList,
  } = useRequest()
  const [submitLoading, setSubmitLoading] = useState()
  const [specValidationErrors, setSpecValidationErrors] = useState({})

  const dispatch = useDispatch()

  const { productId, subscribtionId } = useParams()
  const listProduct = useSelector((state) => state.products.products)

  let list = Object.values(listProduct)
  const plansPriceList = useSelector(
    (state) => state.products.products[productId]?.plansPrice
  )
  useEffect(() => {
    if (Object.values(listProduct).length < 0 || !listProduct) {
      return
    }
    const fetchData = async () => {
      try {
        if (!plansPriceList || Object.keys(plansPriceList).length == 0) {
          const allPlansPrices = await getProductPlanPriceList(productId)
          dispatch(
            setAllPlansPrice({
              productId: productId,
              data: allPlansPrices.data.data,
            })
          )
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [productId])
  const currentPlan = plansPriceList?.[subscribtionId]?.plan?.id

  useEffect(() => {
    if (!listProduct) {
      let query = `?page=1&pageSize=50&filters[0].Field=SearchTerm`
      ;(async () => {
        const productList = await getProductList(query)
        dispatch(setAllProduct(productList.data.data.items))
      })()
    }
  }, [])

  const createValidation = {
    displayName: Yup.string()
      .required(<FormattedMessage id="Display-Name-is-required" />)
      .max(100, <FormattedMessage id="Must-be-maximum-100-digits" />),

    systemName: Yup.string()
      .max(100, <FormattedMessage id="Must-be-maximum-100-digits" />)
      .required(<FormattedMessage id="System-Name-is-required" />)
      .matches(
        /^[a-zA-Z0-9_-]+$/,
        <FormattedMessage id="English-Characters,-Numbers,-and-Underscores-are-only-accepted." />
      ),
  }
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
    plan: currentPlan || '',
    price: tenantData ? tenantData.price : '',
    product: productId || '',
  }

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,

    onSubmit: async (values) => {
      const specificationsArray = listProduct?.[productId]?.specifications
        ? Object.values(listProduct?.[productId].specifications).map(
            (specification) => {
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
            }
          )
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
          const createTenant = await createTenantRequest({
            subscriptions: [
              {
                productId: productId,
                planId: currentPlan,
                planPriceId: currentPrice,
                specifications: specificationsArray,
              },
            ],
            systemName: values.systemName,
            displayName: values.displayName,
          })
          setCurrentTenant(createTenant?.data.data.id)
          setOrderID(createTenant?.data.data.orderId)

          dispatch(
            deleteAllPlan({
              productId: values.product,
            })
          )
          dispatch(
            deleteAllPlanPrice({
              productId: values.product,
            })
          )
          dispatch(setStep(2))
        } else {
          const editTenant = await editTenantRequest({
            displayName: values.displayName,
            id: tenantData.id,
          })
          updateTenant()
        }
      }
      setVisible && setVisible(false)
      setVisible && setVisible(false)
    },
  })

  const intl = useIntl()
  let planOptions
  if (listProduct[formik.values.product]?.plans) {
    planOptions = Object.values(listProduct[formik.values.product].plans)
      .filter((item) => item.isPublished === true)
      .map((item, index) => ({
        value: item.id,
        label: item.displayName,
      }))
  } else {
    planOptions = []
  }

  const options = list.map((item) => {
    return { value: item.id, label: item.name }
  })
  const [specificationValues, setSpecificationValues] = useState({})

  useEffect(() => {
    ;(async () => {
      formik.setFieldValue('plan', '')
      formik.setFieldValue('price', '')
      if (listProduct[productId]) {
        if (!listProduct[productId].specifications) {
          const specifications = await getProductSpecification(productId)

          dispatch(
            setAllSpecifications({
              productId: productId,
              data: specifications.data.data,
            })
          )
        }
      }
    })()
  }, [productId, listProduct])

  const [filteredSpecificationsArray, setFilteredSpecificationsArray] =
    useState()
  useEffect(() => {
    const productData = listProduct[productId]

    const allSpecificationsArray = productData?.specifications
      ? Object.values(productData.specifications)
      : []
    setFilteredSpecificationsArray(
      allSpecificationsArray.filter((spec) => spec.isPublished === true)
    )
  }, [productId, listProduct])

  const handleSpecificationChange = (specificationId, event) => {
    const newValue = event.target.value
    setSpecificationValues((prevValues) => ({
      ...prevValues,
      [specificationId]: newValue,
    }))
  }

  return (
    <Wrapper>
      {listProduct?.[productId] && (
        <Form onSubmit={formik.handleSubmit}>
          <Card.Header>
            <Modal.Title className="h6">{popupLabel}</Modal.Title>
          </Card.Header>
          <Card.Body>
            <div>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FormattedMessage id="Display-Name" />{' '}
                  <span style={{ color: 'red' }}>*</span>
                </Form.Label>
                <input
                  className="form-control"
                  type="text"
                  id="displayName"
                  name="displayName"
                  onChange={formik.handleChange}
                  value={formik.values.displayName}
                />

                {formik.touched.displayName && formik.errors.displayName && (
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ display: 'block' }}
                  >
                    {formik.errors.displayName}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </div>

            <div className="mb-3">
              {type === 'create' && (
                <AutoGenerateInput
                  label={<FormattedMessage id="System-Name" />}
                  id="systemName"
                  value={formik.values.displayName}
                  name={formik.values.systemName}
                  onChange={formik.handleChange}
                  onGenerateUniqueName={(generatedUniqueName) => {
                    formik.setFieldValue('systemName', generatedUniqueName)
                  }}
                  onAutoGenerateClick={() => {
                    formik.setFieldValue(
                      'isAutoGenerated',
                      !formik.values.isAutoGenerated
                    )
                  }}
                  isAutoGenerated={formik.values.isAutoGenerated}
                />
              )}
              {formik.touched.systemName && formik.errors.systemName && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: 'block' }}
                >
                  {formik.errors.systemName}
                </Form.Control.Feedback>
              )}
            </div>

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
              <div className="text-danger">{formik.errors.specifications}</div>
            )}
          </Card.Body>
          <Card.Footer>
            <Button variant="secondary" type="submit" disabled={submitLoading}>
              <FormattedMessage id="Submit" />
            </Button>
          </Card.Footer>
        </Form>
      )}
    </Wrapper>
  )
}

export default CheckoutTenantReg
