import React, { useEffect, useState } from 'react'
import ProductUrl from '../UrlItem/UrlItem'
import { FormattedMessage } from 'react-intl'
import { OverlayTrigger, Tooltip } from '@themesberg/react-bootstrap'
import { BsFillQuestionCircleFill } from 'react-icons/bs'
const UrlItemList = ({ data }) => {
  const [UrlItemList, setURLS] = useState([])
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
        method: 'POST',
        path: data.subscriptionResetUrl,
        displayName: <FormattedMessage id="Subscription-Reset-Url" />,
        description: (
          <FormattedMessage id="Subscription-Reset-Url-Description" />
        ),
      },
      {
        method: 'POST',
        path: data.subscriptionUpgradeUrl,
        displayName: <FormattedMessage id="Subscription-Upgrade" />,
        description: <FormattedMessage id="Subscription-Upgrade-Description" />,
      },
      {
        method: 'POST',
        path: data.subscriptionDowngradeUrl,
        displayName: <FormattedMessage id="Subscription-Downgrade-Url" />,
        description: (
          <FormattedMessage id="Subscription-Downgrade-Url-Description" />
        ),
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
    ])
  }, [data])

  return UrlItemList.map((url, index) => (
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
        <ProductUrl data={url} />
      </td>
    </tr>
  ))
}

export default UrlItemList
