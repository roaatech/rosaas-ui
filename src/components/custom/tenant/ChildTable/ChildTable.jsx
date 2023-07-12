import React, { useState, useEffect } from "react";

import { Card, Table } from "@themesberg/react-bootstrap";
import { Wrapper } from "./ChildTable.style";
import TenantStatus from "../TenantStatus/TenantStatus";
import AccordionComponent from "../../../AccordionComponent"; 


export default function ChildTable() { 
  const rowExpansionTemplate = (data) => {
    return (
      <div className="">
        <Card border="light" className="shadow-sm   border-0">
          <Card.Body className="p-0">
            <Table
              responsive
              className="table-centered table-nowrap rounded mb-0">
              <tbody>
                {Object.keys(data).map((item, index) => (
                  <tr key={index}>
                    <td className="fw-bold">{item}</td>
                    <td>{data[item]}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </div>
    );
  };

  const [products, setProducts] = useState([
    {
      eventKey: "metadata0",
      title: "Meta Data",
      description: rowExpansionTemplate({
        id: "1000-0",
        productCode: "f230fh0g3",
        date: "2020-09-13",
        amount: 65,
        quantity: 1,
        customer: "David James",
        status: "PENDING",
      }),
    },
  ]);

  return (
    <Wrapper>    
            <Card border="light" className="shadow-sm border-0">
               <Card.Body className="p-0">
                  <Table
                  responsive
                  className="table-centered table-nowrap rounded mb-0">
                  <tbody>
                    <tr>
                      <td className="fw-bold">Status</td>
                      <td> <TenantStatus statusValue={10} /></td>
                    </tr>  
                    <tr>
                        <td className="fw-bold">
                          Last Updated Date
                        </td>
                        <td>
                        7/9/2023, 6:50:37 PM
                        </td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>  
            <AccordionComponent defaultKey="metaData" data={products} /> 
    </Wrapper>
  );
}
