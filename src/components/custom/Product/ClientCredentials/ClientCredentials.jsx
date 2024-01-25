import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisH, faEdit, faBan } from '@fortawesome/free-solid-svg-icons'
import {
  ButtonGroup,
  Card,
  Table,
  Button,
  Dropdown,
} from '@themesberg/react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import DeleteConfirmation from '../../global/DeleteConfirmation/DeleteConfirmation'
import { Wrapper } from './ClientCredentials.styled'
import { BsHourglassSplit, BsPlusCircleFill } from 'react-icons/bs'
import DynamicButtons from '../../Shared/DynamicButtons/DynamicButtons'

import Label from '../../Shared/label/Label'
import {
  Product_Client_id,
  activeStatus,
  clientTypeLable,
} from '../../../../const/product'
import { useDispatch } from 'react-redux'
import useRequest from '../../../../axios/apis/useRequest'
import {
  clientCredentials,
  deleteClientCredentials,
  updateClientCredentialAttr,
} from '../../../../store/slices/products/productsSlice'
import { formatDate } from '../../../../lib/sharedFun/Time'
import ThemeDialog from '../../Shared/ThemeDialog/ThemeDialog'
import CreateClientForm from './CreateClientForm/CreateClientForm'
import SecretMangements from './SecretMangements/SecretMangements'
import { GiThreeKeys } from 'react-icons/gi'
import CreateSecretForm from './SecretMangements/CreateSecretForm/CreateSecretForm'
import DescriptionCell from '../../Shared/DescriptionCell/DescriptionCell'
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai'

const ClientCredentials = ({ data }) => {
  const [confirm, setConfirm] = useState(false)
  const [currentClientId, setCurrentClientId] = useState('')
  const [currentClientIdManagement, setCurrentClientIdManagement] = useState('')
  const [type, setType] = useState('')
  const intl = useIntl()
  const { deleteClient, getClientsListByProduct, activateClient } = useRequest()
  const dispatch = useDispatch()

  const deleteConfirm = (id) => {
    setCurrentClientId(id)
    setConfirm(true)
  }
  const editForm = (id) => {
    setType('edit')
    setCurrentClientId(id)
    setVisible(true)
  }
  const createNewSecret = (id) => {
    setType('create')
    setCurrentClientId(id)
    setvisibleSecret(true)
  }

  const manageClientSecret = (id) => {
    setCurrentClientIdManagement(id)
    setSecretManagementVisible((prevVisibility) => {
      const updatedVisibility = {}

      Object.keys(prevVisibility).forEach((key) => {
        updatedVisibility[key] = false
      })

      updatedVisibility[id] = !prevVisibility[id]

      return updatedVisibility
    })
  }
  const productId = data?.id

  useEffect(() => {
    if (!data || data.clientCredentials) {
      return
    }
    ;(async () => {
      const listData = await getClientsListByProduct(
        productId,
        Product_Client_id
      )
      dispatch(
        clientCredentials({
          id: productId,
          data: listData?.data.data,
        })
      )
    })()
  }, [])

  const toggleActiveClient = async (id, isActive) => {
    await activateClient(productId, id, {
      isActive: !isActive,
    })

    dispatch(
      updateClientCredentialAttr({
        productId,
        itemId: id,
        attributeName: 'isActive',
        attributeValue: !isActive,
      })
    )
  }

  const [visible, setVisible] = useState(false)
  const [visibleSecret, setvisibleSecret] = useState(false)
  const [SecretManagementVisible, setSecretManagementVisible] = useState(false)
  const handleDeleteSecret = async () => {
    await deleteClient(productId, currentClientId)
    dispatch(deleteClientCredentials({ productId, itemId: currentClientId }))
  }
  const TableRow = (props) => {
    const {
      id,
      clientId,
      displayName,
      description,
      isActive,
      accessTokenLifetimeInHour,
      clientType,
      createdDate,
      className,
    } = props

    return (
      <>
        <tr className={className}>
          <td>
            <Button variant="primary" onClick={() => manageClientSecret(id)}>
              <GiThreeKeys />
            </Button>
          </td>
          <td>
            <span className="fw-normal">{displayName}</span>
          </td>
          <td>
            <span className="fw-normal">{clientId}</span>
          </td>

          <td>
            <span className="fw-normal">
              <Label {...activeStatus[isActive ? isActive : false]} />
            </span>
          </td>

          <td>
            <span className="fw-normal">
              <Label {...clientTypeLable[clientType]} />
            </span>
          </td>
          <td>
            <span className="fw-normal">
              <Label
                icon={<BsHourglassSplit />}
                value={` ${accessTokenLifetimeInHour}
                  ${intl.formatMessage({ id: 'Hour' })}`}
              />{' '}
            </span>
          </td>
          <td className="description">
            <span className="fw-normal">
              <DescriptionCell data={{ description }} />
            </span>
          </td>
          <td>
            <span className="fw-normal">
              {createdDate && formatDate(createdDate)}
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
                <Dropdown.Item onClick={() => toggleActiveClient(id, isActive)}>
                  {!isActive ? (
                    <span className=" ">
                      <AiOutlineCheckCircle className="mx-2" />
                      <FormattedMessage id="Activate" />
                    </span>
                  ) : (
                    <span className=" ">
                      <AiOutlineCloseCircle className="mx-2" />
                      <FormattedMessage id="Deactivate" />
                    </span>
                  )}
                </Dropdown.Item>
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
                <Dropdown.Item onClick={() => createNewSecret(id)}>
                  <BsPlusCircleFill className="mx-2" />{' '}
                  <FormattedMessage id="New-Secret" />
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
              popupLabel: <FormattedMessage id="Create-New-Client" />,
              order: 1,
              type: 'form',
              label: 'New-Client',
              component: 'createClient',
              clientId: currentClientId,
              icon: <BsPlusCircleFill />,
              formType: 'create',
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
                <th className="border-bottom"></th>
                <th className="border-bottom">
                  <FormattedMessage id="Client-Name" />
                </th>
                <th className="border-bottom">
                  <FormattedMessage id="Client-Id" />
                </th>
                <th className="border-bottom">
                  <FormattedMessage id="Status" />
                </th>

                <th className="border-bottom">
                  <FormattedMessage id="Client-Type" />
                </th>
                <th className="border-bottom">
                  <FormattedMessage id="Access-Token-Life-Time" />
                </th>
                <th className="border-bottom">
                  <FormattedMessage id="Description" />
                </th>
                <th className="border-bottom">
                  <FormattedMessage id="Created-Date" />
                </th>
                <th className="border-bottom">
                  <FormattedMessage id="Actions" />
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.clientCredentials &&
              Object.values(data?.clientCredentials).length
                ? Object.values(data?.clientCredentials).map((t, index) => {
                    if (t != undefined) {
                      return (
                        <React.Fragment key={index}>
                          {/* Client credential details */}
                          <TableRow
                            className={
                              SecretManagementVisible[t.id] &&
                              `SecretMangements`
                            }
                            {...t}
                          />

                          {/* SecretMangements component */}
                          <tr className="SecretMangements">
                            {SecretManagementVisible[t.id] && (
                              <td colSpan="9">
                                <SecretMangements
                                  data={data}
                                  currentClientId={currentClientIdManagement}
                                />
                              </td>
                            )}
                          </tr>
                        </React.Fragment>
                      )
                    }
                  })
                : null}{' '}
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
          <CreateClientForm
            popupLabel={
              type == 'edit' ? (
                <FormattedMessage id="Edit" />
              ) : (
                <FormattedMessage id="Regenerate" />
              )
            }
            type={type}
            setVisible={setVisible}
            currentId={currentClientId}
          />
        </>
      </ThemeDialog>
      <ThemeDialog visible={visibleSecret} setVisible={setvisibleSecret}>
        <CreateSecretForm
          popupLabel={<FormattedMessage id="Create-New-Secret" />}
          type={'create'}
          currentClientId={currentClientId}
          setVisible={setvisibleSecret}
        />
      </ThemeDialog>
    </Wrapper>
  )
}

export default ClientCredentials
