import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Table } from "@themesberg/react-bootstrap";
import BreadcrumbComponent from "../../components/custom/Shared/Breadcrumb/Breadcrumb";
import { BsFillPersonLinesFill } from "react-icons/bs";

// import ProductProduct from "../../components/custom/product/ProductProduct/ProductProduct";
import useGlobal from "../../lib/hocks/global";
import { Button } from "primereact/button";
import DeleteConfirmation from "../../components/custom/global/DeleteConfirmation/DeleteConfirmation";
import useRequest from "../../axios/apis/useRequest";
import { Dialog } from "primereact/dialog";
// import ProductForm from "../../components/custom/product/ProductForm/ProductForm";
import { Wrapper } from "./ProductDetails.styled";
import { useDispatch } from "react-redux";
import { updateSidebar } from "../../store/slices/main";
// import { productArray, productColor, productIcon } from "../../const";

const ProductDetails = () => {
  const [confirm, setConfirm] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [productData, setProductData] = useState();
  const [visible, setVisible] = useState(false);
  const [action, setAction] = useState([
    {
      name: "name1",
      product: 1,
    },
    {
      name: "name2",
      product: 3,
    },
    {
      name: "name3",
      product: 5,
    },
    {
      name: "name3",
      product: 8,
    },
  ]);
  // const { getProduct, deleteProductReq } = useRequest();
  const { DataTransform } = useGlobal();
  const routeParams = useParams();
  const { editProductProduct } = useRequest();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const chagneProduct = async (actionProduct) => {
    await editProductProduct({
      ProductId: productData.data.id,
      // product: actionProduct,
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
    })();
  }, [visible, routeParams.id]);

  return (
    <Wrapper>
      <BreadcrumbComponent
        title={productData && productData.data.title}
        parent={"Product"}
        description={"Product details"}
        child={productData && productData.data.title}
        icon={BsFillPersonLinesFill}
      />
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
                      <td className="fw-bold">Title</td>
                      <td>{productData.data.title}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Unique Name</td>
                      <td>{productData.data.uniqueName}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Products</td>
                      <td>
                        {productData.data.products.map((product) => (
                          <span className="p-1 border-round border-1 border-400 me-2">
                            {product.name}
                          </span>
                        ))}
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold">product</td>
                      {/* <td>
                        <ProductProduct
                          rowData={productData.data}
                          // productArray={productArray}
                          // productColor={productColor}
                        />
                      </td> */}
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
                className="mx-2"
                label="Delete"
                icon="pi pi-trash"
                onClick={() => deleteConfirm(productData.data.id)}
                style={{
                  backgroundColor: "var(--red)",
                  borderColor: "var(--red)",
                }}
              />
              <Button
                className="mx-2"
                label="Edit"
                icon="pi pi-pencil"
                onClick={() => setVisible(true)}
              />
              {action &&
                action.map((item) => (
                  <Button
                    className="mx-2"
                    label={item.name}
                    // icon={`pi ${productIcon[Math.floor((item.product - 1) / 2)]}`}
                    // style={{
                    //   backgroundColor:
                    //     productColor[Math.floor((item.product - 1) / 2)],
                    //   borderColor:
                    //     productColor[Math.floor((item.product - 1) / 2)],
                    // }}
                    onClick={() => chagneProduct(item.product)}
                  />
                ))}
            </div>
            <DeleteConfirmation
              message="Do you want to delete this Product?"
              icon="pi pi-exclamation-triangle"
              confirm={confirm}
              setConfirm={setConfirm}
              confirmFunction={deleteProduct}
            />

            <Dialog
              header={"Edit Product"}
              visible={visible}
              style={{ width: "30vw", minWidth: "300px" }}
              onHide={() => setVisible(false)}>
              {/* <ProductForm
                type={"edit"}
                productData={productData?.data}
                setVisible={setVisible}
              /> */}
            </Dialog>
          </div>
          {/* <div className="timeline">
            <TimelineData />
          </div> */}
        </div>
      )}
    </Wrapper>
  );
};
export default ProductDetails;
