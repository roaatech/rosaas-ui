import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {
  BsPencilSquare,
  BsFillEyeFill,
  BsFillTrash3Fill,
} from "react-icons/bs";
import { Paginator } from "primereact/paginator";
// import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import { BsFillPersonLinesFill } from "react-icons/bs";

import ColumnSortHeader from "../../Shared/ColumnSortHeader/ColumnSortHeader";
import TableHead from "../../Shared/TableHead/TableHead";
import TableDate from "../../Shared/TableDate/TableDate";
import FeatureForm from "../FeatureForm/FeatureForm";
import useRequest from "../../../../axios/apis/useRequest";
import { Dialog } from "primereact/dialog";
import DeleteConfirmation from "../../global/DeleteConfirmation/DeleteConfirmation.jsx";
import { useNavigate } from "react-router-dom";
import { Wrapper } from "./FeatureTable.styled";
import CustomPaginator from "../../Shared/CustomPaginator/CustomPaginator";
import AutoCompleteFiled from "../../Shared/AutoCompleteFiled/AutoCompleteFiled";

export default function FeatureTable({ data }) {
  console.log(data, "00000");
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
  const [selectedProduct, setSelectedProduct] = useState();
  const navigate = useNavigate();
  const deleteConfirm = (id) => {
    setCurrentId(id);
    setConfirm(true);
  };
  const deleteFeature = async () => {
    await deleteTenantReq({ id: currentId });
  };

  useEffect(() => {
    let listData;
    let query = `?page=${Math.ceil(
      (first + 1) / rows
    )}&pageSize=${rows}&filters[0].Field=SearchTerm`;
    if (searchValue) query += `&filters[0].Value=${searchValue}`;
    if (sortField) query += `&sort.Field=${sortField}`;
    if (sortValue) query += `&sort.Direction=${sortValue}`;
    if (selectedProduct)
      query += `&filters[1].Field=selectedProduct&filters[1].Value=${selectedProduct}`;

    (async () => {
      if (totalCount != 0) {
        listData = await getTenantList(query);
      } else {
        listData = data;
      }
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
    const featureData = await getTenant(id);
    setFeatureData(featureData.data);
    setVisible(true);
  };

  return (
    <Wrapper>
      <div className="tableSec">
        <TableHead
          label={"Add Feature"}
          popupLabel={"Create Feature"}
          icon={"pi-plus"}
          setSearchValue={setSearchValue}
          visibleHead={visibleHead}
          setVisibleHead={setVisibleHead}
          setFirst={setFirst}
          search={false}>
          <FeatureForm
            type={"create"}
            update={update}
            setUpdate={setUpdate}
            visibleHead={visibleHead}
            setVisibleHead={setVisibleHead}
            sideBar={false}
          />
        </TableHead>
        <div className="card">
          <DataTable
            value={list}
            tableStyle={{ minWidth: "50rem" }}
            size={"small"}>
            <Column field="title" header="Name" />
            <Column field="title" header="Type" />
            <Column field="title" header="Unit" />
            <Column field="title" header="Reset" />
            <Column field="title" header="Description" />

            <Column
              header="Date"
              field="editedDate"
              style={{ width: "250px", maxidth: "250px" }}
              body={(data, options) => (
                <TableDate
                  createdDate={data.createdDate}
                  editedDate={data.editedDate}
                />
              )}></Column>

            {/* <Column
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
            /> */}
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
