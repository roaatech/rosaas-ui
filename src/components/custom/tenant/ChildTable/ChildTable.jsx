import React, { useState, useEffect } from "react";

import { Card, Table } from "@themesberg/react-bootstrap";
import { Wrapper } from "./ChildTable.style";
import TenantStatus from "../TenantStatus/TenantStatus";
import AccordionComponent from "../../../AccordionComponent";
import Workflow from "../../../../components/custom/Shared/Workflow/Workflow"; 
import { Button } from "primereact/button";
import { updateSidebar } from "../../../../store/slices/main";
import { FiRefreshCw } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { statusConst } from "../../../../const";
import useRequest from "../../../../axios/apis/useRequest";

export default function ChildTable(tenantDetails) {
  const [action, setAction] = useState();
  const { editTenantStatus } = useRequest();
  const [updateDetails, setUpdateDetails] = useState(0);
  const dispatch = useDispatch();
  const chagneStatus = async (actionStatus) => {
    await editTenantStatus({
      TenantId: tenantDetails.id,
      status: actionStatus,
    });
    setUpdateDetails(updateDetails + 1);
    dispatch(updateSidebar());
  };

  const rowExpansionTemplate = (data) => {
    return (
      <div className="">
        <Card border="light" className="  border-0">
          <Card.Body className="p-0">
            <Table
              responsive
              className="table-centered table-nowrap rounded mb-0">
              <tbody>
                {Object.keys(data).map((item, index) => (
                  <tr key={index}>
                    <td className="fw-bold"> {item} :</td>
                    <td>{data[item]}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </div>
    );
  };

  const [products, setProducts] = useState([
    {
      eventKey: "metadata0",
      title: "Meta Data",
      description: rowExpansionTemplate({
        id: "1000-0",
        productCode: "f230fh0g3",
        date: "2020-09-13",
        amount: 65,
        quantity: 1,
        customer: "David James",
        status: "PENDING",
      }),
    },
  ]);

  return (
    <Wrapper>
      <div className="content-container">
        <div className="content-details">
          <Card border="light" className="shadow-sm border-0">
            <Card.Body className="p-0">
              <Table
                responsive
                className="table-centered table-nowrap rounded mb-0">
                <tbody>
                  <tr>
                    <td className="fw-bold">Status</td>
                    <td> <TenantStatus statusValue={10} /></td>
                  </tr>
                  <tr>
                    <td className="fw-bold">
                      Last Updated Date
                    </td>
                    <td>
                      7/9/2023, 6:50:37 PM
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
          <AccordionComponent defaultKey="metaData" data={products} />
          <div className="buttons">
                            <div className="action"> 
                              {action &&
                                action.map((item, index) => (
                                  <Button
                                    key={index}
                                    className="mr-3"
                                    label={item.name}
                                    icon={`pi ${statusConst[item.status].icon}`}
                                    style={{
                                      backgroundColor:
                                        statusConst[item.status].color,
                                      borderColor:
                                        statusConst[item.status].color,
                                    }}
                                    onClick={() => chagneStatus(item.status)}
                                  />
                                ))}
                            </div>

                            {tenantDetails.status != 13 ? (
                              <div className="refresh">
                                <Button
                                  onClick={() => {
                                    setUpdateDetails(updateDetails + 1);
                                    dispatch(updateSidebar());
                                  }}
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
                            ) : null}
                          </div> 
        </div>
        <div className="content timeLine">
          <Card border="light" className="shadow-sm">
            <Card.Header className="fs-6">
              History
            </Card.Header>
            <Card.Body className="pb-0">
              <Workflow updateDetails={updateDetails} />
            </Card.Body>
          </Card>
        </div>

      </div>
    </Wrapper>
  );
}
