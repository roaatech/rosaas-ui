import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Table } from "@themesberg/react-bootstrap";

import useGlobal from "../../../../lib/hocks/global";
import { Button } from "primereact/button";
import DeleteConfirmation from "../../global/DeleteConfirmation/DeleteConfirmation";
import useRequest from "../../../../axios/apis/useRequest";

import { Wrapper } from "./ProdcutDetailsTab.styled";
import ProductForm from "../ProductForm/ProductForm";
import UrlItemList from "../../../../components/custom/Product/UrlItemList/UrlItemList";
import ThemeDialog from "../../Shared/ThemeDialog/ThemeDialog";

const ProductDetailsTab = ({ data }) => {
  const [confirm, setConfirm] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [productData, setProductData] = useState();
  const [visible, setVisible] = useState(false);

  const { deleteProductReq } = useRequest();
  const { DataTransform } = useGlobal();
  const routeParams = useParams();
  const navigate = useNavigate();

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
      setProductData(data);
    })();
  }, [visible, routeParams.id]);

  return (
    <Wrapper>
      {productData && (
        <div className="main">
          <div className="details">
            <Card border="light" className="shadow-sm mb-4">
              <Card.Body className="pb-0">
                <Table
                  responsive
                  className="table-centered table-nowrap rounded mb-0">
                  <tbody>
                    <tr>
                      <td className="fw-bold">Name</td>
                      <td>{productData.name}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Url</td>
                      <td>{productData.url}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Client</td>
                      <td>{productData.client.name}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Created Date</td>
                      <td>{DataTransform(productData.createdDate)}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Last Updated Date</td>
                      <td>{DataTransform(productData.editedDate)}</td>
                    </tr>
                    <UrlItemList data={productData} />
                  </tbody>
                </Table>
              </Card.Body>
            </Card>

            <div className="action">
              <Button
                className="mr-3"
                label="Delete"
                icon="pi pi-trash"
                onClick={() => deleteConfirm(productData.id)}
                style={{
                  backgroundColor: "var(--red)",
                  borderColor: "var(--red)",
                }}
              />
              <Button
                className="mr-3"
                label="Edit"
                icon="pi pi-pencil"
                onClick={() => setVisible(true)}
                style={{
                  backgroundColor: "var(--themeColor)",
                  borderColor: "var(--themeColor)",
                }}
              />
            </div>
            <DeleteConfirmation
              message="Do you want to delete this Product?"
              icon="pi pi-exclamation-triangle"
              confirm={confirm}
              setConfirm={setConfirm}
              confirmFunction={deleteProduct}
              sideBar={false}
            />

            <ThemeDialog visible={visible} setVisible={setVisible}>
              <ProductForm
                type={"edit"}
                visible={visible}
                productData={productData}
                setVisible={setVisible}
                popupLabel={"Edit Product"}
              />
            </ThemeDialog>
          </div>
        </div>
      )}
    </Wrapper>
  );
};
export default ProductDetailsTab;
