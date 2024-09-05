import React, { useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import useRequest from '../../../../../axios/apis/useRequest.js'
import { Modal, Button, Form } from '@themesberg/react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Wrapper } from './PlanForm.styled.jsx'
import { useParams } from 'react-router-dom'
import {
  PlanInfo,
  setAllPlans,
} from '../../../../../store/slices/products/productsSlice.js'
import TextareaAndCounter from '../../../Shared/TextareaAndCounter/TextareaAndCounter.jsx'
import AutoGenerateInput from '../../../Shared/AutoGenerateInput/AutoGenerateInput.jsx'
import MultilingualInput from '../../../Shared/MultilingualInput/MultilingualInput.jsx' // Import MultilingualInput
import { activeTab } from '../../../../../const/product.js'

const PlanForm = ({
  type,
  planData,
  setVisible,
  popupLabel,
  setActiveIndex,
}) => {
  const { createPlanRequest, editPlanRequest, getProductPlans } = useRequest()
  const dispatch = useDispatch()
  const routeParams = useParams()
  const productId = routeParams.id
  const allProducts = useSelector((state) => state.products.products)
  const ProductTrialType = allProducts[productId].trialType

  // Updated initial values for multilingual fields
  const initialValues = {
    displayNameEn: planData?.displayNameLocalizations?.en || '',
    displayNameAr: planData?.displayNameLocalizations?.ar || '',
    descriptionEn: planData?.descriptionLocalizations?.en || '',
    descriptionAr: planData?.descriptionLocalizations?.ar || '',
    systemName: planData ? planData.systemName : '',
    displayOrder: planData ? planData.displayOrder : '0',
    alternativePlanID: planData ? planData.alternativePlanID : '',
    trialPeriodInDays: planData ? planData.trialPeriodInDays : '0',
  }

  // Updated validation schema for multilingual fields
  const validationSchema = Yup.object().shape({
    systemName: Yup.string()
      .max(100, <FormattedMessage id="Must-be-maximum-100-digits" />)
      .required(<FormattedMessage id="Unique-Name-is-required" />)
      .matches(
        /^[a-zA-Z0-9_-]+$/,
        <FormattedMessage id="English-Characters,-Numbers,-and-Underscores-are-only-accepted." />
      ),
    displayNameEn: Yup.string().test({
      name: 'displayNameRequired',
      message: <FormattedMessage id="Display-Name-is-required" />,
      test: (value, context) => {
        const { parent } = context
        const displayNameEn = parent.displayNameEn
        const displayNameAr = parent.displayNameAr
        return !!displayNameEn || !!displayNameAr
      },
    }),
    displayNameAr: Yup.string().test({
      name: 'displayNameRequired',
      message: <FormattedMessage id="Display-Name-is-required" />,
      test: (value, context) => {
        const { parent } = context
        const displayNameEn = parent.displayNameEn
        const displayNameAr = parent.displayNameAr
        return !!displayNameEn || !!displayNameAr
      },
    }),
    descriptionEn: Yup.string().max(
      250,
      <FormattedMessage id="Must-be-maximum-250-digits" />
    ),
    descriptionAr: Yup.string().max(
      250,
      <FormattedMessage id="Must-be-maximum-250-digits" />
    ),
    displayOrder: Yup.number()
      .typeError(<FormattedMessage id="Display-Order-must-be-a-number" />)
      .integer(<FormattedMessage id="Display-Order-must-be-an-integer" />)
      .min(0, <FormattedMessage id="Display-Order-must-be-a-positive-number" />)
      .default(0),
    alternativePlanID: Yup.string(),
    trialPeriodInDays: Yup.number(),
  })

  useEffect(() => {
    const fetchData = async () => {
      if (!allProducts[productId].plan) {
        try {
          const plan = await getProductPlans(productId)
          dispatch(
            setAllPlans({
              productId: productId,
              data: plan.data.data,
            })
          )
        } catch (error) {
          console.error('Error fetching product plans:', error)
        }
      }
    }

    fetchData()
  }, [])

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const dataToSubmit = {
        isLockedBySystem: false,
        tenancyType: 3,
        systemName: values.systemName,
        displayNameLocalizations: {
          en: values.displayNameEn,
          ar: values.displayNameAr,
        },
        descriptionLocalizations: {
          en: values.descriptionEn,
          ar: values.descriptionAr,
        },
        displayOrder: values.displayOrder || 0,
        alternativePlanID: values.alternativePlanID || null,
        trialPeriodInDays: values.trialPeriodInDays || 0,
      }

      if (type === 'create') {
        const createPlan = await createPlanRequest(productId, {
          ...dataToSubmit,
          productId: productId,
        })

        dispatch(
          PlanInfo({
            planId: createPlan.data.data.id,
            productId: productId,
            data: {
              ...dataToSubmit,
              editedDate: new Date().toISOString().slice(0, 19),
              createdDate: new Date().toISOString().slice(0, 19),
              id: createPlan.data.data.id,
            },
          })
        )

        if (setActiveIndex) {
          setActiveIndex(activeTab.plans)
        }
      } else {
        await editPlanRequest(productId, {
          data: dataToSubmit,
          id: planData.id,
        })

        dispatch(
          PlanInfo({
            planId: planData.id,
            productId: productId,
            data: {
              ...dataToSubmit,
              editedDate: new Date().toISOString().slice(0, 19),
              createdDate: planData.createdDate,
              id: planData.id,
            },
          })
        )
      }

      setVisible && setVisible(false)
      setSubmitting(false)
    },
  })

  let alternativePlanIDOptions

  if (allProducts[productId]?.plans) {
    alternativePlanIDOptions = Object.values(allProducts[productId].plans)
      .filter((item) => planData?.id != item.id)
      .map((item) => ({
        value: item.id,
        label: item.displayName,
      }))
  } else {
    alternativePlanIDOptions = []
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
          {/* MultilingualInput for Display Name */}
          <MultilingualInput
            inputLabel="Display-Name"
            languages={[
              { code: 'en', name: 'English' },
              { code: 'ar', name: 'Arabic' },
            ]}
            inputIds={{
              en: 'displayNameEn',
              ar: 'displayNameAr',
            }}
            placeholder={{
              en: 'English-Name',
              ar: 'Arabic-Name',
            }}
            values={{
              en: formik.values.displayNameEn,
              ar: formik.values.displayNameAr,
            }}
            onChange={formik.handleChange}
            isRequired={true}
            inputType="input"
            errors={{
              en: formik.errors.displayNameEn,
              ar: formik.errors.displayNameAr,
            }}
            touched={{
              en: formik.touched.displayNameEn,
              ar: formik.touched.displayNameAr,
            }}
          />

          {/* System Name Field */}
          <div className="mb-3">
            {type === 'create' && (
              <AutoGenerateInput
                label={<FormattedMessage id="System-Name" />}
                id="systemName"
                value={formik.values.displayNameEn}
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

          {/* MultilingualInput for Description */}
          <MultilingualInput
            inputLabel="Description"
            languages={[
              { code: 'en', name: 'English' },
              { code: 'ar', name: 'Arabic' },
            ]}
            inputIds={{
              en: 'descriptionEn',
              ar: 'descriptionAr',
            }}
            placeholder={{
              en: 'English-Description',
              ar: 'Arabic-Description',
            }}
            values={{
              en: formik.values.descriptionEn,
              ar: formik.values.descriptionAr,
            }}
            onChange={formik.handleChange}
            isRequired={false}
            inputType="TextareaAndCounter"
            maxLength={250}
            errors={{
              en: formik.errors.descriptionEn,
              ar: formik.errors.descriptionAr,
            }}
            touched={{
              en: formik.touched.descriptionEn,
              ar: formik.touched.descriptionAr,
            }}
          />

          {/* Display Order Field */}
          <div>
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Display-Order" />
              </Form.Label>
              <input
                type="text"
                className="form-control"
                id="displayOrder"
                name="displayOrder"
                onChange={formik.handleChange}
                value={formik.values.displayOrder}
              />
              {formik.touched.displayOrder && formik.errors.displayOrder && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: 'block' }}
                >
                  {formik.errors.displayOrder}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </div>

          {/* Trial Period Field */}
          {ProductTrialType == 3 && (
            <div>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FormattedMessage id="Trial-Period-In-Days" />
                </Form.Label>
                <input
                  type="text"
                  className="form-control"
                  id="trialPeriodInDays"
                  name="trialPeriodInDays"
                  onChange={formik.handleChange}
                  value={formik.values.trialPeriodInDays}
                />
                {formik.touched.trialPeriodInDays &&
                  formik.errors.trialPeriodInDays && (
                    <Form.Control.Feedback
                      type="invalid"
                      style={{ display: 'block' }}
                    >
                      {formik.errors.trialPeriodInDays}
                    </Form.Control.Feedback>
                  )}
              </Form.Group>
            </div>
          )}

          {/* Alternative Plan Field */}
          <div>
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Alternative-Plan" />{' '}
              </Form.Label>
              <select
                className="form-control"
                name="alternativePlanID"
                id="alternativePlanID"
                value={formik.values.alternativePlanID}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!productId}
              >
                <option value="">
                  <FormattedMessage id="Select-Option" />
                </option>
                {alternativePlanIDOptions?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {formik.touched.alternativePlanID &&
                formik.errors.alternativePlanID && (
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ display: 'block' }}
                  >
                    {formik.errors.alternativePlanID}
                  </Form.Control.Feedback>
                )}
            </Form.Group>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" type="submit">
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

export default PlanForm
