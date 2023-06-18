import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {
  BsPencilSquare,
  BsFillTrash3Fill,
  BsFillEyeFill,
  BsBoxSeam,
} from "react-icons/bs";
import BreadcrumbComponent from "../../components/custom/Shared/Breadcrumb/Breadcrumb";
// import { faUserTie } from "@fortawesome/free-solid-svg-icons";

import ColumnSortHeader from "../../components/custom/Shared/ColumnSortHeader/ColumnSortHeader";
import TableHead from "../../components/custom/Shared/TableHead/TableHead";
import TableDate from "../../components/custom/Shared/TableDate/TableDate";
import ProductForm from "../../components/custom/Product/ProductForm/ProductForm";
import useRequest from "../../axios/apis/useRequest";
import { Dialog } from "primereact/dialog";
import ProductStatus from "../../components/custom/Product/ProductStatus/ProductStatus";
import DeleteConfirmation from "../../components/custom/global/DeleteConfirmation/DeleteConfirmation.jsx";
import { useNavigate } from "react-router-dom";
import { Wrapper } from "./Product.styled";
import CustomPaginator from "../../components/custom/Shared/CustomPaginator/CustomPaginator";
export default function Product({ children }) {
  // const { getProduct, getProductList, deleteProductReq } = useRequest();
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
  const navigate = useNavigate();
  const deleteConfirm = (id) => {
    setCurrentId(id);
    setConfirm(true);
  };
  const deleteProduct = async () => {
    // await deleteProductReq({ id: currentId });
  };

  useEffect(() => {
    let query = `?page=${Math.ceil(
      (first + 1) / rows
    )}&pageSize=${rows}&filters[0].Field=SearchTerm`;
    if (searchValue) query += `&filters[0].Value=${searchValue}`;
    if (sortField) query += `&sort.Field=${sortField}`;
    if (sortValue) query += `&sort.Direction=${sortValue}`;

    (async () => {
      // const listData = await getProductList(query);
      // setTotalCount(listData.data.data.totalCount);
      // setList(listData.data.data.items);
      setTotalCount(7);
      setList([
        {
          id: "c12bd0e3-5127-480b-9b46-ace7285ab4df",
          name: "qwero",
          url: "qwerqwr",
          clientId: {
            id: "88e67328-3b20-413e-b6e1-010b48fa7bc9",
            name: "osos",
          },
          status: 1,
          createdDate: "2023-06-13T07:22:43",
          editedDate: "2023-06-13T07:32:04",
        },
        {
          id: "c12bd0e3-5127-480b-9b46-ace7285ab4df",
          name: "qwero",
          url: "qwerqwr",
          clientId: {
            id: "88e67328-3b20-413e-b6e1-010b48fa7bc9",
            name: "osos",
          },
          status: 1,
          createdDate: "2023-06-13T07:22:43",
          editedDate: "2023-06-13T07:32:04",
        },
        {
          id: "c12bd0e3-5127-480b-9b46-ace7285ab4df",
          name: "qwero",
          url: "qwerqwr",
          clientId: {
            id: "88e67328-3b20-413e-b6e1-010b48fa7bc9",
            name: "osos",
          },
          status: 1,
          createdDate: "2023-06-13T07:22:43",
          editedDate: "2023-06-13T07:32:04",
        },
        {
          id: "c12bd0e3-5127-480b-9b46-ace7285ab4df",
          name: "qwero",
          url: "qwerqwr",
          clientId: {
            id: "88e67328-3b20-413e-b6e1-010b48fa7bc9",
            name: "osos",
          },
          status: 1,
          createdDate: "2023-06-13T07:22:43",
          editedDate: "2023-06-13T07:32:04",
        },
        {
          id: "c12bd0e3-5127-480b-9b46-ace7285ab4df",
          name: "qwero",
          url: "qwerqwr",
          clientId: {
            id: "88e67328-3b20-413e-b6e1-010b48fa7bc9",
            name: "osos",
          },
          status: 1,
          createdDate: "2023-06-13T07:22:43",
          editedDate: "2023-06-13T07:32:04",
        },
        {
          id: "c12bd0e3-5127-480b-9b46-ace7285ab4df",
          name: "qwero",
          url: "qwerqwr",
          clientId: {
            id: "88e67328-3b20-413e-b6e1-010b48fa7bc9",
            name: "osos",
          },
          status: 1,
          createdDate: "2023-06-13T07:22:43",
          editedDate: "2023-06-13T07:32:04",
        },
        {
          id: "c12bd0e3-5127-480b-9b46-ace7285ab4df",
          name: "qwero",
          url: "qwerqwr",
          clientId: {
            id: "88e67328-3b20-413e-b6e1-010b48fa7bc9",
            name: "osos",
          },
          status: 1,
          createdDate: "2023-06-13T07:22:43",
          editedDate: "2023-06-13T07:32:04",
        },
      ]);
    })();
  }, [first, rows, searchValue, sortField, sortValue, update]);

  const statusBodyTemplate = (rowData) => {
    console.log(rowData);
    return <ProductStatus rowData={rowData} key={rowData.id} />;
  };

  /******************************* */

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
    console.log(event.first, event.rows);
  };

  /****************************** */
  const [productData, setProductData] = useState();
  const editForm = async (id) => {
    // const productData = await getProduct(id);
    const productData = {
      data: {
        data: {
          id: "e952885d-0174-4ad2-bf6d-1146eadd9718",
          name: "asdf",
          url: "asdfooo",
          createdDate: "2023-06-11T09:32:28",
          editedDate: "2023-06-12T09:57:38",
        },
      },
    };
    setProductData(productData.data);
    setVisible(true);
  };

  return (
    <Wrapper>
      <BreadcrumbComponent
        title={"Product List"}
        parent={"Product"}
        icon={BsBoxSeam}
      />
      <TableHead
        label={"Add Product"}
        popupLabel={"Create Product"}
        icon={"pi-box"}
        setSearchValue={setSearchValue}
        visibleHead={visibleHead}
        setVisibleHead={setVisibleHead}
        setFirst={setFirst}>
        <ProductForm
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
            field="name"
            header={
              <ColumnSortHeader
                text="Name"
                field="name"
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
            field="url"
            header={
              <ColumnSortHeader
                text="Url"
                field="url"
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
            field={"clientId.name"}
            header={
              <ColumnSortHeader
                text="Client"
                field="client"
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
          />
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
                  onClick={() => navigate(`/ProductDetails/${data.id}`)}
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

        <CustomPaginator
          first={first}
          rows={rows}
          totalCount={totalCount}
          onPageChange={onPageChange}
        />

        <Dialog
          headerClassName="pb-0"
          className="productForm"
          header={"Edit Product"}
          visible={visible}
          style={{ width: "30vw", minWidth: "300px" }}
          onHide={() => setVisible(false)}>
          <ProductForm
            type={"edit"}
            productData={productData?.data}
            update={update}
            setUpdate={setUpdate}
            setVisible={setVisible}
          />
        </Dialog>
      </div>
      <DeleteConfirmation
        message="Do you want to delete this Product?"
        icon="pi pi-exclamation-triangle"
        confirm={confirm}
        setConfirm={setConfirm}
        confirmFunction={deleteProduct}
        update={update}
        setUpdate={setUpdate}
        sideBar={false}
      />
    </Wrapper>
  );
}
