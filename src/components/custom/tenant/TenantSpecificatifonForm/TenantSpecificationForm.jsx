import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import useRequest from '../../../../axios/apis/useRequest.js'
import { cycle } from '../../../../const/index.js'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Form, OverlayTrigger, Tooltip } from '@themesberg/react-bootstrap'
import { Modal, Button } from '@themesberg/react-bootstrap'
import {
  deleteAllPlan,
  deleteAllPlanPrice,
  setAllPlans,
  setAllSpecifications,
  setAllProduct,
} from '../../../../store/slices/products.js'
import { Wrapper } from './TenantSpecificatifonForm.styled.jsx'
import { FormattedMessage, useIntl } from 'react-intl'
import SpecificationInput from '../../Product/CustomSpecification/SpecificationInput/SpecificationInput.jsx'
import { BsFillQuestionCircleFill } from 'react-icons/bs'

const TenantSpecificationForm = ({
  type,
  tenantData,
  update,
  updateTenant,
  setVisible,
  popupLabel,
  selectedProduct,
}) => {
  const {
    createTenantRequest,
    editTenantRequest,
    editTenantSpecificationRequest,
    getProductPlans,
    getProductPlanPriceList,
    getProductSpecification,
  } = useRequest()
  console.log({ tenantData })
  const [submitLoading, setSubmitLoading] = useState()
  const [priceList, setPriceList] = useState([])
  const navigate = useNavigate()
  const [specValidationErrors, setSpecValidationErrors] = useState({})
  console.log({ selectedProduct })
  const dispatch = useDispatch()
  const { getProductList } = useRequest()

  const listData = useSelector((state) => state.products.products)

  let list = Object.values(listData)

  useEffect(() => {
    let query = `?page=1&pageSize=50&filters[0].Field=SearchTerm`

    ;(async () => {
      const productList = await getProductList(query)
      dispatch(setAllProduct(productList.data.data.items))
    })()
  }, [])

  const specificationValuesObject = (tenantData?.subscriptions || [])
    .flatMap((subscription) => subscription?.specifications || [])
    .reduce((acc, specification) => {
      acc[specification.id] = specification.value
      return acc
    }, {})

  const initialValues = {
    product: selectedProduct,
  }
  let [validateErrors, setValidateErrors] = useState({})
  const validateSpecifications = () => {
    setSpecValidationErrors({})
    filteredSpecificationsArray &&
      filteredSpecificationsArray.forEach((specification) => {
        let {
          id: specificationId,
          isRequired,
          regularExpression,
          validationFailureDescription,
        } = specification

        const value = specificationValues[specificationId] || ''
        if (regularExpression.startsWith('/')) {
          regularExpression = regularExpression.slice(1)
        }
        if (regularExpression.endsWith('/')) {
          regularExpression = regularExpression.slice(0, -1)
        }

        let flags = ''
        if (/[gimus]+$/.test(regularExpression)) {
          flags = regularExpression.slice(-1)
          regularExpression = regularExpression.slice(0, -1)
        }

        let pattern = regularExpression

        let regex = new RegExp(pattern, flags)

        if (isRequired && !value.trim()) {
          validateErrors[specificationId] = 'This field is required'
        } else if (regularExpression && value.trim() && !regex.test(value)) {
          validateErrors[specificationId] = validationFailureDescription.en
        }
      })

    setSpecValidationErrors(validateErrors)
    return { errors: validateErrors }
  }

  const formik = useFormik({
    initialValues,

    onSubmit: async (values) => {
      const specificationsArray = filteredSpecificationsArray?.map(
        (specification) => {
          const specificationId = specification.id
          const value = specificationValues[specificationId] || ''
          return {
            specificationId,
            value,
          }
        }
      )
      const specErrors = validateSpecifications()
      formik.setErrors(specErrors.errors)

      if (
        Object.keys(formik.errors).length === 0 &&
        Object.keys(specErrors.errors).length === 0
      ) {
        const editTenant = await editTenantSpecificationRequest(
          specificationsArray,

          tenantData.id,
          selectedProduct
        )
        updateTenant()

        setVisible && setVisible(false)
      }
    },
  })

  const intl = useIntl()
  let planOptions
  if (listData[formik.values.product]?.plans) {
    planOptions = Object.values(listData[formik.values.product].plans)
      .filter((item) => item.isPublished === true)
      .map((item, index) => ({
        value: item.id,
        label: item.name,
      }))
  } else {
    planOptions = []
  }

  const options = list.map((item) => {
    return { value: item.id, label: item.name }
  })
  useEffect(() => {
    ;(async () => {
      if (listData[formik.values.product]) {
        if (!listData[formik.values.product].specifications) {
          const specifications = await getProductSpecification(
            formik.values.product
          )

          dispatch(
            setAllSpecifications({
              productId: formik.values.product,
              data: specifications.data.data,
            })
          )
        }
      }
    })()
  }, [formik.values.product])

  const [specificationValues, setSpecificationValues] = useState({})

  const productData = listData[formik.values.product]

  const allSpecificationsArray = productData?.specifications
    ? Object.values(productData.specifications)
    : []

  const filteredSpecificationsArray = allSpecificationsArray.filter(
    (spec) => spec.isPublished === true && spec.isUserEditable === true
  )

  useEffect(() => {
    if (type == 'edit' && Object.keys(specificationValuesObject).length > 0) {
      setSpecificationValues((prevValues) => ({
        ...prevValues,
        ...specificationValuesObject,
      }))
    }
  }, [type])
  const handleSpecificationChange = (specificationId, event) => {
    const newValue = event.target.value
    setSpecificationValues((prevValues) => ({
      ...prevValues,
      [specificationId]: newValue,
    }))
  }

  return (
    <Wrapper>
      <Form onSubmit={formik.handleSubmit}>
        <Modal.Header>
          <Modal.Title className="h6">{popupLabel}</Modal.Title>
          <Button
            variant="close"
            aria-label="Close"
            onClick={() => setVisible(false)}
          />
        </Modal.Header>
        <Modal.Body>
          {Array.isArray(filteredSpecificationsArray) &&
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" type="submit" disabled={submitLoading}>
            <FormattedMessage id="Submit" />
          </Button>
          <Button
            variant="link"
            className="text-gray "
            onClick={() => setVisible(false)}
          >
            <FormattedMessage id="Close" />
          </Button>
        </Modal.Footer>
      </Form>
    </Wrapper>
  )
}

export default TenantSpecificationForm
