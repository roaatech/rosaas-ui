import React from "react";
import { useFormik } from "formik";
import { InputText } from "primereact/inputtext";
import * as Yup from "yup";
import useRequest from "../../../../axios/apis/useRequest.js";
import { Product_Client_id } from "../../../../const/index.js";
import { Modal, Button } from "@themesberg/react-bootstrap";
import { Form } from "@themesberg/react-bootstrap";
import { productInfo } from "../../../../store/slices/products.js";
import { useDispatch } from "react-redux";

const ProductForm = ({
  type,
  productData,
  setVisible,
  popupLabel,
  update,
  setUpdate,
}) => {
  const { createProductRequest, editProductRequest } = useRequest();
  const dispatch = useDispatch();

  const initialValues = {
    name: productData ? productData.name : "",
    DefaultHealthCheckUrl: productData ? productData.url : "",
    creationEndpoint: productData ? productData.creationEndpoint : "",
    activationEndpoint: productData ? productData.activationEndpoint : "",
    deactivationEndpoint: productData ? productData.deactivationEndpoint : "",
    deletionEndpoint: productData ? productData.deletionEndpoint : "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Product Name is required"),
    DefaultHealthCheckUrl: Yup.string()
      .required("Default Health Check Url is required")
      .url("Please enter a valid Default Health Check Url"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      if (type == "create") {
        console.log("dddddddd");
        const createProduct = await createProductRequest({
          name: values.name,
          url: values.DefaultHealthCheckUrl,
          creationEndpoint: values.creationEndpoint,
          activationEndpoint: values.activationEndpoint,
          deactivationEndpoint: values.deactivationEndpoint,
          deletionEndpoint: values.deletionEndpoint,
          clientId: Product_Client_id,
        });
        setUpdate(update + 1);
      } else {
        const editProduct = await editProductRequest({
          data: {
            name: values.name,
            url: values.DefaultHealthCheckUrl,
            creationEndpoint: values.creationEndpoint,
            activationEndpoint: values.activationEndpoint,
            deactivationEndpoint: values.deactivationEndpoint,
            deletionEndpoint: values.deletionEndpoint,
            clientId: Product_Client_id,
          },
          id: productData.id,
        });

        dispatch(
          productInfo({
            id: productData.id,
            name: values.name,
            url: values.DefaultHealthCheckUrl,
            creationEndpoint: values.creationEndpoint,
            activationEndpoint: values.activationEndpoint,
            deactivationEndpoint: values.deactivationEndpoint,
            deletionEndpoint: values.deletionEndpoint,
            clientId: { id: Product_Client_id },
          })
        );
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
              <Form.Label>
                Name <span style={{ color: "red" }}>*</span>
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
                  style={{ display: "block" }}>
                  {formik.errors.name}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </div>

          <div>
            <Form.Group className="mb-3">
              <Form.Label>
                Default Health Check Url <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <input
                type="text"
                className="form-control"
                id="DefaultHealthCheckUrl"
                name="DefaultHealthCheckUrl"
                onChange={formik.handleChange}
                value={formik.values.DefaultHealthCheckUrl}
              />

              {formik.touched.DefaultHealthCheckUrl &&
                formik.errors.DefaultHealthCheckUrl && (
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ display: "block" }}>
                    {formik.errors.DefaultHealthCheckUrl}
                  </Form.Control.Feedback>
                )}
            </Form.Group>
          </div>

          <div>
            <Form.Group className="mb-3">
              <Form.Label>Creation Url</Form.Label>
              <input
                type="text"
                className="form-control"
                id="creationEndpoint"
                name="creationEndpoint"
                onChange={formik.handleChange}
                value={formik.values.creationEndpoint}
              />

              {formik.touched.creationEndpoint &&
                formik.errors.creationEndpoint && (
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ display: "block" }}>
                    {formik.errors.creationEndpoint}
                  </Form.Control.Feedback>
                )}
            </Form.Group>
          </div>
          <div>
            <Form.Group className="mb-3">
              <Form.Label>Activation Url</Form.Label>
              <input
                type="text"
                className="form-control"
                id="activationEndpoint"
                name="activationEndpoint"
                onChange={formik.handleChange}
                value={formik.values.activationEndpoint}
              />

              {formik.touched.activationEndpoint &&
                formik.errors.activationEndpoint && (
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ display: "block" }}>
                    {formik.errors.activationEndpoint}
                  </Form.Control.Feedback>
                )}
            </Form.Group>
          </div>
          <div>
            <Form.Group className="mb-3">
              <Form.Label>Deactivation Url</Form.Label>
              <input
                type="text"
                className="form-control"
                id="deactivationEndpoint"
                name="deactivationEndpoint"
                onChange={formik.handleChange}
                value={formik.values.deactivationEndpoint}
              />

              {formik.touched.deactivationEndpoint &&
                formik.errors.deactivationEndpoint && (
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ display: "block" }}>
                    {formik.errors.deactivationEndpoint}
                  </Form.Control.Feedback>
                )}
            </Form.Group>
          </div>
          <div>
            <Form.Group className="mb-3">
              <Form.Label>Deletion Url</Form.Label>
              <input
                type="text"
                className="form-control"
                id="deletionEndpoint"
                name="deletionEndpoint"
                onChange={formik.handleChange}
                value={formik.values.deletionEndpoint}
              />

              {formik.touched.deletionEndpoint &&
                formik.errors.deletionEndpoint && (
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ display: "block" }}>
                    {formik.errors.deletionEndpoint}
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

export default ProductForm;
