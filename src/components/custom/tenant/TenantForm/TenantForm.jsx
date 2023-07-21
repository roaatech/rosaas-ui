import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import useRequest from "../../../../axios/apis/useRequest.js";
import { Product_id } from "../../../../const/index.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form } from "@themesberg/react-bootstrap";
import { Modal, Button } from "@themesberg/react-bootstrap";
import { tenantInfo } from "../../../../store/slices/tenants.js";

const TenantForm = ({
  type,
  tenantData,
  update,
  updateTenant,
  setVisible,
  popupLabel,
}) => {
  const { createTenantRequest, editTenantRequest } = useRequest();
  const [submitLoading, setSubmitLoading] = useState();
  const navigate = useNavigate();

  const options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  const validationSchema = Yup.object().shape({
    title: Yup.string().max(100, "Must be maximum 100 digits"),
    product: Yup.array().min(1, "Please select a product"),
    uniqueName: Yup.string()
      .max(100, "Must be maximum 100 digits")
      .required("Unique Name is required")
      .matches(
        /^[a-zA-Z0-9_-]+$/,
        "English Characters, Numbers, and Underscores are only accepted."
      ),
  });
  const initialValues = {
    title: tenantData ? tenantData.title : "",
    uniqueName: tenantData ? tenantData.uniqueName : "",
    product: tenantData ? tenantData?.product?.name : "",
  };
  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // Handle form submission
      console.log(values, "yyyyyyyyyyyy");
      setVisible(false);
      if (type == "create") {
        const createTenant = await createTenantRequest({
          title: values.title,
          uniqueName: values.uniqueName,
          // productsIds: values.product,
          productsIds: [Product_id],
        });
        navigate(`/tenantDetails/${createTenant.data.data.id}`);
      } else {
        const editTenant = await editTenantRequest({
          title: values.title,
          uniqueName: values.uniqueName,
          id: tenantData.id,
          // product: selectedProduct,
        });
        updateTenant();
      }
      setVisible && setVisible(false);
      setVisible && setVisible(false);
    },
  });

  return (
    <div>
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
              <Form.Label>Title</Form.Label>
              <input
                className="form-control"
                type="text"
                id="title"
                name="title"
                onChange={formik.handleChange}
                value={formik.values.title}
              />

              {formik.touched.title && formik.errors.title && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: "block" }}>
                  {formik.errors.title}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </div>
          <div>
            <Form.Group className="mb-3">
              <Form.Label>
                Unique Name <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <input
                className="form-control"
                type="text"
                id="uniqueName"
                name="uniqueName"
                onChange={formik.handleChange}
                value={formik.values.uniqueName}
              />
              {formik.touched.uniqueName && formik.errors.uniqueName && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: "block" }}>
                  {formik.errors.uniqueName}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </div>
          <div>
            <Form.Group className="mb-3">
              <Form.Label>
                Product <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <select
                className="form-select"
                name="product"
                id="product"
                value={formik.values.product}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.product && !!formik.errors.product}
                multiple>
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {formik.touched.product && formik.errors.product && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: "block" }}>
                  {formik.errors.product}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" type="submit" disabled={submitLoading}>
            Submit
          </Button>
          <Button
            variant="link"
            className="text-gray ms-auto"
            onClick={() => setVisible(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Form>
    </div>
  );
};

export default TenantForm;
