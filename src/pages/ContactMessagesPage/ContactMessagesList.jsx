import React, { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb'
import {
  Col,
  Row,
  Card,
  Button,
  ButtonGroup,
  Dropdown,
} from '@themesberg/react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEdit,
  faEllipsisH,
  faEye,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons'
import ColumnSortHeader from '../../components/custom/Shared/ColumnSortHeader/ColumnSortHeader'
import CustomPaginator from '../../components/custom/Shared/CustomPaginator/CustomPaginator'
import DeleteConfirmation from '../../components/custom/global/DeleteConfirmation/DeleteConfirmation.jsx'
import { Dialog } from 'primereact/dialog'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import useRequest from '../../axios/apis/useRequest'
import { Wrapper } from './ContactMessages.styled'
// import {
//   setContactMessagesList,
//   removeContactMessageById,
// } from '../../store/slices/contactMessagesSlice'
import { FormattedMessage } from 'react-intl'
import SafeFormatMessage from '../../components/custom/Shared/SafeFormatMessage/SafeFormatMessage.jsx'
import ShowDetails from '../../components/custom/Shared/ShowDetails/ShowDetails.jsx'
import ThemeDialog from '../../components/custom/Shared/ThemeDialog/ThemeDialog.jsx'
import ReplayForm from './ReplayForm/ReplayForm.jsx'
import TableHead from '../../components/custom/Shared/TableHead/TableHead.jsx'
import { UppercaseMonthDateFormat } from '../../lib/sharedFun/Time.js'
import Label from '../../components/custom/Shared/label/Label.jsx'
import { ContactFormStatus } from '../../const/const.js'
import DataLabelWhite from '../../components/custom/Shared/DateLabelWhite/DateLabelWhite.jsx'
import { MdEmail } from 'react-icons/md'

export default function ContactMessagesList() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {
    getPaginationContactMessagesList,
    getContactMessageById,
    deleteContactMessageById,
  } = useRequest()
  const [list, setList] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [first, setFirst] = useState(0)
  const [rows, setRows] = useState(10)
  const [sortField, setSortField] = useState('')
  const [sortValue, setSortValue] = useState('')
  const [visibleReplay, setVisibleReplay] = useState(false)
  const [visibleDetails, setVisibleDetails] = useState(false)
  const [currentId, setCurrentId] = useState('')
  const [currentData, setCurrentData] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  //   const contactMessagesList = useSelector(
  //     (state) => state.contactMessages.contactMessages
  //   )

  useEffect(() => {
    const fetchContactMessages = async () => {
      const query = `?page=${Math.ceil((first + 1) / rows)}&pageSize=${rows}`
      const result = await getPaginationContactMessagesList(query)
      //   dispatch(setContactMessagesList(result.data.items))
      setList(result.data.data.items)
      setTotalCount(result.data.data.totalCount)
    }

    fetchContactMessages()
  }, [first, rows, sortField, sortValue])

  const handleReplay = (id) => {
    setCurrentId(id)
    setVisibleReplay(true)
  }

  const handleDelete = async () => {
    await deleteContactMessageById(currentId)
    // dispatch(removeContactMessageById(currentId))
    setConfirmDelete(false)
  }
  const handleDetails = async (id) => {
    try {
      navigate(`./${id}`)
    } catch (error) {
      console.error('Failed to fetch message details:', error)
    }
  }

  const onPageChange = (event) => {
    setFirst(event.first)
    setRows(event.rows)
  }

  return (
    <Wrapper>
      <BreadcrumbComponent breadcrumbInfo={'ContactMessages'} />
      <TableHead
        setFirst={setFirst}
        search={false}
        button={false}
        title={
          <SafeFormatMessage
            id="Contact-Messages-List"
            defaultMessage={'Contact Messages List'}
          />
        }
      />
      <div className="main-container">
        <Card
          border="light"
          className="table-wrapper table-responsive shadow-sm"
        >
          <Card.Body className="pt-0">
            <DataTable
              value={list}
              tableStyle={{ minWidth: '50rem' }}
              size="small"
            >
              <Column
                field="status"
                header={<SafeFormatMessage id="Status" />}
                body={(data) => <Label {...ContactFormStatus[data.status]} />}
              />
              <Column
                field="fullName"
                header={<SafeFormatMessage id="Full-Name" />}
              />
              <Column
                field="email"
                header={<SafeFormatMessage id="Email" />}
                body={(data) => (
                  <DataLabelWhite
                    variant={'gray'}
                    text={
                      <>
                        <MdEmail className="mr-2" />
                        {data.email}
                      </>
                    }
                  />
                )}
              />

              <Column
                field="subject"
                header={<SafeFormatMessage id="Subject" />}
              />
              <Column
                field="createdDate"
                header={<SafeFormatMessage id="Created-Date" />}
                body={(data) => (
                  <span>
                    {UppercaseMonthDateFormat(data.createdDate, true, true)}
                  </span>
                )}
              />
              <Column
                field="replyDate"
                header={<SafeFormatMessage id="Reply-Date" />}
                body={(data) => (
                  <span>
                    {UppercaseMonthDateFormat(data.replyDate, true, true)}
                  </span>
                )}
              />

              <Column
                body={(data) => (
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
                      <Dropdown.Item onSelect={() => handleDetails(data.id)}>
                        <FontAwesomeIcon icon={faEye} className="mx-2" />
                        <SafeFormatMessage id="View-Details" />
                      </Dropdown.Item>

                      <Dropdown.Item
                        onClick={() => {
                          setCurrentId(data.id)
                          setConfirmDelete(true)
                        }}
                        className="text-danger"
                      >
                        <FontAwesomeIcon icon={faTrashAlt} className="mx-2" />
                        <SafeFormatMessage id="Delete" />
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
                header={<SafeFormatMessage id="Actions" />}
              />
            </DataTable>
            <CustomPaginator
              first={first}
              rows={rows}
              totalCount={totalCount}
              onPageChange={onPageChange}
            />
          </Card.Body>
        </Card>
      </div>

      <ThemeDialog
        size="xl"
        visible={visibleReplay}
        setVisible={setVisibleReplay}
      >
        <ReplayForm
          contactMessageId={currentId}
          setVisible={setVisibleReplay}
          popupLabel={<FormattedMessage id="Reply-to-Message" />}
        />
      </ThemeDialog>

      <ThemeDialog
        visible={visibleDetails}
        setVisible={setVisibleDetails}
        size={'xl'}
      >
        <ShowDetails
          popupLabel={<SafeFormatMessage id="Contact-Message-Details" />}
          data={currentData}
          setVisible={setVisibleDetails}
          func={() => getContactMessageById(currentId)}
        />
        {/* <ReplayForm
          contactMessageId={currentId}
          data={currentData}
          setVisible={setVisibleReplay}
          type="readOnly"
          popupLabel={<FormattedMessage id="Reply-to-Message" />}
          func={() => getContactMessageById(currentId)}
        /> */}
      </ThemeDialog>

      <DeleteConfirmation
        message={<SafeFormatMessage id="delete-message-confirmation" />}
        confirm={confirmDelete}
        setConfirm={setConfirmDelete}
        confirmFunction={handleDelete}
      />
    </Wrapper>
  )
}
