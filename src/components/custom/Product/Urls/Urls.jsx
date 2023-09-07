import React, { useState } from 'react'
import { urlStyle } from '../../../../const'
import { Wrapper } from './Urls.styled'

const Urls = (data) => {
  const [URLS, setURLS] = useState([
    {
      method: 'POST',
      path: data.data.creationEndpoint,
      title: 'Creation Url',
    },
    {
      method: 'PUT',
      path: data.data.activationEndpoint,
      title: 'Activation Url',
    },
    {
      method: 'PUT',
      path: data.data.deactivationEndpoint,
      title: 'Deactivation Url',
    },
    {
      method: 'DELETE',
      path: data.data.deletionEndpoint,
      title: 'Deletion Url',
    },
  ])

  return (
    <Wrapper>
      {URLS.map((url, index) => (
        <div
          key={index}
          className="bar"
          style={{
            background: urlStyle[url.method].lightColor,
            borderColor: urlStyle[url.method].darkColor,
          }}
        >
          <span className="info">
            <span
              className="method"
              style={{ background: urlStyle[url.method].darkColor }}
            >
              {url.method}
            </span>
            <span className="url">{url.path}</span>
          </span>
          <span className="title">{url.title}</span>
        </div>
      ))}
    </Wrapper>
  )
}

export default Urls
