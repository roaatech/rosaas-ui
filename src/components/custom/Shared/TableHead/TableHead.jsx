import React, { useState } from "react";
import { Wrapper } from "./TableHead.styled";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { BsSearch } from "react-icons/bs";
import { Dialog } from "primereact/dialog";
import useGlobal from "../../../../lib/hocks/global";
const TableHead = ({
  label,
  icon,
  setSearchValue,
  children,
  setFirst,
  visibleHead,
  setVisibleHead,
  popupLabel,
  search = true,
}) => {
  // const [] = useState(false);
  const { searchWait } = useGlobal();
  const [inputValue, setInputValue] = useState("");

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
      <div>
        {children.length > 1 ? (
          <div className="p-input-icon-left mt-2 mr-2">{children[1]}</div>
        ) : null}
        {search && (
          <div className="p-input-icon-left mt-2">
            <BsSearch />
            <InputText
              placeholder="Search"
              value={inputValue}
              onChange={(e) =>
                searchWait(e, setInputValue, setSearchValue, setFirst)
              }
            />
          </div>
        )}
      </div>
      <Dialog
        headerClassName="pb-0"
        header={popupLabel}
        visible={visibleHead}
        style={{ width: "30vw", minWidth: "300px" }}
        onHide={() => setVisibleHead(false)}>
        {children.length > 1 ? children[0] : children}
      </Dialog>
    </Wrapper>
  );
};

export default TableHead;
