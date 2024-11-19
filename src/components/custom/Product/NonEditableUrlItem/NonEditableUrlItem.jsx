import React, { useState, useEffect } from 'react'
import { urlStyle } from '../../../../const'
import { Wrapper } from './NonEditableUrlItem.styled'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Tooltip, OverlayTrigger, Button } from '@themesberg/react-bootstrap'
import { AiFillCopy } from 'react-icons/ai'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import SafeFormatMessage from '../../Shared/SafeFormatMessage/SafeFormatMessage'
import { FiExternalLink } from 'react-icons/fi'

const NonEditableUrlItem = ({ data, showNavigationIcon = false }) => {
  const url = data
  const [toolTipText, setToolTipText] = useState('Copy-to-clipboard')
  let direction = useSelector((state) => state.main.direction)

  const handleCopy = () => {
    setToolTipText('Copied')
    setTimeout(() => {
      setToolTipText('Copy-to-clipboard')
    }, 2000)
  }

  const handleNavigate = () => {
    window.open(url.path, '_blank', 'noopener,noreferrer')
  }

  return (
    <Wrapper direction={direction}>
      <div
        className="bar"
        style={{
          background: urlStyle[url.method]?.lightColor || '#f0f0f0',
          borderColor: urlStyle[url.method]?.darkColor || '#ccc',
        }}
      >
        <div className="info">
          <span
            className="method"
            style={{ background: urlStyle[url.method]?.darkColor || '#ccc' }}
          >
            {urlStyle[url.method]?.method || url.method || 'URL'}
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
                  {<SafeFormatMessage id={toolTipText} />}
                </div>
              </Tooltip>
            }
          >
            <span>
              <CopyToClipboard text={url.path} onCopy={handleCopy}>
                <span
                  className="copyItem ml-1 enabled"
                  style={{ cursor: 'pointer' }}
                >
                  <AiFillCopy />
                </span>
              </CopyToClipboard>
            </span>
          </OverlayTrigger>
          {showNavigationIcon && (
            <OverlayTrigger
              trigger={['hover', 'focus']}
              placement="top"
              overlay={
                <Tooltip>
                  <div style={{ minWidth: '100px' }}>
                    {
                      <SafeFormatMessage
                        id="Open-in-new-tab"
                        defaultMessage={'Open in new tab'}
                      />
                    }
                  </div>
                </Tooltip>
              }
            >
              <span
                className="navigateItem ml-2"
                onClick={handleNavigate}
                style={{ cursor: 'pointer', marginLeft: '10px' }}
              >
                <FiExternalLink />
              </span>
            </OverlayTrigger>
          )}
        </span>
      </div>
    </Wrapper>
  )
}

export default NonEditableUrlItem
