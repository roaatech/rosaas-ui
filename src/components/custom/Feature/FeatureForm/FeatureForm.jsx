import React, { useState } from 'react';
import { useFormik } from 'formik';
import { InputText } from 'primereact/inputtext';
import * as Yup from 'yup';
import useRequest from '../../../../axios/apis/useRequest.js';
import {
  Modal,
  Button,
  OverlayTrigger,
  Tooltip,
} from '@themesberg/react-bootstrap';
import { Form } from '@themesberg/react-bootstrap';
import { featureInfo } from '../../../../store/slices/features.js';
import { useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';
import { Wrapper } from './FeatureForm.styled.jsx';
import { generateApiKey } from '../../../../lib/sharedFun/common.js';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { AiFillCopy } from 'react-icons/ai';

const FeatureForm = ({
  type,
  featureData,
  setVisible,
  popupLabel,
  update,
  setUpdate,
}) => {
  const { createFeatureRequest, editFeatureRequest } = useRequest();
  const dispatch = useDispatch();

  const initialValues = {
    name: featureData ? featureData.name : '',
    description: featureData ? featureData.description : '',
    type: featureData ? featureData.type : '',
    unit: featureData ? featureData.unit : '',
    reset: featureData ? featureData.reset : '',
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Feature Name is required'),
    description: Yup.string().required('Description is required'),
    type: Yup.string().required('Feature Type is required'),
    unit: Yup.string().when('type', {
      is: 'Number',
      then: Yup.string().required('Feature Unit is required'),
    }),
    reset: Yup.string().required('Feature Reset is required'),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      if (type === 'create') {
        const createFeature = await createFeatureRequest({
          name: values.name,
          description: values.description,
          type: values.type,
          unit: values.unit,
          reset: values.reset,
        });
        setUpdate(update + 1);
      } else {
        const editFeature = await editFeatureRequest({
          data: {
            name: values.name,
            description: values.description,
            type: values.type,
            unit: values.unit,
            reset: values.reset,
          },
          id: featureData.id,
        });

        dispatch(
          featureInfo({
            id: featureData.id,
            name: values.name,
            description: values.description,
            type: values.type,
            unit: values.unit,
            reset: values.reset,
            editedDate: new Date().toISOString().slice(0, 19),
          })
        );
      }

      setVisible && setVisible(false);
      setSubmitting(false);
    },
  });

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
          <Form.Group className="mb-3">
            <Form.Label>
              <FormattedMessage id="Name" />
            </Form.Label>
            <InputText
              type="text"
              id="name"
              name="name"
              onChange={formik.handleChange}
              value={formik.values.name}
              className={
                formik.touched.name && formik.errors.name ? 'is-invalid' : ''
              }
            />
            {formik.touched.name && formik.errors.name && (
              <div className="invalid-feedback">{formik.errors.name}</div>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <FormattedMessage id="Description" />
            </Form.Label>
            <InputText
              type="text"
              id="description"
              name="description"
              onChange={formik.handleChange}
              value={formik.values.description}
              className={
                formik.touched.description && formik.errors.description
                  ? 'is-invalid'
                  : ''
              }
            />
            {formik.touched.description && formik.errors.description && (
              <div className="invalid-feedback">{formik.errors.description}</div>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <FormattedMessage id="Type" />
            </Form.Label>
            <InputText
              type="text"
              id="type"
              name="type"
              onChange={formik.handleChange}
              value={formik.values.type}
              className={
                formik.touched.type && formik.errors.type ? 'is-invalid' : ''
              }
            />
            {formik.touched.type && formik.errors.type && (
              <div className="invalid-feedback">{formik.errors.type}</div>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <FormattedMessage id="Unit" />
            </Form.Label>
            <InputText
              type="text"
              id="unit"
              name="unit"
              onChange={formik.handleChange}
              value={formik.values.unit}
              className={
                formik.touched.unit && formik.errors.unit ? 'is-invalid' : ''
              }
            />
            {formik.touched.unit && formik.errors.unit && (
              <div className="invalid-feedback">{formik.errors.unit}</div>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <FormattedMessage id="Reset" />
            </Form.Label>
            <InputText
              type="text"
              id="reset"
              name="reset"
              onChange={formik.handleChange}
              value={formik.values.reset}
              className={
                formik.touched.reset && formik.errors.reset ? 'is-invalid' : ''
              }
            />
            {formik.touched.reset && formik.errors.reset && (
              <div className="invalid-feedback">{formik.errors.reset}</div>
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" type="submit">
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
  );
};

export default FeatureForm;
