import React, { useEffect } from "react";
import { Tag } from "primereact/tag";
import { useState } from "react";
import useRequest from "../../../../axios/apis/useRequest";
import { Button } from "primereact/button";
import { Wrapper } from "./ProductStatus.styled";
import { updateSidebar } from "../../../../store/slices/main";
import { useDispatch } from "react-redux";
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
