import React, { useState } from 'react'
import moment from 'moment-timezone'
import Datetime from 'react-datetime'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import {
  Col,
  Row,
  Card,
  Form,
  Button,
  InputGroup,
} from '@themesberg/react-bootstrap'
import { Wrapper } from './Settings.styled'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'
import { BsGearFill } from 'react-icons/bs'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useEffect } from 'react'

const Settings = () => {
  const [edit, setEdit] = useState(false)
  const [oldData, setOldData] = useState({})

  useEffect(() => {
    const old = {
      available: 1,
      unavailable: 2,
      inaccessible: 3,
      checkDown: 4,
    }
    setOldData(old)
    formik.setValues(old)
  }, [])

  const cancel = () => {
    setEdit(false)
    formik.setValues(oldData)
  }

  const initialValues = {}
  const validationSchema = Yup.object().shape({
    available: Yup.number()
      .required('The feild is required!')
      .test(
        'Is positive?',
        'Add a valid number',
        (value) => value > 0 && value % 1 == 0
      ),
    unavailable: Yup.number()
      .required('The feild is required!')
      .test(
        'Is positive?',
        'Add a valid number',
        (value) => value > 0 && value % 1 == 0
      ),
    inaccessible: Yup.number()
      .required('The feild is required!')
      .test(
        'Is positive?',
        'Add a valid number',
        (value) => value > 0 && value % 1 == 0
      ),
    checkDown: Yup.number()
      .required('The feild is required!')
      .test(
        'Is positive?',
        'Add a valid number',
        (value) => value > 0 && value % 1 == 0
      ),
  })
  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log(values)
      setOldData(values)
      setEdit(false)
    },
  })

  return (
    <>
      <BreadcrumbComponent breadcrumbInfo={'HealthCheck'} icon={BsGearFill} />
      <Wrapper>
        <h5 className="title">General information</h5>
        <Card className="m-3 mt-0">
          <Card.Body>
            <Form onSubmit={formik.handleSubmit} className="my-2">
              <div className="mb-3">
                <Button
                  className={edit ? 'd-none' : ''}
                  variant="primary"
                  type="button"
                  onClick={() => {
                    setEdit(true)
                  }}
                >
                  Edit
                </Button>

                <span className={!edit ? 'd-none' : ''}>
                  <Button variant="primary" type="submit">
                    Save All
                  </Button>
                  <Button
                    type="button"
                    className="ml-2 cancel"
                    onClick={cancel}
                  >
                    Cancel
                  </Button>
                </span>
              </div>
              <Row>
                <Col sm={6} className="mb-3">
                  <Form.Group id="addressNumber">
                    <Form.Label>
                      Health Status Change Url
                      <span style={{ color: 'red' }}>*</span>
                    </Form.Label>
                    <input
                      className="form-control"
                      required
                      type="number"
                      id="available"
                      name="available"
                      onChange={formik.handleChange}
                      value={formik.values.available}
                      disabled={!edit}
                    />
                    {formik.touched.available && formik.errors.available && (
                      <Form.Control.Feedback
                        type="invalid"
                        style={{ display: 'block' }}
                      >
                        {formik.errors.available}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                </Col>
                <Col sm={6} className="mb-3">
                  <Form.Group id="addressNumber">
                    <Form.Label>
                      Health Status Change Url
                      <span style={{ color: 'red' }}>*</span>
                    </Form.Label>
                    <input
                      className="form-control"
                      required
                      type="number"
                      id="unavailable"
                      name="unavailable"
                      onChange={formik.handleChange}
                      value={formik.values.unavailable}
                      disabled={!edit}
                    />
                    {formik.touched.unavailable &&
                      formik.errors.unavailable && (
                        <Form.Control.Feedback
                          type="invalid"
                          style={{ display: 'block' }}
                        >
                          {formik.errors.unavailable}
                        </Form.Control.Feedback>
                      )}
                  </Form.Group>
                </Col>
                <Col sm={6} className="mb-3">
                  <Form.Group id="addressNumber">
                    <Form.Label>
                      Health Status Change Url
                      <span style={{ color: 'red' }}>*</span>
                    </Form.Label>
                    <input
                      className="form-control"
                      required
                      type="number"
                      id="inaccessible"
                      name="inaccessible"
                      onChange={formik.handleChange}
                      value={formik.values.inaccessible}
                      disabled={!edit}
                    />
                    {formik.touched.inaccessible &&
                      formik.errors.inaccessible && (
                        <Form.Control.Feedback
                          type="invalid"
                          style={{ display: 'block' }}
                        >
                          {formik.errors.inaccessible}
                        </Form.Control.Feedback>
                      )}
                  </Form.Group>
                </Col>
                <Col sm={6} className="mb-3">
                  <Form.Group id="addressNumber">
                    <Form.Label>
                      Health Status Change Url
                      <span style={{ color: 'red' }}>*</span>
                    </Form.Label>
                    <input
                      className="form-control"
                      required
                      type="number"
                      id="checkDown"
                      name="checkDown"
                      onChange={formik.handleChange}
                      value={formik.values.checkDown}
                      disabled={!edit}
                    />
                    {formik.touched.checkDown && formik.errors.checkDown && (
                      <Form.Control.Feedback
                        type="invalid"
                        style={{ display: 'block' }}
                      >
                        {formik.errors.checkDown}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </Wrapper>
    </>
  )
}

export default Settings
