import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { FormattedMessage } from 'react-intl'
import { Wrapper } from './DiscountRequirementsForm.styled'
import {
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
} from '@themesberg/react-bootstrap'
import useRequest from '../../../../axios/apis/useRequest'
import { useDispatch, useSelector } from 'react-redux'
import {
  setAllDiscounts,
  discountInfo,
  setDiscountAllocation,
  setAllRequirementsOptions,
  setDiscountRequirementInfo,
} from '../../../../store/slices/discountsSlice'
import SafeFormatMessage from '../../Shared/SafeFormatMessage/SafeFormatMessage'
import { MultiSelect } from 'primereact/multiselect'
import { setAllPlansLookup } from '../../../../store/slices/products/productsSlice'
import {
  countryIsoCodes,
  discountTypes,
  entityTypes,
} from '../../../../const/const'
import {
  convertEnumToOptionsArray,
  convertObjectToCustomOptionsArray,
} from '../../Shared/SharedFunctions/SharedFunctions'
import { use } from 'react'
import { useParams } from 'react-router-dom'

const DiscountRequirementsForm = ({
  setVisible, // Function to toggle modal visibility
  popupLabel, // Title of the modal
  onUpdate, // Callback after form submission
  currentId,
  type,
  discountData,
  requirementType = '',
}) => {
  console.log({ discountData: discountData, currentId })
  const discountId = useParams().id
  console.log({ discountId })

  const dispatch = useDispatch()
  const {
    getDiscountsRequirementsOptions,
    createDiscountRequirementGeoLocation,
    editDiscountRequirementGeoLocation,
  } = useRequest()
  const [discountrequirementType, setDiscountRequirementType] =
    useState(requirementType)

  const productsLookup = useSelector(
    (state) => state.products?.lookup?.productsLookup
  )
  const requirementsOptions = useSelector(
    (state) => state.discountsSlice?.requirementsOptions
  )
  useEffect(() => {
    if (requirementsOptions && requirementsOptions.length > 0) {
      return
    }
    const sendRequest = () => {
      ;(async () => {
        const listData = await getDiscountsRequirementsOptions()
        dispatch(setAllRequirementsOptions(listData.data.data))
      })()
    }
    sendRequest()
  }, [])

  const initialValues = {
    parentId: null,
    isGroup: false,
    interactionType: null,
    countriesIsoCodes: discountData?.countriesIsoCodes || [],
  }
  const validationSchema = Yup.object().shape({
    countriesIsoCodes: Yup.array().test({
      name: 'is-required-if-geo-location',
      message: <SafeFormatMessage id="This-field-is-required" />,
      test: function (value) {
        // Access the parent context here
        if (
          discountrequirementType === 'GeoLocationDiscountRequirementRule' &&
          (!value || value.length === 0)
        ) {
          return false // Validation fails if empty when required
        }
        return true // Validation passes if condition isn't met
      },
    }),
  })
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const payload = {
        ...values,
      }

      try {
        if (type === 'create') {
          const response = await createDiscountRequirementGeoLocation(
            discountId,
            payload
          )

          dispatch(
            setDiscountRequirementInfo({
              id: response?.data?.data?.id,
              discountId: discountId,
              data: {
                ...payload,
                id: response?.data?.data?.id,
                systemName:
                  discountrequirementType ===
                  'GeoLocationDiscountRequirementRule'
                    ? 'GeoLocationDiscountRequirementRule'
                    : '',
              },
            })
          )
        } else {
          console.log({ ssssssssssssssss: discountId })

          const response = await editDiscountRequirementGeoLocation(
            discountId,
            {
              ...discountData,
              ...payload,
            },
            currentId
          )

          dispatch(
            setDiscountRequirementInfo({
              id: currentId,
              discountId: discountId,
              data: {
                ...discountData,
                ...payload,
              },
            })
          )
        }

        setSubmitting(false)
        setVisible(false)
        onUpdate && onUpdate()
      } catch (error) {
        console.error('Error submitting form:', error)
      }
    },
  })
  console.log({ values: formik.values })

  const handleMultiSelectChange = (e) => {
    const selectedIds = e.value?.map((option) => option)

    formik.setFieldValue('countriesIsoCodes', selectedIds || [])
  }
  const requirementTypeOptions =
    requirementsOptions &&
    convertObjectToCustomOptionsArray(
      requirementsOptions,
      'displayName',
      'systemName'
    )
  console.log({ requirementTypeOptions, requirementsOptions })

  const GeolocationModelBoy = () => {
    return (
      <div className="mb-3">
        <Form.Label>
          <SafeFormatMessage id="Countries" />
        </Form.Label>
        <MultiSelect
          value={formik.values.countriesIsoCodes}
          options={
            countryIsoCodes && convertEnumToOptionsArray(countryIsoCodes)
          }
          placeholder={SafeFormatMessage({ id: 'Select' })}
          onChange={handleMultiSelectChange}
          showSelectAll={true}
          className={`d-flex p-0 form-control ${
            formik.touched.countriesIsoCodes && formik.errors.countriesIsoCodes
              ? 'is-invalid'
              : ''
          }`}
          maxSelectedLabels={0}
          selectedItemTemplate={(items) => {
            const count = formik.values.countriesIsoCodes?.length
            return count === 0 ? (
              SafeFormatMessage({ id: 'No-items-selected' })
            ) : (
              <span>
                {count} <SafeFormatMessage id={'items-selected'} />
              </span>
            )
          }}
        />
        {formik.touched.countriesIsoCodes &&
          formik.errors.countriesIsoCodes && (
            <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
              {formik.errors.countriesIsoCodes}
            </Form.Control.Feedback>
          )}
      </div>
    )
  }
  return (
    <Wrapper>
      <form onSubmit={formik.handleSubmit}>
        <Modal.Header>
          <Modal.Title className="h6">{popupLabel}</Modal.Title>
          <Button
            variant="close"
            aria-label="Close"
            onClick={() => setVisible(false)}
          />
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>
              <SafeFormatMessage id="DiscountRequirementType" />
            </Form.Label>
            <select
              className="form-control"
              value={discountrequirementType}
              onChange={(e) => setDiscountRequirementType(e.target.value)}
            >
              <option value="">
                <SafeFormatMessage id="Select-Option" />
              </option>
              {requirementTypeOptions &&
                requirementTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
            </select>
          </Form.Group>
          {discountrequirementType == 'GeoLocationDiscountRequirementRule' &&
            GeolocationModelBoy()}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            type="submit"
            disabled={formik.isSubmitting}
          >
            <SafeFormatMessage id="submit" />
          </Button>
          <Button
            variant="link"
            className="text-gray"
            onClick={() => setVisible(false)}
          >
            <SafeFormatMessage id="close" />
          </Button>
        </Modal.Footer>
      </form>
    </Wrapper>
  )
}
export default DiscountRequirementsForm
