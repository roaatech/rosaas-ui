import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Table } from "@themesberg/react-bootstrap";
import BreadcrumbComponent from "../../components/custom/Shared/Breadcrumb/Breadcrumb";
// import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import { BsFillPersonLinesFill } from "react-icons/bs";

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
import TimelineData from "../../components/custom/tenant/TimelineData/TimelineData";
import { statusArray, statusColor, statusIcon } from "../../const";

const TenantDetails = () => {
  const [confirm, setConfirm] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [tenantData, setTenantData] = useState();
  const [visible, setVisible] = useState(false);
  const [action, setAction] = useState([
    {
      name: "name1",
      status: 1,
    },
    {
      name: "name2",
      status: 3,
    },
    {
      name: "name3",
      status: 5,
    },
    {
      name: "name3",
      status: 8,
    },
  ]);
  const { getTenant, deleteTenantReq } = useRequest();
  const { DataTransform } = useGlobal();
  const routeParams = useParams();
  const { editTenantStatus } = useRequest();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const chagneStatus = async (actionStatus) => {
    await editTenantStatus({
      TenantId: tenantData.data.id,
      // status: actionStatus,
    });
    dispatch(updateSidebar());
  };

  const deleteConfirm = (id) => {
    setCurrentId(id);
    setConfirm(true);
  };
  const deleteTenant = async () => {
    await deleteTenantReq({ id: currentId });
    navigate(`/welcome`);
  };

  useEffect(() => {
    (async () => {
      const tenantData = await getTenant(routeParams.id);
      // setAction(tenantData.data.data.actions);
      setTenantData(tenantData.data);
    })();
  }, [visible, routeParams.id]);

  return (
    <Wrapper>
      <BreadcrumbComponent
        title={tenantData && tenantData.data.title}
        parent={"Tenant"}
        description={"Tenant details"}
        child={tenantData && tenantData.data.title}
        icon={BsFillPersonLinesFill}
      />
      {tenantData && (
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
                          rowData={tenantData.data}
                          statusArray={statusArray}
                          statusColor={statusColor}
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
                    icon={`pi ${statusIcon[Math.floor((item.status - 1) / 2)]}`}
                    style={{
                      backgroundColor:
                        statusColor[Math.floor((item.status - 1) / 2)],
                      borderColor:
                        statusColor[Math.floor((item.status - 1) / 2)],
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
              />
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
export default TenantDetails;
