import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Table } from "@themesberg/react-bootstrap";
import BreadcrumbComponent from "../../components/custom/Shared/Breadcrumb/Breadcrumb";
import { BsBoxSeam } from "react-icons/bs";

import ProductStatus from "../../components/custom/Product/ProductStatus/ProductStatus";
import useGlobal from "../../lib/hocks/global";
import { Button } from "primereact/button";
import DeleteConfirmation from "../../components/custom/global/DeleteConfirmation/DeleteConfirmation";
import useRequest from "../../axios/apis/useRequest";
import { Dialog } from "primereact/dialog";
// import ProductForm from "../../components/custom/product/ProductForm/ProductForm";
import { Wrapper } from "./ProductDetails.styled";
import { useDispatch } from "react-redux";
import { updateSidebar } from "../../store/slices/main";
import ProductForm from "../../components/custom/Product/ProductForm/ProductForm";
import ProductDetailsTab from "../../components/custom/Product/ProdcutDetailsTab/ProdcutDetailsTab";
// import { productArray, productColor, productIcon } from "../../const";
import { TabView, TabPanel } from "primereact/tabview";
import FeatureTable from "../../components/custom/Feature/FeatureTable/FeatureTable";
import TimelineData from "../../components/custom/tenant/TimelineData/TimelineData";

const ProductDetails = () => {
  const [confirm, setConfirm] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [productData, setProductData] = useState();
  const [visible, setVisible] = useState(false);

  // const { getProduct, deleteProductReq } = useRequest();
  const { DataTransform } = useGlobal();
  const routeParams = useParams();
  const { editProductProduct } = useRequest();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const chagneProduct = async (actionStatus) => {
    await editProductProduct({
      ProductId: productData.data.id,
      // product: actionStatus,
    });
    dispatch(updateSidebar());
  };

  const deleteConfirm = (id) => {
    setCurrentId(id);
    setConfirm(true);
  };
  const deleteProduct = async () => {
    // await deleteProductReq({ id: currentId });
    navigate(`/Product`);
  };

  useEffect(() => {
    (async () => {
      // const productData = await getProduct(routeParams.id);
      // // setAction(productData.data.data.actions);
      // setProductData(productData.data);
      setProductData({
        data: {
          id: "c12bd0e3-5127-480b-9b46-ace7285ab4df",
          name: "qwero",
          url: "qwerqwr",
          clientId: {
            id: "88e67328-3b20-413e-b6e1-010b48fa7bc9",
            name: "osos",
          },
          status: 1,
          createdDate: "2023-06-13T07:22:43",
          editedDate: "2023-06-13T07:32:04",
        },
      });
    })();
  }, [visible, routeParams.id]);

  return (
    <Wrapper>
      <BreadcrumbComponent
        title={productData && productData.data.name}
        parent={"Product"}
        child={productData && productData.data.name}
        icon={BsBoxSeam}
      />
      <div className="mainContainer">
        <div className="card mb-5">
          <TabView>
            <TabPanel header="Details">
              <ProductDetailsTab />
            </TabPanel>
            <TabPanel header="Features">
              <FeatureTable />
            </TabPanel>
            <TabPanel header="Plans">
              <p className="m-0">Plans</p>
            </TabPanel>
          </TabView>
        </div>
      </div>
    </Wrapper>
  );
};
export default ProductDetails;
