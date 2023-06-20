import React, { useEffect } from "react";
import { Tag } from "primereact/tag";
import { useState } from "react";
import useRequest from "../../../../axios/apis/useRequest";
import { Button } from "primereact/button";
import { Wrapper } from "./TenantStatus.styled";
import { updateSidebar } from "../../../../store/slices/main";
import { useDispatch } from "react-redux";
import { statusArray, statusColor, statusOpacity } from "../../../../const";
const TenantStatus = ({ rowData }) => {
  const [status, setStatus] = useState();

  useEffect(() => {
    setStatus(rowData.status - 1);
  }, [rowData.status]);

  return (
    <Wrapper>
      <span
        className="label"
        style={{
          color: statusColor[status],
          background: statusColor[status] + statusOpacity[status],
        }}>
        {statusArray[status]}
      </span>
    </Wrapper>
  );
};

export default TenantStatus;
