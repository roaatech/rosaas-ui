import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEllipsisH,
  faEdit,
  faSyncAlt,
  faBan,
} from '@fortawesome/free-solid-svg-icons'

import {
  ButtonGroup,
  Card,
  Table,
  Button,
  Dropdown,
} from '@themesberg/react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { Wrapper } from './SecretMangements.styled'

import Label from '../../../Shared/label/Label'
import { activeStatus } from '../../../../../const/product'
import { useDispatch } from 'react-redux'
import useRequest from '../../../../../axios/apis/useRequest'
import { deleteClientSecret } from '../../../../../store/slices/products/productsSlice'
import { formatDate } from '../../../../../lib/sharedFun/Time'
import ThemeDialog from '../../../Shared/ThemeDialog/ThemeDialog'
import CreateSecretForm from './CreateSecretForm/CreateSecretForm'
import DeleteConfirmation from '../../../global/DeleteConfirmation/DeleteConfirmation'
import { clientCredentialsSecrets } from '../../../../../store/slices/products/productsSlice'
import DateLabel from '../../../Shared/DateLabel/DateLabel'

const SecretMangements = ({ data, currentClientId }) => {
  const [confirm, setConfirm] = useState(false)
  const [currentId, setCurrentId] = useState('')
  const [type, setType] = useState('')

  const { getClientSecrets, DeleteClientSecret: DeleteClientSecretReq } =
    useRequest()
  const dispatch = useDispatch()

  const deleteConfirm = (id) => {
    setCurrentId(id)
    setConfirm(true)
  }
  const editForm = (id) => {
    setType('edit')
    setCurrentId(id)
    setVisible(true)
  }
  const regenerateClientSecret = (id) => {
    setType('regenerate')
    setCurrentId(id)
    setVisible(true)
  }
  const productId = data?.id

  const isExpirationValid = (expirationDate, created) => {
    const expiration = expirationDate && new Date(expirationDate)

    const currentDate = new Date()
    if (expiration >= currentDate || expirationDate == null) {
      return true
    } else return false
  }

  useEffect(() => {
    if (
      !data ||
      data.clientCredentials?.[currentClientId]?.clientCredentialsSecrets
    ) {
      return
    }
    ;(async () => {
      const listData = await getClientSecrets(productId, currentClientId)

      dispatch(
        clientCredentialsSecrets({
          productId,
          clientId: currentClientId,
          data: listData?.data.data,
        })
      )
    })()
  }, [])
  const [clientRecordId, setClientRecordId] = useState()
  const [visible, setVisible] = useState(false)

  const handleDeleteSecret = async () => {
    await DeleteClientSecretReq(productId, clientRecordId, currentId)
    dispatch(
      deleteClientSecret({
        productId,
        itemId: currentId,
        clientId: clientRecordId,
      })
    )
  }
  const [client, setClient] = useState()
  const TableRow = (props) => {
    const { clientId, description, id, created, clientRecordId, expiration } =
      props
    const createdDate = created && new Date(created)
    const expirationDate = expiration && new Date(expiration)
    useEffect(() => {
      setClient(currentClientId)
      setClientRecordId(clientRecordId)
    }, [currentClientId, clientRecordId])

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
                  {...activeStatus[isExpirationValid(expiration, created)]}
                />
              }
            </span>
          </td>
          <td>
            <span className="fw-normal">
              <Label
                {...{
                  background: '#cccccc40',
                  value: formatDate(createdDate),
                  lighter: true,
                }}
              />
            </span>
          </td>
          <td>
            <span className="fw-normal">
              {expirationDate && (
                <DateLabel
                  endDate={expirationDate && formatDate(expirationDate)}
                />
              )}
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
                    editForm(id)
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} className="mx-2" />
                  <FormattedMessage id="Edit" />
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => deleteConfirm(id)}
                  className="text-danger"
                >
                  <FontAwesomeIcon icon={faBan} className="mx-2" />
                  <FormattedMessage id="Revoke" />
                </Dropdown.Item>
                <Dropdown.Item onClick={() => regenerateClientSecret(id)}>
                  <FontAwesomeIcon icon={faSyncAlt} className="mx-2" />
                  <FormattedMessage id="Regenerate-Secret" />
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
      {/* <div className="dynamicButtons pt-0 mt-0 mb-1">
        <DynamicButtons
          buttons={[
            {
              popupLabel: <FormattedMessage id="Create-New-Secret" />,
              order: 1,
              type: 'form',
              label: 'New-Secret',
              component: 'createSecret',
              clientId: client,
              icon: <BsPlusCircleFill />,
              formType: 'create',
            },
            {
              popupLabel: <FormattedMessage id="Show-Client-Id" />,
              order: 4,
              type: 'form',
              label: 'Show-Client-Id',
              component: 'createSecret',
              clientId: client,
              icon: <BsEyeFill />,
              formType: 'showClientId',
            },
          ]}
        />
      </div> */}
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
                  <FormattedMessage id="Secret-Display-Name" />
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
              {data?.clientCredentials &&
              currentClientId &&
              data.clientCredentials?.[currentClientId]
                ?.clientCredentialsSecrets &&
              Object.values(
                data.clientCredentials?.[currentClientId]
                  ?.clientCredentialsSecrets
              ).length
                ? Object.values(
                    data.clientCredentials?.[currentClientId]
                      ?.clientCredentialsSecrets
                  ).map((t, index) => {
                    if (t != undefined) {
                      return <TableRow key={index} {...t} />
                    }
                  })
                : null}
            </tbody>
          </Table>
          <DeleteConfirmation
            message="Are you sure you want to revoke this secret?"
            icon="pi pi-exclamation-triangle"
            confirm={confirm}
            setConfirm={setConfirm}
            confirmFunction={handleDeleteSecret}
            sideBar={false}
          />
        </Card.Body>
      </Card>

      <ThemeDialog visible={visible} setVisible={setVisible}>
        <>
          <CreateSecretForm
            popupLabel={
              type == 'edit' ? (
                <FormattedMessage id="Edit" />
              ) : (
                <FormattedMessage id="Regenerate" />
              )
            }
            type={type}
            setVisible={setVisible}
            currentClientId={currentClientId}
            currentId={currentId}
          />
        </>
      </ThemeDialog>
    </Wrapper>
  )
}

export default SecretMangements
