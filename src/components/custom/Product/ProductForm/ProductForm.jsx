import React from "react";
import { Button } from "@themesberg/react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { InputText } from "primereact/inputtext";
import * as Yup from "yup";
import useRequest from "../../../../axios/apis/useRequest.js";
import { Client_id } from "../../../../const/index.js";

const ProductForm = ({
  type,
  productData,
  update,
  setUpdate,
  setVisibleHead,
  setVisible,
}) => {
  // const { createProductRequest, editProductRequest } = useRequest();

  const initialValues = {
    name: productData ? productData.name : "",
    url: productData ? productData.url : "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Product Name is required"),
    url: Yup.string()
      .required("Url is required")
      .matches(/^(?!.*\/$).*/, "Url can't end with '/'"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    if (type == "create") {
      // const createProduct = await createProductRequest({
      //   name: values.name,
      //   url: values.url,
      //   client_id: [Client_id],
      // });
    } else {
      // const editProduct = await editProductRequest({
      //   name: values.name,
      //   url: values.url,
      //   client_id: Client_id,
      // });
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
