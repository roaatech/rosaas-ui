import React, { useEffect } from "react";
import { Tag } from "primereact/tag";
import { useState } from "react";
import useRequest from "../../../../axios/apis/useRequest";
import { Button } from "primereact/button";
import { Wrapper } from "./TenantStatus.styled";
import { updateSidebar } from "../../../../store/slices/main";
import { useDispatch } from "react-redux";
import { statusArray, statusColor, statusOpacity } from "../../../../const";
const TenantStatus = ({ statusValue }) => {
  const [status, setStatus] = useState();

  useEffect(() => {
    setStatus(statusValue - 1);
  }, [statusValue]);

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
