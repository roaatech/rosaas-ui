import React from "react";
import { Wrapper } from "./TenantStatus.styled";
import { statusConst } from "../../../../const";
const TenantStatus = ({ statusValue }) => {
  return (
    <Wrapper>
      <span
        className="label"
        style={{
          color: statusConst[statusValue].color,
          background:
            statusConst[statusValue].color + statusConst[statusValue].opacity,
        }}>
        {statusConst[statusValue].string}
      </span>
    </Wrapper>
  );
};

export default TenantStatus;
