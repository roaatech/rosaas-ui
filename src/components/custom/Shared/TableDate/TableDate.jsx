import React from "react";
import { Wrapper } from "./TableDate.styled";
import useGlobal from "../../../../lib/hocks/global";
import { OverlayTrigger, Tooltip } from "@themesberg/react-bootstrap";

const TableDate = ({
  createdDate = "10/18/200, 11:42AM",
  editedDate = "10/18/200, 11:42AM",
}) => {
  const { DataTransform } = useGlobal();

  return (
    <Wrapper>
      <OverlayTrigger
        trigger={["hover", "focus"]}
        overlay={
          <Tooltip>
            <div>Last Update At {DataTransform(editedDate)}</div>
            <div>Created At {DataTransform(createdDate)}</div>
          </Tooltip>
        }>
        <span> {DataTransform(createdDate)}</span>
      </OverlayTrigger>
    </Wrapper>
  );
};

export default TableDate;
