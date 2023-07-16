import React, { useState } from "react";
import { Wrapper } from "./TableHead.styled";
import { Button, ButtonGroup, InputGroup, Col,
  Row,
  Form,
  Card,  
  Breadcrumb, 
  Dropdown, } from '@themesberg/react-bootstrap';
import { InputText } from "primereact/inputtext";
import { BsSearch } from "react-icons/bs";
import { Dialog } from "primereact/dialog";
import useGlobal from "../../../../lib/hocks/global";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus,faSearch} from "@fortawesome/free-solid-svg-icons";
const TableHead = ({
  active = true,
  label,
  name,
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
  if (!active) {
    return (  
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">  
  <h4>{label} : {name}</h4>
  </div>
  );
} 
  return (
    
    <Wrapper> 
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">  
       <ButtonGroup>
       <Button variant="secondary"   onClick={() => setVisibleHead(true)}  >
        <FontAwesomeIcon icon={faPlus} className="me-2" />  {label}
      </Button>
        </ButtonGroup>
     
      <div>
        {children.length > 1 ? (
          <div className="p-input-icon-left mt-2 mr-2">{children[1]}</div>
        ) : null}
        {search && (
          <div className="p-input-icon-left mt-2">
            <BsSearch />
            <InputText
             className="form-control"  
              placeholder="Search"
              value={inputValue}
              onChange={(e) =>
                searchWait(e, setInputValue, setSearchValue, setFirst)
              }
            />
          </div>
        )}
      </div>
      
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
