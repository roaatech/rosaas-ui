import React from "react";
import { FormattedMessage } from "react-intl";
import { Button } from "@themesberg/react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { InputText } from "primereact/inputtext";
import * as Yup from "yup";
import useRequest from "../../../../axios/apis/useRequest.js";
import { Product_id } from "../../../../const/index.js";

const TenantForm = ({ type, tenantData }) => {
  const { createTenantRequest, editTenantRequest } = useRequest();

  const initialValues = {
    title: tenantData ? tenantData.title : "",
    uniqueName: tenantData ? tenantData.uniqueName : "",
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().max(100, "Must be maximum 100 digits"),
    uniqueName: Yup.string()
      .max(100, "Must be maximum 100 digits")
      .required("UniqueName is required")
      .matches(
        /^[\w]+$/,
        "English Characters, numbers, and underscores are only accepted."
      ),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log({ values });
    if (type == "create") {
      const createTenant = await createTenantRequest({
        title: values.title,
        uniqueName: values.uniqueName,
        ProductsIds: [Product_id],
      });
    } else {
      const editTenant = await editTenantRequest({
        title: values.title,
        uniqueName: values.uniqueName,
        id: tenantData.id,
      });
    }
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form className="mt-4">
            <div>
              <label htmlFor="title" className="pb-2">
                Title:
              </label>
              <div className="inputContainer mb-3">
                <div className="inputContainerWithIcon">
                  <Field type="text" id="title" name="title" as={InputText} />
                </div>
                <ErrorMessage
                  name="title"
                  component="div"
                  className="error-message"
                />
              </div>
            </div>
            <div>
              <label htmlFor="uniqueName" className="pb-2">
                Unique Name:
              </label>
              <div className="inputContainer mb-3">
                <div className="inputContainerWithIcon">
                  <Field
                    type="text"
                    id="uniqueName"
                    name="uniqueName"
                    as={InputText}
                  />
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
