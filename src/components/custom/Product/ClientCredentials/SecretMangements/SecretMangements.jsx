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
import { FormattedMessage, useIntl } from 'react-intl'
import { Wrapper } from './SecretMangements.styled'

import Label from '../../../Shared/label/Label'
import { activeStatus } from '../../../../../const/product'
import { useDispatch } from 'react-redux'
import useRequest from '../../../../../axios/apis/useRequest'
import { deleteClientSecret } from '../../../../../store/slices/products/productsSlice'
import { formatDate } from '../../../../../lib/sharedFun/Time'
import ThemeDialog from '../../../Shared/ThemeDialog/ThemeDialog'
import CreateSecretForm from './CreateSecretForm/CreateSecretForm'
import { clientCredentialsSecrets } from '../../../../../store/slices/products/productsSlice'
import DateLabel from '../../../Shared/DateLabel/DateLabel'
import SafeFormatMessage from '../../../Shared/SafeFormatMessage/SafeFormatMessage'
import ConfirmationForm from '../../../Shared/ConfirmationForm/ConfirmationForm'
import { AiFillWarning } from 'react-icons/ai'

const SecretMangements = ({ data, currentClientId }) => {
  const [currentId, setCurrentId] = useState('')
  const [type, setType] = useState('')
  const intl = useIntl()

  // New state variables for confirmation dialog
  const [confirmationVisible, setConfirmationVisible] = useState(false)
  const [confirmationType, setConfirmationType] = useState('')
  const [popupLabel, setPopupLabel] = useState('')
  const [confirmationValue, setConfirmationValue] = useState('')
  const [confirmationMessage, setConfirmationMessage] = useState('')
  const [variant, setVariant] = useState('')
  const [confirmationInputLabel, setConfirmationInputLabel] = useState('')
  const [confirmationTooltipMessage, setConfirmationTooltipMessage] =
    useState('')
  const { getClientSecrets, DeleteClientSecret: DeleteClientSecretReq } =
    useRequest()
  const dispatch = useDispatch()

  const deleteConfirm = (id) => {
    setCurrentId(id)
    setConfirmationType('revoke')
    setConfirmationVisible(true)
  }

  const regenerateConfirm = (id) => {
    setCurrentId(id)
    setConfirmationType('regenerate')
    setConfirmationVisible(true)
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

  // Function to set confirmation dialog properties based on type
  const setConfirmationDialog = (type) => {
    switch (type) {
      case 'revoke':
        setPopupLabel(intl.formatMessage({ id: 'Revoke-Secret' }))
        setConfirmationValue('REVOKE')
        setConfirmationMessage(
          <>
            <AiFillWarning className="mx-1 mb-1" />
            <SafeFormatMessage id="Warning" /> !{' '}
            <SafeFormatMessage id="Revoke-Secret-Confirmation" />
          </>
        )
        setVariant('danger')
        setConfirmationInputLabel(
          SafeFormatMessage({
            id: 'type-REVOKE-to-confirm',
            values: { Revoke: 'REVOKE' },
            boldValue: 'Revoke',
          })
        )
        setConfirmationTooltipMessage(
          SafeFormatMessage({
            id: 'To-revoke-the-Secret-enter-Revoke',
            values: { Revoke: 'REVOKE' },
            boldValue: 'Revoke',
          })
        )
        break
      case 'regenerate':
        setPopupLabel(intl.formatMessage({ id: 'Regenerate-Secret' }))
        setConfirmationValue('REGENERATE')
        setConfirmationMessage(
          <>
            <AiFillWarning className="mx-1 mb-1" />
            <SafeFormatMessage id="Warning" /> !{' '}
            <SafeFormatMessage id="Regenerate-Secret-Confirmation" />
          </>
        )
        setVariant('warning')
        setConfirmationInputLabel(
          SafeFormatMessage({
            id: 'type-REGENERATE-to-confirm',
            boldValue: 'REGENERATE',
            values: { REGENERATE: 'REGENERATE' },
          })
        )
        setConfirmationTooltipMessage(
          SafeFormatMessage({
            id: 'To-regenerate-the-Client-enter-Regenerate',
            values: { REGENERATE: 'REGENERATE' },
            boldValue: 'REGENERATE',
          })
        )
        break
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

  const handleConfirm = async () => {
    if (confirmationType === 'revoke') {
      await handleDeleteSecret()
    } else if (confirmationType === 'regenerate') {
      setType('regenerate')
      setVisible(true)
    }
    setConfirmationVisible(false)
  }

  const TableRow = (props) => {
    const { description, id, created, clientRecordId, expiration } = props
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
                  background: 'var(--misty-gray)',
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
                    setType('edit')
                    setCurrentId(id)
                    setVisible(true)
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} className="mx-2" />
                  <SafeFormatMessage id="Edit" />
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => deleteConfirm(id)}
                  className="text-danger"
                >
                  <FontAwesomeIcon icon={faBan} className="mx-2" />
                  <SafeFormatMessage id="Revoke" />
                </Dropdown.Item>
                <Dropdown.Item onClick={() => regenerateConfirm(id)}>
                  <span className="text-warning">
                    <FontAwesomeIcon icon={faSyncAlt} className="mx-2 " />
                    <SafeFormatMessage id="Regenerate-Secret" />
                  </span>
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
      <div className="border-top-1 border-light p-0" />
      <Card
        border="light"
        className="table-wrapper table-responsive shadow-sm "
      >
        <Card.Body className="pt-0">
          <Table hover className="user-table align-items-center">
            <thead>
              <tr>
                <th className="border-bottom">
                  <SafeFormatMessage id="Secret-Display-Name" />
                </th>
                <th className="border-bottom">
                  <SafeFormatMessage id="Status" />
                </th>

                <th className="border-bottom">
                  <SafeFormatMessage id="Created-Date" />
                </th>
                <th className="border-bottom">
                  <SafeFormatMessage id="expiration-date" />
                </th>
                <th className="border-bottom">
                  <SafeFormatMessage id="Actions" />
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

          {/* Remove old DeleteConfirmation component */}

          {/* New Confirmation Dialog */}
          {confirmationValue && (
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
                confirmationInputLabel={confirmationInputLabel}
                tooltipMessage={confirmationTooltipMessage}
              />
            </ThemeDialog>
          )}
        </Card.Body>
      </Card>

      {/* Existing ThemeDialog for CreateSecretForm */}
      <ThemeDialog visible={visible} setVisible={setVisible}>
        <>
          <CreateSecretForm
            popupLabel={
              type === 'edit' ? (
                <SafeFormatMessage id="Edit" />
              ) : (
                <SafeFormatMessage id="Regenerate" />
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
