import React from "react";
import { Button } from "@themesberg/react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { InputText } from "primereact/inputtext";
import * as Yup from "yup";
import useRequest from "../../../../axios/apis/useRequest.js";
import { Product_Client_id } from "../../../../const/index.js";

const ProductForm = ({
  type,
  productData,
  update,
  setUpdate,
  setVisibleHead,
  setVisible,
}) => {
  const { createProductRequest, editProductRequest } = useRequest();
  const initialValues = {
    name: productData ? productData.name : "",
    url: productData ? productData.url : "",
    creationEndpoint: productData ? productData.creationEndpoint : "",
    activationEndpoint: productData ? productData.activationEndpoint : "",
    deactivationEndpoint: productData ? productData.deactivationEndpoint : "",
    deletionEndpoint: productData ? productData.deletionEndpoint : "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Product Name is required"),
    url: Yup.string()
      .required("Url is required")
      .url("Please enter a valid URL"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    if (type == "create") {
      const createProduct = await createProductRequest({
        name: values.name,
        url: values.url,
        creationEndpoint: values.creationEndpoint,
        activationEndpoint: values.activationEndpoint,
        deactivationEndpoint: values.deactivationEndpoint,
        deletionEndpoint: values.deletionEndpoint,
        clientId: Product_Client_id,
      });
    } else {
      const editProduct = await editProductRequest({
        data: {
          name: values.name,
          url: values.url,
          creationEndpoint: values.creationEndpoint,
          activationEndpoint: values.activationEndpoint,
          deactivationEndpoint: values.deactivationEndpoint,
          deletionEndpoint: values.deletionEndpoint,
          clientId: Product_Client_id,
        },
        id: productData.id,
      });
    }
    setVisible && setVisible(false);
    setVisibleHead && setVisibleHead(false);
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
              {/* <label htmlFor="name" className="pb-2">
                name:
              </label> */}
              <div className="inputContainer mb-4">
                <div className="inputContainerWithIcon">
                  <span className="p-float-label">
                    <Field type="text" id="name" name="name" as={InputText} />
                    <label htmlFor="name">
                      Name:<span style={{ color: "red" }}>*</span>
                    </label>
                  </span>
                </div>
                <ErrorMessage
                  name="name"
                  component="div"
                  className="error-message"
                />
              </div>
            </div>
            <div>
              {/* <label htmlFor="url" className="pb-2">
                Unique Name:
              </label> */}
              <div className="inputContainer mb-3">
                <div className="inputContainerWithIcon">
                  <span className="p-float-label">
                    <Field type="text" id="url" name="url" as={InputText} />
                    <label htmlFor="url">
                      Url:<span style={{ color: "red" }}>*</span>
                    </label>
                  </span>
                </div>
                <ErrorMessage
                  name="url"
                  component="div"
                  className="error-message"
                />
              </div>
            </div>
            <div>
              <div className="inputContainer mb-3">
                <div className="inputContainerWithIcon">
                  <span className="p-float-label">
                    <Field
                      type="text"
                      id="creationEndpoint"
                      name="creationEndpoint"
                      as={InputText}
                    />
                    <label htmlFor="creationEndpoint">Creation Endpoint:</label>
                  </span>
                </div>
                <ErrorMessage
                  name="creationEndpoint"
                  component="div"
                  className="error-message"
                />
              </div>
            </div>
            <div>
              <div className="inputContainer mb-3">
                <div className="inputContainerWithIcon">
                  <span className="p-float-label">
                    <Field
                      type="text"
                      id="activationEndpoint"
                      name="activationEndpoint"
                      as={InputText}
                    />
                    <label htmlFor="activationEndpoint">
                      Activation Endpoint:
                    </label>
                  </span>
                </div>
                <ErrorMessage
                  name="activationEndpoint"
                  component="div"
                  className="error-message"
                />
              </div>
            </div>
            <div>
              <div className="inputContainer mb-3">
                <div className="inputContainerWithIcon">
                  <span className="p-float-label">
                    <Field
                      type="text"
                      id="deactivationEndpoint"
                      name="deactivationEndpoint"
                      as={InputText}
                    />
                    <label htmlFor="deactivationEndpoint">
                      Deactivation Endpoint :
                    </label>
                  </span>
                </div>
                <ErrorMessage
                  name="deactivationEndpoint"
                  component="div"
                  className="error-message"
                />
              </div>
            </div>
            <div>
              <div className="inputContainer mb-3">
                <div className="inputContainerWithIcon">
                  <span className="p-float-label">
                    <Field
                      type="text"
                      id="deletionEndpoint"
                      name="deletionEndpoint"
                      as={InputText}
                    />
                    <label htmlFor="deletionEndpoint">deletionEndpoint:</label>
                  </span>
                </div>
                <ErrorMessage
                  name="deletionEndpoint"
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

export default ProductForm;
