import React, { useState } from 'react'
import { urlStyle } from '../../../../const'
import { Wrapper } from './UrlItem.styled'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Tooltip, OverlayTrigger } from '@themesberg/react-bootstrap'
import { AiFillCopy } from 'react-icons/ai'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'

const UrlItem = ({ data }) => {
  const url = data
  const [code, setCode] = useState(url.path)
  const [toolTipText, setToolTipText] = useState('Copy-to-clipboard')
  let direction = useSelector((state) => state.main.direction)

  const handleCopy = () => {
    setToolTipText('Copied')
    setTimeout(() => {
      setToolTipText('Copy-to-clipboard')
    }, 2000)
  }

  return (
    <Wrapper direction={direction}>
      <div
        className="bar"
        style={{
          background: urlStyle[url.method].lightColor,
          borderColor: urlStyle[url.method].darkColor,
        }}
      >
        <div className="info">
          <span
            className="method"
            style={{ background: urlStyle[url.method].darkColor }}
          >
            {url.method}
          </span>
          <span className="url">{url.path}</span>
        </div>
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
      </div>
    </Wrapper>
  )
}

export default UrlItem
