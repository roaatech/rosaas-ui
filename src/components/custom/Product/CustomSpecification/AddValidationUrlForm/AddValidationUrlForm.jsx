import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Wrapper } from './AddValidationUrlForm.styled'
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  OverlayTrigger,
  Row,
  Tooltip,
} from '@themesberg/react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import useRequest from '../../../../../axios/apis/useRequest'
import { activeTab } from '../../../../../const/product'
const AddValidationUrlForm = ({ productId, setVisible, setActiveIndex }) => {
  const { createValidationUrlRequest } = useRequest()
  const intl = useIntl()

  const initialValues = {
    validationUrl: '',
  }

  const validationSchema = Yup.object().shape({
    validationUrl: Yup.string()
      .url(intl.formatMessage({ id: 'Invalid-URL' }))
      .required(intl.formatMessage({ id: 'URL-Required' })),
  })

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await createValidationUrlRequest(productId, values.validationUrl)
        // Handle success (e.g., show a success message, update state)
        setVisible && setVisible(false)
        if (setActiveIndex) {
          setActiveIndex(activeTab.customSpecification)
          // Replace `someIndex` with the desired index
        }
      } catch (error) {
        // Handle error (e.g., show an error message)
      }
      setSubmitting(false)
    },
  })

  return (
    <Wrapper>
      <Form onSubmit={formik.handleSubmit}>
        <Modal.Header>
          <Modal.Title className="h6">Add Validation URL</Modal.Title>
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
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Validation URL
                      <span style={{ color: 'red' }}>*</span>
                    </Form.Label>
                    <input
                      type="text"
                      className="form-control"
                      id="validationUrl"
                      name="validationUrl"
                      onChange={formik.handleChange}
                      value={formik.values.validationUrl}
                    />
                    {formik.touched.validationUrl &&
                      formik.errors.validationUrl && (
                        <Form.Control.Feedback
                          type="invalid"
                          style={{ display: 'block' }}
                        >
                          {formik.errors.validationUrl}
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
            Submit
          </Button>
          <Button
            variant="link"
            className="text-gray"
            onClick={() => setVisible(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Form>
    </Wrapper>
  )
}

export default AddValidationUrlForm
