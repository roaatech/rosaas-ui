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
import {
  BsArrowDown,
  BsArrowDownCircle,
  BsArrowUp,
  BsFillArrowDownCircleFill,
  BsFillArrowUpCircleFill,
  BsHourglassSplit,
  BsPlusCircleFill,
} from 'react-icons/bs'
import DynamicButtons from '../../Shared/DynamicButtons/DynamicButtons'

import Label from '../../Shared/label/Label'
import { activeStatus, clientTypeLable } from '../../../../const/product'
import { useDispatch, useSelector } from 'react-redux'
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
import SafeFormatMessage from '../../Shared/SafeFormatMessage/SafeFormatMessage'
import ConfirmationForm from '../../Shared/ConfirmationForm/ConfirmationForm'
import DataLabelWhite from '../../Shared/DateLabelWhite/DateLabelWhite'
const ClientCredentials = ({ data }) => {
  const [confirm, setConfirm] = useState(false)
  const [currentClientId, setCurrentClientId] = useState('')

  const [currentClientIdManagement, setCurrentClientIdManagement] = useState('')
  const [type, setType] = useState('')
  const [confirmationVisible, setConfirmationVisible] = useState(false)
  const [confirmationType, setConfirmationType] = useState('')
  const [popupLabel, setPopupLabel] = useState('')
  const [confirmationValue, setConfirmationValue] = useState('')
  const [confirmationMessage, setConfirmationMessage] = useState('')
  const [variant, setVariant] = useState('')
  const intl = useIntl()
  const { deleteClient, getClientsListByProduct, activateClient } = useRequest()
  const dispatch = useDispatch()
  const allProducts = useSelector((state) => state.products.products)
  const productId = data?.id
  useEffect(() => {
    if (confirmationVisible) {
      return
    }
    console.log('***********')

    !confirmationVisible && setConfirmationValue('')
  }, [confirmationVisible])

  const id =
    allProducts[productId]?.client?.id ||
    allProducts[productId]?.productOwner?.id

  const deleteConfirm = (id) => {
    setCurrentClientId(id)
    setConfirmationType('revoke')
    setConfirmationVisible(true)
  }
  const deactivateConfirm = (id, clientFriendlyId) => {
    setConfirmationValue(clientFriendlyId)
    setCurrentClientId(id)
    setConfirmationType('deactivate')
    setConfirmationVisible(true)
  }
  const activateConfirm = (id, clientFriendlyId) => {
    setConfirmationValue(clientFriendlyId)
    setCurrentClientId(id)
    setConfirmationType('activate')
    setConfirmationVisible(true)
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

  useEffect(() => {
    if (!data || data.clientCredentials) {
      return
    }
    ;(async () => {
      const listData = await getClientsListByProduct(productId, id)
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

  const handleConfirm = async () => {
    if (confirmationType === 'revoke') {
      await deleteClient(productId, currentClientId)
      dispatch(deleteClientCredentials({ productId, itemId: currentClientId }))
    } else if (confirmationType === 'deactivate') {
      toggleActiveClient(currentClientId, true)
    } else if (confirmationType === 'activate') {
      toggleActiveClient(currentClientId, false)
    }
    setConfirmationVisible(false)
  }

  // Function to set confirmation dialog properties based on type
  const setConfirmationDialog = (type) => {
    switch (type) {
      case 'revoke':
        setPopupLabel(intl.formatMessage({ id: 'Revoke-Client' }))
        setConfirmationValue('REVOKE')
        setConfirmationMessage(
          intl.formatMessage({ id: 'Revoke-Client-Confirmation' })
        )
        setVariant('danger')
        break

      case 'activate':
        setPopupLabel(intl.formatMessage({ id: 'Activate-Client' }))
        setConfirmationMessage(
          intl.formatMessage({ id: 'Activate-Client-Confirmation' })
        )
        setVariant('success')
        break
      case 'deactivate':
        setPopupLabel(intl.formatMessage({ id: 'Deactivate-Client' }))
        setConfirmationMessage(
          intl.formatMessage({ id: 'Deactivate-Client-Confirmation' })
        )
        setVariant('warning')
        break
      // Add more cases as needed
      default:
        break
    }
  }

  // When confirmationType changes, update the confirmation dialog properties
  useEffect(() => {
    if (confirmationType) {
      setConfirmationDialog(confirmationType)
    }
  }, [confirmationType])
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
            <td>
              <Button
                variant="secondary"
                onClick={() => manageClientSecret(id)}
                className="icon-transition "
                style={{
                  transition: 'transform 0.9s ease',
                }}
              >
                {SecretManagementVisible[id] ? (
                  <>
                    <BsFillArrowUpCircleFill />{' '}
                    <SafeFormatMessage id="Secrets" />
                  </>
                ) : (
                  <>
                    <BsFillArrowDownCircleFill />{' '}
                    <SafeFormatMessage id="Secrets" />
                  </>
                )}
              </Button>
            </td>
          </td>
          <td>
            <span className="fw-normal">{displayName}</span>
          </td>
          <td>
            <span className="fw-normal">
              <DataLabelWhite
                text={clientId}
                showCopyButton={true}
                style={{ fontWeight: 'bold' }}
                variant={'gray'}
              />
            </span>
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
                <Dropdown.Item
                  onSelect={() => {
                    editForm(id)
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} className="mx-2" />
                  <SafeFormatMessage id="Edit" />
                </Dropdown.Item>
                <Dropdown.Divider />

                <Dropdown.Item
                  onClick={() =>
                    isActive
                      ? deactivateConfirm(id, clientId)
                      : activateConfirm(id, clientId)
                  }
                >
                  {!isActive ? (
                    <span className="text-success">
                      <AiOutlineCheckCircle className="mx-2" />
                      <SafeFormatMessage id="Activate" />
                    </span>
                  ) : (
                    <span className="text-danger">
                      <AiOutlineCloseCircle className="mx-2" />
                      <SafeFormatMessage id="Deactivate" />
                    </span>
                  )}
                </Dropdown.Item>

                <Dropdown.Item
                  onClick={() => deleteConfirm(id)}
                  className="text-danger"
                >
                  <FontAwesomeIcon icon={faBan} className="mx-2" />
                  <SafeFormatMessage id="Revoke" />
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => createNewSecret(id)}>
                  <BsPlusCircleFill className="mx-2" />{' '}
                  <SafeFormatMessage id="New-Secret" />
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
              popupLabel: <SafeFormatMessage id="Create-New-Client" />,
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
                  <SafeFormatMessage id="Client-Name" />
                </th>
                <th className="border-bottom">
                  <SafeFormatMessage id="Client-Id" />
                </th>
                <th className="border-bottom">
                  <SafeFormatMessage id="Status" />
                </th>

                <th className="border-bottom">
                  <SafeFormatMessage id="Client-Type" />
                </th>
                <th className="border-bottom">
                  <SafeFormatMessage id="Access-Token-Life-Time" />
                </th>
                <th className="border-bottom">
                  <SafeFormatMessage id="Description" />
                </th>
                <th className="border-bottom">
                  <SafeFormatMessage id="Created-Date" />
                </th>
                <th className="border-bottom">
                  <SafeFormatMessage id="Actions" />
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

          {/* <DeleteConfirmation
            message="Are you sure you want to revoke this secret?"
            icon="pi pi-exclamation-triangle"
            confirm={confirm}
            setConfirm={setConfirm}
            confirmFunction={handleDeleteSecret}
            sideBar={false}
          /> */}
        </Card.Body>
      </Card>

      <ThemeDialog visible={visible} setVisible={setVisible}>
        <>
          <CreateClientForm
            popupLabel={
              type == 'edit' ? (
                <SafeFormatMessage id="Edit" />
              ) : (
                <SafeFormatMessage id="Regenerate" />
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
          popupLabel={<SafeFormatMessage id="Create-New-Secret" />}
          type={'create'}
          currentClientId={currentClientId}
          setVisible={setvisibleSecret}
        />
      </ThemeDialog>
      {
        <ThemeDialog
          visible={confirmationVisible}
          setVisible={setConfirmationVisible}
        >
          <ConfirmationForm
            setVisible={setConfirmationVisible}
            popupLabel={popupLabel}
            confirmationValue={confirmationValue}
            confirmationMessage={confirmationMessage}
            onConfirm={handleConfirm}
            variant={variant}
            setConfirmationValue={setConfirmationValue}
          />
        </ThemeDialog>
      }
    </Wrapper>
  )
}

export default ClientCredentials
