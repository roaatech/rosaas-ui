import React, { useState, useEffect } from "react"; 
import {Card, Table} from "@themesberg/react-bootstrap";  
import useGlobal from "../../../../lib/hocks/global";   
import TenantStatus from "../../../custom/tenant/TenantStatus/TenantStatus"; 
import useRequest from "../../../../axios/apis/useRequest";
 


export const ProductTenantsList = () => {


  const { DataTransform } = useGlobal();
  const {  getTenantList } = useRequest(); 
  const [totalCount, setTotalCount] = useState(0); 
  const [list, setList] = useState([]); 
  const [searchValue] = useState("");
  const [sortField] = useState("");
  const [sortValue] = useState("");
  const [first] = useState(0);
  const [rows] = useState(10); 
  const [update] = useState(1);
  const [selectedProduct] = useState(); 
  
  useEffect(() => {
    let query = `?page=${Math.ceil(
      (first + 1) / rows
    )}&pageSize=${100}`; 
    query += `&filters[1].Field=ProductId&filters[1].Value=88e67328-3b20-413e-b6e1-010b48fa7bc9`;
     

    (async () => {
      const listData = await getTenantList(query);
      setTotalCount(listData.data.data.totalCount);
      setList(listData.data.data.items);
    })();
  }, [first, rows, searchValue, sortField, sortValue, update, selectedProduct]);
 
  const TableRow = (props) => {
    const { title, uniqueName, status, createdDate, } =  props;
    
    return (
      <tr>
        
        <td>
          <span className="fw-normal">{title}</span>
        </td>
        <td>
          <span className="fw-normal">{uniqueName}</span>
        </td> 
        <td>
          <span className="fw-normal"><TenantStatus statusValue={5} /></span>
        </td>
        <td>
          <span className={`fw-normal`}>{DataTransform(createdDate)} </span>
        </td>
       
      </tr>
    );
  };
 

  return (
    <Card border="light" className="table-wrapper table-responsive shadow-sm">
      <Card.Body className="pt-0">
        <Table hover className="user-table align-items-center">
          <thead>
            <tr>
               
              <th className="border-bottom">Title</th>
              <th className="border-bottom">Unique Name</th> 
              <th className="border-bottom">Status</th> 
              <th className="border-bottom">Created Date</th>  
            </tr>
          </thead>
          <tbody>
            {list.map((t) => (
              <TableRow key={`transaction-${t.invoiceNumber}`} {...t} />
            ))}
          </tbody>
        </Table>
        
      </Card.Body>
    </Card>
  );



};
 

export default ProductTenantsList;
