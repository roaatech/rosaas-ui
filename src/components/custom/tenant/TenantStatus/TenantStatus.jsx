import React from "react";
import { Tag } from "primereact/tag";
import { useState } from "react";
import useRequest from "../../../../axios/apis/useRequest";
import { Button } from "primereact/button";
import { Wrapper } from "./TenantStatus.styled";
const TenantStatus = ({ rowData, setFirst }) => {
  const [status, setStatus] = useState(rowData.status);
  const { editTenantStatus } = useRequest();

  const chagneStatus = async () => {
    await editTenantStatus({
      isActive: status === 1 ? false : true,
      id: rowData.id,
    });
    setStatus(status === 1 ? 2 : 1);
  };

  return (
    <Wrapper status={status}>
      <Tag value={status == 1 ? "Active" : "Inactive"} onClick={chagneStatus} />
    </Wrapper>
  );
};

export default TenantStatus;
