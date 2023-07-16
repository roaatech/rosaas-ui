import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Table } from "@themesberg/react-bootstrap";
import BreadcrumbComponent from "../../components/custom/Shared/Breadcrumb/Breadcrumb";
// import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { FiRefreshCw } from "react-icons/fi";
import { TabView, TabPanel } from "primereact/tabview";
import ChildTable from "../../components/custom/tenant/ChildTable/ChildTable";
import TenantStatus from "../../components/custom/tenant/TenantStatus/TenantStatus";
import useGlobal from "../../lib/hocks/global";
import { Button } from "primereact/button";
import DeleteConfirmation from "../../components/custom/global/DeleteConfirmation/DeleteConfirmation";
import useRequest from "../../axios/apis/useRequest";
import { Dialog } from "primereact/dialog";
import TenantForm from "../../components/custom/tenant/TenantForm/TenantForm";
import { Wrapper } from "./TenantDetails.styled";
import { useDispatch } from "react-redux";
import { updateSidebar } from "../../store/slices/main";
import { statusConst } from "../../const";
import { Tooltip } from "bootstrap";
import Actions from "../../components/custom/tenant/Actions/Actions"; 
import TableHead from "../../components/custom/Shared/TableHead/TableHead";

const TenantDetails = () => {
  const [confirm, setConfirm] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [tenantData, setTenantData] = useState();
  const [updateDetails, setUpdateDetails] = useState(0);
  const [visible, setVisible] = useState(false);
  const [action, setAction] = useState();
  const [tenantStatus, setTenantStatus] = useState();

  const { DataTransform } = useGlobal();

  const { getTenant, deleteTenantReq, editTenantStatus } = useRequest();
  const routeParams = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const chagneStatus = async (actionStatus) => {
    await editTenantStatus({
      TenantId: tenantData.data.id,
      status: actionStatus,
    });
    setUpdateDetails(updateDetails + 1);
    dispatch(updateSidebar());
  };

  const deleteConfirm = (id) => {
    setCurrentId(id);
    setConfirm(true);
  };
  const deleteTenant = async () => {
    await deleteTenantReq({ id: currentId });
    navigate(`/Dashboard`);
  };

  useEffect(() => {
    (async () => {
      const tenantData = await getTenant(routeParams.id);
      setAction(tenantData.data.data.actions);
      setTenantData(tenantData.data);
      setTenantStatus(
        tenantData.data.data.products
          .flatMap((item) => item.actions.map((action) => action))
          .filter(
            (obj, index, self) =>
              self.findIndex((o) => o.status === obj.status) === index
          )
      );
    })();
  }, [visible, routeParams.id, updateDetails]);

  return (
    <Wrapper>  
   {tenantData &&  <BreadcrumbComponent
        breadcrumbInfo= {"TenantDetails" } 
        param1={tenantData.data.id}
        icon={BsFillPersonLinesFill}
      />}
      
      <div className="main-container">
      {tenantData &&  <TableHead 
         label={"Tenant Details"}   
        name={tenantData.data.uniqueName}  
        active={false}
        />}
        
        {tenantData && (
          <div className="pageWrapper">
            <div className="tableSec">
              <div className="main">
                <div className="details">
                  <TabView>
                    <TabPanel header="Details">
                      <Card border="light" className="shadow-sm border-0">
                        <Card.Body className="p-0">
                          <Table
                            responsive
                            className="table-centered table-nowrap rounded mb-0">
                            <tbody>
                              <tr>
                                <td className="fw-bold">Title</td>
                                <td>{tenantData.data.title}</td>
                              </tr>
                              <tr>
                                <td className="fw-bold">Unique Name</td>
                                <td>{tenantData.data.uniqueName}</td>
                              </tr>
                              <tr>
                                <td className="fw-bold">Products</td>
                                <td>
                                  {tenantData.data.products.map(
                                    (product, index) => (
                                      <span
                                        key={index}
                                        className="p-1 border-round border-1 border-400 me-2">
                                        {product.name}
                                      </span>
                                    )
                                  )}
                                </td>
                              </tr>
                              {/* <tr>
                                <td className="fw-bold">status</td>
                                <td>
                                  <TenantStatus
                                    statusValue={tenantData.data.status}
                                  />
                                </td>
                              </tr> */}
                              <tr>
                                <td className="fw-bold">Created Date</td>
                                <td>
                                  {DataTransform(tenantData.data.createdDate)}
                                </td>
                              </tr>
                              <tr>
                                <td className="fw-bold">Last Updated Date</td>
                                <td>
                                  {DataTransform(tenantData.data.editedDate)}
                                </td>
                              </tr>
                            </tbody>
                          </Table>
                        </Card.Body>
                      </Card>
                      <div className="buttons">
                        <div className="action">
                          {tenantStatus && tenantStatus[0]?.status != 13 ? (
                            <Button
                              className="mr-3"
                              label="Edit"
                              icon="pi pi-pencil"
                              onClick={() => setVisible(true)}
                              style={{
                                backgroundColor: "var(--primaryColor)",
                                borderColor: "var(--primaryColor)",
                              }}
                            />
                          ) : null}

                          <Actions
                            tenantData={tenantData}
                            actions={tenantStatus}
                            deleteConfirm={deleteConfirm}
                            chagneStatus={chagneStatus}
                          />
                        </div>
                      </div>
                    </TabPanel>
                    {tenantData.data.products.map((product, index) => (
                      <TabPanel header={product.name.toUpperCase()} key={index}>
                        {console.log(product)}
                        <ChildTable
                          tenantDetails={tenantData.data}
                          tenantId={tenantData.data.id}
                          productData={product}
                        />
                      </TabPanel>
                    ))}
                  </TabView>

                  <DeleteConfirmation
                    message="Do you want to delete this Tenant?"
                    icon="pi pi-exclamation-triangle"
                    confirm={confirm}
                    setConfirm={setConfirm}
                    confirmFunction={deleteTenant}
                    sideBar={true}
                  />
                  <Dialog
                    header={"Edit Tenant"}
                    visible={visible}
                    style={{ width: "30vw", minWidth: "300px" }}
                    onHide={() => setVisible(false)}>
                    <TenantForm
                      type={"edit"}
                      tenantData={tenantData?.data}
                      setVisible={setVisible}
                      sideBar={true}
                    />
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Wrapper>
  );
};
export default TenantDetails;
