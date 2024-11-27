import { Card, Col, Form, Row } from '@themesberg/react-bootstrap'
import { useFormik } from 'formik'
import React, { useState, useEffect } from 'react'
import * as Yup from 'yup'
import DynamicButtons from '../../Shared/DynamicButtons/DynamicButtons'
import { Wrapper } from './Profile.styled'
import UpperContent from '../../Shared/UpperContent/UpperContent'
import { BsFillBackspaceFill, BsGearFill } from 'react-icons/bs'
import { AiFillEdit, AiFillSave } from 'react-icons/ai'
import useRequest from '../../../../axios/apis/useRequest'
import BreadcrumbComponent from '../../Shared/Breadcrumb/Breadcrumb'
import { useLocation, useParams } from 'react-router-dom'

const Profile = () => {
  const { updateProfile, getCurrentProfile } = useRequest()
  const [edit, setEdit] = useState(false)
  const [oldProfileData, setOldProfileData] = useState({})
  const cancel = () => {
    setEdit(false)
  }

  useEffect(() => {
    ;(async () => {
      const currentProfile = await getCurrentProfile()
      const userData = {
        ...currentProfile.data.data.userProfile,
        ...currentProfile.data.data.userAccount,
      }
      setOldProfileData(userData)
      formik.setValues(userData)
    })()
  }, [])

  const initialValues = {
    fullName: oldProfileData?.fullName ? oldProfileData.fullName : '',
    address: oldProfileData?.address ? oldProfileData.address : '',
    organization: oldProfileData?.organization
      ? oldProfileData.organization
      : '',
    email: oldProfileData?.email ? oldProfileData.email : '',

    mobileNumber: oldProfileData?.mobileNumber
      ? oldProfileData.mobileNumber
      : '',
  }

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required('Full Name is required'),
    address: Yup.string(),
    organization: Yup.string(),
    email: Yup.string().email('Invalid email').required('Email is required'),
    mobileNumber: Yup.string(),
  })
  const location = useLocation()

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setEdit(false)
      setOldProfileData(values)
      updateProfile(values)
      setSubmitting(false)
    },
  })
  return (
    <Wrapper>
      {location.pathname.includes('admin-panel') && (
        <BreadcrumbComponent breadcrumbInfo={'Profile'} icon={BsGearFill} />
      )}
      <Form>
        <UpperContent>
          <h4 className="m-0">Profile </h4>
          <DynamicButtons
            buttons={
              edit
                ? [
                    {
                      order: 1,
                      type: 'action',
                      label: 'Save-All',
                      func: formik.handleSubmit,
                      variant: 'secondary',
                      icon: <AiFillSave />,
                    },
                    {
                      order: 1,
                      type: 'action',
                      label: 'Cancel',
                      variant: 'primary',
                      func: cancel,
                      icon: <BsFillBackspaceFill />,
                    },
                  ]
                : [
                    {
                      order: 1,
                      type: 'action',
                      label: 'Edit',
                      variant: 'secondary',
                      func: () => setEdit(true),
                      icon: <AiFillEdit />,
                    },
                    {
                      order: 1,
                      type: 'form',
                      component: 'changePassword',
                      label: 'Change-Password',
                      icon: <AiFillEdit />,
                      variant: 'primary',
                    },
                  ]
            }
          />
        </UpperContent>
        <Card className="m-3 p-3 mt-0">
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  id="email"
                  name="email"
                  value={formik.values.email}
                  disabled={true}
                  onChange={formik.handleChange}
                />
                {formik.touched.email && formik.errors.email && (
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ display: 'block' }}
                  >
                    {formik.errors.email}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  id="fullName"
                  name="fullName"
                  disabled={!edit}
                  value={formik.values.fullName}
                  onChange={formik.handleChange}
                />

                {formik.touched.fullName && formik.errors.fullName && (
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ display: 'block' }}
                  >
                    {formik.errors.fullName}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  id="address"
                  name="address"
                  disabled={!edit}
                  value={formik.values.address}
                  onChange={formik.handleChange}
                />
                {formik.touched.address && formik.errors.address && (
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ display: 'block' }}
                  >
                    {formik.errors.address}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Organization</Form.Label>
                <Form.Control
                  type="text"
                  id="organization"
                  name="organization"
                  disabled={!edit}
                  value={formik.values.organization}
                  onChange={formik.handleChange}
                />
                {formik.touched.organization && formik.errors.organization && (
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ display: 'block' }}
                  >
                    {formik.errors.organization}
                  </Form.Control.Feedback>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Mobile Phone</Form.Label>
                <Form.Control
                  type="text"
                  id="mobileNumber"
                  name="mobileNumber"
                  value={formik.values.mobileNumber}
                  disabled={!edit}
                  onChange={formik.handleChange}
                />
                {formik.touched.mobileNumber && formik.errors.mobileNumber && (
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ display: 'block' }}
                  >
                    {formik.errors.mobileNumber}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
          </Row>
        </Card>
      </Form>
    </Wrapper>
  )
}

export default Profile
