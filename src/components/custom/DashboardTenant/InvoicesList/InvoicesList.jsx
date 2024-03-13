import { useEffect, useState } from 'react'
import useRequest from '../../../../axios/apis/useRequest'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import {
  Button,
  ButtonGroup,
  Card,
  Dropdown,
  Table,
} from '@themesberg/react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisH, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FormattedMessage } from 'react-intl'
import DeleteConfirmation from '../../global/DeleteConfirmation/DeleteConfirmation'
import { Wrapper } from './InvoicesList.styled'

export const InvoicesList = ({ productId }) => {
  const { getInvoicesList, deleteInvoice } = useRequest()
  const [invoices, setInvoices] = useState([])
  const [currentId, setCurrentId] = useState('')
  const [confirm, setConfirm] = useState(false)

  const handleDeleteInvoice = async () => {
    await deleteInvoice(currentId)
    setInvoices(invoices.filter((invoice) => invoice.id !== currentId))
    toast.success('Invoice deleted successfully')
  }

  const deleteConfirm = (id) => {
    setCurrentId(id)
    setConfirm(true)
  }

  useEffect(() => {
    const fetchInvoices = async () => {
      const invoicesData = await getInvoicesList()
      setInvoices(invoicesData.data.data)
      // dispatch(setAllInvoices(invoicesData));
    }
    fetchInvoices()
  }, [])

  const TableRow = ({ id, orderNumber, paidDate, orderTotal }) => {
    return (
      <tr>
        <td>{orderNumber}</td>
        <td>{new Date(paidDate).toLocaleDateString()}</td>
        <td>{orderTotal} $</td>
        {/* <td>
          <Dropdown as={ButtonGroup}>
            <Dropdown.Toggle
              as={Button}
              split
              variant="link"
              className="text-dark m-0 p-0"
            >
              <span className="icon icon-sm">
                <FontAwesomeIcon icon={faEllipsisH} className="icon-dark" />
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => deleteConfirm(id)}
                className="text-danger"
              >
                <FontAwesomeIcon icon={faTrashAlt} className="mx-2" />
                <FormattedMessage id="Delete" />
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </td> */}
      </tr>
    )
  }

  return (
    <Wrapper>
      <Card className="m-3  mt-0">
        <Card.Body>
          <div className="border-top-1 border-light">
            <Card
              border="light"
              className="table-wrapper table-responsive shadow-sm"
            >
              <Card.Body className="pt-0">
                <Table hover className="user-table align-items-center">
                  <thead>
                    <tr>
                      <th className="border-bottom">
                        <FormattedMessage id="Invoice-Number" />
                      </th>
                      <th className="border-bottom">
                        <FormattedMessage id="Invoice-Date" />
                      </th>
                      <th className="border-bottom">
                        <FormattedMessage id="Total" />
                      </th>
                      {/* <th className="border-bottom">
                    <FormattedMessage id="Actions" />
                  </th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id} {...invoice} />
                    ))}
                  </tbody>
                </Table>
                <DeleteConfirmation
                  message={
                    <FormattedMessage id="delete-invoice-confirmation-message" />
                  }
                  icon="pi pi-exclamation-triangle"
                  confirm={confirm}
                  setConfirm={setConfirm}
                  confirmFunction={handleDeleteInvoice}
                  sideBar={false}
                />
              </Card.Body>
            </Card>
          </div>
        </Card.Body>
      </Card>
    </Wrapper>
  )
}

export default InvoicesList
