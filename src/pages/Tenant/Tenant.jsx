import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {
  BsPencilSquare,
  BsFillTrash3Fill,
  BsFillEyeFill,
} from "react-icons/bs";
import { Paginator } from "primereact/paginator";
import BreadcrumbComponent from "../../components/custom/Shared/Breadcrumb/Breadcrumb";
import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import ColumnSortHeader from "../../components/custom/Shared/ColumnSortHeader/ColumnSortHeader";
import TableHead from "../../components/custom/Shared/TableHead/TableHead";
import TableDate from "../../components/custom/Shared/TableDate/TableDate";
import TenantForm from "../../components/custom/tenant/TenantForm/TenantForm";
import useRequest from "../../axios/apis/useRequest";
import { Dialog } from "primereact/dialog";
import TenantStatus from "../../components/custom/tenant/TenantStatus/TenantStatus";
import DeleteConfirmation from "../../components/custom/global/DeleteConfirmation/DeleteConfirmation.jsx";
import { useHistory } from "react-router-dom";
import { Wrapper } from "./Tenant.styled";
export default function Tenant({ children }) {
  const { getTenant, getTenantList, deleteTenantReq } = useRequest();
  const [visible, setVisible] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [visibleHead, setVisibleHead] = useState(false);
  const [list, setList] = useState([]);
  const [rebase, setRebase] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortValue, setSortValue] = useState("");
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [confirm, setConfirm] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [update, setUpdate] = useState(1);
  const history = useHistory();
  const deleteConfirm = (id) => {
    setCurrentId(id);
    setConfirm(true);
  };
  const deleteTenant = async () => {
    await deleteTenantReq({ id: currentId });
  };

  useEffect(() => {
    console.log("ddddddddddfffffffff");
    let query = `?page=${Math.ceil(
      (first + 1) / rows
    )}&pageSize=${rows}&filters[0].Field=SearchTerm`;
    if (searchValue) query += `&filters[0].Value=${searchValue}`;
    if (sortField) query += `&sort.Field=${sortField}`;
    if (sortValue) query += `&sort.Direction=${sortValue}`;

    (async () => {
      const listData = await getTenantList(query);
      setTotalCount(listData.data.data.totalCount);
      setList(listData.data.data.items);
    })();
  }, [first, rows, searchValue, sortField, sortValue, update]);

  const statusBodyTemplate = (rowData) => {
    return (
      <TenantStatus rowData={rowData} key={rowData.id} setFirst={setFirst} />
    );
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
    const tenantData = await getTenant(id);
    console.log("dddddddd", tenantData);
    setTenantData(tenantData.data);
    setVisible(true);
  };

  return (
    <Wrapper>
      <BreadcrumbComponent
        title={"Tenant List"}
        parent={"Tenant"}
        icon={faUserTie}
      />
      <TableHead
        label={"Add Tenant"}
        icon={"pi-user-plus"}
        setSearchValue={setSearchValue}
        visibleHead={visibleHead}
        setVisibleHead={setVisibleHead}
        setFirst={setFirst}>
        <TenantForm
          type={"create"}
          update={update}
          setUpdate={setUpdate}
          visibleHead={visibleHead}
          setVisibleHead={setVisibleHead}
        />
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
                setFirst={setFirst}
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
                setFirst={setFirst}
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
                setFirst={setFirst}
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
                setFirst={setFirst}
              />
            }
          />
          <Column
            style={{ width: "60px", textAlign: "center" }}
            body={(data, options) => (
              <>
                <BsFillEyeFill
                  onClick={() => history.push(`/TenantDetails/${data.id}`)}
                  style={{ cursor: "pointer" }}
                />
              </>
            )}
            header="View"
          />
          <Column
            style={{ width: "60px", textAlign: "center" }}
            body={(data, options) => (
              <>
                <BsPencilSquare
                  onClick={() => editForm(data.id)}
                  style={{ cursor: "pointer" }}
                />
              </>
            )}
            header="Edit"
          />
          <Column
            style={{ width: "60px", textAlign: "center" }}
            body={(data, options) => (
              <>
                <BsFillTrash3Fill
                  onClick={() => deleteConfirm(data.id)}
                  style={{ cursor: "pointer" }}
                />
              </>
            )}
            header="Delete"
          />
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
          headerClassName="pb-0"
          className="tenantForm"
          header={"Edit Tenant"}
          visible={visible}
          style={{ width: "30vw", minWidth: "300px" }}
          onHide={() => setVisible(false)}>
          <TenantForm
            type={"edit"}
            tenantData={tenantData?.data}
            update={update}
            setUpdate={setUpdate}
            setVisible={setVisible}
          />
        </Dialog>
      </div>
      <DeleteConfirmation
        message="Do you want to delete this Tenant?"
        icon="pi pi-exclamation-triangle"
        confirm={confirm}
        setConfirm={setConfirm}
        confirmFunction={deleteTenant}
        update={update}
        setUpdate={setUpdate}
      />
    </Wrapper>
  );
}
