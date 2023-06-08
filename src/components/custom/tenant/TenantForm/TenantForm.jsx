import React from "react";
import { FormattedMessage } from "react-intl";
import { Button } from "@themesberg/react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { InputText } from "primereact/inputtext";
import * as Yup from "yup";
import useRequest from "../../../../axios/apis/useRequest.js";
import { Product_id } from "../../../../const/index.js";

const TenantForm = ({
  type,
  tenantData,
  update,
  setUpdate,
  setVisibleHead,
  setVisible,
}) => {
  const { createTenantRequest, editTenantRequest } = useRequest();

  const initialValues = {
    title: tenantData ? tenantData.title : "",
    uniqueName: tenantData ? tenantData.uniqueName : "",
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().max(100, "Must be maximum 100 digits"),
    uniqueName: Yup.string()
      .max(100, "Must be maximum 100 digits")
      .required("Unique Name is required")
      .matches(
        /^[a-zA-Z0-9_-]+$/,
        "English Characters, numbers, and underscores are only accepted."
      ),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log({ values });
    if (type == "create") {
      const createTenant = await createTenantRequest({
        title: values.title,
        uniqueName: values.uniqueName,
        productsIds: [Product_id],
      });
    } else {
      const editTenant = await editTenantRequest({
        title: values.title,
        uniqueName: values.uniqueName,
        id: tenantData.id,
      });
    }
    setVisible && setVisible(false);
    setVisibleHead && setVisibleHead(false);
    setUpdate(update + 1);
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form className="pt-4">
            <div>
              {/* <label htmlFor="title" className="pb-2">
                Title:
              </label> */}
              <div className="inputContainer mb-4">
                <div className="inputContainerWithIcon">
                  <span className="p-float-label">
                    <Field type="text" id="title" name="title" as={InputText} />
                    <label htmlFor="title">Title:</label>
                  </span>
                </div>
                <ErrorMessage
                  name="title"
                  component="div"
                  className="error-message"
                />
              </div>
            </div>
            <div>
              {/* <label htmlFor="uniqueName" className="pb-2">
                Unique Name:
              </label> */}
              <div className="inputContainer mb-3">
                <div className="inputContainerWithIcon">
                  <span className="p-float-label">
                    <Field
                      type="text"
                      id="uniqueName"
                      name="uniqueName"
                      as={InputText}
                    />
                    <label htmlFor="uniqueName">
                      Unique Name:<span style={{ color: "red" }}>*</span>
                    </label>
                  </span>
                </div>
                <ErrorMessage
                  name="uniqueName"
                  component="div"
                  className="error-message"
                />
              </div>
            </div>
            <div className="pt-1">
              <Button
                variant="primary"
                type="submit"
                className="w-100"
                disabled={isSubmitting}>
                Submit
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default TenantForm;
