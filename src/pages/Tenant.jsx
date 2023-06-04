import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { BsPencilSquare } from "react-icons/bs";
import { Paginator } from "primereact/paginator";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import BreadcrumbComponent from "../components/custom/Shared/Breadcrumb/Breadcrumb";
import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import ColumnSortHeader from "../components/custom/Shared/ColumnSortHeader/ColumnSortHeader";
import TableHead from "../components/custom/Shared/TableHead/TableHead";
import TableDate from "../components/custom/Shared/TableDate/TableDate";
import TenantForm from "../components/custom/tenant/TenantForm/TenantForm";
import useRequest from "../axios/apis/useRequest";
import { Dialog } from "primereact/dialog";
import TenantStatus from "../components/custom/tenant/TenantStatus/TenantStatus";

export default function Tenant({ children }) {
  const { getTenant, getTenantList } = useRequest();
  const [visible, setVisible] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [list, setList] = useState([]);
  const [rebase, setRebase] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortValue, setSortValue] = useState("");
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);

  useEffect(() => {
    (async () => {
      // const listData = await getTenantList(
      //   `?page=${Math.ceil(
      //     (first + 1) / rows
      //   )}&pageSize=${rows}&filters[0].Field=SearchTerm&filters[0].Value=${searchValue}&sort.Field=${sortField}&sort.Direction=${sortValue}`
      // );
      const listData = {
        data: {
          items: [
            {
              id: "d1f33c17-1178-415e-a4f4-7178ef48d7c9",
              title: "string",
              uniqueName: "aaaa_tenant_156",
              products: [
                {
                  id: "88e67328-3b20-413e-b6e1-010b48fa7bc9",
                  name: "OSOS",
                },
              ],
              status: 1,
              createdDate: "2023-06-01T10:08:29",
              editedDate: "2023-06-01T10:08:29",
            },
            {
              id: "816e87b0-b0db-4b9c-8132-426a51f847e8",
              title: "string",
              uniqueName: "abc_tenant_156",
              products: [
                {
                  id: "88e67328-3b20-413e-b6e1-010b48fa7bc9",
                  name: "OSOS",
                },
              ],
              status: 1,
              createdDate: "2023-06-01T13:55:36",
              editedDate: "2023-06-01T13:55:36",
            },
            {
              id: "16550d65-bec3-49dd-8a72-2d9fbe4c896f",
              title: "string",
              uniqueName: "bbb_tenant_156",
              products: [
                {
                  id: "88e67328-3b20-413e-b6e1-010b48fa7bc9",
                  name: "OSOS",
                },
              ],
              status: 1,
              createdDate: "2023-06-01T10:08:34",
              editedDate: "2023-06-01T10:08:34",
            },
            {
              id: "8db414fe-82c4-4124-83f6-3e961114838c",
              title: "string",
              uniqueName: "tenant_156",
              products: [
                {
                  id: "88e67328-3b20-413e-b6e1-010b48fa7bc9",
                  name: "OSOS",
                },
              ],
              status: 1,
              createdDate: "2023-06-01T09:45:51",
              editedDate: "2023-06-01T09:45:51",
            },
            {
              id: "cffe1a57-af42-441f-87b6-f5d2f8e69888",
              title: "string",
              uniqueName: "zzzz_tenant_156",
              products: [
                {
                  id: "88e67328-3b20-413e-b6e1-010b48fa7bc9",
                  name: "OSOS",
                },
              ],
              status: 1,
              createdDate: "2023-06-01T10:08:39",
              editedDate: "2023-06-01T10:08:39",
            },
          ],
          totalCount: 5,
        },
        metadata: {
          errors: [],
          success: true,
        },
      };
      setTotalCount(listData.data.totalCount);
      setList(listData.data.items);
    })();
  }, [first, rows, searchValue, sortField, sortValue]);

  const statusBodyTemplate = (rowData) => {
    return <TenantStatus rowData={rowData} />;
  };

  /******************************* */

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
    console.log(event.first, event.rows);
  };

  /****************************** */
  const [tenantData, setTenantData] = useState();
  const editForm = async (id) => {
    // const tenantData = await getTenant(id);
    setTenantData({
      data: {
        id: "3abac857-9921-40ac-ba76-8d633c0e9051",
        title: "title one",
        uniqueName: "tenant_12345",
        productId: "08db61ee-b0f4-459c-809d-e25d181dd0fe",
        productName: "",
        status: 1,
        createdDate: "2023-05-31T15:50:00",
      },
      metadata: {
        errors: [],
        success: true,
      },
    });

    setVisible(true);
  };

  return (
    <>
      <BreadcrumbComponent
        title={"Tenant List"}
        parent={"Tenant"}
        icon={faUserTie}
      />
      <TableHead
        label={"Add Tenant"}
        icon={"pi-user-plus"}
        setSearchValue={setSearchValue}>
        <TenantForm type={"create"} />
      </TableHead>
      <div className="card">
        <DataTable
          value={list}
          tableStyle={{ minWidth: "50rem" }}
          size={"small"}>
          <Column
            field="title"
            header={
              <ColumnSortHeader
                text="Title"
                field="uniqueName"
                rebase={rebase}
                setRebase={setRebase}
                sortField={sortField}
                sortValue={sortValue}
                setSortField={setSortField}
                setSortValue={setSortValue}
              />
            }></Column>
          <Column
            field="uniqueName"
            header={
              <ColumnSortHeader
                text="Unique Name"
                field="uniqueName"
                rebase={rebase}
                setRebase={setRebase}
                sortField={sortField}
                sortValue={sortValue}
                setSortField={setSortField}
                setSortValue={setSortValue}
              />
            }></Column>
          <Column
            field="status"
            header={
              <ColumnSortHeader
                text="Status"
                field="status"
                rebase={rebase}
                setRebase={setRebase}
                sortField={sortField}
                sortValue={sortValue}
                setSortField={setSortField}
                setSortValue={setSortValue}
              />
            }
            showFilterMenu={false}
            body={statusBodyTemplate}
          />
          <Column
            body={(data, options) => (
              <TableDate
                createdDate={data.createdDate}
                editedDate={data.editedDate}
              />
            )}
            style={{ width: "250px", maxidth: "250px" }}
            header={
              <ColumnSortHeader
                text="Date"
                field="editedDate"
                rebase={rebase}
                setRebase={setRebase}
                sortField={sortField}
                sortValue={sortValue}
                setSortField={setSortField}
                setSortValue={setSortValue}
              />
            }
          />
          <Column
            style={{ width: "100px" }}
            body={(data, options) => (
              <>
                {/* {console.log(options.rowIndex, data.price, 1)} */}
                <BsPencilSquare
                  onClick={() => editForm(data.id)}
                  style={{ cursor: "pointer" }}
                />
              </>
            )}
            header="Edit"
          />
          {/* <Column
            body={(data, options) => (
              <>
                {console.log(options.rowIndex, data.price, 1)}
                <BsPencilSquare />
              </>
            )}
            header="Edit"
          /> */}
        </DataTable>

        <Paginator
          size={"small"}
          first={first}
          rows={rows}
          totalRecords={totalCount}
          rowsPerPageOptions={[10, 20, 30]}
          onPageChange={onPageChange}
        />

        <Dialog
          header={"Edit Tenant"}
          visible={visible}
          style={{ width: "30vw", minWidth: "300px" }}
          onHide={() => setVisible(false)}>
          <TenantForm type={"edit"} tenantData={tenantData?.data} />
        </Dialog>
      </div>
    </>
  );
}
