import React, { useState } from 'react'
import { Card, Table } from '@themesberg/react-bootstrap'
import OldUrlItemList from '../OldUrlItemList/OldUrlItemList'
import UrlItemList from '../UpdatedUrlItemList/UpdatedUrlItemList'

const IntegrationUrlsTab = ({ data, onSave }) => {
  const [urlData, setUrlData] = useState(data)

  const handleUrlsChange = (updatedUrls) => {
    setUrlData((prevState) => ({
      ...prevState,
      defaultHealthCheckUrl: updatedUrls[0].path,
      healthStatusChangeUrl: updatedUrls[1].path,
      subscriptionResetUrl: updatedUrls[2].path,
      subscriptionUpgradeUrl: updatedUrls[3].path,
      subscriptionDowngradeUrl: updatedUrls[4].path,
      creationEndpoint: updatedUrls[5].path,
      activationEndpoint: updatedUrls[6].path,
      deactivationEndpoint: updatedUrls[7].path,
      deletionEndpoint: updatedUrls[8].path,
    }))
  }

  const handleSave = () => {
    if (onSave) {
      onSave(urlData) // Pass the updated data back to the parent or API
    }
  }

  return <UrlItemList data={urlData} handleUrlsChange={handleUrlsChange} />
}

export default IntegrationUrlsTab
