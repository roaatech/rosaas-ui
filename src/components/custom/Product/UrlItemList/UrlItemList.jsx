import React, { useEffect, useState } from 'react'
import ProductUrl from '../UrlItem/UrlItem'
import { FormattedMessage } from 'react-intl'
import {
  OverlayTrigger,
  Tooltip,
  Card,
  Table,
  Form,
} from '@themesberg/react-bootstrap'
import { BsFillQuestionCircleFill } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import useRequest from '../../../../axios/apis/useRequest'
import { Wrapper } from './UrlItemList.styled'
import { productInfo } from '../../../../store/slices/products/productsSlice'

const UrlItemList = ({ data }) => {
  const [urlItems, setURLS] = useState([])

  const listData = useSelector((state) => state.products.products)
  const productId = useParams().id
  const productData = listData?.[productId]
  const [groupStates, setGroupStates] = useState({
    healthGroupEnabled: productData?.isHealthCheckEnabled == true,
    lifecycleGroupEnabled: productData?.isMainOperationEnabled == true,
    specificationGroupEnabled:
      productData?.isSpecificationValidatorEnabled == true,
    paymentAndRedirectionEndpoints:
      productData?.isPaymentAndRedirectionEndpointsEnabled == true,
    PlanSelectionGroupEnabled:
      productData?.isPlanSelectionRedirectionEnabled == true,
  })

  const dispatch = useDispatch()
  const { editProductRequest } = useRequest()
  console.log(productData?.IsSubscriptionResetEnabled)

  useEffect(() => {
    setURLS([
      {
        method: 'GET',
        path: data.defaultHealthCheckUrl,
        displayName: <FormattedMessage id="Default-Health-Check-Url" />,
        description: (
          <FormattedMessage id="Default-Health-Check-Url-description" />
        ),
      },
      {
        method: 'POST',
        path: data.healthStatusChangeUrl,
        displayName: <FormattedMessage id="Health-Status-Change-Url" />,
        description: (
          <FormattedMessage id="Health-Status-Change-Url-Description" />
        ),
      },
      {
        method: productData?.IsSubscriptionResetEnabled ? 'POST' : 'DISABLED',
        path: data.subscriptionResetUrl,
        displayName: <FormattedMessage id="Subscription-Reset-Url" />,
        description: (
          <FormattedMessage id="Subscription-Reset-Url-Description" />
        ),
        isEnabled: productData?.IsSubscriptionResetEnabled == true,
      },
      {
        method: productData?.IsSubscriptionUpgradeEnabled ? 'POST' : 'DISABLED',
        path: data.subscriptionUpgradeUrl,
        displayName: <FormattedMessage id="Subscription-Upgrade-Url" />,
        description: <FormattedMessage id="Subscription-Upgrade-Description" />,
        isEnabled: productData?.IsSubscriptionUpgradeEnabled == true,
      },
      {
        method: productData?.IsSubscriptionDowngradeEnabled
          ? 'POST'
          : 'DISABLED',
        path: data.subscriptionDowngradeUrl,
        displayName: <FormattedMessage id="Subscription-Downgrade-Url" />,
        description: (
          <FormattedMessage id="Subscription-Downgrade-Url-Description" />
        ),
        isEnabled: productData?.IsSubscriptionDowngradeEnabled == true,
      },
      {
        method: 'POST',
        path: data.creationEndpoint,
        displayName: <FormattedMessage id="Creation-Url" />,
        description: <FormattedMessage id="Creation-Url-description" />,
      },
      {
        method: 'POST',
        path: data.activationEndpoint,
        displayName: <FormattedMessage id="Activation-Url" />,
        description: <FormattedMessage id="Activation-Url-description" />,
      },
      {
        method: 'POST',
        path: data.deactivationEndpoint,
        displayName: <FormattedMessage id="Deactivation-Url" />,
        description: <FormattedMessage id="Deactivation-Url-description" />,
      },
      {
        method: 'POST',
        path: data.deletionEndpoint,
        displayName: <FormattedMessage id="Deletion-Url" />,
        description: <FormattedMessage id="Deletion-Url-description" />,
      },
      {
        method: 'GET',
        path: data.specificationValidatorUrl,
        displayName: <FormattedMessage id="Specification-Validator-Url" />,
        description: (
          <FormattedMessage id="Specification-Validator-Url-Description" />
        ),
      },
      {
        method: 'GET',
        path: data.paymentSuccessCallbackUrl,
        displayName: <FormattedMessage id="Payment-Success-Callback-Url" />,
        description: (
          <FormattedMessage id="Payment-Success-Callback-Url-Description" />
        ),
      },
      {
        method: 'GET',
        path: data.paymentFailureCallbackUrl,
        displayName: <FormattedMessage id="Payment-Failure-Callback-Url" />,
        description: (
          <FormattedMessage id="Payment-Failure-Callback-Url-Description" />
        ),
      },
      {
        method: 'GET',
        path: data.planSelectionRedirectUrl,
        displayName: <FormattedMessage id="Plan-Selection-Redirect-Url" />,
        description: (
          <FormattedMessage id="Plan-Selection-Redirect-Url-Description" />
        ),
      },
    ])
  }, [data, productData, groupStates.subscriptionGroupEnabled])
  const urlFields = [
    { url: 'defaultHealthCheckUrl', flag: null },
    { url: 'healthStatusChangeUrl', flag: null },
    { url: 'subscriptionResetUrl', flag: 'IsSubscriptionResetEnabled' },
    { url: 'subscriptionUpgradeUrl', flag: 'IsSubscriptionUpgradeEnabled' },
    {
      url: 'subscriptionDowngradeUrl',
      flag: 'IsSubscriptionDowngradeEnabled',
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
      flag: 'isPaymentCallbackOverrideEnabled',
    },
    {
      url: 'paymentFailureCallbackUrl',
      flag: 'isPaymentCallbackOverrideEnabled',
    },
    {
      url: 'planSelectionRedirectUrl',
      flag: 'isPlanSelectionRedirectionEnabled',
    },
  ]
  const handleUrlChange = async (index, newPath) => {
    const updatedProductData = { ...productData }

    updatedProductData[urlFields[index].url] = newPath

    if (urlFields[index].flag) {
      updatedProductData[urlFields[index].flag] = newPath.trim() !== ''
    }

    const editProduct = await editProductRequest({
      data: updatedProductData,
      id: productId,
    })
    dispatch(
      productInfo({
        ...productData,
        ...updatedProductData,
      })
    )
  }
  const handleUrlToggle = async (index) => {
    const updatedUrlItems = [...urlItems]
    const urlField = urlFields[index] // Get the URL field corresponding to this index

    // Toggle the isEnabled state
    updatedUrlItems[index].isEnabled = !updatedUrlItems[index].isEnabled
    updatedUrlItems[index].method = updatedUrlItems[index].isEnabled
      ? 'POST'
      : 'DISABLED'

    setURLS(updatedUrlItems) // Update the local state

    const updatedProductData = { ...productData }
    updatedProductData[urlField.flag] = updatedUrlItems[index].isEnabled

    // Send the updated product data to the backend
    const editProduct = await editProductRequest({
      data: updatedProductData,
      id: productId,
    })
    dispatch(
      productInfo({
        ...productData,
        ...updatedProductData,
      })
    )
  }

  const handleGroupToggle = async (groupName) => {
    const newGroupState = !groupStates[groupName]

    // Update the local state
    setGroupStates({
      ...groupStates,
      [groupName]: newGroupState,
    })

    // Create a copy of the product data to be sent to the backend
    const updatedProductData = {}

    // Map group names to the relevant flags in your product data
    const groupFlags = {
      healthGroupEnabled: { healthGroupEnabled: 'isHealthCheckEnabled' }, // This group does not have a specific flag in your product data

      lifecycleGroupEnabled: {
        lifecycleGroupEnabled: 'isMainOperationEnabled',
      },
      specificationGroupEnabled: {
        specificationValidatorUrl: 'isSpecificationValidatorEnabled',
      },
      paymentAndRedirectionEndpoints: {
        paymentAndRedirectionEndpoints:
          'isPaymentAndRedirectionEndpointsEnabled',
      },
      additionalEndpointsGroupEnabled: {
        paymentSuccessCallbackUrl: 'isPaymentCallbackOverrideEnabled',
        paymentFailureCallbackUrl: 'isPaymentCallbackOverrideEnabled',
      },
      PlanSelectionGroupEnabled: {
        planSelectionRedirectUrl: 'isPlanSelectionRedirectionEnabled',
      },
    }
    console.log({ aaa: updatedProductData })

    // For the groups that have associated flags, update those flags in the product data
    if (groupFlags[groupName]) {
      Object.keys(groupFlags[groupName]).forEach((key) => {
        updatedProductData[groupFlags[groupName][key]] = newGroupState
      })
    }

    // Send the updated product data to the backend
    const editProduct = await editProductRequest({
      data: { ...data, ...updatedProductData },
      id: productId,
    })
    dispatch(
      productInfo({
        ...productData,
        ...updatedProductData,
      })
    )
  }

  const getGroupMethod = (groupEnabled, index) => {
    return groupEnabled ? urlItems[index].method : 'DISABLED'
  }
  const getUrlMethod = (urlEnabled, index) => {
    return urlEnabled && urlItems[index].isEnabled
      ? urlItems[index].method
      : 'DISABLED'
  }
  return (
    <Wrapper>
      {/* Group 1: Default Health Check Url and Health Status Change Url */}

      <Card border="light" className="shadow-sm mb-4">
        <Card.Header>
          <div className="d-flex  align-items-center">
            <Form.Check
              type="checkbox"
              checked={groupStates.healthGroupEnabled}
              className="mr-2 mb-2"
              onChange={() => handleGroupToggle('healthGroupEnabled')}
            />

            <h5>
              <FormattedMessage id="Health-Group" />
            </h5>
          </div>
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
                          groupStates.healthGroupEnabled,
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
          <div className="d-flex justify-content-between align-items-center">
            <h5>
              <FormattedMessage id="Subscription-Group" />
            </h5>
            {/* <Form.Check
              type="checkbox"
              checked={groupStates.subscriptionGroupEnabled}
              onChange={() => handleGroupToggle('subscriptionGroupEnabled')}
            /> */}
          </div>
        </Card.Header>
        <Card.Body className="pb-0">
          <Table
            responsive
            className="table-centered table-nowrap rounded mb-0 table"
          >
            <tbody>
              {urlItems.slice(2, 5).map((url, index) => (
                <tr key={index + 2}>
                  <td className="fw-bold d-flex align-items-center">
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
                  </td>
                </tr>
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
              checked={groupStates.lifecycleGroupEnabled}
              onChange={() => handleGroupToggle('lifecycleGroupEnabled')}
              className="mr-2 mb-2"
            />
            <h5>
              <FormattedMessage id="Lifecycle-Group" />
            </h5>
          </div>
        </Card.Header>
        <Card.Body className="pb-0">
          <Table
            responsive
            className="table-centered table-nowrap rounded mb-0 table"
          >
            <tbody>
              {urlItems.slice(5, 9).map((url, index) => (
                <tr key={index + 5}>
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
                          groupStates.lifecycleGroupEnabled,
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
              checked={groupStates.specificationGroupEnabled}
              onChange={() => handleGroupToggle('specificationGroupEnabled')}
              className="mr-2 mb-2"
            />
            <h5>
              <FormattedMessage id="Specification-Validator-Group" />
            </h5>
          </div>
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
                          groupStates.specificationGroupEnabled,
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
              checked={groupStates.paymentAndRedirectionEndpoints}
              onChange={() =>
                handleGroupToggle('paymentAndRedirectionEndpoints')
              }
              className="mr-2 mb-2"
            />
            <h5>
              <FormattedMessage id="Payment-and-Redirection-Endpoints" />
            </h5>
          </div>
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
                          groupStates.paymentAndRedirectionEndpoints,
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
              checked={groupStates.PlanSelectionGroupEnabled}
              onChange={() => handleGroupToggle('PlanSelectionGroupEnabled')}
              className="mr-2 mb-2"
            />
            <h5>
              <FormattedMessage id="Plan-Selection" />
            </h5>
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
                          groupStates.PlanSelectionGroupEnabled,
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
