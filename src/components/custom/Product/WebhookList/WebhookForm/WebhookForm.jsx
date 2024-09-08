import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Modal, Button, Form } from '@themesberg/react-bootstrap'
import { TreeSelect } from 'primereact/treeselect'

import { FormattedMessage } from 'react-intl'

import { Wrapper } from './WebhookForm.styled'
import DescriptionCell from '../../../Shared/DescriptionCell/DescriptionCell'
import TextareaAndCounter from '../../../Shared/TextareaAndCounter/TextareaAndCounter'
import AutoGenerateInput from '../../../Shared/AutoGenerateInput/AutoGenerateInput'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { NodeService } from '../../../../../const/webhookEndpoints'
import useRequest from '../../../../../axios/apis/useRequest'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  WebhookEndpointInfo,
  setAllWebhookEndpoints,
} from '../../../../../store/slices/products/productsSlice'
import DataLabelWhite from '../../../Shared/DateLabelWhite/DateLabelWhite'
import SafeFormatMessage from '../../../Shared/SafeFormatMessage/SafeFormatMessage'

const CreateWebhookForm = ({
  visible,
  setVisible,
  popUpLable,
  webhookId,
  type,
  currentWebhookData,
}) => {
  const initialValues = {
    endpointURL: currentWebhookData ? currentWebhookData.url : '',
    description: currentWebhookData ? currentWebhookData.description : '',
    events: currentWebhookData ? currentWebhookData.eventsToListen : [],
    signingSecret: currentWebhookData ? currentWebhookData.signingSecret : '',
  }
  const {
    getWebhookEndpointsList,
    createWebhookEndpoint,

    editWebhookEndpoint,
  } = useRequest()

  const dispatch = useDispatch()

  const [nodes, setNodes] = useState()
  const [selectedNodeKey, setSelectedNodeKey] = useState({})
  const [selected, setSelected] = useState({})
  const [eventsValues, setEventsValues] = useState([])
  const routeParams = useParams()
  const productId = routeParams.id
  const allProducts = useSelector((state) => state.products.products)
  useEffect(() => {
    if (!currentWebhookData?.eventsToListen) {
      return
    }
    setSelectedNodeKey(currentWebhookData?.eventsToListen)
  }, [currentWebhookData?.eventsToListen])

  const renderEvents = (eventsToListen) => {
    const eventLabels = eventsToListen?.map((eventKey) => {
      const findLabel = (nodes, key, parentLabel = '') => {
        for (const node of nodes) {
          const currentLabel = parentLabel
            ? `${parentLabel.replace(/\s+/g, '')}.${node.label.replace(
                /\s+/g,
                ''
              )}`
            : node.label.replace(/\s+/g, '')

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
      ? eventLabels
          .reduce((rows, label, index) => {
            if (index % 2 === 0) {
              rows.push([])
            }
            rows[rows.length - 1].push(
              <span className="mx-2  mt-3" key={label}>
                <DataLabelWhite text={label} />
              </span>
            )
            return rows
          }, [])
          .map((row, index) => (
            <div className="d-flex  mt-0" key={index}>
              {row}
            </div>
          ))
      : ''
  }

  const validationSchema = Yup.object().shape({
    // endpointURL: Yup.string().required('Endpoint URL is required'),
    description: Yup.string(),
    // events: Yup.array().min(1, 'Select at least one event to listen to'),
    signingSecret: Yup.string().required('Signing secret is required'),
  })
  const formik = useFormik({
    initialValues,
    validationSchema,

    onSubmit: async (values, { setSubmitting }) => {
      // Handle form submission
      if (type === 'create') {
        const createWebhookEndpointdata = await createWebhookEndpoint(
          productId,
          {
            url: values.endpointURL,
            description: values.description,
            eventsToListen: eventsValues,
            signingSecret: values.signingSecret,
            entityId: productId,
            isActive: true,
          }
        )
        if (!allProducts[productId].webhookEndpoints) {
          const webhookEndpoints = await getWebhookEndpointsList(productId)
          dispatch(
            setAllWebhookEndpoints({
              productId: productId,
              data: webhookEndpoints.data.data,
            })
          )
        }
        dispatch(
          WebhookEndpointInfo({
            productId: productId,
            endpointId: createWebhookEndpointdata.data.data.id,
            data: {
              url: values.endpointURL,
              description: values.description,
              eventsToListen: eventsValues,
              signingSecret: values.signingSecret,
              id: createWebhookEndpointdata.data.data.id,
              isActive: true,
            },
          })
        )
        // Example: await handleSubmit(values);
        setVisible(false)
        setSubmitting(false)
      } else if (type == 'edit') {
        const updateWebhookEndpointdata = await editWebhookEndpoint(
          productId,
          webhookId,
          {
            url: values.endpointURL,
            description: values.description,
            eventsToListen: eventsValues,
            signingSecret: values.signingSecret,
          }
        )
        if (!allProducts[productId].webhookEndpoints) {
          const webhookEndpoints = await getWebhookEndpointsList(productId)
          dispatch(
            setAllWebhookEndpoints({
              productId: productId,
              data: webhookEndpoints.data.data,
            })
          )
        }
        dispatch(
          WebhookEndpointInfo({
            productId: productId,
            endpointId: webhookId,
            data: {
              ...allProducts[productId].webhookEndpoints[webhookId],
              url: values.endpointURL,
              description: values.description,
              eventsToListen: eventsValues,
              signingSecret: values.signingSecret,
              id: webhookId,
            },
          })
        )
        // Example: await handleSubmit(values);
        setVisible(false)
        setSubmitting(false)
      }
    },
  })

  useEffect(() => {
    if (selectedNodeKey && Object.keys(selectedNodeKey).length <= 0) {
      return setEventsValues(null)
    }
    const numberKeys = Object.keys(selectedNodeKey)
      .filter((key) => !isNaN(parseInt(key)))
      .map((key) => parseInt(key))

    setEventsValues(numberKeys)
  }, [Object.keys(selectedNodeKey).length])

  useEffect(() => {
    // Fetch tree nodes data from NodeService
    const fetchData = async () => {
      const data = NodeService.getTreeNodesData()
      setNodes(data)
    }

    fetchData()
  }, [])
  useEffect(() => {
    if (type != 'edit') {
      return
    }
    if (initialValues.events && nodes) {
      const selectedKeys = {}
      initialValues.events.forEach((eventKey) => {
        const findNode = (nodes, key) => {
          for (const node of nodes) {
            if (node.key === key) {
              selectedKeys[node.key] = { checked: true, partialChecked: false }
              return true
            }
            if (node.children && findNode(node.children, key)) {
              selectedKeys[node.key] = { checked: true, partialChecked: true }
              return true
            }
          }
          return false
        }
        findNode(nodes, eventKey)
      })
      setSelectedNodeKey(selectedKeys)
    }
  }, [initialValues.events, type, nodes])
  const handleSelectAll = () => {
    const selectAllKeys = (nodes) => {
      let keys = []
      nodes.forEach((node) => {
        keys.push(node.key)
        if (node.children) {
          keys = keys.concat(selectAllKeys(node.children))
        }
      })
      return keys
    }

    const allKeys = selectAllKeys(nodes)
    const selectedKeys = {}
    allKeys.forEach((key) => {
      selectedKeys[key] = { checked: true, partialChecked: false }
    })

    setSelectedNodeKey(selectedKeys)
  }
  const [selectAllChecked, setSelectAllChecked] = useState(false)
  useEffect(() => {
    if (!selectAllChecked) {
      setSelectedNodeKey({})
    } else {
      handleSelectAll()
    }
  }, [selectAllChecked])

  return (
    <Wrapper>
      <Form onSubmit={formik.handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title className="h6">{popUpLable}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="endpointURL">
            <Form.Label>
              <SafeFormatMessage id="Endpoint-URL" />
              <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="endpointURL"
              value={formik.values.endpointURL}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={
                formik.touched.endpointURL && formik.errors.endpointURL
              }
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.endpointURL}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="signingSecret">
            {/* Use AutoGenerateInput for Signing Secret */}
            <AutoGenerateInput
              label={<SafeFormatMessage id="Signing-Secret" />}
              id="signingSecret"
              value={formik.values.signingSecret}
              name={formik.values.signingSecret}
              onChange={formik.handleChange}
              onGenerateUniqueName={(generatedUniqueName) => {
                formik.setFieldValue('signingSecret', generatedUniqueName)
              }}
              onAutoGenerateClick={() => {
                formik.setFieldValue(
                  'isAutoGenerated',
                  !formik.values.isAutoGenerated
                )
              }}
              isAutoGenerated={formik.values.isAutoGenerated}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.signingSecret}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="events">
            <Form.Label>
              <SafeFormatMessage id="Select-events-to-listen-to" />
              <span className="text-danger">*</span>
            </Form.Label>
            <TreeSelect
              value={selectedNodeKey}
              onChange={(e) => {
                setSelectAllChecked(e.value?.select_all?.checked)
                setSelectedNodeKey(e.value)
                setSelected(renderEvents(eventsValues))
              }}
              options={nodes}
              ngModel="selectedNodes2"
              className=" w-full"
              placeholder={<SafeFormatMessage id="Select-Items" />}
              metaKeySelection={false}
              selectionMode="checkbox"
            />

            <Form.Control.Feedback type="invalid">
              {formik.errors.events}
            </Form.Control.Feedback>
            {/* <Button onClick={handleSelectAll} className="mt-2">
              <SafeFormatMessage id="Select-All" />
            </Button> */}
          </Form.Group>
          <div className="mb-3">{renderEvents(eventsValues)}</div>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>
              <SafeFormatMessage id="Description" />
            </Form.Label>
            <TextareaAndCounter
              addTextarea={formik.setFieldValue}
              maxLength={250}
              showCharCount
              inputValue={formik?.values?.description}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" type="submit">
            <SafeFormatMessage id="Submit" />
          </Button>
        </Modal.Footer>
      </Form>
    </Wrapper>
  )
}

export default CreateWebhookForm
