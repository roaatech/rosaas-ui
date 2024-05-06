import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Button,
  ButtonGroup,
  Card,
  Dropdown,
  Table,
} from '@themesberg/react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEdit,
  faEllipsisH,
  faEye,
  faEyeSlash,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons'
import DeleteConfirmation from '../../global/DeleteConfirmation/DeleteConfirmation'
// import WebhookForm from './WebhookForm/WebhookForm' // You'll need to create this component for adding/editing webhooks
import { Wrapper } from './WebhookList.styled' // You'll need to define your own styled components if needed
import { toast } from 'react-toastify' // If you're using toast notifications
import ThemeDialog from '../../Shared/ThemeDialog/ThemeDialog'
import CreateWebhookForm from './WebhookForm/WebhookForm'
import DynamicButtons from '../../Shared/DynamicButtons/DynamicButtons'
import {
  MdOutlinePublishedWithChanges,
  MdOutlineUnpublished,
  MdWeb,
} from 'react-icons/md'
import useRequest from '../../../../axios/apis/useRequest'
import { useParams } from 'react-router-dom'
import {
  deleteWebhookEndpointById,
  setAllWebhookEndpoints,
  WebhookEndpointsChangeAttr,
} from '../../../../store/slices/products/productsSlice'
import {
  NodeService,
  webhhookActiveStatus,
} from '../../../../const/webhookEndpoints'
import DescriptionCell from '../../Shared/DescriptionCell/DescriptionCell'
import Label from '../../Shared/label/Label'
import { FormattedMessage } from 'react-intl'
import DataLabelWhite from '../../Shared/DateLabelWhite/DateLabelWhite'

export const WebhookList = ({}) => {
  const {
    getWebhookEndpointsList,
    activateWebhookEndpoint,
    deleteWebhookEndpoint,
  } = useRequest()
  const [confirm, setConfirm] = useState(false)
  const [currentId, setCurrentId] = useState('')
  const [visible, setVisible] = useState(false)
  const [popUpLable, setPopUpLable] = useState('')
  const dispatch = useDispatch()
  const params = useParams()
  const products = useSelector((state) => state?.products?.products)
  const webhooks = products?.[params.id]?.webhookEndpoints
  useEffect(() => {
    ;(async () => {
      if (!webhooks) {
        const WebhookEndpointsList = await getWebhookEndpointsList(params.id)
        dispatch(
          setAllWebhookEndpoints({
            productId: params.id,
            data: WebhookEndpointsList.data.data,
          })
        )
      }
    })()
  }, [])

  const handleDeleteWebhook = async () => {
    await deleteWebhookEndpoint(params.id, currentId)
    dispatch(
      deleteWebhookEndpointById({
        productId: params.id,
        webhookEndpointId: currentId,
      })
    )
  }

  const deleteConfirm = (id) => {
    setCurrentId(id)
    setConfirm(true)
  }

  const editForm = (id) => {
    setCurrentId(id)
    setVisible(true)
    setPopUpLable('Edit Webhook')
  }
  const renderEvents = (eventsToListen) => {
    const eventLabels = eventsToListen?.map((eventKey) => {
      const findLabel = (nodes, key, parentLabel = '') => {
        for (const node of nodes) {
          const currentLabel = parentLabel
            ? `${parentLabel}.${node.label}`
            : node.label

          if (node.key === key) {
            return currentLabel
          }
          if (node.children) {
            const childLabel = findLabel(node.children, key, currentLabel)
            if (childLabel) {
              return childLabel
            }
          }
        }
        return null
      }

      const label = findLabel(NodeService.getTreeNodesData(), eventKey)

      return label ? label : null
    })

    return eventLabels
      ? eventLabels.map((label) => (
          <div className="mb-3 mt-2 " key={label}>
            <DataLabelWhite text={label} />
          </div>
        ))
      : ''
  }
  const toggleActivateWebhooksEndpoint = async (id, isActive) => {
    await activateWebhookEndpoint(params.id, id, {
      isActive: !isActive,
    })

    dispatch(
      WebhookEndpointsChangeAttr({
        productId: params.id,
        endpointId: id,
        attr: 'isActive',
        value: !isActive,
      })
    )
  }

  const [showSigningSecret, setShowSigningSecret] = useState({})

  const handleToggleShowSecret = (webhookId) => {
    setShowSigningSecret((prevState) => ({
      ...prevState,
      [webhookId]: !prevState[webhookId],
    }))
  }
  return (
    <Wrapper>
      <div className="dynamicButtons pt-0 mt-0 mb-1 ">
        <DynamicButtons
          buttons={[
            {
              order: 1,
              type: 'form',
              label: 'Add-Endpoint',
              component: 'addEndpoint',
              icon: <MdWeb />,
              formType: 'create',
            },
          ]}
        />
      </div>
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
                    <FormattedMessage id="URL" />
                  </th>
                  <th className="border-bottom">
                    <FormattedMessage id="Events-To-Listen" />
                  </th>
                  <th className="border-bottom">
                    <FormattedMessage id="Signing-secret" />
                  </th>
                  <th className="border-bottom">
                    <FormattedMessage id="Activation-Status" />
                  </th>
                  <th className="border-bottom">
                    <FormattedMessage id="Description" />
                  </th>
                  <th className="border-bottom">
                    <FormattedMessage id="Actions" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {webhooks &&
                  Object.values(webhooks).map((webhook) => {
                    return (
                      <tr key={webhook.id}>
                        <td>{webhook.url}</td>
                        <td>
                          <DescriptionCell
                            data={{
                              description: renderEvents(
                                webhook?.eventsToListen
                              ),
                              minHeight: 40,
                            }}
                          />
                        </td>
                        <td>
                          {showSigningSecret[webhook.id] ? (
                            <span>{webhook.signingSecret}</span>
                          ) : (
                            <span>
                              <FormattedMessage id="Reveal" />
                            </span>
                          )}
                          <FontAwesomeIcon
                            icon={
                              showSigningSecret[webhook.id] ? faEyeSlash : faEye
                            }
                            onClick={() => handleToggleShowSecret(webhook.id)}
                            className="ml-2"
                            style={{ cursor: 'pointer' }}
                          />
                        </td>{' '}
                        <td>
                          <Label
                            {...webhhookActiveStatus[
                              webhook.isActive ? webhook.isActive : false
                            ]}
                          />
                        </td>
                        <td>
                          <DescriptionCell
                            data={{ description: webhook?.description }}
                          />
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
                                <FontAwesomeIcon
                                  icon={faEllipsisH}
                                  className="icon-dark"
                                />
                              </span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={() =>
                                  toggleActivateWebhooksEndpoint(
                                    webhook.id,
                                    webhook.isActive
                                  )
                                }
                              >
                                {webhook.isActive ? (
                                  <span className=" ">
                                    <MdOutlineUnpublished className="mx-2" />
                                    <FormattedMessage id="Deactivate" />
                                  </span>
                                ) : (
                                  <span className=" ">
                                    <MdOutlinePublishedWithChanges className="mx-2" />
                                    <FormattedMessage id="Activate" />
                                  </span>
                                )}
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => editForm(webhook.id)}
                              >
                                <FontAwesomeIcon
                                  icon={faEdit}
                                  className="mx-2"
                                />
                                <FormattedMessage id="Edit" />
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => deleteConfirm(webhook.id)}
                                className="text-danger"
                              >
                                <FontAwesomeIcon
                                  icon={faTrashAlt}
                                  className="mx-2"
                                />
                                <FormattedMessage id="Delete" />
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </Table>
            <DeleteConfirmation
              message={
                <FormattedMessage id="Are-you-sure-you-want-to-delete-this-webhook?" />
              }
              confirm={confirm}
              setConfirm={setConfirm}
              confirmFunction={handleDeleteWebhook}
            />
          </Card.Body>
        </Card>
        <ThemeDialog visible={visible} setVisible={setVisible} size={'lg'}>
          <CreateWebhookForm
            visible={visible}
            setVisible={setVisible}
            popUpLable={popUpLable}
            webhookId={currentId}
            type="edit"
            currentWebhookData={webhooks?.[currentId]}
          />
        </ThemeDialog>
      </div>
    </Wrapper>
  )
}

export default WebhookList
