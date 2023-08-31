import React, { useEffect } from "react";
import { useState } from "react";
import { Wrapper } from "./ProductStatus.styled";
import { statusConst } from "../../../../const";

const ProductStatus = ({ rowData, setFirst }) => {
  const [status, setStatus] = useState(2);

  useEffect(() => {}, [rowData.status]);

  return (
    <Wrapper>
      <span
        className="label"
        style={{
          color: statusConst[status].color,
          background: statusConst[status].color + statusConst[status].opacity,
        }}>
        {statusConst[status].string}
      </span>
    </Wrapper>
  );
};

export default ProductStatus;
