import React, { useState } from "react";
import { Wrapper } from "./TableDate.styled";
import useGlobal from "../../../../lib/hocks/global";
import { MdUpdate } from "react-icons/md";

const TableDate = ({
  createdDate = "10/18/200, 11:42AM",
  editedDate = "10/18/200, 11:42AM",
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const { DataTransform } = useGlobal();
  const handleHover = () => {
    setMenuVisible(true);
  };

  const handleLeave = () => {
    setMenuVisible(false);
  };

  return (
    <Wrapper onMouseLeave={handleLeave}>
      <div onMouseEnter={handleHover}>
        {!menuVisible ? (
          `${DataTransform(editedDate)}`
        ) : (
          <MdUpdate />
        )}
      </div>
      {menuVisible && (
        <div className="dateCont">
          <div>Last Update At {DataTransform(editedDate)}</div>
          <div>Created At {DataTransform(createdDate)}</div>
        </div>
      )}
    </Wrapper>
  );
};

export default TableDate;
