import React, { useEffect } from "react";
import { Tag } from "primereact/tag";
import { useState } from "react";
import useRequest from "../../../../axios/apis/useRequest";
import { Button } from "primereact/button";
import { Wrapper } from "./TenantStatus.styled";
import { updateSidebar } from "../../../../store/slices/main";
import { useDispatch } from "react-redux";
import { statusArray, statusColor } from "../../../../const";
const TenantStatus = ({ rowData, setFirst }) => {
  const [status, setStatus] = useState(5);

  useEffect(() => {
    // setStatus(rowData.status - 1);
  }, [rowData.status]);

  return (
    <Wrapper>
      <span
        className="label"
        style={{
          color: statusColor[Math.floor(status / 2)],
          background:
            statusColor[Math.floor(status / 2)] +
            (status % 2 > 0 ? "35" : "15"),
        }}>
        {statusArray[status]}
      </span>
    </Wrapper>
  );
};

export default TenantStatus;
