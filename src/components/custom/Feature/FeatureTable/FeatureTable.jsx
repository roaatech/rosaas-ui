import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { BsPencilSquare, BsFillEyeFill } from "react-icons/bs";
import { Paginator } from "primereact/paginator";
import BreadcrumbComponent from "../../components/custom/Shared/Breadcrumb/Breadcrumb";
// import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import { BsFillPersonLinesFill } from "react-icons/bs";

import ColumnSortHeader from "../../components/custom/Shared/ColumnSortHeader/ColumnSortHeader";
import TableHead from "../../components/custom/Shared/TableHead/TableHead";
import TableDate from "../../components/custom/Shared/TableDate/TableDate";
import FeatureForm from "../FeatureForm/FeatureForm";
import useRequest from "../../axios/apis/useRequest";
import { Dialog } from "primereact/dialog";
import DeleteConfirmation from "../../components/custom/global/DeleteConfirmation/DeleteConfirmation.jsx";
import { useNavigate } from "react-router-dom";
import { Wrapper } from "./FeatureTable.styled";
import CustomPaginator from "../../Shared/CustomPaginator/CustomPaginator";
import AutoCompleteFiled from "../../Shared/AutoCompleteFiled/AutoCompleteFiled";

export default function FeatureTable({ children }) {
  const { getFeature, getFeatureList, deleteFeatureReq } = useRequest();
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
  const [selectedProduct, setSelectedProduct] = useState();
  const navigate = useNavigate();
  const deleteConfirm = (id) => {
    setCurrentId(id);
    setConfirm(true);
  };
  const deleteFeature = async () => {
    await deleteFeatureReq({ id: currentId });
  };

  useEffect(() => {
    let query = `?page=${Math.ceil(
      (first + 1) / rows
    )}&pageSize=${rows}&filters[0].Field=SearchTerm`;
    if (searchValue) query += `&filters[0].Value=${searchValue}`;
    if (sortField) query += `&sort.Field=${sortField}`;
    if (sortValue) query += `&sort.Direction=${sortValue}`;
    if (selectedProduct)
      query += `&filters[1].Field=selectedProduct&filters[1].Value=${selectedProduct}`;

    (async () => {
      const listData = await getFeatureList(query);
      setTotalCount(listData.data.data.totalCount);
      setList(listData.data.data.items);
    })();
  }, [first, rows, searchValue, sortField, sortValue, update, selectedProduct]);

  /******************************* */

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const productOptions = async (text) => {
    // const allOptions = await getProductSearch();
    // return allOptions.data;
    return {
      data: [
        {
          id: "asfdasf1",
          name: "product1",
        },
        {
          id: "asfdasf2",
          name: "product2",
        },
        {
          id: "asfdasf3",
          name: "product3",
        },
        {
          id: "asfdasf4",
          name: "product4",
        },
      ],
    };
  };

  /****************************** */
  const [featureData, setFeatureData] = useState();
  const editForm = async (id) => {
    const featureData = await getFeature(id);
    setFeatureData(featureData.data);
    setVisible(true);
  };

  return (
    <Wrapper>
      <BreadcrumbComponent
        title={"Feature List"}
        parent={"Feature"}
        icon={BsFillPersonLinesFill}
      />

      <div className="tableSec">
        <TableHead
          label={"Add Feature"}
          popupLabel={"Create Feature"}
          icon={"pi-user-plus"}
          setSearchValue={setSearchValue}
          visibleHead={visibleHead}
          setVisibleHead={setVisibleHead}
          setFirst={setFirst}>
          <FeatureForm
            type={"create"}
            update={update}
            setUpdate={setUpdate}
            visibleHead={visibleHead}
            setVisibleHead={setVisibleHead}
            sideBar={false}
          />

          <AutoCompleteFiled
            placeHolder="Select Product"
            dataFunction={productOptions}
            setSelectedProduct={setSelectedProduct}
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
              }
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
                    onClick={() => navigate(`/FeatureDetails/${data.id}`)}
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
            {/* <Column
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
            /> */}
          </DataTable>

          <CustomPaginator
            first={first}
            rows={rows}
            totalCount={totalCount}
            onPageChange={onPageChange}
          />

          <Dialog
            headerClassName="pb-0"
            className="featureForm"
            header={"Edit Feature"}
            visible={visible}
            style={{ width: "30vw", minWidth: "300px" }}
            onHide={() => setVisible(false)}>
            <FeatureForm
              type={"edit"}
              featureData={featureData?.data}
              update={update}
              setUpdate={setUpdate}
              setVisible={setVisible}
              sideBar={false}
            />
          </Dialog>
        </div>
      </div>

      <DeleteConfirmation
        message="Do you want to delete this Feature?"
        icon="pi pi-exclamation-triangle"
        confirm={confirm}
        setConfirm={setConfirm}
        confirmFunction={deleteFeature}
        update={update}
        setUpdate={setUpdate}
        sideBar={false}
      />
    </Wrapper>
  );
}
