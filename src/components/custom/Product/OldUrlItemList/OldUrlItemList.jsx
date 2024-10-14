import React, { useEffect, useState } from 'react'
import ProductUrl from '../UrlItem/UrlItem'
import { FormattedMessage } from 'react-intl'
import {
  OverlayTrigger,
  Tooltip,
  Card,
  Table,
  Form,
  Dropdown,
} from '@themesberg/react-bootstrap'
import { BsFillQuestionCircleFill } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import useRequest from '../../../../axios/apis/useRequest'
import { Wrapper } from './OldUrlItemList.styled'
import { productInfo } from '../../../../store/slices/products/productsSlice'
import { MdArrowDropDown, MdErrorOutline } from 'react-icons/md'
import SafeFormatMessage from '../../Shared/SafeFormatMessage/SafeFormatMessage'

const OldUrlItemList = () => {
  const dispatch = useDispatch()
  const { editProductRequest } = useRequest()
  const productId = useParams().id
  const listData = useSelector((state) => state.products.products)
  const productData = listData?.[productId]

  const [urlItems, setUrlItems] = useState([])
  const [groupStates, setGroupStates] = useState({})
  const [validationMessages, setValidationMessages] = useState({})
  const [selectedVersion, setSelectedVersion] = useState('v0.0')

  // Define URL items data
  const urlItemsData = [
    // Group 1: Health Group
    {
      id: 0,
      method: 'GET',
      pathKey: 'defaultHealthCheckUrl',
      displayNameId: 'Default-Health-Check-Url',
      descriptionId: 'Default-Health-Check-Url-description',
      group: 'Health',
      flag: 'isHealthCheckEnabled',
    },
    {
      id: 1,
      method: 'POST',
      pathKey: 'healthStatusChangeUrl',
      displayNameId: 'Health-Status-Change-Url',
      descriptionId: 'Health-Status-Change-Url-Description',
      group: 'Health',
      flag: 'isHealthCheckEnabled',
    },
    // Group 2: Subscription Group
    {
      id: 2,
      method: 'POST',
      pathKey: 'subscriptionResetUrl',
      displayNameId: 'Subscription-Reset-Url',
      descriptionId: 'Subscription-Reset-Url-Description',
      group: 'Subscription',
      flag: 'isSubscriptionResetEnabled',
      isToggleable: true,
    },
    {
      id: 3,
      method: 'POST',
      pathKey: 'subscriptionUpgradeUrl',
      displayNameId: 'Subscription-Upgrade-Url',
      descriptionId: 'Subscription-Upgrade-Description',
      group: 'Subscription',
      flag: 'isSubscriptionUpgradeEnabled',
      isToggleable: true,
    },
    {
      id: 4,
      method: 'POST',
      pathKey: 'subscriptionDowngradeUrl',
      displayNameId: 'Subscription-Downgrade-Url',
      descriptionId: 'Subscription-Downgrade-Url-Description',
      group: 'Subscription',
      flag: 'isSubscriptionDowngradeEnabled',
      isToggleable: true,
    },
    // Group 3: Lifecycle Group
    {
      id: 5,
      method: 'POST',
      pathKey: 'creationEndpoint',
      displayNameId: 'Creation-Url',
      descriptionId: 'Creation-Url-description',
      group: 'Lifecycle',
      flag: 'isMainOperationEnabled',
      versionKey: 'creationApiVersion',
      isVersioned: true,
    },
    {
      id: 6,
      method: 'POST',
      pathKey: 'activationEndpoint',
      displayNameId: 'Activation-Url',
      descriptionId: 'Activation-Url-description',
      group: 'Lifecycle',
      flag: 'isMainOperationEnabled',
    },
    {
      id: 7,
      method: 'POST',
      pathKey: 'deactivationEndpoint',
      displayNameId: 'Deactivation-Url',
      descriptionId: 'Deactivation-Url-description',
      group: 'Lifecycle',
      flag: 'isMainOperationEnabled',
    },
    {
      id: 8,
      method: 'POST',
      pathKey: 'deletionEndpoint',
      displayNameId: 'Deletion-Url',
      descriptionId: 'Deletion-Url-description',
      group: 'Lifecycle',
      flag: 'isMainOperationEnabled',
    },
    // Group 4: Specification Validator Group
    {
      id: 9,
      method: 'GET',
      pathKey: 'specificationValidatorUrl',
      displayNameId: 'Specification-Validator-Url',
      descriptionId: 'Specification-Validator-Url-Description',
      group: 'SpecificationValidator',
      flag: 'isSpecificationValidatorEnabled',
    },
    // Group 5: Payment and Redirection Endpoints
    {
      id: 10,
      method: 'GET',
      pathKey: 'paymentSuccessCallbackUrl',
      displayNameId: 'Payment-Success-Callback-Url',
      descriptionId: 'Payment-Success-Callback-Url-Description',
      group: 'Payment',
      flag: 'isPaymentCallbackOverrideEnabled',
    },
    {
      id: 11,
      method: 'GET',
      pathKey: 'paymentFailureCallbackUrl',
      displayNameId: 'Payment-Failure-Callback-Url',
      descriptionId: 'Payment-Failure-Callback-Url-Description',
      group: 'Payment',
      flag: 'isPaymentCallbackOverrideEnabled',
    },
    // Group 6: Plan Selection
    {
      id: 12,
      method: 'GET',
      pathKey: 'planSelectionRedirectUrl',
      displayNameId: 'Plan-Selection-Redirect-Url',
      descriptionId: 'Plan-Selection-Redirect-Url-Description',
      group: 'PlanSelection',
      flag: 'isPlanSelectionRedirectionEnabled',
    },
  ]

  // Define groups
  const groups = [
    {
      name: 'Health',
      displayNameId: 'Health-Group',
      flag: 'isHealthCheckEnabled',
      isToggleable: true,
    },
    {
      name: 'Subscription',
      displayNameId: 'Subscription-Group',
      flag: null, // Individual items are toggleable
      isToggleable: false,
    },
    {
      name: 'Lifecycle',
      displayNameId: 'Lifecycle-Group',
      flag: 'isMainOperationEnabled',
      isToggleable: true,
    },
    {
      name: 'SpecificationValidator',
      displayNameId: 'Specification-Validator-Group',
      flag: 'isSpecificationValidatorEnabled',
      isToggleable: true,
    },
    {
      name: 'Payment',
      displayNameId: 'Payment-and-Redirection-Endpoints',
      flag: 'isPaymentCallbackOverrideEnabled',
      isToggleable: true,
    },
    {
      name: 'PlanSelection',
      displayNameId: 'Plan-Selection',
      flag: 'isPlanSelectionRedirectionEnabled',
      isToggleable: true,
    },
  ]

  useEffect(() => {
    // Build URL items
    const updatedUrlItems = urlItemsData.map((item) => {
      const path = productData?.[item.pathKey]
      const isEnabled = item.isToggleable
        ? productData?.[item.flag] === true
        : undefined
      const method = item.isToggleable && !isEnabled ? 'DISABLED' : item.method
      const version = item.versionKey
        ? productData?.[item.versionKey] || 'v0.0'
        : undefined

      return {
        ...item,
        path,
        isEnabled,
        method,
        version,
        displayName: <SafeFormatMessage id={item.displayNameId} />,
        description: <SafeFormatMessage id={item.descriptionId} />,
      }
    })

    setUrlItems(updatedUrlItems)

    // Build group states
    const updatedGroupStates = {}
    groups.forEach((group) => {
      if (group.flag) {
        updatedGroupStates[group.flag] = productData?.[group.flag] === true
      }
    })
    setGroupStates(updatedGroupStates)

    setSelectedVersion(productData?.creationApiVersion || 'v0.0')
  }, [productData])

  const handleUrlChange = async (itemId, newPath) => {
    const updatedProductData = { ...productData }
    const item = urlItemsData.find((item) => item.id === itemId)

    updatedProductData[item.pathKey] = newPath

    if (item.isToggleable && newPath.trim() === '') {
      updatedProductData[item.flag] = false
      setGroupStates((prev) => ({
        ...prev,
        [item.flag]: false,
      }))
      setValidationMessages((prev) => ({
        ...prev,
        [item.flag]: 'The-URL-cannot-be-empty-while-the-group-is-enabled.',
      }))
    } else {
      setValidationMessages((prev) => ({
        ...prev,
        [item.flag]: '',
      }))
    }

    await editProductRequest({
      data: updatedProductData,
      id: productId,
    })

    dispatch(productInfo(updatedProductData))
  }

  const handleUrlToggle = async (itemId) => {
    const updatedProductData = { ...productData }
    const item = urlItemsData.find((item) => item.id === itemId)
    const isEnabled = !productData?.[item.flag]

    if (
      isEnabled &&
      (!productData[item.pathKey] || productData[item.pathKey].trim() === '')
    ) {
      setValidationMessages((prev) => ({
        ...prev,
        [item.flag]: 'This-field-is-required-while-the-checkbox-is-enabled.',
      }))
      return
    }

    updatedProductData[item.flag] = isEnabled

    await editProductRequest({
      data: updatedProductData,
      id: productId,
    })

    dispatch(productInfo(updatedProductData))

    setValidationMessages((prev) => ({
      ...prev,
      [item.flag]: '',
    }))
  }

  const handleGroupToggle = async (groupFlag) => {
    const isEnabled = !groupStates[groupFlag]

    const group = groups.find((g) => g.flag === groupFlag)
    const groupItems = urlItemsData.filter((item) => item.group === group.name)

    if (isEnabled) {
      // Check if any URL is empty
      for (let item of groupItems) {
        const path = productData?.[item.pathKey]
        if (!path || path.trim() === '') {
          setValidationMessages((prev) => ({
            ...prev,
            [groupFlag]: 'Please-fill-in-all-fields-before-enabling-the-group.',
          }))
          return
        }
      }
    }

    setGroupStates((prev) => ({
      ...prev,
      [groupFlag]: isEnabled,
    }))

    const updatedProductData = { ...productData }
    updatedProductData[groupFlag] = isEnabled

    await editProductRequest({
      data: updatedProductData,
      id: productId,
    })

    dispatch(productInfo(updatedProductData))

    setValidationMessages((prev) => ({
      ...prev,
      [groupFlag]: '',
    }))
  }

  const handleVersionSelect = async (version) => {
    setSelectedVersion(version)

    const updatedProductData = {
      ...productData,
      creationApiVersion: version,
    }

    await editProductRequest({
      data: updatedProductData,
      id: productId,
    })

    dispatch(productInfo(updatedProductData))
  }

  return (
    <Wrapper>
      {groups.map((group) => (
        <UrlGroup
          key={group.name}
          group={group}
          urlItems={urlItems}
          groupStates={groupStates}
          handleGroupToggle={handleGroupToggle}
          handleUrlChange={handleUrlChange}
          handleUrlToggle={handleUrlToggle}
          validationMessages={validationMessages}
          selectedVersion={selectedVersion}
          handleVersionSelect={handleVersionSelect}
        />
      ))}
    </Wrapper>
  )
}

const UrlGroup = ({
  group,
  urlItems,
  groupStates,
  handleGroupToggle,
  handleUrlChange,
  handleUrlToggle,
  validationMessages,
  selectedVersion,
  handleVersionSelect,
}) => {
  const [showDropdown, setShowDropdown] = useState(false)

  const handleMouseEnter = () => {
    setShowDropdown(true)
  }

  const handleMouseLeave = () => {
    setShowDropdown(false)
  }

  const groupItems = urlItems.filter((item) => item.group === group.name)
  const isGroupEnabled = group.flag ? groupStates[group.flag] : true

  return (
    <Card border="light" className="shadow-sm mb-4">
      <Card.Header>
        <div className="d-flex align-items-center">
          {group.isToggleable && (
            <Form.Check
              type="checkbox"
              checked={isGroupEnabled}
              onChange={() => handleGroupToggle(group.flag)}
              className="mr-2 mb-2"
            />
          )}
          <h5>
            <SafeFormatMessage id={group.displayNameId} />
          </h5>
        </div>
        {validationMessages[group.flag] && (
          <div className="d-flex align-items-center text-danger ">
            <span className="px-2">
              <MdErrorOutline />
            </span>
            <SafeFormatMessage id={validationMessages[group.flag]} />
          </div>
        )}
      </Card.Header>
      <Card.Body className="pb-0">
        <Table
          responsive
          className="table-centered table-nowrap rounded mb-0 table"
        >
          <tbody>
            {groupItems.map((item) => {
              const isItemEnabled =
                item.isToggleable && !isGroupEnabled
                  ? false
                  : item.isToggleable
                  ? item.isEnabled
                  : isGroupEnabled

              const method = isItemEnabled ? item.method : 'DISABLED'

              return (
                <tr key={item.id}>
                  <td className="fw-bold">
                    <div className="d-flex align-items-center">
                      {item.isToggleable && (
                        <Form.Check
                          type="checkbox"
                          checked={isItemEnabled}
                          onChange={() => handleUrlToggle(item.id)}
                          className="mr-2"
                          disabled={!isGroupEnabled}
                        />
                      )}
                      {item.displayName}{' '}
                      <span className="fw-normal">
                        <OverlayTrigger
                          trigger={['hover', 'focus']}
                          overlay={<Tooltip>{item.description}</Tooltip>}
                        >
                          <span className="question">
                            <BsFillQuestionCircleFill />
                          </span>
                        </OverlayTrigger>
                      </span>
                      {item.isVersioned && (
                        <span className="d-flex align-items-center m-0 p-0">
                          <Dropdown
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            show={showDropdown}
                            className="m-0 p-0"
                          >
                            <Dropdown.Toggle
                              variant="link"
                              id="dropdown-basic"
                              className="custom-dropdown-toggle"
                            >
                              <div className="d-flex justify-content-center align-items-center">
                                <span className="font-small">
                                  {selectedVersion.toUpperCase()}
                                </span>
                                <MdArrowDropDown className="mt-1" />
                                <OverlayTrigger
                                  trigger={['hover', 'focus']}
                                  overlay={
                                    <Tooltip>
                                      <SafeFormatMessage id="This-is-the-API-payload-version-for-creation" />
                                    </Tooltip>
                                  }
                                >
                                  <span className="question-drop">
                                    <BsFillQuestionCircleFill />
                                  </span>
                                </OverlayTrigger>
                              </div>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item
                                eventKey="v0.0"
                                onSelect={() => handleVersionSelect('v0.0')}
                              >
                                V0.0
                              </Dropdown.Item>
                              <Dropdown.Item
                                eventKey="v0.1"
                                onSelect={() => handleVersionSelect('v0.1')}
                              >
                                V0.1
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="url-container">
                    <ProductUrl
                      data={{
                        ...item,
                        method,
                      }}
                      onUrlChange={(newPath) =>
                        handleUrlChange(item.id, newPath)
                      }
                    />
                    {validationMessages[item.flag] && (
                      <div className="d-flex align-items-center text-danger mt-1">
                        <span className="px-2">
                          <MdErrorOutline />
                        </span>
                        <SafeFormatMessage id={validationMessages[item.flag]} />
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  )
}

export default OldUrlItemList
