import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import useRequest from '../../../../../axios/apis/useRequest.js'
import {
  Modal,
  Button,
  Card,
  Row,
  Col,
  Container,
  OverlayTrigger,
  Tooltip,
} from '@themesberg/react-bootstrap'
import { Form } from '@themesberg/react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'
import { Wrapper } from './CustomSpecificationForm.styled.jsx'
import { useParams } from 'react-router-dom'
import {
  specificationInfo,
  setAllSpecifications,
} from '../../../../../store/slices/products.js'
import { BsFillQuestionCircleFill } from 'react-icons/bs'
import TextareaAndCounter from '../../../Shared/TextareaAndCounter/TextareaAndCounter.jsx'
import { TabPanel, TabView } from 'primereact/tabview'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faToggleOff, faToggleOn } from '@fortawesome/free-solid-svg-icons'
const CustomSpecificationForm = ({
  type,
  specificationData,
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
  const intl = useIntl()

  const productId = routeParams.id
  const initialValues = {
    name: specificationData ? specificationData.name : '',

    descriptionEn: specificationData?.description?.en || '',
    descriptionAr: specificationData?.description?.ar || '',
    displayNameAr: specificationData?.displayName?.ar || '',
    displayNameEn: specificationData?.displayName?.en || '',
    isRequired: specificationData?.isRequired || false,
    isPublished: specificationData?.isPublished || false,
    isUserEditable: specificationData?.isUserEditable || false,
    regularExpression: specificationData?.regularExpression || '',
    validationFailureDescriptionEn:
      specificationData?.validationFailureDescription?.en || '',
    validationFailureDescriptionAr:
      specificationData?.validationFailureDescription?.ar || '',
  }
  const allProducts = useSelector((state) => state.products.products)
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .max(100, intl.formatMessage({ id: 'Maximum-Length-100' }))
      .required(intl.formatMessage({ id: 'Name-Required' }))
      .matches(
        /^[a-zA-Z0-9_-]+$/,
        intl.formatMessage({
          id: 'English-Characters,-Numbers,-and-Underscores-are-only-accepted.',
        })
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
    regularExpression: Yup.string()
      .test(
        'isValidPattern',
        intl.formatMessage({ id: 'Valid-Regular-Expression' }),
        (value) => {
          if (!value) {
            return true // Allow empty string
          }
          const isValidPattern = /^\/.*\/[gimus]*$/.test(value)
          return isValidPattern
        }
      )
      .nullable(),
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
            displayName: { en: values.displayNameEn, ar: values.displayNameAr },
            description: {
              en: values.descriptionEn,
              ar: values.descriptionAr,
            },
            isRequired: values.isRequired,
            isUserEditable: values.isUserEditable || false,
            isPublished: values.isPublished || false,
            regularExpression: values.regularExpression,
            validationFailureDescription: {
              en: values.validationFailureDescriptionEn,
              ar: values.validationFailureDescriptionAr,
            },
            inputType: 1,
            dataType: 1,
          }
        )
        setVisible && setVisible(false)

        if (!allProducts[productId].specification) {
          const specification = await getProductSpecification(productId)
          dispatch(
            setAllSpecifications({
              productId: productId,
              data: specification.data.data,
            })
          )
        }

        if (setActiveIndex) {
          setActiveIndex(1)
        }
      } else {
        const editSpecification = await editSpecificationRequest(productId, {
          data: {
            name: values.name,
            description: {
              en: values.descriptionEn,
              ar: values.descriptionAr,
            },
            displayName: {
              en: values.displayNameEn,
              ar: values.displayNameAr,
            },
            isUserEditable: values.isUserEditable || false,
            isPublished: values.isPublished || false,

            isRequired: values.isRequired || false,
            regularExpression: values.regularExpression,
            validationFailureDescription: {
              en: values.validationFailureDescriptionEn,
              ar: values.validationFailureDescriptionAr,
            },
            inputType: 1,
            dataType: 1,
          },
          id: specificationData.id,
        })

        dispatch(
          specificationInfo({
            specificationId: specificationData.id,
            productId: productId,
            data: {
              name: values.name,
              description: {
                en: values.descriptionEn,
                ar: values.descriptionAr,
              },
              isUserEditable: values.isUserEditable || false,
              isPublished: values.isPublished || false,

              isRequired: values.isRequired || false,
              regularExpression: values.regularExpression,
              validationFailureDescription: {
                en: values.validationFailureDescriptionEn,
                ar: values.validationFailureDescriptionAr,
              },
              displayName: {
                en: values.displayNameEn,
                ar: values.displayNameAr,
              },
              editedDate: new Date().toISOString().slice(0, 19),
              createdDate: specificationData.createdDate,
              id: specificationData.id,
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
          <Card
            border="light"
            className="table-wrapper table-responsive shadow-sm"
          >
            <Container>
              <Row>
                <Col md={6} style={{ borderRight: '1px solid #f1f1f1' }}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FormattedMessage id="Name" />{' '}
                      <span style={{ color: 'red' }}>* </span>
                      <span className="fw-normal">
                        <OverlayTrigger
                          trigger={['hover', 'focus']}
                          overlay={
                            <Tooltip>
                              The unique name used to identify the json property
                              name
                            </Tooltip>
                          }
                        >
                          <span>
                            <BsFillQuestionCircleFill />
                          </span>
                        </OverlayTrigger>
                      </span>
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
                </Col>
                <Col md={6} className="pt-3">
                  <div className="toggle-container d-flex align-items-center justify-content-between ">
                    <Form.Label>
                      <FormattedMessage id="Is-Published" />{' '}
                      <span className="fw-normal">
                        <OverlayTrigger
                          trigger={['hover', 'focus']}
                          overlay={
                            <Tooltip>
                              display this specification in the Tenant adding
                              form
                            </Tooltip>
                          }
                        >
                          <span>
                            <BsFillQuestionCircleFill />
                          </span>
                        </OverlayTrigger>
                      </span>
                    </Form.Label>
                    <FontAwesomeIcon
                      icon={
                        formik.values.isPublished ? faToggleOn : faToggleOff
                      }
                      className={
                        formik.values.isPublished
                          ? 'active-toggle fa-lg'
                          : 'passive-toggle fa-lg'
                      }
                      onClick={() =>
                        formik.setFieldValue(
                          'isPublished',
                          !formik.values.isPublished
                        )
                      }
                    />
                  </div>

                  <div className="toggle-container d-flex align-items-center justify-content-between ">
                    <Form.Label>
                      <FormattedMessage id="Is-User-Editable" />{' '}
                      <span className="fw-normal">
                        <OverlayTrigger
                          trigger={['hover', 'focus']}
                          overlay={
                            <Tooltip>Value will be editable by a user.</Tooltip>
                          }
                        >
                          <span>
                            <BsFillQuestionCircleFill />
                          </span>
                        </OverlayTrigger>
                      </span>
                    </Form.Label>
                    <FontAwesomeIcon
                      icon={
                        formik.values.isUserEditable ? faToggleOn : faToggleOff
                      }
                      className={
                        formik.values.isUserEditable
                          ? 'active-toggle fa-lg'
                          : 'passive-toggle fa-lg'
                      }
                      onClick={() =>
                        formik.setFieldValue(
                          'isUserEditable',
                          !formik.values.isUserEditable
                        )
                      }
                    />
                  </div>
                </Col>
              </Row>
            </Container>
          </Card>
          <Card
            border="light"
            className="table-wrapper table-responsive shadow-sm "
            style={{ marginTop: '15px' }}
          >
            <Container>
              <Row>
                <Col md={6} style={{ borderRight: '1px solid #f1f1f1' }}>
                  <div>
                    <Form.Group>
                      <Form.Label className="mb-1">
                        <FormattedMessage id="Display-Name" />{' '}
                        <span style={{ color: 'red' }}>* </span>
                        <span className="fw-normal">
                          <OverlayTrigger
                            trigger={['hover', 'focus']}
                            overlay={
                              <Tooltip>
                                A friendly name (label) for the specification
                              </Tooltip>
                            }
                          >
                            <span>
                              <BsFillQuestionCircleFill />
                            </span>
                          </OverlayTrigger>
                        </span>
                      </Form.Label>
                      {/* <Card
                border="light"
                className="table-wrapper table-responsive shadow-sm"
              > */}
                      <TabView>
                        <TabPanel header="En">
                          <div className="form-group mt-3">
                            <input
                              type="text"
                              className="form-control"
                              id="displayNameEn"
                              name="displayNameEn"
                              onChange={formik.handleChange}
                              value={formik.values.displayNameEn}
                              placeholder="Enter English Name"
                            />
                          </div>
                        </TabPanel>
                        <TabPanel header="Ar">
                          <div className="form-group mt-3">
                            <input
                              type="text"
                              className="form-control"
                              id="displayNameAr"
                              name="displayNameAr"
                              onChange={formik.handleChange}
                              value={formik.values.displayNameAr}
                              placeholder="Enter Arabic Name"
                            />
                          </div>
                        </TabPanel>
                        {/* Add more language tabs as needed */}
                      </TabView>
                      {/* </Card> */}

                      {(formik.touched.displayNameEn ||
                        formik.touched.displayNameAr) &&
                        (formik.errors.displayNameEn ||
                          formik.errors.displayNameAr) && (
                          <Form.Control.Feedback
                            type="invalid"
                            style={{ display: 'block' }}
                          >
                            {formik.errors.displayNameEn ||
                              formik.errors.displayNameAr}
                          </Form.Control.Feedback>
                        )}
                    </Form.Group>
                  </div>
                </Col>
                <Col md={6}>
                  <div>
                    <Form.Group>
                      <Form.Label className="mb-1 ">
                        <FormattedMessage id="Description" />{' '}
                        <span className="fw-normal">
                          <OverlayTrigger
                            trigger={['hover', 'focus']}
                            overlay={
                              <Tooltip>
                                A description that will be displayed as a hint
                                to describe a label in Tenant adding form
                              </Tooltip>
                            }
                          >
                            <span>
                              <BsFillQuestionCircleFill />
                            </span>
                          </OverlayTrigger>
                        </span>
                      </Form.Label>
                      {/* <Card
                      border="light"
                      className="table-wrapper table-responsive shadow-sm"
                    > */}
                      <TabView>
                        <TabPanel header="En">
                          <div className="form-group mt-3">
                            <TextareaAndCounter
                              addTextarea={formik.setFieldValue}
                              maxLength={250}
                              showCharCount
                              inputValue={formik.values.descriptionEn}
                              placeholder="Enter English Description"
                              id="descriptionEn"
                              name="descriptionEn"
                              onChange={formik.handleChange}
                              disableMainClass={true}
                            />
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
                              onChange={formik.handleChange}
                              disableMainClass={true}
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
                      {/* </Card> */}
                    </Form.Group>
                  </div>
                </Col>{' '}
              </Row>
            </Container>
          </Card>

          <Card
            border="light"
            className="table-wrapper table-responsive shadow-sm"
            style={{ marginTop: '15px' }}
          >
            <Container>
              <Row>
                <Col md={6} style={{ borderRight: '1px solid #f1f1f1' }}>
                  <div className="toggle-container d-flex align-items-center justify-content-between  mb-2">
                    <Form.Label>
                      <FormattedMessage id="Is-Required" />{' '}
                      <span className="fw-normal">
                        <OverlayTrigger
                          trigger={['hover', 'focus']}
                          overlay={
                            <Tooltip>
                              value must be present to create a tenant
                            </Tooltip>
                          }
                        >
                          <span>
                            <BsFillQuestionCircleFill />
                          </span>
                        </OverlayTrigger>
                      </span>
                    </Form.Label>
                    <FontAwesomeIcon
                      icon={formik.values.isRequired ? faToggleOn : faToggleOff}
                      className={
                        formik.values.isRequired
                          ? 'active-toggle fa-lg'
                          : 'passive-toggle fa-lg'
                      }
                      onClick={() =>
                        formik.setFieldValue(
                          'isRequired',
                          !formik.values.isRequired
                        )
                      }
                    />
                  </div>
                  <Form.Group>
                    <Form.Label>
                      <FormattedMessage id="Regular-Expression" />{' '}
                      <span className="fw-normal">
                        <OverlayTrigger
                          trigger={['hover', 'focus']}
                          overlay={
                            <Tooltip>
                              The pattern used to match character combinations
                              in Value
                            </Tooltip>
                          }
                        >
                          <span>
                            <BsFillQuestionCircleFill />
                          </span>
                        </OverlayTrigger>
                      </span>
                    </Form.Label>
                    <input
                      type="text"
                      className="form-control"
                      id="regularExpression"
                      name="regularExpression"
                      onChange={formik.handleChange}
                      value={formik.values.regularExpression}
                    />
                    {/* Display validation error */}
                    {formik.touched.regularExpression &&
                      formik.errors.regularExpression && (
                        <Form.Control.Feedback
                          type="invalid"
                          style={{ display: 'block' }}
                        >
                          {formik.errors.regularExpression}
                        </Form.Control.Feedback>
                      )}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="mb-1 ">
                      <FormattedMessage id="Validation-Failure-Description" />{' '}
                      <span className="fw-normal">
                        <OverlayTrigger
                          trigger={['hover', 'focus']}
                          overlay={
                            <Tooltip>
                              A message to describe the validation error
                            </Tooltip>
                          }
                        >
                          <span>
                            <BsFillQuestionCircleFill />
                          </span>
                        </OverlayTrigger>
                      </span>
                    </Form.Label>
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
                            onChange={formik.handleChange}
                            disableMainClass={true}
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
                            onChange={formik.handleChange}
                            disableMainClass={true}
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
                  </Form.Group>
                </Col>
              </Row>
            </Container>
          </Card>
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
