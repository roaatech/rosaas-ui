import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import useRequest from '../../../../../axios/apis/useRequest.js'
import {
  Modal,
  Button,
  OverlayTrigger,
  Tooltip,
} from '@themesberg/react-bootstrap'
import { Form } from '@themesberg/react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'
import { Wrapper } from './FeaturePlanForm.styled.jsx'
import { useParams } from 'react-router-dom'
import {
  featurePlanInfo,
  setAllFeaturePlan,
  setAllFeatures,
} from '../../../../../store/slices/products/productsSlice.js'
import { setAllPlans } from '../../../../../store/slices/products/productsSlice.js'
import TextareaAndCounter from '../../../Shared/TextareaAndCounter/TextareaAndCounter.jsx' // Import the missing component
import {
  activeIndex,
  featureResetMap,
  featureUnitMap,
} from '../../../../../const/index.js'
import { TabPanel, TabView } from 'primereact/tabview'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faQuestionCircle,
  faToggleOff,
  faToggleOn,
} from '@fortawesome/free-solid-svg-icons'
import { activeTab } from '../../../../../const/product.js'
import MultilingualInput from '../../../Shared/MultilingualInput/MultilingualInput.jsx'
import SafeFormatMessage from '../../../Shared/SafeFormatMessage/SafeFormatMessage.jsx'
import useSharedFunctions from '../../../Shared/SharedFunctions/SharedFunctions.jsx'

const FeaturePlanForm = ({
  type,
  FeaturePlanData,
  setVisible,
  popupLabel,
  setActiveIndex,
  plan,
  feature,
  selectedLanguage,
}) => {
  const routeParams = useParams()
  const productId = routeParams.id
  const intl = useIntl()
  const {
    getProductFeatures,
    getProductPlans,
    createFeaturePlanRequest,
    editFeaturePlanRequest,
    getFeaturePlanList,
  } = useRequest()
  const dispatch = useDispatch()
  const [unitDisplayName, setUnitDisplayName] = useState(false)

  const isFeatureBoolean = (value) => {
    return (
      featureOptions &&
      featureOptions.find((obj) => obj.value === value)?.type == 'Boolean'
    )
  }

  const allProducts = useSelector((state) => state.products.products)
  const listFeatureData = allProducts[productId]?.features
  let allFeatureArray = listFeatureData && Object.values(listFeatureData)
  console.log({ allFeatureArray })

  const allPlans = useSelector(
    (state) => state.products.products[productId]?.plans
  )
  let allPlansArray = allPlans && Object.values(allPlans)
  const allPlansfeatures = useSelector(
    (state) => state.products.products[productId]?.featurePlan
  )
  const { getLocalizedString } = useSharedFunctions()

  if (allPlansArray) {
    allPlansArray = allPlansArray.filter((plan) => !plan.isSubscribed)
  }
  const [featureOptions, setfeatureOptions] = useState()
  useEffect(() => {
    const features = listFeatureData
      ? allFeatureArray.map((item) => {
          return {
            value: item.id,
            label: getLocalizedString(item?.displayNameLocalizations),
            type: item.type == 1 ? 'Number' : 'Boolean',
          }
        })
      : []
    setfeatureOptions(features)
  }, [listFeatureData])

  const planOptions = allPlans
    ? allPlansArray.map((item) => {
        return {
          value: item.id,
          label: getLocalizedString(item.displayNameLocalizations),
        }
      })
    : []

  useEffect(() => {
    ;(async () => {
      if (!allProducts[productId].featurePlan || !allPlansfeatures) {
        const featurePlan = await getFeaturePlanList(productId)
        dispatch(
          setAllFeaturePlan({
            productId: productId,
            data: featurePlan.data.data,
          })
        )
      }
      if (!listFeatureData) {
        const featureReq = await getProductFeatures(productId)
        dispatch(
          setAllFeatures({ productId: productId, data: featureReq.data.data })
        )
      }
      if (!allPlans) {
        const planReq = await getProductPlans(productId)
        dispatch(setAllPlans({ productId: productId, data: planReq.data.data }))
      }
    })()
  }, [allPlansfeatures])

  const initialValues = {
    feature: feature || (FeaturePlanData ? FeaturePlanData?.feature?.id : ''),
    plan: plan || (FeaturePlanData ? FeaturePlanData?.plan?.id : ''),
    limit: FeaturePlanData ? FeaturePlanData?.limit : '',
    reset: FeaturePlanData ? FeaturePlanData?.reset : '',
    unit: FeaturePlanData ? FeaturePlanData?.unit : '',
    unitDisplayNameEn: FeaturePlanData
      ? FeaturePlanData?.unitDisplayName?.en
      : '',
    unitDisplayNameAr: FeaturePlanData
      ? FeaturePlanData?.unitDisplayName?.ar
      : '',
    descriptionEn: FeaturePlanData?.descriptionLocalizations?.en || '',
    descriptionAr: FeaturePlanData?.descriptionLocalizations?.ar || '',
  }

  const validationSchema = Yup.object().shape({
    feature: Yup.string().required(
      <SafeFormatMessage id="Please-Select-a-Option" />
    ),
    plan: Yup.string().required(
      <SafeFormatMessage id="Please-Select-a-Option" />
    ),
    limit: Yup.number()
      .nullable()
      .test('', 'Limit must be number more than 0', function (value) {
        const feature = this.resolve(Yup.ref('feature'))
        if (isFeatureBoolean(feature)) {
          return true
        } else if (unlimited) {
          return true
        } else {
          const regex = /^[1-9]\d*$/
          return regex.test(value)
        }
      }),

    unit: Yup.number()
      .nullable()
      .test('', 'This field is required', function (value) {
        const feature = this.resolve(Yup.ref('feature'))
        if (isFeatureBoolean(feature)) {
          return true
        } else {
          if (value) {
            return true
          } else {
            return false
          }
        }
      }),
    reset: Yup.number()
      .nullable()
      .test('', 'This field is required', function (value) {
        const feature = this.resolve(Yup.ref('feature'))
        if (isFeatureBoolean(feature)) {
          return true
        } else {
          if (value) {
            return true
          } else {
            return false
          }
        }
      }),
  })

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const dataDetails = {
        descriptionLocalizations: {
          en: values.descriptionEn,
          ar: values.descriptionAr,
        },
        featureId: values.feature,
        planId: values.plan,
      }
      if (values.limit) dataDetails.limit = unlimited ? null : values.limit
      if (values.reset) dataDetails.reset = parseInt(values.reset)
      if (values.unit) dataDetails.unit = parseInt(values.unit)
      if (values.unitDisplayNameEn || values.unitDisplayNameAr)
        dataDetails.unitDisplayName = {
          en: values.unitDisplayNameEn,
          ar: values.unitDisplayNameAr,
        }

      if (type === 'create') {
        const createFeaturePlan = await createFeaturePlanRequest({
          productId: productId,
          data: dataDetails,
        })

        if (!allProducts[productId].featurePlan) {
          const featurePlan = await getFeaturePlanList(productId)
          dispatch(
            setAllFeaturePlan({
              productId: productId,
              data: featurePlan.data.data,
            })
          )
        }
        dispatch(
          featurePlanInfo({
            productId: productId,
            data: {
              ...dataDetails,
              feature: {
                id: values.feature,
                displayNameLocalizations: Object.values(listFeatureData).find(
                  (item) => item.id === values.feature
                ).displayNameLocalizations,
              },
              plan: {
                id: values.plan,
                displayName: planOptions.find(
                  (item) => item.value === values.plan
                ).label,
              },
              id: createFeaturePlan.data.data.id,
              editedDate: new Date().toISOString().slice(0, 19),
              createdDate: new Date().toISOString().slice(0, 19),
            },
          })
        )
        if (setActiveIndex) {
          setActiveIndex(activeTab.plansFeatures)
        }
      } else {
        const editFeaturePlan = await editFeaturePlanRequest({
          productId: productId,
          featurePlanId: FeaturePlanData.id,
          data: dataDetails,
        })

        const newData = {
          ...FeaturePlanData,
          descriptionLocalizations: {
            en: values.descriptionEn,
            ar: values.descriptionAr,
          },
          limit: unlimited ? null : values.limit,
          reset: values.reset,
          unit: values.unit,
          unitDisplayName: {
            en: values.unitDisplayNameEn,
            ar: values.unitDisplayNameAr,
          },
          editedDate: new Date().toISOString().slice(0, 19),
        }

        dispatch(featurePlanInfo({ productId, data: newData }))
      }
      setVisible && setVisible(false)
    },
  })

  const [availableFeatures, setAvailableFeatures] = useState()
  useEffect(() => {
    if (!featureOptions) {
      return
    }
    setAvailableFeatures(featureOptions)
  }, [featureOptions])

  useEffect(() => {
    if (!featureOptions) {
      return
    }
    if (formik.values.plan || FeaturePlanData?.plan?.id) {
      const selectedPlanId = formik.values.plan || FeaturePlanData?.plan?.id
      const featuresAssignedToPlan = Object.values(allPlansfeatures)
        .filter((planFeature) => planFeature.plan.id === selectedPlanId)
        .map((planFeature) => planFeature.feature)
      if (featuresAssignedToPlan.length > 0) {
        const assignedFeatureIds = featuresAssignedToPlan
          .map((planFeature) => planFeature.id)
          .filter((id) => id !== '00000000-0000-0000-0000-000000000000')

        const updatedAvailableFeatures = featureOptions.filter(
          (option) => !assignedFeatureIds.includes(option.value)
        )

        setAvailableFeatures(updatedAvailableFeatures)
      }
      console.log(featuresAssignedToPlan)
    }
  }, [formik.values.plan, FeaturePlanData?.plan?.id, featureOptions])
  useEffect(() => {
    if (FeaturePlanData?.unit == 1 || formik.values.unit == 1) {
      setUnitDisplayName(true)
    } else {
      setUnitDisplayName(false)
    }
  }, [formik.values.unit, FeaturePlanData?.unit])
  const [unlimited, setUnlimited] = useState(false)
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
          <div style={{ display: type == 'edit' ? 'none' : 'block' }}>
            <Form.Group className="mb-3">
              <Form.Label>
                <SafeFormatMessage id="Plan" />{' '}
                <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <select
                className="form-control"
                name="plan"
                id="plan"
                value={formik.values.plan}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value={''}>
                  <SafeFormatMessage id="Select-Option" />
                </option>
                {planOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {formik.touched.plan && formik.errors.plan && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: 'block' }}
                >
                  {formik.errors.plan}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </div>

          <div style={{ display: type == 'edit' ? 'none' : 'block' }}>
            <Form.Group className="mb-3">
              <Form.Label>
                <SafeFormatMessage id="Feature" />{' '}
                <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <select
                className="form-control"
                name="feature"
                id="feature"
                value={formik.values.feature}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!formik.values.plan}
              >
                <option value={''}>
                  <SafeFormatMessage id="Select-Option" />
                </option>
                {availableFeatures &&
                  availableFeatures.map((option) => (
                    <option key={option.value} value={option.value}>
                      {`${option.label} (${option.type})`}
                    </option>
                  ))}
              </select>
              {formik.touched.feature && formik.errors.feature && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: 'block' }}
                >
                  {formik.errors.feature}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </div>
          <div
            style={{
              display: isFeatureBoolean(formik.values.feature)
                ? 'none'
                : 'block',
            }}
          >
            <Form.Group className="">
              <Form.Label>
                <SafeFormatMessage id="Limit" />
                <span style={{ color: 'red' }}> *</span>
              </Form.Label>
              <input
                type="text"
                className="form-control"
                id="limit"
                name="limit"
                onChange={formik.handleChange}
                value={
                  unlimited
                    ? ''
                    : isFeatureBoolean(formik.values.feature)
                    ? ''
                    : formik.values.limit
                }
                disabled={isFeatureBoolean(formik.values.feature) || unlimited}
              />

              {formik.touched.limit && formik.errors.limit && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: 'block' }}
                >
                  {formik.errors.limit}
                </Form.Control.Feedback>
              )}
              <div
                className={`text-right ${
                  unlimited ? 'active-toggle mr-2' : 'passive-toggle mr-2'
                }`}
              >
                <span>
                  <SafeFormatMessage id="Unlimited" />
                </span>
                <FontAwesomeIcon
                  icon={unlimited ? faToggleOn : faToggleOff}
                  className={
                    unlimited ? 'active-toggle ml-1' : 'passive-toggle ml-1'
                  }
                  onClick={() => setUnlimited(!unlimited)}
                />
              </div>
            </Form.Group>
          </div>
          <div
            style={{
              display: isFeatureBoolean(formik.values.feature)
                ? 'none'
                : 'block',
            }}
          >
            <Form.Group className="mb-3">
              <Form.Label>
                <SafeFormatMessage id="Unit" />
                <span style={{ color: 'red' }}> *</span>
              </Form.Label>
              <select
                className="form-control"
                id="unit"
                name="unit"
                onChange={formik.handleChange}
                value={
                  isFeatureBoolean(formik.values.feature)
                    ? ''
                    : formik.values.unit
                }
                disabled={isFeatureBoolean(formik.values.feature)}
              >
                <option value="">
                  <SafeFormatMessage id="Select-Option" />
                </option>
                {Object.entries(featureUnitMap).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {formik.touched.unit && formik.errors.unit && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: 'block' }}
                >
                  {formik.errors.unit}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            {unitDisplayName && (
              <MultilingualInput
                inputLabel="Unit-Display-Name"
                languages={[
                  { code: 'en', name: 'English' },
                  { code: 'ar', name: 'Arabic' },
                ]}
                inputIds={{
                  en: 'unitDisplayNameEn',
                  ar: 'unitDisplayNameAr',
                }}
                placeholder={{
                  en: 'English-Name',
                  ar: 'Arabic-Name',
                }}
                tooltipMessageId="Tooltip-for-Unit-Display-Name"
                values={{
                  en: formik.values.unitDisplayNameEn,
                  ar: formik.values.unitDisplayNameAr,
                }}
                onChange={formik.handleChange}
                isRequired={true}
                inputType="input"
                errors={{
                  en: formik.errors.unitDisplayNameEn,
                  ar: formik.errors.unitDisplayNameAr,
                }}
                touched={{
                  en: formik.touched.unitDisplayNameEn,
                  ar: formik.touched.unitDisplayNameAr,
                }}
              />
            )}
          </div>
          <div
            style={{
              display: isFeatureBoolean(formik.values.feature)
                ? 'none'
                : 'block',
            }}
          >
            <Form.Group className="mb-3">
              <Form.Label>
                <SafeFormatMessage id="Reset" />
                <span style={{ color: 'red' }}> *</span>
              </Form.Label>
              <select
                className="form-control"
                id="reset"
                name="reset"
                onChange={formik.handleChange}
                value={
                  isFeatureBoolean(formik.values.feature)
                    ? ''
                    : formik.values.reset
                }
                disabled={isFeatureBoolean(formik.values.feature)}
              >
                <option value="">
                  <SafeFormatMessage id="Select-Option" />
                </option>
                {Object.entries(featureResetMap).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {formik.touched.reset && formik.errors.reset && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: 'block' }}
                >
                  {formik.errors.reset}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </div>
          {/* MultilingualInput for Description */}
          <MultilingualInput
            inputLabel="Plan-Feature-display-description"
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
            tooltipMessageId="Display-description-of-the-plan-feature-that-will-show-in-the-price-page"
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" type="submit">
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

export default FeaturePlanForm
