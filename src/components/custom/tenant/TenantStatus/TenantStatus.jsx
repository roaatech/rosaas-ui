import React from "react";
import { Tag } from "primereact/tag";
import { useState } from "react";
import useRequest from "../../../../axios/apis/useRequest";
import { Button } from "primereact/button";
const TenantStatus = ({ rowData }) => {
  const [status, setStatus] = useState(rowData.status);
  const { editTenantStatus } = useRequest();

  const chagneStatus = async () => {
    // await editTenantStatus({
    //   isActive: status === 1 ? false : true,
    //   id: rowData.id,
    // });
    setStatus(status === 1 ? 2 : 1);
  };

  const getSeverity = (value) => {
    switch (value) {
      case 1:
        return "success";

      case 2:
        return "danger";

      default:
        return null;
    }
  };

  return (
    // <Button
    //   onClick={chagneStatus}
    //   style={{ cursor: "pointer", width: "70px" }}
    //   severity={getSeverity(status)}>
    //   {status == 1 ? "Active" : "Inactive"}
    // </Button>
    <Button
      size="small"
      style={{ width: "100px" }}
      label={status == 1 ? "Active" : "Inactive"}
      severity={getSeverity(status)}
      raised
      onClick={chagneStatus}
    />
  );
};

export default TenantStatus;
