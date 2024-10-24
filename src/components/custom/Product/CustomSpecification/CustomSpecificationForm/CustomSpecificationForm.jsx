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
} from '../../../../../store/slices/products/productsSlice.js'
import { BsFillQuestionCircleFill } from 'react-icons/bs'
import TextareaAndCounter from '../../../Shared/TextareaAndCounter/TextareaAndCounter.jsx'
import { TabPanel, TabView } from 'primereact/tabview'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faToggleOff, faToggleOn } from '@fortawesome/free-solid-svg-icons'
import { activeTab } from '../../../../../const/product.js'

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
    systemName: specificationData ? specificationData.systemName : '',
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
    inlineDescriptionEn: specificationData?.inlineDescription?.en || '',
    inlineDescriptionAr: specificationData?.inlineDescription?.ar || '',
  }

  const allProducts = useSelector((state) => state.products.products)
  const direction = useSelector((state) => state.main.direction)

  const validationSchema = Yup.object().shape({
    systemName: Yup.string()
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
            return true
          }
          const isValidPattern = /^\/.*\/[gimus]*$/.test(value)
          return isValidPattern
        }
      )
      .nullable(),
    validationFailureDescriptionEn: Yup.string().test({
      systemName: 'validationFailureDescriptionRequired',
      message: intl.formatMessage({
        id: 'This-field-is-required',
      }),
      test: function (value) {
        const parent = this.parent
        const hasRegularExpression = !!parent.regularExpression
        const hasValueEn = !!parent.validationFailureDescriptionEn
        const hasValueAr = !!parent.validationFailureDescriptionAr
        return !hasRegularExpression || hasValueEn || hasValueAr || !!value
      },
    }),
  })

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      if (type === 'create') {
        const createSpecification = await createSpecificationRequest(
          productId,
          {
            systemName: values.systemName,
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
            inlineDescription: {
              en: values.inlineDescriptionEn,
              ar: values.inlineDescriptionAr,
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
          setActiveIndex(activeTab.customSpecification)
        }
      } else {
        const editSpecification = await editSpecificationRequest(productId, {
          data: {
            systemName: values.systemName,
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
            inlineDescription: {
              en: values.inlineDescriptionEn,
              ar: values.inlineDescriptionAr,
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
              systemName: values.systemName,
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
              inlineDescription: {
                en: values.inlineDescriptionEn,
                ar: values.inlineDescriptionAr,
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
          {/* 1st Card: System Name and Display Name */}
          <Card
            border="light"
            className="table-wrapper table-responsive shadow-sm"
          >
            <Container>
              <Row>
                <Col
                  md={6}
                  className={direction == 'rtl' ? 'borderLeft' : 'borderRight'}
                >
                  <Form.Group className="">
                    <Form.Label>
                      <FormattedMessage id="System-Name" />{' '}
                      <span style={{ color: 'red' }}>* </span>
                      <span className="fw-normal">
                        <OverlayTrigger
                          trigger={['hover', 'focus']}
                          overlay={
                            <Tooltip>
                              {intl.formatMessage({
                                id: 'JSON-Property-Name',
                              })}
                            </Tooltip>
                          }
                        >
                          <span>
                            <BsFillQuestionCircleFill
                              className={
                                direction == 'rtl' ? 'ar-questionCircle' : ''
                              }
                            />
                          </span>
                        </OverlayTrigger>
                      </span>
                    </Form.Label>
                    <TabView className="mt-4"></TabView>
                    <input
                      type="text"
                      className="form-control"
                      id="systemName"
                      name="systemName"
                      onChange={formik.handleChange}
                      value={formik.values.systemName}
                    />
                    {formik.touched.systemName && formik.errors.systemName && (
                      <Form.Control.Feedback
                        type="invalid"
                        style={{ display: 'block' }}
                      >
                        {formik.errors.systemName}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="">
                    <Form.Label>
                      <FormattedMessage id="Display-Name" />{' '}
                      <span style={{ color: 'red' }}>* </span>
                      <span className="fw-normal">
                        <OverlayTrigger
                          trigger={['hover', 'focus']}
                          overlay={
                            <Tooltip>
                              {intl.formatMessage({
                                id: 'Friendly-Name-Label',
                              })}
                            </Tooltip>
                          }
                        >
                          <span>
                            <BsFillQuestionCircleFill
                              className={
                                direction == 'rtl' ? 'ar-questionCircle' : ''
                              }
                            />
                          </span>
                        </OverlayTrigger>
                      </span>
                    </Form.Label>
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
                            id="displayNameAr"
                            name="displayNameAr"
                            onChange={formik.handleChange}
                            value={formik.values.displayNameAr}
                            placeholder={intl.formatMessage({
                              id: 'Arabic-Name',
                            })}
                          />
                        </div>
                      </TabPanel>
                    </TabView>
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
                </Col>
              </Row>
            </Container>
          </Card>

          {/* 3rd Card: Hint Description and Inline Description */}
          <Card
            border="light"
            className="table-wrapper table-responsive shadow-sm"
            style={{ marginTop: '15px' }}
          >
            <Container>
              <Row>
                <Col
                  md={6}
                  className={direction == 'rtl' ? 'borderLeft' : 'borderRight'}
                >
                  <Form.Group>
                    <Form.Label className="mb-1">
                      <FormattedMessage id="Hint-description" />{' '}
                      <span className="fw-normal">
                        <OverlayTrigger
                          trigger={['hover', 'focus']}
                          overlay={
                            <Tooltip>
                              {intl.formatMessage({
                                id: 'Friendly-Hint-Description',
                              })}
                            </Tooltip>
                          }
                        >
                          <span>
                            <BsFillQuestionCircleFill
                              className={
                                direction == 'rtl' ? 'ar-questionCircle' : ''
                              }
                            />
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
                            inputValue={formik.values.descriptionEn}
                            placeholder={intl.formatMessage({
                              id: 'English-Hint-Description',
                            })}
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
                            placeholder={intl.formatMessage({
                              id: 'Arabic-Hint-Description',
                            })}
                            id="descriptionAr"
                            name="descriptionAr"
                            onChange={formik.handleChange}
                            disableMainClass={true}
                          />
                        </div>
                      </TabPanel>
                    </TabView>

                    {formik.touched.descriptionEn &&
                      formik.errors.descriptionEn && (
                        <Form.Control.Feedback
                          type="invalid"
                          style={{ display: 'block' }}
                        >
                          {formik.errors.descriptionEn}
                        </Form.Control.Feedback>
                      )}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="mb-1">
                      <FormattedMessage id="Inline-Description" />{' '}
                      <span className="fw-normal">
                        <OverlayTrigger
                          trigger={['hover', 'focus']}
                          overlay={
                            <Tooltip>
                              {intl.formatMessage({
                                id: 'Friendly-Inline-Description',
                              })}
                            </Tooltip>
                          }
                        >
                          <span>
                            <BsFillQuestionCircleFill
                              className={
                                direction == 'rtl' ? 'ar-questionCircle' : ''
                              }
                            />
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
                            inputValue={formik.values.inlineDescriptionEn}
                            placeholder={intl.formatMessage({
                              id: 'English-Inline-Description',
                            })}
                            id="inlineDescriptionEn"
                            name="inlineDescriptionEn"
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
                            inputValue={formik?.values?.inlineDescriptionAr}
                            placeholder={intl.formatMessage({
                              id: 'Arabic-Inline-Description',
                            })}
                            id="inlineDescriptionAr"
                            name="inlineDescriptionAr"
                            onChange={formik.handleChange}
                            disableMainClass={true}
                          />
                        </div>
                      </TabPanel>
                    </TabView>

                    {formik.touched.inlineDescriptionEn &&
                      formik.errors.inlineDescriptionEn && (
                        <Form.Control.Feedback
                          type="invalid"
                          style={{ display: 'block' }}
                        >
                          {formik.errors.inlineDescriptionEn}
                        </Form.Control.Feedback>
                      )}
                  </Form.Group>
                </Col>
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
                <Col
                  md={6}
                  className={direction == 'rtl' ? 'borderLeft' : 'borderRight'}
                >
                  {/* <div className="toggle-container d-flex align-items-center justify-content-between  mb-2">
                    <Form.Label>
                      <FormattedMessage id="Is-Required" />{' '}
                      <span className="fw-normal">
                        <OverlayTrigger
                          trigger={['hover', 'focus']}
                          overlay={
                            <Tooltip>
                              {intl.formatMessage({
                                id: 'Value-Presence-Required',
                              })}{' '}
                            </Tooltip>
                          }
                        >
                          <span>
                            <BsFillQuestionCircleFill
                              className={
                                direction == 'rtl' ? 'ar-questionCircle' : ''
                              }
                            />
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
                  </div> */}
                  <Form.Group>
                    <Form.Label>
                      <FormattedMessage id="Regular-Expression" />{' '}
                      <span className="fw-normal">
                        <OverlayTrigger
                          trigger={['hover', 'focus']}
                          overlay={
                            <Tooltip>
                              {intl.formatMessage({
                                id: 'Character-Combination-Pattern',
                              })}
                            </Tooltip>
                          }
                        >
                          <span>
                            <BsFillQuestionCircleFill
                              className={
                                direction == 'rtl' ? 'ar-questionCircle' : ''
                              }
                            />
                          </span>
                        </OverlayTrigger>
                      </span>
                    </Form.Label>
                    <TabView className="mt-3"></TabView>
                    <input
                      type="text"
                      className="form-control"
                      id="regularExpression"
                      name="regularExpression"
                      onChange={formik.handleChange}
                      value={formik.values.regularExpression}
                    />
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
                              {intl.formatMessage({
                                id: 'Validation-Error-Message',
                              })}{' '}
                            </Tooltip>
                          }
                        >
                          <span>
                            <BsFillQuestionCircleFill
                              className={
                                direction == 'rtl' ? 'ar-questionCircle' : ''
                              }
                            />
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
                            placeholder={intl.formatMessage({
                              id: 'English-Validation-Failure',
                            })}
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
                            placeholder={intl.formatMessage({
                              id: 'Arabic-Validation-Failure',
                            })}
                            id="validationFailureDescriptionAr"
                            name="validationFailureDescriptionAr"
                            onChange={formik.handleChange}
                            disableMainClass={true}
                          />
                        </div>
                      </TabPanel>
                    </TabView>

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

          {/* 2nd Card: Is Published and Is User Editable */}
          <Card
            border="light"
            className="table-wrapper table-responsive shadow-sm bool-card"
            style={{ marginTop: '15px' }}
          >
            <Container>
              <Row>
                <Col
                  md={4}
                  className={direction == 'rtl' ? 'borderLeft' : 'borderRight'}
                >
                  <div className="toggle-container d-flex  justify-content-between">
                    <Form.Label>
                      <FormattedMessage id="Is-Published" />{' '}
                      <span className="fw-normal">
                        <OverlayTrigger
                          trigger={['hover', 'focus']}
                          overlay={
                            <Tooltip>
                              {intl.formatMessage({
                                id: 'Tenant-Specification-Display',
                              })}
                            </Tooltip>
                          }
                        >
                          <span>
                            <BsFillQuestionCircleFill
                              className={
                                direction == 'rtl' ? 'ar-questionCircle' : ''
                              }
                            />
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
                </Col>
                <Col
                  md={4}
                  className={direction == 'rtl' ? 'borderLeft' : 'borderRight'}
                >
                  <div className="toggle-container d-flex  justify-content-between">
                    <Form.Label>
                      <FormattedMessage id="Is-User-Editable" />{' '}
                      <span className="fw-normal">
                        <OverlayTrigger
                          trigger={['hover', 'focus']}
                          overlay={
                            <Tooltip>
                              {intl.formatMessage({
                                id: 'User-Editable-Value',
                              })}
                            </Tooltip>
                          }
                        >
                          <span>
                            <BsFillQuestionCircleFill
                              className={
                                direction == 'rtl' ? 'ar-questionCircle' : ''
                              }
                            />
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
                <Col
                  md={4}
                  className={direction == 'rtl' ? 'borderLeft' : 'borderRight'}
                >
                  <div className="toggle-container d-flex  justify-content-between  ">
                    <Form.Label>
                      <FormattedMessage id="Is-Required" />{' '}
                      <span className="fw-normal">
                        <OverlayTrigger
                          trigger={['hover', 'focus']}
                          overlay={
                            <Tooltip>
                              {intl.formatMessage({
                                id: 'Value-Presence-Required',
                              })}{' '}
                            </Tooltip>
                          }
                        >
                          <span>
                            <BsFillQuestionCircleFill
                              className={
                                direction == 'rtl' ? 'ar-questionCircle' : ''
                              }
                            />
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
