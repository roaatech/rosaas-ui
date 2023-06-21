import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Table } from "@themesberg/react-bootstrap";
import BreadcrumbComponent from "../../components/custom/Shared/Breadcrumb/Breadcrumb";
// import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { FiRefreshCw } from "react-icons/fi";

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
import { statusColor, statusIcon } from "../../const";
import Workflow from "../../components/custom/Shared/Workflow/Workflow";
import { Tooltip } from "bootstrap";

const TenantDetails = () => {
  const [confirm, setConfirm] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [tenantData, setTenantData] = useState();
  const [updateDetails, setUpdateDetails] = useState(0);
  const [visible, setVisible] = useState(false);
  const [action, setAction] = useState();

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
    })();
  }, [visible, routeParams.id, updateDetails]);

  return (
    <Wrapper>
      <BreadcrumbComponent
        title={tenantData && tenantData.data.title}
        parent={"Tenant"}
        description={"Tenant details"}
        child={tenantData && tenantData.data.title}
        icon={BsFillPersonLinesFill}
      />

      <div className="refresh">
        <Button
          type="button"
          icon={<FiRefreshCw />}
          tooltip="Refresh Data"
          tooltipOptions={{
            position: "left",
            mouseTrack: true,
            mouseTrackTop: 15,
          }}
        />
      </div>

      {tenantData && (
        <div className="pageWrapper">
          <div className="tableSec">
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
                          <td>{tenantData.data.title}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Unique Name</td>
                          <td>{tenantData.data.uniqueName}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Products</td>
                          <td>
                            {tenantData.data.products.map((product) => (
                              <span className="p-1 border-round border-1 border-400 me-2">
                                {product.name}
                              </span>
                            ))}
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-bold">status</td>
                          <td>
                            <TenantStatus
                              statusValue={tenantData.data.status}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Created Date</td>
                          <td>{DataTransform(tenantData.data.createdDate)}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Last Updated Date</td>
                          <td>{DataTransform(tenantData.data.editedDate)}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>

                <div className="action">
                  {tenantData.data.status == 13 ? (
                    <Button
                      className="mx-2"
                      label="Delete"
                      icon="pi pi-trash"
                      onClick={() => deleteConfirm(tenantData.data.id)}
                      style={{
                        backgroundColor: "var(--red)",
                        borderColor: "var(--red)",
                      }}
                    />
                  ) : null}
                  <Button
                    className="mx-2"
                    label="Edit"
                    icon="pi pi-pencil"
                    onClick={() => setVisible(true)}
                  />
                  {action &&
                    action.map((item, index) => (
                      <Button
                        key={index}
                        className="mx-2"
                        label={item.name}
                        icon={`pi ${statusIcon[item.status - 1]}`}
                        style={{
                          backgroundColor: statusColor[item.status - 1],
                          borderColor: statusColor[item.status - 1],
                        }}
                        onClick={() => chagneStatus(item.status)}
                      />
                    ))}
                </div>
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

          <div className="timeLine">
            <Workflow updateDetails={updateDetails} />
          </div>
        </div>
      )}
    </Wrapper>
  );
};
export default TenantDetails;
