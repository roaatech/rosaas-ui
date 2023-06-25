import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Button } from "@themesberg/react-bootstrap";
import { Formik, Form, Field, ErrorMessage, useFormik } from "formik";
import { InputText } from "primereact/inputtext";
import * as Yup from "yup";
import useRequest from "../../../../axios/apis/useRequest.js";
import { Product_id } from "../../../../const/index.js";
import { updateSidebar } from "../../../../store/slices/main.js";
import { useDispatch } from "react-redux";
import AutoCompleteFiled from "../../Shared/AutoCompleteFiled/AutoCompleteFiled.jsx";
import { useNavigate } from "react-router-dom";

const FeatureForm = ({
  type,
  featureData,
  update,
  setUpdate,
  setVisibleHead,
  setVisible,
  sideBar,
}) => {
  const { createFeatureRequest, editFeatureRequest } = useRequest();
  const dispatch = useDispatch();
  const [selectedProduct, setSelectedProduct] = useState("");
  const [submitLoading, setSubmitLoading] = useState();
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    title: Yup.string().max(100, "Must be maximum 100 digits"),
    uniqueName: Yup.string()
      .max(100, "Must be maximum 100 digits")
      .required("Unique Name is required")
      .matches(
        /^[a-zA-Z0-9_-]+$/,
        "English Characters, numbers, and underscores are only accepted."
      ),

    // product: Yup.string()
    //   .required("Product is required")
    //   .test("custom", "Product is invalid", (v) => {
    //     if (selectedProduct.length > 0) {
    //       return true;
    //     }
    //     return false;
    //   }),
  });
  const initialValues = {
    title: featureData ? featureData.title : "",
    uniqueName: featureData ? featureData.uniqueName : "",
    // product: featureData ? featureData?.product?.name : "",
  };
  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // Handle form submission
      if (type == "create") {
        const createFeature = await createFeatureRequest({
          title: values.title,
          uniqueName: values.uniqueName,
          productsIds: [Product_id],
          // product: selectedProduct,
        });
        navigate(`/featureDetails/${createFeature.data.data.id}`);
        if (update) {
          setUpdate(update + 1);
        }
        if (sideBar == true) {
          dispatch(updateSidebar());
        }
      } else {
        const editFeature = await editFeatureRequest({
          title: values.title,
          uniqueName: values.uniqueName,
          id: featureData.id,
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
  // useEffect(() => {
  //   featureData?.product?.id && setSelectedProduct(featureData.product.id);
  // }, []);
  // useEffect(() => {
  //   (async () => {
  //     setTimeout(async () => {
  //       await formik.validateField("product");
  //     }, 100);
  //   })();
  // }, [submitLoading]);

  return (
    <div>
      {/* <form className="pt-4"> */}
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
          {/* <div className="inputContainer mb-3">
            <AutoCompleteFiled
              class={"p-float-label"}
              name="product"
              id="product"
              dataFunction={productOptions}
              label="Product"
              className="p-float-label"
              setSelectedProduct={setSelectedProduct}
              value={formik.values.product}
              onChange={(event) => formik.setFieldValue("product", event.value)}
              setSubmitLoading={setSubmitLoading}
            />
            {formik.touched.product && formik.errors.product && (
              <div className="error-message">{formik.errors.product}</div>
            )}
          </div> */}
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

export default FeatureForm;
