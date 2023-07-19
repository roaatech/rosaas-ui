import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useFormik } from "formik";
import { InputText } from "primereact/inputtext";
import * as Yup from "yup";
import useRequest from "../../../../axios/apis/useRequest.js";
import { Product_id } from "../../../../const/index.js";
import { updateSidebar } from "../../../../store/slices/main";
import { useDispatch } from "react-redux";
import AutoCompleteFiled from "../../Shared/AutoCompleteFiled/AutoCompleteFiled.jsx";
import { useNavigate } from "react-router-dom";
import { Form } from "@themesberg/react-bootstrap";
import { Modal, Button } from "@themesberg/react-bootstrap";
const TenantForm = ({
  type,
  tenantData,
  update,
  setUpdate,
  setVisible,
  sideBar,
  popupLabel,
}) => {
  const { createTenantRequest, editTenantRequest } = useRequest();
  const dispatch = useDispatch();
  const [submitLoading, setSubmitLoading] = useState();
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    title: Yup.string().max(100, "Must be maximum 100 digits"),
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
    // product: tenantData ? tenantData?.product?.name : "",
  };
  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // Handle form submission
      setVisible(false);
      if (type == "create") {
        const createTenant = await createTenantRequest({
          title: values.title,
          uniqueName: values.uniqueName,
          productsIds: [Product_id],
          // product: selectedProduct,
        });
        navigate(`/tenantDetails/${createTenant.data.data.id}`);
        /// ****** remove
        if (update) {
          setUpdate(update + 1);
        }
        if (sideBar == true) {
          dispatch(updateSidebar());
        }
      } else {
        const editTenant = await editTenantRequest({
          title: values.title,
          uniqueName: values.uniqueName,
          id: tenantData.id,
          // product: selectedProduct,
        });
        if (update) {
          setUpdate(update + 1);
        }
        if (sideBar == true) {
          dispatch(updateSidebar());
        }
      }
      setVisible && setVisible(false);
      setVisible && setVisible(false);
      dispatch(updateSidebar());
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
              {/* <Form.Control */}
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
      {/* <form className="pt-4" onSubmit={formik.handleSubmit}>
        <div>
          <div className="inputContainer mb-4">
            <div className="inputContainerWithIcon">
              <span className="p-float-label">
                <InputText
                  id="title"
                  name="title"
                  onChange={formik.handleChange}
                  value={formik.values.title}
                />
                <label htmlFor="title">Title: </label>
              </span>
            </div>
            {formik.touched.title && formik.errors.title && (
              <div className="error-message">{formik.errors.title}</div>
            )}
          </div>
        </div>
        <div>
          <div className="inputContainer mb-4">
            <div className="inputContainerWithIcon">
              <span className="p-float-label">
                <InputText
                  id="uniqueName"
                  name="uniqueName"
                  onChange={formik.handleChange}
                  // onBlur={formik.handleBlur}
                  value={formik.values.uniqueName}
                />
                <label htmlFor="uniqueName">
                  UniqueName: <span style={{ color: "red" }}>*</span>
                </label>
              </span>
            </div>
            {formik.touched.uniqueName && formik.errors.uniqueName && (
              <div className="error-message">{formik.errors.uniqueName}</div>
            )}
          </div>
     
        </div>
        <div className="pt-1">
          <Button
            variant="primary"
            type="submit"
            className="w-100"
            disabled={submitLoading}>
            Submit
          </Button>
        </div>
      </form> */}
    </div>
  );
};

export default TenantForm;
