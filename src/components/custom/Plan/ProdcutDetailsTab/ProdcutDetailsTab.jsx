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
import { useDispatch } from "react-redux";

const ProductDetailsTab = () => {
  const [confirm, setConfirm] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [productData, setProductData] = useState();
  const [visible, setVisible] = useState(false);

  const { getProduct, deleteProductReq } = useRequest();
  const { DataTransform } = useGlobal();
  const routeParams = useParams();
  const { editProductProduct } = useRequest();
  const dispatch = useDispatch();
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
      const productDataReq = await getProduct(routeParams.id);
      setProductData(productDataReq.data);
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
                      <td>{productData.data.name}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Url</td>
                      <td>{productData.data.defaultHealthCheckUrl}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Client</td>
                      <td>{productData.data.client.name}</td>
                    </tr>

                    <tr>
                      <td className="fw-bold">Created Date</td>
                      <td>{DataTransform(productData.data.createdDate)}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Last Updated Date</td>
                      <td>{DataTransform(productData.data.editedDate)}</td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>

            <div className="action">
              <Button
                className="mr-4"
                label="Delete"
                icon="pi pi-trash"
                onClick={() => deleteConfirm(productData.data.id)}
                style={{
                  backgroundColor: "var(--red)",
                  borderColor: "var(--red)",
                }}
              />
              <Button
                className="mr-4"
                label="Edit"
                icon="pi pi-pencil"
                onClick={() => setVisible(true)}
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
          </div>
        </div>
      )}
    </Wrapper>
  );
};
export default ProductDetailsTab;
