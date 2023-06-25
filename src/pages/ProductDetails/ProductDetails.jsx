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
      <div className="card mb-5">
        <TabView>
          <TabPanel header="Details">
            <ProductDetailsTab />
          </TabPanel>
          <TabPanel header="Feature">
            <FeatureTable />
          </TabPanel>
          <TabPanel header="Plan">
            <p className="m-0">
              At vero eos et accusamus et iusto odio dignissimos ducimus qui
              blanditiis praesentium voluptatum deleniti atque corrupti quos
              dolores et quas molestias excepturi sint occaecati cupiditate non
              provident, similique sunt in culpa qui officia deserunt mollitia
              animi, id est laborum et dolorum fuga. Et harum quidem rerum
              facilis est et expedita distinctio. Nam libero tempore, cum soluta
              nobis est eligendi optio cumque nihil impedit quo minus.
            </p>
          </TabPanel>
          <TabPanel header="Test">
            <div className="moreTsec">
              <ProductDetailsTab />

              <div className="timeLine">
                <div className="sc-eErDDp jraFy">
                  <div className="timeLineCont">
                    <div className="timeLineItemCont">
                      <div className="author">External System</div>
                      <div className="info">
                        <div className="action">
                          <span className="sc-bXxmBy bJUTwo">
                            <span
                              className="label"
                              // style="color: rgb(0, 166, 117); background: rgba(0, 166, 117, 0.208);"
                            >
                              Created As Active
                            </span>
                          </span>
                        </div>
                        <div className="time">6/21/2023, 3:12:51 PM</div>
                      </div>
                      <div className="message">
                        The external system created the tenant resources
                      </div>
                    </div>
                    <div className="timeLineItemCont">
                      <div className="author">Super Admin</div>
                      <div className="info">
                        <div className="action">
                          <span className="sc-bXxmBy bJUTwo">
                            <span
                              className="label"
                              // style="color: rgb(21, 93, 215); background: rgba(21, 93, 215, 0.082);"
                            >
                              Creating
                            </span>
                          </span>
                        </div>
                        <div className="time">6/21/2023, 3:11:24 PM</div>
                      </div>
                      <div className="message">
                        The external system is creating the tenant resources
                      </div>
                    </div>
                    <div className="timeLineItemCont">
                      <div className="author">Super Admin</div>
                      <div className="info">
                        <div className="action">
                          <span className="sc-bXxmBy bJUTwo">
                            <span
                              className="label"
                              // style={
                              //   "color: rgb(21, 93, 215); background: rgba(21, 93, 215, 0.063);"
                              // }
                            >
                              Pre-Creating
                            </span>
                          </span>
                        </div>
                        <div className="time">6/21/2023, 3:11:24 PM</div>
                      </div>
                      <div className="message">
                        ROSAS - Super Admin called the external system to create
                        the tenant resources for it
                      </div>
                    </div>
                    <div className="timeLineItemCont">
                      <div className="author">Super Admin</div>
                      <div className="info">
                        <div className="action">
                          <span className="sc-bXxmBy bJUTwo">
                            <span
                              className="label"
                              // style="color: rgb(21, 93, 215); background: rgba(21, 93, 215, 0.208);"
                            >
                              Created in db
                            </span>
                          </span>
                        </div>
                        <div className="time">6/21/2023, 3:11:24 PM</div>
                      </div>
                      <div className="message">
                        ROSAS - Super Admin created a tenant record in ROSAS's
                        database
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
          <TabPanel header="Test">
            <div className="moreTsec">
              <ProductDetailsTab />

              <div className="timeLine">
                <div className="sc-eErDDp jraFy">
                  <div className="timeLineCont">
                    <div className="timeLineItemCont">
                      <div className="author">External System</div>
                      <div className="info">
                        <div className="action">
                          <span className="sc-bXxmBy bJUTwo">
                            <span
                              className="label"
                              // style="color: rgb(0, 166, 117); background: rgba(0, 166, 117, 0.208);"
                            >
                              Created As Active
                            </span>
                          </span>
                        </div>
                        <div className="time">6/21/2023, 3:12:51 PM</div>
                      </div>
                      <div className="message">
                        The external system created the tenant resources
                      </div>
                    </div>
                    <div className="timeLineItemCont">
                      <div className="author">Super Admin</div>
                      <div className="info">
                        <div className="action">
                          <span className="sc-bXxmBy bJUTwo">
                            <span
                              className="label"
                              // style="color: rgb(21, 93, 215); background: rgba(21, 93, 215, 0.082);"
                            >
                              Creating
                            </span>
                          </span>
                        </div>
                        <div className="time">6/21/2023, 3:11:24 PM</div>
                      </div>
                      <div className="message">
                        The external system is creating the tenant resources
                      </div>
                    </div>
                    <div className="timeLineItemCont">
                      <div className="author">Super Admin</div>
                      <div className="info">
                        <div className="action">
                          <span className="sc-bXxmBy bJUTwo">
                            <span
                              className="label"
                              // style={
                              //   "color: rgb(21, 93, 215); background: rgba(21, 93, 215, 0.063);"
                              // }
                            >
                              Pre-Creating
                            </span>
                          </span>
                        </div>
                        <div className="time">6/21/2023, 3:11:24 PM</div>
                      </div>
                      <div className="message">
                        ROSAS - Super Admin called the external system to create
                        the tenant resources for it
                      </div>
                    </div>
                    <div className="timeLineItemCont">
                      <div className="author">Super Admin</div>
                      <div className="info">
                        <div className="action">
                          <span className="sc-bXxmBy bJUTwo">
                            <span
                              className="label"
                              // style="color: rgb(21, 93, 215); background: rgba(21, 93, 215, 0.208);"
                            >
                              Created in db
                            </span>
                          </span>
                        </div>
                        <div className="time">6/21/2023, 3:11:24 PM</div>
                      </div>
                      <div className="message">
                        ROSAS - Super Admin created a tenant record in ROSAS's
                        database
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="timeLine">
                <div className="sc-eErDDp jraFy">
                  <div className="timeLineCont">
                    <div className="timeLineItemCont">
                      <div className="author">External System</div>
                      <div className="info">
                        <div className="action">
                          <span className="sc-bXxmBy bJUTwo">
                            <span
                              className="label"
                              // style="color: rgb(0, 166, 117); background: rgba(0, 166, 117, 0.208);"
                            >
                              Created As Active
                            </span>
                          </span>
                        </div>
                        <div className="time">6/21/2023, 3:12:51 PM</div>
                      </div>
                      <div className="message">
                        The external system created the tenant resources
                      </div>
                    </div>
                    <div className="timeLineItemCont">
                      <div className="author">Super Admin</div>
                      <div className="info">
                        <div className="action">
                          <span className="sc-bXxmBy bJUTwo">
                            <span
                              className="label"
                              // style="color: rgb(21, 93, 215); background: rgba(21, 93, 215, 0.082);"
                            >
                              Creating
                            </span>
                          </span>
                        </div>
                        <div className="time">6/21/2023, 3:11:24 PM</div>
                      </div>
                      <div className="message">
                        The external system is creating the tenant resources
                      </div>
                    </div>
                    <div className="timeLineItemCont">
                      <div className="author">Super Admin</div>
                      <div className="info">
                        <div className="action">
                          <span className="sc-bXxmBy bJUTwo">
                            <span
                              className="label"
                              // style={
                              //   "color: rgb(21, 93, 215); background: rgba(21, 93, 215, 0.063);"
                              // }
                            >
                              Pre-Creating
                            </span>
                          </span>
                        </div>
                        <div className="time">6/21/2023, 3:11:24 PM</div>
                      </div>
                      <div className="message">
                        ROSAS - Super Admin called the external system to create
                        the tenant resources for it
                      </div>
                    </div>
                    <div className="timeLineItemCont">
                      <div className="author">Super Admin</div>
                      <div className="info">
                        <div className="action">
                          <span className="sc-bXxmBy bJUTwo">
                            <span
                              className="label"
                              // style="color: rgb(21, 93, 215); background: rgba(21, 93, 215, 0.208);"
                            >
                              Created in db
                            </span>
                          </span>
                        </div>
                        <div className="time">6/21/2023, 3:11:24 PM</div>
                      </div>
                      <div className="message">
                        ROSAS - Super Admin created a tenant record in ROSAS's
                        database
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
        </TabView>
      </div>
    </Wrapper>
  );
};
export default ProductDetails;
