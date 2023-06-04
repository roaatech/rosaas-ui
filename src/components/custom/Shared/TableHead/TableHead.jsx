import React, { useState } from "react";
import { Wrapper } from "./TableHead.styled";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { BsSearch } from "react-icons/bs";
import { Dialog } from "primereact/dialog";

let x = 0;
const TableHead = ({ label, icon, setSearchValue, children }) => {
  const [visible, setVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const changeValue = (e) => {
    setInputValue(e.target.value);
    const oldText = e.target.value;
    x++;
    const y = x;
    setTimeout(() => {
      if (x === y) {
        setSearchValue(oldText);
        console.log(oldText);
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
          onClick={() => setVisible(true)}
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
        header={"Create Tenant"}
        visible={visible}
        style={{ width: "30vw", minWidth: "300px" }}
        onHide={() => setVisible(false)}>
        {children}
      </Dialog>
    </Wrapper>
  );
};

export default TableHead;
