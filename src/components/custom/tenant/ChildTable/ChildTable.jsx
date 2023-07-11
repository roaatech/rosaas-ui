import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Card, Table } from "@themesberg/react-bootstrap";

export default function ChildTable() {
  const [products, setProducts] = useState([]);
  const [expandedRows, setExpandedRows] = useState(null);
  const toast = useRef(null);

  useEffect(() => {
    setProducts([
      {
        id: "1",
        name: "Bamboo Watch",
        metaData: {
          id: "1000-0",
          productCode: "f230fh0g3",
          date: "2020-09-13",
          amount: 65,
          quantity: 1,
          customer: "David James",
          status: "PENDING",
        },
      },
      {
        name: "Black Watch",
        id: "2",
        metaData: {
          id: "1001-0",
          productCode: "nvklal433",
          date: "2020-05-14",
          amount: 72,
          quantity: 1,
          customer: "Maisha Jefferson",
          status: "DELIVERED",
        },
      },
      {
        id: "3",
        name: "Blue Band",
        metaData: {
          id: "1002-0",
          productCode: "zz21cz3c1",
          date: "2020-07-05",
          amount: 79,
          quantity: 1,
          customer: "Stacey Leja",
          status: "DELIVERED",
        },
      },
    ]);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const allowExpansion = (rowData) => {
    return Object.keys(rowData.metaData).length > 0;
  };

  const rowExpansionTemplate = (data) => {
    return (
      <div className="p-3">
        <Card border="light" className="shadow-sm mb-4">
          <Card.Body className="pb-0">
            <Table
              responsive
              className="table-centered table-nowrap rounded mb-0">
              <tbody>
                {Object.keys(data.metaData).map((item, index) => (
                  <tr key={index}>
                    <td className="fw-bold">{item}</td>
                    <td>{data.metaData[item]}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </div>
    );
  };

  return (
    <div className="card">
      <Toast ref={toast} />
      <DataTable
        value={products}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        rowExpansionTemplate={rowExpansionTemplate}
        dataKey="id">
        <Column expander={allowExpansion} header="" />
        <Column field="name" header="" />
      </DataTable>
    </div>
  );
}
