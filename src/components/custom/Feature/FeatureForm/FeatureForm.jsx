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
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";

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
    name: Yup.string().required("Name is required"),
    type: Yup.string().required("Type is required"),
    unit: Yup.string(),
    reset: Yup.string().required("Reset is required"),
    description: Yup.string(),

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
    name: featureData ? featureData.name : "",
    type: featureData ? featureData.type : "number",
    unit: featureData ? featureData.unit : "",
    reset: featureData ? featureData.reset : "never",
    description: featureData ? featureData.description : "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log(values);
      // try {
      // Handle form submission
      if (type == "create") {
        // const createFeature = await createFeatureRequest({
        //   name: values.name,
        //   type: values.type,
        //   unit: values.unit,
        //   reset: values.reset,
        //   description: values.description,
        // });
        // navigate(`/featureDetails/${createFeature.data.data.id}`);
        if (update) {
          setUpdate(update + 1);
        }
      } else {
        // const editFeature = await editFeatureRequest({
        //   name: values.name,
        //   type: values.type,
        //   unit: values.unit,
        //   reset: values.reset,
        //   description: values.description,
        // });
        if (update) {
          setUpdate(update + 1);
        }
        console.log(values);
      }
      setVisible && setVisible(false);
      setVisibleHead && setVisibleHead(false);
      dispatch(updateSidebar());
      // } catch (error) {
      //   console.log(error);
      // }
    },
  });

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

  const TypeOptions = [
    { label: "Number", value: "number" },
    { label: "Yes/No", value: "yes/no" },
  ];
  const UnitOptions = [
    { label: " ", value: "" },
    { label: "K", value: "K" },
    { label: "MB", value: "MB" },
    { label: "GB", value: "GB" },
  ];
  const ResetOptions = [
    { label: "Never", value: "never" },
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
    { label: "Annual", value: "annual" },
  ];

  return (
    <div>
      <form className="pt-4" onSubmit={formik.handleSubmit}>
        <div>
          <div className="inputContainer mb-4">
            <div className="inputContainerWithIcon">
              <span className="p-float-label">
                <InputText
                  id="name"
                  name="name"
                  onChange={formik.handleChange}
                  // onBlur={formik.handleBlur}
                  value={formik.values.name}
                />
                <label htmlFor="name">
                  Name: <span style={{ color: "red" }}>*</span>
                </label>
              </span>
            </div>
            {formik.touched.name && formik.errors.name && (
              <div className="error-message">{formik.errors.name}</div>
            )}
          </div>
        </div>
        <div>
          <div className="inputContainer mb-4">
            <div className="inputContainerWithIcon">
              <span className="p-float-label">
                <Dropdown
                  id="type"
                  options={TypeOptions}
                  value={formik.values.type}
                  onChange={(e) => formik.setFieldValue("type", e.value)}
                  // placeholder="Type"
                  name="type"
                />
                <label htmlFor="type">
                  Type: <span style={{ color: "red" }}>*</span>
                </label>
              </span>
            </div>
            {formik.touched.type && formik.errors.type && (
              <div className="error">{formik.errors.type}</div>
            )}
          </div>
        </div>
        <div>
          <div className="inputContainer mb-4">
            <div className="inputContainerWithIcon">
              <span className="p-float-label">
                <Dropdown
                  id="unit"
                  options={UnitOptions}
                  value={formik.values.unit}
                  onChange={(e) => formik.setFieldValue("unit", e.value)}
                  // placeholder="Unit"
                  name="unit"
                />
                <label htmlFor="unit">Unit:</label>
              </span>
            </div>
            {formik.touched.unit && formik.errors.unit && (
              <div className="error">{formik.errors.unit}</div>
            )}
          </div>
        </div>
        <div>
          <div className="inputContainer mb-4">
            <div className="inputContainerWithIcon">
              <span className="p-float-label">
                <Dropdown
                  id="reset"
                  options={ResetOptions}
                  value={formik.values.reset}
                  onChange={(e) => formik.setFieldValue("reset", e.value)}
                  // placeholder="Reset"
                  name="reset"
                />
                <label htmlFor="reset">
                  Reset: <span style={{ color: "red" }}>*</span>
                </label>
              </span>
            </div>
            {formik.touched.reset && formik.errors.reset && (
              <div className="error">{formik.errors.reset}</div>
            )}
          </div>
        </div>
        <div>
          <div className="inputContainer mb-4">
            <div className="inputContainerWithIcon">
              <span className="p-float-label">
                <InputTextarea
                  id="description"
                  name="description"
                  onChange={formik.handleChange}
                  value={formik.values.description}
                />
                <label htmlFor="description">Description:</label>
              </span>
            </div>
            {formik.touched.description && formik.errors.description && (
              <div className="error-message">{formik.errors.description}</div>
            )}
          </div>
        </div>

        <div className="pt-1">
          <Button
            variant="primary"
            type="submit"
            className="w-100"
            // disabled={submitLoading}
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FeatureForm;
