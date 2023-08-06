import React, { useEffect, useState } from 'react'
import ProductUrl from '../UrlItem/UrlItem'
import { FormattedMessage } from 'react-intl'

const UrlItemList = ({ data }) => {
  const [UrlItemList, setURLS] = useState([])

  useEffect(() => {
    setURLS([
      {
        method: 'GET',
        path: data.defaultHealthCheckUrl,
        title: <FormattedMessage id="Default-Health-Check-Url" />,
      },
      {
        method: 'POST',
        path: data.healthStatusChangeUrl,
        title: <FormattedMessage id="Health-Status-Change-Url" />,
      },
      {
        method: 'POST',
        path: data.creationEndpoint,
        title: <FormattedMessage id="Creation-Url" />,
      },
      {
        method: 'PUT',
        path: data.activationEndpoint,
        title: <FormattedMessage id="Activation-Url" />,
      },
      {
        method: 'PUT',
        path: data.deactivationEndpoint,
        title: <FormattedMessage id="Deactivation-Url" />,
      },
      {
        method: 'DELETE',
        path: data.deletionEndpoint,
        title: <FormattedMessage id="Deletion-Url" />,
      },
    ])
  }, [data])

  return UrlItemList.map((url) => (
    <tr>
      <td className="fw-bold">{url.title}</td>
      <td className="url-container">
        <ProductUrl data={url} />
      </td>
    </tr>
  ))
}

export default UrlItemList
