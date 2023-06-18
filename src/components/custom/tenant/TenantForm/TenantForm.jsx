import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Button } from "@themesberg/react-bootstrap";
import { Formik, Form, Field, ErrorMessage, useFormik } from "formik";
import { InputText } from "primereact/inputtext";
import * as Yup from "yup";
import useRequest from "../../../../axios/apis/useRequest.js";
import { Product_id } from "../../../../const/index.js";
import { updateSidebar } from "../../../../store/slices/main";
import { useDispatch } from "react-redux";
import AutoCompleteFiled from "../../Shared/AutoCompleteFiled/AutoCompleteFiled.jsx";

const TenantForm = ({
  type,
  tenantData,
  update,
  setUpdate,
  setVisibleHead,
  setVisible,
}) => {
  const { createTenantRequest, editTenantRequest } = useRequest();
  const dispatch = useDispatch();
  const [selectedProduct, setSelectedProduct] = useState("");
  const [submitLoading, setSubmitLoading] = useState();

  const validationSchema = Yup.object().shape({
    title: Yup.string().max(100, "Must be maximum 100 digits"),
    uniqueName: Yup.string()
      .max(100, "Must be maximum 100 digits")
      .required("Unique Name is required")
      .matches(
        /^[a-zA-Z0-9_-]+$/,
        "English Characters, numbers, and underscores are only accepted."
      ),

    // product: Yup.string().required("Product is required"),
    product: Yup.string()
      .required("Product is required")
      .test("custom", "Product is invalid", (v) => {
        console.log({ v });
        if (selectedProduct.length > 0) {
          return true;
        }
        return false;
      }),
  });
  const initialValues = {
    title: tenantData ? tenantData.title : "",
    uniqueName: tenantData ? tenantData.uniqueName : "",
    product: tenantData ? tenantData?.product?.name : "",
  };
  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (e, values) => {
      e.preventDefault();
      // Handle form submission
      console.log({ values });
      if (type == "create") {
        const createTenant = await createTenantRequest({
          title: values.title,
          uniqueName: values.uniqueName,
          productsIds: [Product_id],
          // product: selectedProduct,
        });
      } else {
        const editTenant = await editTenantRequest({
          title: values.title,
          uniqueName: values.uniqueName,
          id: tenantData.id,
          // product: selectedProduct,
        });
      }
      setVisible && setVisible(false);
      setVisibleHead && setVisibleHead(false);
      dispatch(updateSidebar());
    },
  });
  const productOptions = async (text) => {
    // const allOptions = await getProductSearch();
    // return allOptions.data;
    return {
      data: [
        {
          id: "asfdasf1",
          name: "product1",
        },
        {
          id: "asfdasf2",
          name: "product2",
        },
        {
          id: "asfdasf3",
          name: "product3",
        },
        {
          id: "asfdasf4",
          name: "product4",
        },
      ],
    };
  };
  useEffect(() => {
    tenantData?.product?.id && setSelectedProduct(tenantData.product.id);
  }, []);
  useEffect(() => {
    (async () => {
      setTimeout(async () => {
        await formik.validateField("product");
      }, 100);
    })();
  }, [submitLoading]);

  return (
    <div>
      <form className="pt-4" onSubmit={formik.handleSubmit}>
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
          <div className="inputContainer mb-3">
            <AutoCompleteFiled
              class={"p-float-label"}
              name="product"
              id="product"
              dataFunction={productOptions}
              label="Proudct"
              className="p-float-label"
              setSelectedProduct={setSelectedProduct}
              value={formik.values.product}
              onChange={(event) => formik.setFieldValue("product", event.value)}
              setSubmitLoading={setSubmitLoading}
            />
            {formik.touched.product && formik.errors.product && (
              <div className="error-message">{formik.errors.product}</div>
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
      </form>
    </div>
  );
};

export default TenantForm;
