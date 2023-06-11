import React, { useEffect } from "react";
import { Tag } from "primereact/tag";
import { useState } from "react";
import useRequest from "../../../../axios/apis/useRequest";
import { Button } from "primereact/button";
import { Wrapper } from "./TenantStatus.styled";
import { updateSidebar } from "../../../../store/slices/main";
import { useDispatch } from "react-redux";
const TenantStatus = ({ rowData, setFirst }) => {
  const [status, setStatus] = useState();
  const { editTenantStatus } = useRequest();
  const dispatch = useDispatch();
  const chagneStatus = async (statusX) => {
    console.log(statusX, "statusX");
    await editTenantStatus({
      isActive: statusX === 1 ? false : true,
      id: rowData.id,
    });
    setStatus(statusX === 1 ? 2 : 1);
    dispatch(updateSidebar());
  };

  useEffect(() => {
    setStatus(rowData.status);
  }, [rowData.status]);

  return (
    <Wrapper status={status}>
      <Tag
        value={status == 1 ? "Active" : "Inactive"}
        onClick={() => chagneStatus(status)}
      />
    </Wrapper>
  );
};

export default TenantStatus;
