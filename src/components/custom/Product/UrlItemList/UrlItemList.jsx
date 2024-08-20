import React, { useEffect, useState } from 'react'
import ProductUrl from '../UrlItem/UrlItem'
import { FormattedMessage } from 'react-intl'
import {
  OverlayTrigger,
  Tooltip,
  Card,
  Table,
  Form,
  Alert,
} from '@themesberg/react-bootstrap'
import { BsFillQuestionCircleFill } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import useRequest from '../../../../axios/apis/useRequest'
import { Wrapper } from './UrlItemList.styled'
import { productInfo } from '../../../../store/slices/products/productsSlice'
import { MdError, MdErrorOutline } from 'react-icons/md'

const UrlItemList = ({ data }) => {
  const [urlItems, setURLS] = useState([])
  console.log({ wwwwwww: urlItems })

  const listData = useSelector((state) => state.products.products)
  const productId = useParams().id
  const productData = listData?.[productId]
  console.log({ productData })

  const [groupStates, setGroupStates] = useState({
    isHealthCheckEnabled: productData?.isHealthCheckEnabled == true,
    isMainOperationEnabled: productData?.isMainOperationEnabled == true,
    isSpecificationValidatorEnabled:
      productData?.isSpecificationValidatorEnabled == true,
    isPaymentAndRedirectionEndpointsEnabled:
      productData?.isPaymentAndRedirectionEndpointsEnabled == true,
    isPlanSelectionRedirectionEnabled:
      productData?.isPlanSelectionRedirectionEnabled == true,
  })
  const urlFlagsCheck = [
    { url: 'defaultHealthCheckUrl', flag: 'isHealthCheckEnabled' },
    { url: 'healthStatusChangeUrl', flag: 'isHealthCheckEnabled' },
    { url: 'subscriptionResetUrl', flag: 'isSubscriptionResetEnabled' },
    { url: 'subscriptionUpgradeUrl', flag: 'isSubscriptionUpgradeEnabled' },
    {
      url: 'subscriptionDowngradeUrl',
      flag: 'isSubscriptionDowngradeEnabled',
    },
    { url: 'creationEndpoint', flag: 'isMainOperationEnabled' },
    { url: 'activationEndpoint', flag: 'isMainOperationEnabled' },
    { url: 'deactivationEndpoint', flag: 'isMainOperationEnabled' },
    { url: 'deletionEndpoint', flag: 'isMainOperationEnabled' },
    {
      url: 'specificationValidatorUrl',
      flag: 'isSpecificationValidatorEnabled',
    },
    {
      url: 'paymentSuccessCallbackUrl',
      flag: 'isPaymentAndRedirectionEndpointsEnabled',
    },
    {
      url: 'paymentFailureCallbackUrl',
      flag: 'isPaymentAndRedirectionEndpointsEnabled',
    },
    {
      url: 'planSelectionRedirectUrl',
      flag: 'isPlanSelectionRedirectionEnabled',
    },
  ]
  const [validationMessages, setValidationMessages] = useState({
    isHealthCheckEnabled: '',
    subscriptionGroupEnabled: '',
    isMainOperationEnabled: '',
    isSpecificationValidatorEnabled: '',
    isPaymentAndRedirectionEndpointsEnabled: '',
    isPlanSelectionRedirectionEnabled: '',
    isSubscriptionResetEnabled: '',
    isSubscriptionUpgradeEnabled: '',
    isSubscriptionDowngradeEnabled: '',
  })
  console.log({ validationMessages })

  const dispatch = useDispatch()
  const { editProductRequest } = useRequest()

  useEffect(() => {
    setURLS([
      {
        method: 'GET',
        path: productData.defaultHealthCheckUrl,
        displayName: <FormattedMessage id="Default-Health-Check-Url" />,
        description: (
          <FormattedMessage id="Default-Health-Check-Url-description" />
        ),
      },
      {
        method: 'POST',
        path: productData.healthStatusChangeUrl,
        displayName: <FormattedMessage id="Health-Status-Change-Url" />,
        description: (
          <FormattedMessage id="Health-Status-Change-Url-Description" />
        ),
      },
      {
        method: productData?.isSubscriptionResetEnabled ? 'POST' : 'DISABLED',
        path: productData.subscriptionResetUrl,
        displayName: <FormattedMessage id="Subscription-Reset-Url" />,
        description: (
          <FormattedMessage id="Subscription-Reset-Url-Description" />
        ),
        isEnabled: productData?.isSubscriptionResetEnabled == true,
      },
      {
        method: productData?.isSubscriptionUpgradeEnabled ? 'POST' : 'DISABLED',
        path: productData.subscriptionUpgradeUrl,
        displayName: <FormattedMessage id="Subscription-Upgrade-Url" />,
        description: <FormattedMessage id="Subscription-Upgrade-Description" />,
        isEnabled: productData?.isSubscriptionUpgradeEnabled == true,
      },
      {
        method: productData?.isSubscriptionDowngradeEnabled
          ? 'POST'
          : 'DISABLED',
        path: productData.subscriptionDowngradeUrl,
        displayName: <FormattedMessage id="Subscription-Downgrade-Url" />,
        description: (
          <FormattedMessage id="Subscription-Downgrade-Url-Description" />
        ),
        isEnabled: productData?.isSubscriptionDowngradeEnabled == true,
      },
      {
        method: 'POST',
        path: productData.creationEndpoint,
        displayName: <FormattedMessage id="Creation-Url" />,
        description: <FormattedMessage id="Creation-Url-description" />,
      },
      {
        method: 'POST',
        path: productData.activationEndpoint,
        displayName: <FormattedMessage id="Activation-Url" />,
        description: <FormattedMessage id="Activation-Url-description" />,
      },
      {
        method: 'POST',
        path: productData.deactivationEndpoint,
        displayName: <FormattedMessage id="Deactivation-Url" />,
        description: <FormattedMessage id="Deactivation-Url-description" />,
      },
      {
        method: 'POST',
        path: productData.deletionEndpoint,
        displayName: <FormattedMessage id="Deletion-Url" />,
        description: <FormattedMessage id="Deletion-Url-description" />,
      },
      {
        method: 'GET',
        path: productData.specificationValidatorUrl,
        displayName: <FormattedMessage id="Specification-Validator-Url" />,
        description: (
          <FormattedMessage id="Specification-Validator-Url-Description" />
        ),
      },
      {
        method: 'GET',
        path: productData.paymentSuccessCallbackUrl,
        displayName: <FormattedMessage id="Payment-Success-Callback-Url" />,
        description: (
          <FormattedMessage id="Payment-Success-Callback-Url-Description" />
        ),
      },
      {
        method: 'GET',
        path: productData.paymentFailureCallbackUrl,
        displayName: <FormattedMessage id="Payment-Failure-Callback-Url" />,
        description: (
          <FormattedMessage id="Payment-Failure-Callback-Url-Description" />
        ),
      },
      {
        method: 'GET',
        path: productData.planSelectionRedirectUrl,
        displayName: <FormattedMessage id="Plan-Selection-Redirect-Url" />,
        description: (
          <FormattedMessage id="Plan-Selection-Redirect-Url-Description" />
        ),
      },
    ])
  }, [productData, validationMessages])

  const urlFields = [
    { url: 'defaultHealthCheckUrl', flag: null },
    { url: 'healthStatusChangeUrl', flag: null },
    { url: 'subscriptionResetUrl', flag: 'isSubscriptionResetEnabled' },
    { url: 'subscriptionUpgradeUrl', flag: 'isSubscriptionUpgradeEnabled' },
    {
      url: 'subscriptionDowngradeUrl',
      flag: 'isSubscriptionDowngradeEnabled',
    },
    { url: 'creationEndpoint', flag: null },
    { url: 'activationEndpoint', flag: null },
    { url: 'deactivationEndpoint', flag: null },
    { url: 'deletionEndpoint', flag: null },
    {
      url: 'specificationValidatorUrl',
      flag: 'isSpecificationValidatorEnabled',
    },
    {
      url: 'paymentSuccessCallbackUrl',
      flag: 'isPaymentAndRedirectionEndpointsEnabled',
    },
    {
      url: 'paymentFailureCallbackUrl',
      flag: 'isPaymentAndRedirectionEndpointsEnabled',
    },
    {
      url: 'planSelectionRedirectUrl',
      flag: 'isPlanSelectionRedirectionEnabled',
    },
  ]

  const handleUrlChange = async (index, newPath) => {
    const updatedProductData = { ...productData }
    const urlField = urlFlagsCheck[index]

    updatedProductData[urlFields[index].url] = newPath

    // Check if the field is empty
    if (newPath.trim() === '') {
      // Disable the checkbox and set the flag to false
      updatedProductData[urlField.flag] = false

      // Uncheck the checkbox in the UI
      setGroupStates({
        ...groupStates,
        [urlField.flag]: false,
      })

      // Show a validation message if needed
      setValidationMessages({
        ...validationMessages,
        [urlField.flag]: 'The-URL-cannot-be-empty-while-the-group-is-enabled.',
      })
    } else {
      // Reset validation message
      setValidationMessages({
        ...validationMessages,
        [urlField.flag]: '',
      })
    }

    // Send the updated data to the backend
    const editProduct = await editProductRequest({
      data: updatedProductData,
      id: productId,
    })

    // Update the store
    dispatch(
      productInfo({
        ...productData,
        ...updatedProductData,
      })
    )

    // Clear validation messages
    setValidationMessages({
      isHealthCheckEnabled: '',
      subscriptionGroupEnabled: '',
      isMainOperationEnabled: '',
      isSpecificationValidatorEnabled: '',
      isPaymentAndRedirectionEndpointsEnabled: '',
      isPlanSelectionRedirectionEnabled: '',
    })
  }

  const handleUrlToggle = async (index) => {
    const updatedUrlItems = [...urlItems]
    const urlField = urlFields[index]

    // Check if the URL is empty before enabling the checkbox
    if (
      !updatedUrlItems[index].isEnabled &&
      updatedUrlItems[index].path.trim() === ''
    ) {
      setValidationMessages({
        ...validationMessages,
        [urlField.flag]:
          'This-field-is-required-while-the-checkbox-is-enabled.',
      })
      return
    }

    // Toggle the checkbox
    updatedUrlItems[index].isEnabled = !updatedUrlItems[index].isEnabled
    updatedUrlItems[index].method = updatedUrlItems[index].isEnabled
      ? 'POST'
      : 'DISABLED'

    // Update the local state for UI
    setURLS(updatedUrlItems)

    const updatedProductData = { ...productData }

    // Update the flag in product data based on the checkbox state
    updatedProductData[urlField.flag] = updatedUrlItems[index].isEnabled

    // Send the updated data to the backend
    const editProduct = await editProductRequest({
      data: updatedProductData,
      id: productId,
    })

    // Update the store
    dispatch(
      productInfo({
        ...productData,
        ...updatedProductData,
      })
    )

    // Reset validation messages
    setValidationMessages({
      ...validationMessages,
      [urlField.flag]: '',
    })
  }
  const validateGroup = (groupItems) => {
    for (let item of groupItems) {
      if (!item.path || item.path.trim() === '') {
        return false
      }
    }
    return true
  }

  console.log({ groupStates })
  const handleGroupToggle = async (
    groupName,
    groupStartIndex,
    groupEndIndex
  ) => {
    if (!groupStates[groupName]) {
      const groupItems = urlItems.slice(groupStartIndex, groupEndIndex + 1)
      console.log({ urlItems })

      if (!validateGroup(groupItems)) {
        setValidationMessages({
          ...validationMessages,
          [groupName]: 'Please-fill-in-all-fields-before-enabling-the-group.',
        })

        return
      }
    }

    const newGroupState = !groupStates[groupName]
    if (newGroupState) {
      console.log({ rrrr: urlItems })

      for (let i = groupStartIndex; i <= groupEndIndex; i++) {
        if (urlItems[i]?.path.trim() === '') {
          setValidationMessages({
            ...validationMessages,
            [groupName]: 'Please-fill-in-all-fields-before-enabling-the-group.',
          })
          return
        }
      }
    }

    setValidationMessages({
      ...validationMessages,
      [groupName]: '',
    })

    // Update the local state
    setGroupStates({
      ...groupStates,
      [groupName]: newGroupState,
    })

    // Handle updating the backend (no changes needed here)

    setGroupStates({
      ...groupStates,
      [groupName]: newGroupState,
    })

    const updatedProductData = {}

    const groupFlags = {
      isHealthCheckEnabled: { isHealthCheckEnabled: 'isHealthCheckEnabled' },
      isMainOperationEnabled: {
        isMainOperationEnabled: 'isMainOperationEnabled',
      },
      isSpecificationValidatorEnabled: {
        specificationValidatorUrl: 'isSpecificationValidatorEnabled',
      },
      isPaymentAndRedirectionEndpointsEnabled: {
        isPaymentAndRedirectionEndpointsEnabled:
          'isPaymentAndRedirectionEndpointsEnabled',
      },
      isPlanSelectionRedirectionEnabled: {
        planSelectionRedirectUrl: 'isPlanSelectionRedirectionEnabled',
      },
    }

    if (groupFlags[groupName]) {
      Object.keys(groupFlags[groupName]).forEach((key) => {
        updatedProductData[groupFlags[groupName][key]] = newGroupState
      })
    }
    console.log({ updatedProductData2: updatedProductData })
    console.log({ data2: data })

    const editProduct = await editProductRequest({
      data: { ...productData, ...updatedProductData },
      id: productId,
    })
    dispatch(
      productInfo({
        ...productData,
        ...updatedProductData,
      })
    )
    setValidationMessages({
      isHealthCheckEnabled: '',
      subscriptionGroupEnabled: '',
      isMainOperationEnabled: '',
      isSpecificationValidatorEnabled: '',
      isPaymentAndRedirectionEndpointsEnabled: '',
      isPlanSelectionRedirectionEnabled: '',
    })
  }

  const getGroupMethod = (groupEnabled, index) => {
    return groupEnabled ? urlItems[index].method : 'DISABLED'
  }

  return (
    <Wrapper>
      {/* Group 1: Default Health Check Url and Health Status Change Url */}
      <Card border="light" className="shadow-sm mb-4">
        <Card.Header>
          <div className="d-flex  align-items-center">
            <Form.Check
              type="checkbox"
              checked={groupStates.isHealthCheckEnabled}
              className="mr-2 mb-2"
              onChange={() => handleGroupToggle('isHealthCheckEnabled', 0, 1)}
            />
            <h5>
              <FormattedMessage id="Health-Group" />
            </h5>
          </div>
          {validationMessages.isHealthCheckEnabled && (
            <div className="d-flex align-items-center text-danger ">
              <span className="px-2">
                <MdErrorOutline />
              </span>
              <FormattedMessage id={validationMessages.isHealthCheckEnabled} />
            </div>
          )}
        </Card.Header>

        <Card.Body className="pb-0">
          <Table
            responsive
            className="table-centered table-nowrap rounded mb-0 table"
          >
            <tbody>
              {urlItems.slice(0, 2).map((url, index) => (
                <tr key={index}>
                  <td className="fw-bold">
                    {url.displayName}{' '}
                    <span className="fw-normal">
                      <OverlayTrigger
                        trigger={['hover', 'focus']}
                        overlay={<Tooltip>{url.description}</Tooltip>}
                      >
                        <span className="question">
                          <BsFillQuestionCircleFill />
                        </span>
                      </OverlayTrigger>
                    </span>
                  </td>
                  <td className="url-container">
                    <ProductUrl
                      data={{
                        ...url,
                        method: getGroupMethod(
                          groupStates.isHealthCheckEnabled,
                          index
                        ),
                      }}
                      onUrlChange={(newPath) => handleUrlChange(index, newPath)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Group 2: Subscription Reset URL, Subscription Upgrade, Subscription Downgrade Url */}
      <Card border="light" className="shadow-sm mb-4">
        <Card.Header>
          <div className="d-flex align-items-center">
            {/* Commented out the checkbox for the group level toggle */}
            <h5>
              <FormattedMessage id="Subscription-Group" />
            </h5>
          </div>
        </Card.Header>

        <Card.Body className="pb-0">
          <Table
            responsive
            className="table-centered table-nowrap rounded mb-0 table"
          >
            <tbody>
              {urlItems.slice(2, 5).map((url, index) => (
                <React.Fragment key={index + 2}>
                  <tr>
                    <td className="fw-bold">
                      <div className="d-flex align-items-center">
                        <Form.Check
                          type="checkbox"
                          checked={url.isEnabled}
                          onChange={() => handleUrlToggle(index + 2)}
                          className="mr-2"
                        />
                        {url.displayName}{' '}
                        <span className="fw-normal">
                          <OverlayTrigger
                            trigger={['hover', 'focus']}
                            overlay={<Tooltip>{url.description}</Tooltip>}
                          >
                            <span className="question">
                              <BsFillQuestionCircleFill />
                            </span>
                          </OverlayTrigger>
                        </span>
                      </div>
                    </td>

                    <td className="url-container">
                      <ProductUrl
                        data={{
                          ...url,
                          method: getGroupMethod(url?.isEnabled, index + 2),
                        }}
                        onUrlChange={(newPath) =>
                          handleUrlChange(index + 2, newPath)
                        }
                      />
                      {validationMessages[urlFields[index + 2].flag] && (
                        <div className="d-flex align-items-center text-danger mt-1  ">
                          <span className="px-2">
                            <MdErrorOutline />
                          </span>{' '}
                          <FormattedMessage
                            id={validationMessages[urlFields[index + 2].flag]}
                          />
                        </div>
                      )}
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Group 3: Creation Url, Activation Url, Deactivation Url, Deletion Url */}
      <Card border="light" className="shadow-sm mb-4">
        <Card.Header>
          <div className="d-flex align-items-center">
            <Form.Check
              type="checkbox"
              checked={groupStates.isMainOperationEnabled}
              onChange={() => handleGroupToggle('isMainOperationEnabled', 5, 8)}
              className="mr-2 mb-2"
            />
            <h5>
              <FormattedMessage id="Lifecycle-Group" />
            </h5>
          </div>
          {validationMessages.isMainOperationEnabled && (
            <div className="d-flex align-items-center text-danger ">
              <span className="px-2">
                <MdErrorOutline />
              </span>
              <FormattedMessage
                id={validationMessages.isMainOperationEnabled}
              />
            </div>
          )}
        </Card.Header>

        <Card.Body className="pb-0">
          <Table
            responsive
            className="table-centered table-nowrap rounded mb-0 table"
          >
            <tbody>
              {urlItems.slice(5, 9).map((url, index) => (
                <tr key={index + 5} className="px-5">
                  <td className="fw-bold">
                    {url.displayName}{' '}
                    <span className="fw-normal">
                      <OverlayTrigger
                        trigger={['hover', 'focus']}
                        overlay={<Tooltip>{url.description}</Tooltip>}
                      >
                        <span className="question">
                          <BsFillQuestionCircleFill />
                        </span>
                      </OverlayTrigger>
                    </span>
                  </td>
                  <td className="url-container">
                    <ProductUrl
                      data={{
                        ...url,
                        method: getGroupMethod(
                          groupStates.isMainOperationEnabled,
                          index + 5
                        ),
                      }}
                      onUrlChange={(newPath) =>
                        handleUrlChange(index + 5, newPath)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Group 4: Specification Validator*/}
      <Card border="light" className="shadow-sm mb-4">
        <Card.Header>
          <div className="d-flex align-items-center">
            <Form.Check
              type="checkbox"
              checked={groupStates.isSpecificationValidatorEnabled}
              onChange={() =>
                handleGroupToggle('isSpecificationValidatorEnabled', 9, 9)
              }
              className="mr-2 mb-2"
            />
            <h5>
              <FormattedMessage id="Specification-Validator-Group" />
            </h5>
          </div>
          {validationMessages.isSpecificationValidatorEnabled && (
            <div className="d-flex align-items-center text-danger ">
              <span className="px-2">
                <MdErrorOutline />
              </span>

              <FormattedMessage
                id={validationMessages.isSpecificationValidatorEnabled}
              />
            </div>
          )}
        </Card.Header>

        <Card.Body className="pb-0">
          <Table
            responsive
            className="table-centered table-nowrap rounded mb-0 table"
          >
            <tbody>
              {urlItems?.[9] && (
                <tr key={9} className="justify-content-between ">
                  <td className="fw-bold">
                    {urlItems[9].displayName}{' '}
                    <span className="fw-normal">
                      <OverlayTrigger
                        trigger={['hover', 'focus']}
                        overlay={<Tooltip>{urlItems[9].description}</Tooltip>}
                      >
                        <span className="question">
                          <BsFillQuestionCircleFill />
                        </span>
                      </OverlayTrigger>
                    </span>
                  </td>
                  <td className="url-container">
                    <ProductUrl
                      data={{
                        ...urlItems[9],
                        method: getGroupMethod(
                          groupStates.isSpecificationValidatorEnabled,
                          9
                        ),
                      }}
                      onUrlChange={(newPath) => handleUrlChange(9, newPath)}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Group 5: Specification Validator, Payment Success Callback, Payment Failure Callback, Plan Selection Redirect */}
      <Card border="light" className="shadow-sm mb-4">
        <Card.Header>
          <div className="d-flex align-items-center">
            <Form.Check
              type="checkbox"
              checked={groupStates.isPaymentAndRedirectionEndpointsEnabled}
              onChange={() =>
                handleGroupToggle(
                  'isPaymentAndRedirectionEndpointsEnabled',
                  10,
                  11
                )
              }
              className="mr-2 mb-2"
            />
            <h5>
              <FormattedMessage id="Payment-and-Redirection-Endpoints" />
            </h5>
          </div>
          {validationMessages.isPaymentAndRedirectionEndpointsEnabled && (
            <div className="d-flex align-items-center text-danger ">
              <span className="px-2">
                <MdErrorOutline />
              </span>
              {validationMessages.isPaymentAndRedirectionEndpointsEnabled && (
                <FormattedMessage
                  id={
                    validationMessages.isPaymentAndRedirectionEndpointsEnabled
                  }
                />
              )}
            </div>
          )}
        </Card.Header>

        <Card.Body className="pb-0">
          <Table
            responsive
            className="table-centered table-nowrap rounded mb-0 table"
          >
            <tbody>
              {urlItems.slice(10, 12).map((url, index) => (
                <tr key={index + 10}>
                  <td className="fw-bold">
                    {url.displayName}{' '}
                    <span className="fw-normal">
                      <OverlayTrigger
                        trigger={['hover', 'focus']}
                        overlay={<Tooltip>{url.description}</Tooltip>}
                      >
                        <span className="question">
                          <BsFillQuestionCircleFill />
                        </span>
                      </OverlayTrigger>
                    </span>
                  </td>
                  <td className="url-container">
                    <ProductUrl
                      data={{
                        ...url,
                        method: getGroupMethod(
                          groupStates.isPaymentAndRedirectionEndpointsEnabled,
                          index + 10
                        ),
                      }}
                      onUrlChange={(newPath) =>
                        handleUrlChange(index + 10, newPath)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      {/* Group 6: Plan-Selection-Redirect-Url */}
      <Card border="light" className="shadow-sm mb-4">
        <Card.Header>
          <div className="d-flex align-items-center">
            <Form.Check
              type="checkbox"
              checked={groupStates.isPlanSelectionRedirectionEnabled}
              onChange={() =>
                handleGroupToggle('isPlanSelectionRedirectionEnabled', 12, 12)
              }
              className="mr-2 mb-2"
            />
            <h5>
              <FormattedMessage id="Plan-Selection" />
            </h5>
            {validationMessages.isPlanSelectionRedirectionEnabled && (
              <div className="d-flex align-items-center text-danger ">
                <span className="px-2">
                  <MdErrorOutline />
                </span>

                {validationMessages.isPlanSelectionRedirectionEnabled && (
                  <FormattedMessage
                    id={validationMessages.isPlanSelectionRedirectionEnabled}
                  />
                )}
              </div>
            )}
          </div>
        </Card.Header>

        <Card.Body className="pb-0">
          <Table
            responsive
            className="table-centered table-nowrap rounded mb-0 table"
          >
            <tbody>
              {urlItems?.[12] && (
                <tr key={12} className="justify-content-between ">
                  <td className="fw-bold">
                    {urlItems[12].displayName}{' '}
                    <span className="fw-normal">
                      <OverlayTrigger
                        trigger={['hover', 'focus']}
                        overlay={<Tooltip>{urlItems[12].description}</Tooltip>}
                      >
                        <span className="question">
                          <BsFillQuestionCircleFill />
                        </span>
                      </OverlayTrigger>
                    </span>
                  </td>
                  <td className="url-container">
                    <ProductUrl
                      data={{
                        ...urlItems[12],
                        method: getGroupMethod(
                          groupStates.isPlanSelectionRedirectionEnabled,
                          12
                        ),
                      }}
                      onUrlChange={(newPath) => handleUrlChange(12, newPath)}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Wrapper>
  )
}

export default UrlItemList
