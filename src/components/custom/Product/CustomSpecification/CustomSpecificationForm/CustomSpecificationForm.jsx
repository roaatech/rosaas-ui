import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import useRequest from '../../../../../axios/apis/useRequest.js'
import { Modal, Button, Card } from '@themesberg/react-bootstrap'
import { Form } from '@themesberg/react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Wrapper } from './CustomSpecificationForm.styled.jsx'
import { useParams } from 'react-router-dom'
import {
  specificationInfo,
  setAllSpecifications,
} from '../../../../../store/slices/products.js'

import TextareaAndCounter from '../../../Shared/TextareaAndCounter/TextareaAndCounter.jsx'
import { TabPanel, TabView } from 'primereact/tabview'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faToggleOff, faToggleOn } from '@fortawesome/free-solid-svg-icons'

const CustomSpecificationForm = ({
  type,
  planData: specificaitionData,
  setVisible,
  popupLabel,
  setActiveIndex,
}) => {
  const {
    createSpecificationRequest,
    editSpecificationRequest,
    getProductSpecification,
  } = useRequest()
  const dispatch = useDispatch()
  const routeParams = useParams()
  const productId = routeParams.id
  const initialValues = {
    name: specificaitionData ? specificaitionData.name : '',
    descriptionEn: specificaitionData?.description?.en || '',
    descriptionAr: specificaitionData?.description?.ar || '',
    isRequired: specificaitionData?.isRequired || false,
    isUserEditable: specificaitionData?.isUserEditable || false,
    regularExpression: specificaitionData?.regularExpression || '',
    validationFailureDescriptionEn:
      specificaitionData?.validationFailureDescription?.en || '',
    validationFailureDescriptionAr:
      specificaitionData?.validationFailureDescription?.ar || '',
  }
  const allProducts = useSelector((state) => state.products.products)

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required(<FormattedMessage id="Plan-Name-is-required" />)
      .max(15, <FormattedMessage id="Name-must-be-at-most-15-characters" />),
  })
  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      if (type === 'create') {
        const createSpecification = await createSpecificationRequest(
          productId,
          {
            name: values.name,
            // productId: productId,
            displayName: { en: values.nameEn, ar: values.nameAr },
            description: {
              en: values.descriptionEn,
              ar: values.descriptionAr,
            },
            isRequired: values.isRequired,
            isUserEditable: values.isUserEditable || false, // Add isUserEditable
            regularExpression: values.regularExpression, // Add regularExpression
            validationFailureDescription: {
              en: values.validationFailureDescriptionEn,
              ar: values.validationFailureDescriptionAr,
            },
            inputType: 1,
            dataType: 1,
          }
        )

        if (!allProducts[productId].specification) {
          const specification = await getProductSpecification(productId)
          dispatch(
            setAllSpecifications({
              productId: productId,
              data: specification.data.data,
            })
          )
        }
        dispatch(
          specificationInfo({
            planId: createSpecification.data.data.id,
            productId: productId,
            data: {
              name: values.name,
              description: values.description,
              editedDate: new Date().toISOString().slice(0, 19),
              createdDate: new Date().toISOString().slice(0, 19),
              id: createSpecification.data.data.id,
            },
          })
        )

        if (setActiveIndex) {
          setActiveIndex(1)
        }
      } else {
        const editPlan = await editSpecificationRequest(productId, {
          data: {
            name: values.name,
            description: {
              en: values.descriptionEn,
              ar: values.descriptionAr,
            },
            isUserEditable: values.isUserEditable || false, // Add isUserEditable
            regularExpression: values.regularExpression, // Add regularExpression
            validationFailureDescription: {
              en: values.validationFailureDescriptionEn,
              ar: values.validationFailureDescriptionAr,
            },
          },
          id: specificaitionData.id,
        })

        dispatch(
          specificationInfo({
            planId: specificaitionData.id,
            productId: productId,
            data: {
              name: values.name,
              description: {
                en: values.descriptionEn,
                ar: values.descriptionAr,
              },
              isUserEditable: values.isUserEditable || false,
              regularExpression: values.regularExpression,
              validationFailureDescription: {
                en: values.validationFailureDescriptionEn,
                ar: values.validationFailureDescriptionAr,
              },
              editedDate: new Date().toISOString().slice(0, 19),
              createdDate: specificaitionData.createdDate,
              id: specificaitionData.id,
            },
          })
        )
      }

      setVisible && setVisible(false)
      setSubmitting(false)
    },
  })

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
          <div>
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Name" />{' '}
                <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                onChange={formik.handleChange}
                value={formik.values.name}
              />
              {/* Display validation error */}
              {formik.touched.name && formik.errors.name && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: 'block' }}
                >
                  {formik.errors.name}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </div>
          <div>
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Display-Name" />{' '}
                <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <Card
                border="light"
                className="table-wrapper table-responsive shadow-sm"
              >
                <TabView>
                  <TabPanel header="En">
                    <div className="form-group mt-3">
                      <input
                        type="text"
                        className="form-control"
                        id="nameEn"
                        name="nameEn"
                        onChange={formik.handleChange}
                        value={formik.values.nameEn}
                        placeholder="Enter English Name"
                      />
                    </div>
                  </TabPanel>
                  <TabPanel header="Ar">
                    <div className="form-group mt-3">
                      <input
                        type="text"
                        className="form-control"
                        id="nameAr"
                        name="nameAr"
                        onChange={formik.handleChange}
                        value={formik.values.nameAr}
                        placeholder="Enter Arabic Name"
                      />
                    </div>
                  </TabPanel>
                  {/* Add more language tabs as needed */}
                </TabView>
              </Card>
              {/* Display validation error */}
              {formik.touched.nameEn && formik.errors.nameEn && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: 'block' }}
                >
                  {formik.errors.nameEn}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </div>
          <div>
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Description" />
              </Form.Label>
              <Card
                border="light"
                className="table-wrapper table-responsive shadow-sm"
              >
                <TabView>
                  <TabPanel header="En">
                    <div className="form-group mt-3">
                      <TextareaAndCounter
                        addTextarea={formik.setFieldValue}
                        maxLength={250}
                        showCharCount
                        inputValue={formik?.values?.descriptionEn}
                        placeholder="Enter English Description"
                        id="descriptionEn"
                        name="descriptionEn"
                        onChange={formik.handleChange}
                      />
                      {/* <textarea
    className="form-control"
    id="descriptionEn"
    name="descriptionEn"
    onChange={formik.handleChange}
    value={formik.values.descriptionEn}
    maxLength={250}
    placeholder="Enter English Description"
    rows={4} // Adjust the number of rows as needed
  /> */}
                    </div>
                  </TabPanel>
                  <TabPanel header="Ar">
                    <div className="form-group mt-3">
                      <TextareaAndCounter
                        addTextarea={formik.setFieldValue}
                        maxLength={250}
                        showCharCount
                        inputValue={formik?.values?.descriptionAr}
                        placeholder="Enter Arabic Description"
                        id="descriptionAr"
                        name="descriptionAr"
                      />
                    </div>
                  </TabPanel>
                  {/* Add more language tabs as needed */}
                </TabView>

                {/* Display validation error */}
                {formik.touched.descriptionEn &&
                  formik.errors.descriptionEn && (
                    <Form.Control.Feedback
                      type="invalid"
                      style={{ display: 'block' }}
                    >
                      {formik.errors.descriptionEn}
                    </Form.Control.Feedback>
                  )}
              </Card>
            </Form.Group>
          </div>

          {/* <div>
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Is-Required" />
              </Form.Label>
              <Form.Check
                type="checkbox"
                id="isRequired"
                name="isRequired"
                checked={formik.values.isRequired}
                onChange={formik.handleChange}
              />
            </Form.Group>
          </div>
          <div>
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Is-User-Editable" />
              </Form.Label>
              <Form.Check
                type="checkbox"
                id="isUserEditable"
                name="isUserEditable"
                checked={formik.values.isUserEditable}
                onChange={formik.handleChange}
              />
            </Form.Group>
          </div> */}
          <Form.Label>
            <FormattedMessage id="Permissions" />{' '}
            <span style={{ color: 'red' }}>*</span>
          </Form.Label>
          <Card
            border="light"
            className="table-wrapper table-responsive shadow-sm"
          >
            <Card.Body>
              <div className="row">
                <div className="col-md-6 d-flex align-items-center">
                  <Form.Label className="Permission">
                    <FormattedMessage id="Is-Required" />
                  </Form.Label>
                </div>
                <div className="col-md-6 d-flex align-items-center justify-content-end">
                  <FontAwesomeIcon
                    icon={formik.values.isRequired ? faToggleOn : faToggleOff}
                    className={
                      formik.values.isRequired
                        ? 'active-toggle'
                        : 'passive-toggle'
                    }
                    onClick={() =>
                      formik.setFieldValue(
                        'isRequired',
                        !formik.values.isRequired
                      )
                    }
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 d-flex align-items-center">
                  <Form.Label className="Permission">
                    <FormattedMessage id="Is-User-Editable" />
                  </Form.Label>
                </div>
                <div className="col-md-6 d-flex align-items-center justify-content-end">
                  <FontAwesomeIcon
                    icon={
                      formik.values.isUserEditable ? faToggleOn : faToggleOff
                    }
                    className={
                      formik.values.isUserEditable
                        ? 'active-toggle'
                        : 'passive-toggle'
                    }
                    onClick={() =>
                      formik.setFieldValue(
                        'isUserEditable',
                        !formik.values.isUserEditable
                      )
                    }
                  />
                </div>
              </div>
            </Card.Body>
          </Card>
          <div>
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Regular-Expression" />
              </Form.Label>
              <input
                type="text"
                className="form-control"
                id="regularExpression"
                name="regularExpression"
                onChange={formik.handleChange}
                value={formik.values.regularExpression}
              />
            </Form.Group>
          </div>
          <div>
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Validation-Failure-Description" />
              </Form.Label>
              <Card
                border="light"
                className="table-wrapper table-responsive shadow-sm"
              >
                <TabView>
                  <TabPanel header="En">
                    <div className="form-group mt-3">
                      <TextareaAndCounter
                        addTextarea={formik.setFieldValue}
                        maxLength={250}
                        showCharCount
                        inputValue={
                          formik?.values?.validationFailureDescriptionEn
                        }
                        placeholder="Enter English Validation Failure Description"
                        id="validationFailureDescriptionEn"
                        name="validationFailureDescriptionEn"
                      />
                    </div>
                  </TabPanel>
                  <TabPanel header="Ar">
                    <div className="form-group mt-3">
                      <TextareaAndCounter
                        addTextarea={formik.setFieldValue}
                        maxLength={250}
                        showCharCount
                        inputValue={
                          formik?.values?.validationFailureDescriptionAr
                        }
                        placeholder="Enter Arabic Validation Failure Description"
                        id="validationFailureDescriptionAr"
                        name="validationFailureDescriptionAr"
                      />
                    </div>
                  </TabPanel>
                </TabView>

                {/* Display validation error */}
                {formik.touched.validationFailureDescriptionEn &&
                  formik.errors.validationFailureDescriptionEn && (
                    <Form.Control.Feedback
                      type="invalid"
                      style={{ display: 'block' }}
                    >
                      {formik.errors.validationFailureDescriptionEn}
                    </Form.Control.Feedback>
                  )}
              </Card>
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

export default CustomSpecificationForm
