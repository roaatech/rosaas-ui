import React from 'react'
import { useState } from 'react'

import {
  Card,
  OverlayTrigger,
  Table,
  Tooltip,
} from '@themesberg/react-bootstrap'

import { Wrapper } from './ProdcutDetailsTab.styled'
import UrlItemList from '../../../../components/custom/Product/UrlItemList/UrlItemList'
import { FormattedMessage } from 'react-intl'
import { DataTransform } from '../../../../lib/sharedFun/Time'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { AiFillCopy } from 'react-icons/ai'

const ProductDetailsTab = ({ data }) => {
  const [code, setCode] = useState(data.apiKey)
  const [toolTipText, setToolTipText] = useState('Copy-to-clipboard')

  const handleCopy = () => {
    setToolTipText('Copied')
    setTimeout(() => {
      setToolTipText('Copy-to-clipboard')
    }, 2000)
  }

  return (
    <Wrapper>
      {data && (
        <div className="main">
          <div className="details">
            <Card border="light" className="shadow-sm mb-4">
              <Card.Body className="pb-0">
                <Table
                  responsive
                  className="table-centered table-nowrap rounded mb-0 table"
                >
                  <tbody>
                    <tr>
                      <td className="fw-bold">
                        <FormattedMessage id="Display-Name" />
                      </td>
                      <td>{data.displayName}</td>
                    </tr>

                    <tr>
                      <td className="fw-bold">
                        <FormattedMessage id="Name" />
                      </td>
                      <td>{data.name}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">
                        <FormattedMessage id="Description" />
                      </td>
                      <td>{data.description}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">
                        <FormattedMessage id="Client" />
                      </td>
                      <td>{data.client.name}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">
                        <FormattedMessage id="Created-Date" />
                      </td>
                      <td>{DataTransform(data.createdDate)}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">
                        <FormattedMessage id="Last-Updated-Date" />
                      </td>
                      <td>{DataTransform(data.editedDate)}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">
                        <FormattedMessage id="Api-key" />
                      </td>
                      <td className="apikeyTd">
                        <span>{data.apiKey}</span>
                        <span className="relative">
                          <OverlayTrigger
                            style={{ minWidth: '150px' }}
                            trigger={['hover', 'focus']}
                            placement="top"
                            overlay={
                              <Tooltip>
                                <div style={{ minWidth: '100px' }}>
                                  {<FormattedMessage id={toolTipText} />}
                                </div>
                              </Tooltip>
                            }
                          >
                            <CopyToClipboard text={code} onCopy={handleCopy}>
                              <span className="copyItem ml-1">
                                <AiFillCopy />
                              </span>
                            </CopyToClipboard>
                          </OverlayTrigger>
                        </span>
                      </td>
                    </tr>
                    <UrlItemList data={data} />
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </div>
        </div>
      )}
    </Wrapper>
  )
}
export default ProductDetailsTab
