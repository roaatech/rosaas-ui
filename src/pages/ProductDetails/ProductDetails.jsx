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
import Urls from "../../components/custom/Product/Urls/Urls";

const ProductDetails = () => {
  const [confirm, setConfirm] = useState(false);
  const [productData, setProductData] = useState();
  const [visible, setVisible] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [featureData, setFeatureData] = useState();

  const { getProduct, deleteProductReq } = useRequest();
  const { DataTransform } = useGlobal();
  const routeParams = useParams();
  const { editProductProduct, getTenantList } = useRequest();
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
    await deleteProductReq({ id: currentId });
    navigate(`/Product`);
  };

  useEffect(() => {
    (async () => {
      // const featureDataReq = await getTenantList(
      //   `?page=1&pageSize=10&filters[0].Field=SearchTerm`
      // );
      // setFeatureData(featureDataReq);
      // console.log(featureDataReq, "0000000000");
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const productData = await getProduct(routeParams.id);
      // setAction(productData.data.data.actions);
      setProductData(productData.data);
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
      {productData && (
        <div className="mainContainer">
          <div className="card mb-5">
            <TabView>
              <TabPanel header="Details">
                <ProductDetailsTab data={productData} />
              </TabPanel>
              {/* <TabPanel header="Features">
              <FeatureTable data={featureData} />
            </TabPanel>
            <TabPanel header="Plans">
              <p className="m-0">Plans</p>
            </TabPanel> */}
              <TabPanel header="Urls">
                <Urls data={productData.data} />
              </TabPanel>
            </TabView>
          </div>
        </div>
      )}
    </Wrapper>
  );
};
export default ProductDetails;
