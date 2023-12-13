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
  } = useRequest()
  const [submitLoading, setSubmitLoading] = useState()
  const [specValidationErrors, setSpecValidationErrors] = useState({})

  const dispatch = useDispatch()
  const { getProductList } = useRequest()

  const listData = useSelector((state) => state.products.products)
  const { productId, subscribtionId } = useParams()

  let list = Object.values(listData)
  const plansPriceList = useSelector(
    (state) => state.products.products[productId]?.plansPrice
  )
  const listProduct = useSelector((state) => state.products.products)
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
    if (!listData) {
      let query = `?page=1&pageSize=50&filters[0].Field=SearchTerm`
      ;(async () => {
        const productList = await getProductList(query)
        dispatch(setAllProduct(productList.data.data.items))
      })()
    }
  }, [])

  const createValidation = {
    title: Yup.string()
      .required(<FormattedMessage id="Title-is-required" />)
      .max(100, <FormattedMessage id="Must-be-maximum-100-digits" />),

    uniqueName: Yup.string()
      .max(100, <FormattedMessage id="Must-be-maximum-100-digits" />)
      .required(<FormattedMessage id="Unique-Name-is-required" />)
      .matches(
        /^[a-zA-Z0-9_-]+$/,
        <FormattedMessage id="English-Characters,-Numbers,-and-Underscores-are-only-accepted." />
      ),
  }
  const editValidation = {
    title: Yup.string()
      .required(<FormattedMessage id="Title-is-required" />)
      .max(100, <FormattedMessage id="Must-be-maximum-100-digits" />),
  }
  const validationSchema = Yup.object().shape(
    type === 'create' ? createValidation : editValidation
  )

  const initialValues = {
    title: tenantData ? tenantData.title : '',

    uniqueName: tenantData ? tenantData.uniqueName : '',
    plan: currentPlan || '',
    price: tenantData ? tenantData.price : '',
    product: productId || '',
  }

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,

    onSubmit: async (values) => {
      const specificationsArray = listData?.[productId]?.specifications
        ? Object.values(listData?.[productId].specifications).map(
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
            uniqueName: values.uniqueName,
            title: values.title,
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
            title: values.title,
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
  if (listData[formik.values.product]?.plans) {
    planOptions = Object.values(listData[formik.values.product].plans)
      .filter((item) => item.isPublished === true)
      .map((item, index) => ({
        value: item.id,
        label: item.title,
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
      if (listData[productId]) {
        if (!listData[productId].specifications) {
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
  }, [productId, listData])

  const [filteredSpecificationsArray, setFilteredSpecificationsArray] =
    useState()
  useEffect(() => {
    const productData = listData[productId]

    const allSpecificationsArray = productData?.specifications
      ? Object.values(productData.specifications)
      : []
    setFilteredSpecificationsArray(
      allSpecificationsArray.filter((spec) => spec.isPublished === true)
    )
  }, [productId, listData])

  const handleSpecificationChange = (specificationId, event) => {
    const newValue = event.target.value
    setSpecificationValues((prevValues) => ({
      ...prevValues,
      [specificationId]: newValue,
    }))
  }

  return (
    <Wrapper>
      <Container className="card ">
        <Row>
          {listData?.[productId] && (
            <Form onSubmit={formik.handleSubmit}>
              <Card.Header>
                <Modal.Title className="h6">{popupLabel}</Modal.Title>
              </Card.Header>
              <Card.Body>
                <div>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FormattedMessage id="Title" />{' '}
                      <span style={{ color: 'red' }}>*</span>
                    </Form.Label>
                    <input
                      className="form-control"
                      type="text"
                      id="title"
                      name="title"
                      onChange={formik.handleChange}
                      value={formik.values.title}
                    />

                    {formik.touched.title && formik.errors.title && (
                      <Form.Control.Feedback
                        type="invalid"
                        style={{ display: 'block' }}
                      >
                        {formik.errors.title}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                </div>

                <div className="mb-3">
                  {type === 'create' && (
                    <AutoGenerateInput
                      label={<FormattedMessage id="Name" />}
                      id="uniqueName"
                      value={formik.values.title}
                      name={formik.values.uniqueName}
                      onChange={formik.handleChange}
                      onGenerateUniqueName={(generatedUniqueName) => {
                        formik.setFieldValue('uniqueName', generatedUniqueName)
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
                  {formik.touched.uniqueName && formik.errors.uniqueName && (
                    <Form.Control.Feedback
                      type="invalid"
                      style={{ display: 'block' }}
                    >
                      {formik.errors.uniqueName}
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
        </Row>
      </Container>
    </Wrapper>
  )
}

export default CheckoutTenantReg
