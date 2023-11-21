import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEye,
  faEyeSlash,
  faCopy,
  faEllipsisH,
  faEdit,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons'
import {
  ButtonGroup,
  Card,
  Col,
  Row,
  Table,
  Button,
  Dropdown,
} from '@themesberg/react-bootstrap'
import { FormattedMessage } from 'react-intl'
import DeleteConfirmation from '../../global/DeleteConfirmation/DeleteConfirmation'
import { Wrapper } from './ClientCredentials.styled'
import { BsPlusCircle, BsPlusCircleFill } from 'react-icons/bs'
import DynamicButtons from '../../Shared/DynamicButtons/DynamicButtons'

import DescriptionCell from '../../Shared/DescriptionCell/DescriptionCell'
import TableDate from '../../Shared/TableDate/TableDate'
import Label from '../../Shared/label/Label'
import { expirationStatus } from '../../../../const/product'
import { useDispatch, useSelector } from 'react-redux'
import useRequest from '../../../../axios/apis/useRequest'
import {
  clientCredentials,
  deleteClientSecret,
} from '../../../../store/slices/products/productsSlice'
import { formatDate } from '../../../../lib/sharedFun/Time'
import ThemeDialog from '../../Shared/ThemeDialog/ThemeDialog'

const ClientCredentials = ({ data }) => {
  const [confirm, setConfirm] = useState(false)
  const [currentId, setCurrentId] = useState('')
  const { getClientSecrets, DeleteClientSecret: DeleteClientSecretReq } =
    useRequest()
  const dispatch = useDispatch()

  const deleteConfirm = (id) => {
    setCurrentId(id)
    setConfirm(true)
  }
  const productId = data?.id
  console.log({ data })

  const isExpirationValid = (expirationDate, created) => {
    const expiration = new Date(expirationDate)
    console.log(expiration)

    const currentDate = new Date()
    if (expiration >= currentDate || expirationDate == null) {
      return true
    } else return false
  }
  useEffect(() => {
    if (!data || data.clientCredentials) {
      return
    }
    ;(async () => {
      const listData = await getClientSecrets(productId, data?.client?.id)
      console.log(listData?.data.data)
      dispatch(
        clientCredentials({
          id: productId,
          data: listData?.data.data,
        })
      )
    })()
  }, [])
  const [clientRecordId, setClientRecordId] = useState()
  const handleDeleteSecret = async () => {
    await DeleteClientSecretReq(clientRecordId, currentId)
    dispatch(deleteClientSecret({ productId, id: currentId }))
  }
  const [client, setClient] = useState()
  const TableRow = (props) => {
    const { clientId, description, id, created, clientRecordId, expiration } =
      props
    setClient(clientId)
    setClientRecordId(clientRecordId)

    return (
      <>
        <tr>
          <td>
            <span className="fw-normal">{description}</span>
          </td>

          <td>
            <span className="fw-normal">
              {
                <Label
                  {...expirationStatus[isExpirationValid(expiration, created)]}
                />
              }
            </span>
          </td>
          <td>
            <span className="fw-normal">{created && formatDate(created)}</span>
          </td>
          <td>
            <span className="fw-normal">
              {expiration && formatDate(expiration)}
            </span>
          </td>
          <td>
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
                  onSelect={() => {
                    // editForm(id)
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} className="mx-2" />
                  <FormattedMessage id="Edit" />
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => deleteConfirm(id)}
                  className="text-danger"
                >
                  <FontAwesomeIcon icon={faTrashAlt} className="mx-2" />
                  <FormattedMessage id="Delete" />
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </td>
        </tr>
      </>
    )
  }
  return (
    <Wrapper>
      <div className="dynamicButtons pt-0 mt-0 mb-1">
        <DynamicButtons
          buttons={[
            {
              order: 1,
              type: 'form',
              label: 'New-Secret',
              component: 'createSecret',
              clientId: client,
              icon: <BsPlusCircleFill />,
            },
          ]}
        />
      </div>
      <div className="border-top-1 border-light p-0" />
      <Card
        border="light"
        className="table-wrapper table-responsive shadow-sm "
      >
        <Card.Body className="pt-0">
          {/* <ClientIdField /> */}
          <Table hover className="user-table align-items-center">
            <thead>
              <tr>
                <th className="border-bottom">
                  <FormattedMessage id="Secret-Title" />
                </th>
                <th className="border-bottom">
                  <FormattedMessage id="Status" />
                </th>

                <th className="border-bottom">
                  <FormattedMessage id="Created-Date" />
                </th>
                <th className="border-bottom">
                  <FormattedMessage id="expiration-date" />
                </th>
                <th className="border-bottom">
                  <FormattedMessage id="Actions" />
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.clientCredentials?.data &&
              Object.values(data?.clientCredentials?.data).length
                ? Object.values(data?.clientCredentials?.data).map(
                    (t, index) => {
                      if (t != undefined) {
                        return <TableRow key={index} {...t} />
                      }
                    }
                  )
                : null}
            </tbody>
          </Table>
          <DeleteConfirmation
            message={<FormattedMessage id="delete-plan-confirmation-message" />}
            icon="pi pi-exclamation-triangle"
            confirm={confirm}
            setConfirm={setConfirm}
            confirmFunction={handleDeleteSecret}
            sideBar={false}
          />
        </Card.Body>
      </Card>

      {/* <ThemeDialog visible={visible} setVisible={setVisible}>
          <>
            <PlanForm
              popupLabel={<FormattedMessage id={popUpLable} />}
              type={type}
              setVisible={setVisible}
              sideBar={false}
              planData={type == 'edit' ? list?.plans[currentId] : {}}
            />
          </>
        </ThemeDialog> */}
    </Wrapper>
  )
}

export default ClientCredentials
