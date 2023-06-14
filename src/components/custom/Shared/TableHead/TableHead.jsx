import React, { useState } from "react";
import { Wrapper } from "./TableHead.styled";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { BsSearch } from "react-icons/bs";
import { Dialog } from "primereact/dialog";

let x = 0;
const TableHead = ({
  label,
  icon,
  setSearchValue,
  children,
  setFirst,
  visibleHead,
  setVisibleHead,
  popupLabel,
}) => {
  // const [] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const changeValue = (e) => {
    setInputValue(e.target.value);
    const oldText = e.target.value;
    x++;
    const y = x;
    setTimeout(() => {
      if (x === y) {
        setSearchValue(oldText);
        setFirst(0);
      }
    }, 1000);
  };
  return (
    <Wrapper>
      <div className="addNew  mt-2 ">
        <Button
          size="small"
          label={label}
          icon={` pi ${icon}`}
          onClick={() => setVisibleHead(true)}
        />
      </div>

      <div className="p-input-icon-left mt-2">
        <BsSearch />
        <InputText
          placeholder="Search"
          value={inputValue}
          onChange={(e) => changeValue(e)}
        />
      </div>
      <Dialog
        headerClassName="pb-0"
        header={popupLabel}
        visible={visibleHead}
        style={{ width: "30vw", minWidth: "300px" }}
        onHide={() => setVisibleHead(false)}>
        {children}
      </Dialog>
    </Wrapper>
  );
};

export default TableHead;
