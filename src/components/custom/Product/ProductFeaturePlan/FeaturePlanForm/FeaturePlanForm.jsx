import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { InputText } from 'primereact/inputtext'
import * as Yup from 'yup'
import useRequest from '../../../../axios/apis/useRequest.js'
import { FeaturePlan_Client_id } from '../../../../const/index.js'
import {
  Modal,
  Button,
  OverlayTrigger,
  Tooltip,
} from '@themesberg/react-bootstrap'
import { Form } from '@themesberg/react-bootstrap'
import { FeaturePlanInfo } from '../../../../store/slices/FeaturePlans.js'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi'
import { Wrapper } from './FeaturePlanForm.styled.jsx'
import { generateApiKey } from '../../../../lib/sharedFun/common.js'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { AiFillCopy } from 'react-icons/ai'

const FeaturePlanForm = ({
  type,
  FeaturePlanData,
  setVisible,
  popupLabel,
  update,
  setUpdate,
}) => {
  const { createFeaturePlanRequest, editFeaturePlanRequest } = useRequest()
  const dispatch = useDispatch()

  const initialValues = {
    name: FeaturePlanData ? FeaturePlanData.name : '',
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('FeaturePlan Name is required'),
    // defaultHealthCheckUrl: Yup.string()
    //   .required(<FormattedMessage id="This-field-is-required" />)
    //   .matches(
    //     /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,})(:\d{2,5})?(\/[^\s]*)?$/i,
    //     <FormattedMessage id="Please-enter-a-valid-value" />
    //   ),
    // healthStatusChangeUrl: Yup.string()
    //   .required(<FormattedMessage id="This-field-is-required" />)
    //   .matches(
    //     /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,})(:\d{2,5})?(\/[^\s]*)?$/i,
    //     <FormattedMessage id="Please-enter-a-valid-value" />
    //   ),
  })

  const listFeatureData = useSelector((state) => state.products.products)
  let allFeature = Object.values(listFeatureData)
  const options = allFeature.map((item, index) => {
    return { value: item.id, label: item.name }
  })

  useEffect(() => {
    ;(async () => {
      // if (list.length == 0) {
      //   const featureReq = await getProductList(query)
      //   dispatch(setAllProduct(featureReq.data.data.items))
      // }
    })()
  }, [])

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      if (type == 'create') {
        const createFeaturePlan = await createFeaturePlanRequest({
          name: values.name,
        })
        setUpdate(update + 1)
      } else {
        const editFeaturePlan = await editFeaturePlanRequest({
          data: {
            name: values.name,
          },
        })

        dispatch(
          FeaturePlanInfo({
            id: FeaturePlanData.id,
            name: values.name,
          })
        )
      }

      setVisible && setVisible(false)
    },
  })
  //   const RandomApiKey = () => {
  //     formik.setFieldValue('apiKey', generateApiKey())
  //   }
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
          {/* <div>
            <Form.Group className="mb-3">
              <Form.Label>
                <FormattedMessage id="Name" />
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

              {formik.touched.name && formik.errors.name && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: 'block' }}
                >
                  {formik.errors.name}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </div> */}

          <div style={{ display: type == 'edit' ? 'none' : 'block' }}>
            <Form.Group className="mb-3">
              <Form.Label>
                Product <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <select
                className="form-select"
                name="product"
                id="product"
                value={formik.values.product}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.product && formik.errors.product}
                multiple
              >
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {formik.touched.product && formik.errors.product && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: 'block' }}
                >
                  {formik.errors.product}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            type="submit"
            // disabled={submitLoading}
          >
            <FormattedMessage id="Submit" />
          </Button>
          <Button
            variant="link"
            className="text-gray ms-auto"
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
