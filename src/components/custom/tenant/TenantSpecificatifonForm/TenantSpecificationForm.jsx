import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import useRequest from '../../../../axios/apis/useRequest.js'
import { useDispatch, useSelector } from 'react-redux'
import { Form } from '@themesberg/react-bootstrap'
import { Modal, Button } from '@themesberg/react-bootstrap'
import {
  setAllSpecifications,
  setAllProduct,
} from '../../../../store/slices/products/productsSlice.js'
import { Wrapper } from './TenantSpecificatifonForm.styled.jsx'
import { FormattedMessage, useIntl } from 'react-intl'
import SpecificationInput from '../../Product/CustomSpecification/SpecificationInput/SpecificationInput.jsx'
import { validateSpecifications } from '../validateSpecifications/validateSpecifications.jsx'
import SafeFormatMessage from '../../Shared/SafeFormatMessage/SafeFormatMessage.jsx'

const TenantSpecificationForm = ({
  type,
  tenantData,
  update,
  updateTenant,
  setVisible,
  popupLabel,
  selectedProduct,
}) => {
  const { editTenantSpecificationRequest, getProductSpecification } =
    useRequest()
  const [submitLoading, setSubmitLoading] = useState()
  const [specValidationErrors, setSpecValidationErrors] = useState({})
  const dispatch = useDispatch()
  const { getProductList } = useRequest()

  const listData = useSelector((state) => state.products.products)

  useEffect(() => {
    if (!listData) {
      let query = `?page=1&pageSize=50&filters[0].Field=SearchTerm`

      ;(async () => {
        const productList = await getProductList(query)
        dispatch(setAllProduct(productList.data.data.items))
      })()
    }
  }, [])

  const specificationValuesObject = (tenantData?.subscriptions || [])
    .flatMap((subscription) => subscription?.specifications || [])
    .reduce((acc, specification) => {
      acc[specification.id] = specification.value
      return acc
    }, {})

  const initialValues = {}

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

  useEffect(() => {
    ;(async () => {
      if (listData[selectedProduct]) {
        if (!listData[selectedProduct].specifications) {
          const specifications = await getProductSpecification(selectedProduct)

          dispatch(
            setAllSpecifications({
              productId: selectedProduct,
              data: specifications.data.data,
            })
          )
        }
      }
    })()
  }, [selectedProduct])

  const [specificationValues, setSpecificationValues] = useState({})

  const productData = listData[selectedProduct]

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
            <SafeFormatMessage id="Submit" />
          </Button>
          <Button
            variant="link"
            className="text-gray "
            onClick={() => setVisible(false)}
          >
            <SafeFormatMessage id="Close" />
          </Button>
        </Modal.Footer>
      </Form>
    </Wrapper>
  )
}

export default TenantSpecificationForm
