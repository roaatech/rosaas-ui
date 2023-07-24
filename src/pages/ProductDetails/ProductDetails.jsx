import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import TableHead from "../../components/custom/Shared/TableHead/TableHead";
import BreadcrumbComponent from "../../components/custom/Shared/Breadcrumb/Breadcrumb";
import { BsBoxSeam } from "react-icons/bs";
import useRequest from "../../axios/apis/useRequest";
import { Wrapper } from "./ProductDetails.styled";
import ProductDetailsTab from "../../components/custom/Product/ProdcutDetailsTab/ProdcutDetailsTab";
import ProductTenantsList from "../../components/custom/Product/ProductTenantsList/ProductTenantsList";
import { TabView, TabPanel } from "primereact/tabview";
import { useDispatch, useSelector } from "react-redux";
import { productInfo } from "../../store/slices/products";

const ProductDetails = () => {
  const routeParams = useParams();
  const listData = useSelector((state) => state.products.products);
  let productData = listData[routeParams.id];
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();

  const { getProduct, deleteProductReq } = useRequest();

  useEffect(() => {
    (async () => {
      const productData = await getProduct(routeParams.id);
      dispatch(productInfo(productData.data.data));
    })();
  }, [visible, routeParams.id]);

  return (
    <Wrapper>
      {productData && (
        <BreadcrumbComponent
          breadcrumbInfo={"ProductDetails"}
          param1={productData.id}
          icon={BsBoxSeam}
        />
      )}

      {productData && (
        <div className="main-container">
          <TableHead
            label={"Product Details"}
            name={productData.name}
            active={false}
          />
          <TabView className="card">
            <TabPanel header="Details">
              <ProductDetailsTab data={productData} />
            </TabPanel>

            <TabPanel header="Subscriptions">
              <ProductTenantsList
                productId={productData.id}
                productName={productData.name}
              />
            </TabPanel>
          </TabView>
        </div>
      )}
    </Wrapper>
  );
};
export default ProductDetails;
