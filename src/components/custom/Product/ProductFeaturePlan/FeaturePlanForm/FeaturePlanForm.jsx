import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import useRequest from '../../../../../axios/apis/useRequest.js'
import { Modal, Button } from '@themesberg/react-bootstrap'
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
import { faToggleOff, faToggleOn } from '@fortawesome/free-solid-svg-icons'
import { activeTab } from '../../../../../const/product.js'

const FeaturePlanForm = ({
  type,
  FeaturePlanData,
  setVisible,
  popupLabel,
  setActiveIndex,
  plan,
  feature,
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
  const allPlans = useSelector(
    (state) => state.products.products[productId]?.plans
  )
  let allPlansArray = allPlans && Object.values(allPlans)
  const allPlansfeatures = useSelector(
    (state) => state.products.products[productId]?.featurePlan
  )
  // console.log({ allPlansfeatures })

  if (allPlansArray) {
    allPlansArray = allPlansArray.filter((plan) => !plan.isSubscribed)
  }
  const [featureOptions, setfeatureOptions] = useState()
  useEffect(() => {
    const features = listFeatureData
      ? allFeatureArray.map((item) => {
          return {
            value: item.id,
            label: item.title,
            type: item.type == 1 ? 'Number' : 'Boolean',
          }
        })
      : []
    setfeatureOptions(features)
  }, [listFeatureData])

  const planOptions = allPlans
    ? allPlansArray.map((item) => {
        return { value: item.id, label: item.title }
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
    description: FeaturePlanData ? FeaturePlanData?.description : '',
  }

  const validationSchema = Yup.object().shape({
    feature: Yup.string().required(
      <FormattedMessage id="Please-Select-a-Option" />
    ),
    plan: Yup.string().required(
      <FormattedMessage id="Please-Select-a-Option" />
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
      if (type === 'create') {
        const dataDetails = {
          description: values.description,
          featureId: values.feature,
          planId: values.plan,
        }
        if (values.limit) dataDetails.limit = unlimited ? null : values.limit
        if (values.reset) dataDetails.reset = parseInt(values.reset)
        if (values.unit) dataDetails.unit = parseInt(values.unit)
        if (values.unitDisplayName)
          dataDetails.unitDisplayName = {
            en: values.unitDisplayNameEn,
            ar: values.unitDisplayNameAr,
          }
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
              description: values.description,
              limit: unlimited ? null : values.limit,
              reset: values.reset,
              unit: values.unit,
              unitDisplayName: {
                en: values.unitDisplayNameEn,
                ar: values.unitDisplayNameAr,
              },
              feature: {
                id: values.feature,
                title: featureOptions.find(
                  (item) => item.value === values.feature
                ).label,
              },
              plan: {
                id: values.plan,
                title: planOptions.find((item) => item.value === values.plan)
                  .label,
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
        const dataDetails = {
          description: values.description,
        }
        if (values.reset) dataDetails.reset = parseInt(values.reset)
        if (values.limit) dataDetails.limit = unlimited ? null : values.limit
        if (values.unit) dataDetails.unit = parseInt(values.unit)
        if (values.unitDisplayNameEn || values.unitDisplayNameAr)
          dataDetails.unitDisplayName = {
            en: values.unitDisplayNameEn,
            ar: values.unitDisplayNameAr,
          }
        const editFeaturePlan = await editFeaturePlanRequest({
          productId: productId,
          featurePlanId: FeaturePlanData.id,
          data: dataDetails,
        })

        const newData = JSON.parse(JSON.stringify(FeaturePlanData))
        newData.description = values.description
        newData.limit = unlimited ? null : values.limit
        newData.reset = values.reset
        newData.unit = values.unit
        newData.unitDisplayName = {
          en: values.unitDisplayNameEn,
          ar: values.unitDisplayNameAr,
        }
        newData.createdDate = FeaturePlanData.createdDate
        newData.editedDate = new Date().toISOString().slice(0, 19)

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
                <FormattedMessage id="Plan" />{' '}
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
                  <FormattedMessage id="Select-Option" />
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
                <FormattedMessage id="Feature" />{' '}
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
                  <FormattedMessage id="Select-Option" />
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

          <div>
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Description" />
              </Form.Label>

              <TextareaAndCounter
                addTextarea={formik.setFieldValue}
                maxLength={250}
                showCharCount
                inputValue={formik?.values?.description}
              />

              {formik.touched.description && formik.errors.description && (
                <div className="invalid-feedback">
                  {formik.errors.description}
                </div>
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
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Reset" />
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
                  <FormattedMessage id="Select-Option" />
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
          <div
            style={{
              display: isFeatureBoolean(formik.values.feature)
                ? 'none'
                : 'block',
            }}
          >
            <Form.Group className="">
              <Form.Label>
                <FormattedMessage id="Limit" />
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
                  <FormattedMessage id="Unlimited" />
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
                <FormattedMessage id="Unit" />
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
                  <FormattedMessage id="Select-Option" />
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
              <div>
                <Form.Group>
                  <Form.Label className="mb-1">
                    <FormattedMessage id="Unit-Display-Name" />{' '}
                    <span style={{ color: 'red' }}>* </span>
                  </Form.Label>
                  <div className="card">
                    <TabView>
                      <TabPanel header="En">
                        <div className="form-group mt-3">
                          <input
                            type="text"
                            className="form-control"
                            id="unitDisplayNameEn"
                            name="unitDisplayNameEn"
                            onChange={formik.handleChange}
                            value={formik.values.unitDisplayNameEn}
                            placeholder={intl.formatMessage({
                              id: 'English-Name',
                            })}
                          />
                        </div>
                      </TabPanel>
                      <TabPanel header="Ar">
                        <div className="form-group mt-3">
                          <input
                            type="text"
                            className="form-control"
                            id="unitDisplayNameAr"
                            name="unitDisplayNameAr"
                            onChange={formik.handleChange}
                            value={formik.values.unitDisplayNameAr}
                            placeholder={intl.formatMessage({
                              id: 'Arabic-Name',
                            })}
                          />
                        </div>
                      </TabPanel>
                    </TabView>

                    {(formik.touched.unitDisplayNameEn ||
                      formik.touched.unitDisplayNameAr) &&
                      (formik.errors.unitDisplayNameEn ||
                        formik.errors.unitDisplayNameAr) && (
                        <Form.Control.Feedback
                          type="invalid"
                          style={{ unitDisplay: 'block' }}
                        >
                          {formik.errors.unitDisplayNameEn ||
                            formik.errors.unitDisplayNameAr}
                        </Form.Control.Feedback>
                      )}
                  </div>
                </Form.Group>
              </div>
            )}
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

export default FeaturePlanForm
