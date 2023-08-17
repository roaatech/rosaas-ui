import React, { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { BsBoxSeam } from 'react-icons/bs'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEdit,
  faEllipsisH,
  faEye,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons'
import {
  Col,
  Row,
  Form,
  Card,
  Button,
  ButtonGroup,
  Breadcrumb,
  InputGroup,
  Dropdown,
} from '@themesberg/react-bootstrap'
// import { faUserTie } from "@fortawesome/free-solid-svg-icons";

import ColumnSortHeader from '../../components/custom/Shared/ColumnSortHeader/ColumnSortHeader'
import TableHead from '../../components/custom/Shared/TableHead/TableHead'
import TableDate from '../../components/custom/Shared/TableDate/TableDate'
import FeatureForm from '../../components/custom/Feature/FeatureForm/FeatureForm'
import useRequest from '../../axios/apis/useRequest'
import { Dialog } from 'primereact/dialog'
import DeleteConfirmation from '../../components/custom/global/DeleteConfirmation/DeleteConfirmation.jsx'
import { useNavigate } from 'react-router-dom'
import { Wrapper } from './Feature.styled'
import CustomPaginator from '../../components/custom/Shared/CustomPaginator/CustomPaginator'
import ThemeDialog from '../../components/custom/Shared/ThemeDialog/ThemeDialog'
import { featureInfo, setAllFeature } from '../../store/slices/features'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'

export default function Feature({ children }) {
  const dispatch = useDispatch()
  const { getFeature, getFeatureList, deleteFeatureReq } = useRequest()
  const [visible, setVisible] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const [visibleHead, setVisibleHead] = useState(false)
  // const [list, setList] = useState([]);
  const [rebase, setRebase] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [sortField, setSortField] = useState('')
  const [sortValue, setSortValue] = useState('')
  const [first, setFirst] = useState(0)
  const [rows, setRows] = useState(10)
  const [confirm, setConfirm] = useState(false)
  const [currentId, setCurrentId] = useState('')
  const [update, setUpdate] = useState(1)
  const navigate = useNavigate()
  const deleteConfirm = (id) => {
    setCurrentId(id)
    setConfirm(true)
  }
  const deleteFeature = async () => {
    await deleteFeatureReq({ id: currentId })
  }

  const listData = useSelector((state) => state.features.features)
  let list = Object.values(listData)

  useEffect(() => {
    let query = `?page=${Math.ceil(
      (first + 1) / rows
    )}&pageSize=${rows}&filters[0].Field=SearchTerm`
    if (searchValue) query += `&filters[0].Value=${searchValue}`
    if (sortField) query += `&sort.Field=${sortField}`
    if (sortValue) query += `&sort.Direction=${sortValue}`
    ;(async () => {
      // if (Object.values(listData).length == 0) {
      const featureList = await getFeatureList(query)
      dispatch(setAllFeature(featureList.data.data.items))
      setTotalCount(featureList.data.data.totalCount)
      // }
    })()
  }, [first, rows, searchValue, sortField, sortValue, update])

  /******************************* */

  const onPageChange = (event) => {
    setFirst(event.first)
    setRows(event.rows)
  }

  /****************************** */
  const editForm = async (id) => {
    if (!listData[id].creationEndpoint) {
      const featureData = await getFeature(id)
      dispatch(featureInfo(featureData.data.data))
    }
    setCurrentId(id)
    setVisible(true)
  }

  return (
    <Wrapper>
      <BreadcrumbComponent breadcrumbInfo={'FeatureList'} icon={BsBoxSeam} />
      <div className="main-container">
        <TableHead
          label={<FormattedMessage id="Add-Feature" />}
          icon={'pi-box'}
          setSearchValue={setSearchValue}
          visibleHead={visibleHead}
          setVisibleHead={setVisibleHead}
          setFirst={setFirst}
        >
          <FeatureForm
            popupLabel={<FormattedMessage id="Create-Feature" />}
            type={'create'}
            update={update}
            setUpdate={setUpdate}
            visible={visibleHead}
            setVisible={setVisibleHead}
          />
        </TableHead>
        <Card
          border="light"
          className="table-wrapper table-responsive shadow-sm"
        >
          <Card.Body className="pt-0">
            <DataTable
              value={list}
              tableStyle={{ minWidth: '50rem' }}
              size={'small'}
            >
              <Column
                field="name"
                header={
                  <ColumnSortHeader
                    text={<FormattedMessage id="Name" />}
                    field="name"
                    rebase={rebase}
                    setRebase={setRebase}
                    sortField={sortField}
                    sortValue={sortValue}
                    setSortField={setSortField}
                    setSortValue={setSortValue}
                    setFirst={setFirst}
                  />
                }
              ></Column>
              <Column
                field="defaultHealthCheckUrl"
                header={
                  <ColumnSortHeader
                    text={<FormattedMessage id="Default-Health-Check-Url" />}
                    field="defaultHealthCheckUrl"
                    rebase={rebase}
                    setRebase={setRebase}
                    sortField={sortField}
                    sortValue={sortValue}
                    setSortField={setSortField}
                    setSortValue={setSortValue}
                    setFirst={setFirst}
                  />
                }
              ></Column>

              <Column
                field={'client.name'}
                header={
                  <ColumnSortHeader
                    text={<FormattedMessage id="Client" />}
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
                body={(data, options) => (
                  <TableDate
                    createdDate={data.createdDate}
                    editedDate={data.editedDate}
                  />
                )}
                style={{ width: '250px', maxidth: '250px' }}
                header={
                  <ColumnSortHeader
                    text={<FormattedMessage id="Date" />}
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
                body={(data, options) => (
                  <Dropdown as={ButtonGroup}>
                    <Dropdown.Toggle
                      as={Button}
                      split
                      variant="link"
                      className="text-dark m-0 p-0"
                    >
                      <span className="icon icon-sm">
                        <FontAwesomeIcon
                          icon={faEllipsisH}
                          className="icon-dark"
                        />
                      </span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onSelect={() => navigate(`/features/${data.id}`)}
                      >
                        <FontAwesomeIcon icon={faEye} className="me-2" />
                        <FormattedMessage id="View-Details" />
                      </Dropdown.Item>
                      <Dropdown.Item onSelect={() => editForm(data.id)}>
                        <FontAwesomeIcon icon={faEdit} className="me-2" />
                        <FormattedMessage id="Edit" />
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => deleteConfirm(data.id)}
                        className="text-danger"
                      >
                        <FontAwesomeIcon icon={faTrashAlt} className="me-2" />
                        <FormattedMessage id="Delete" />
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
                style={{ width: '60px', textAlign: 'center' }}
                header={<FormattedMessage id="Actions" />}
              />
            </DataTable>
            <CustomPaginator
              first={first}
              rows={rows}
              totalCount={totalCount}
              onPageChange={onPageChange}
            />

            <ThemeDialog visible={visible} setVisible={setVisible}>
              <FeatureForm
                popupLabel={<FormattedMessage id="Edit-Feature" />}
                type={'edit'}
                featureData={listData[currentId]}
                update={update}
                setUpdate={setUpdate}
                setVisible={setVisible}
              />
            </ThemeDialog>

            <DeleteConfirmation
              message={
                <FormattedMessage id="delete-feature-confirmation-message" />
              }
              icon="pi pi-exclamation-triangle"
              confirm={confirm}
              setConfirm={setConfirm}
              confirmFunction={deleteFeature}
              update={update}
              setUpdate={setUpdate}
              sideBar={false}
            />
          </Card.Body>
        </Card>
      </div>
    </Wrapper>
  )
}
