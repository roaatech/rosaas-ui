import React, { useState, useEffect } from 'react'
import { urlStyle } from '../../../../const'
import { Wrapper } from './UrlItem.styled'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Tooltip, OverlayTrigger, Button } from '@themesberg/react-bootstrap'
import { AiFillCopy, AiOutlineEdit, AiOutlineSave } from 'react-icons/ai'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import SafeFormatMessage from '../../Shared/SafeFormatMessage/SafeFormatMessage'

const UrlItem = ({ data, onUrlChange }) => {
  const url = data
  const [code, setCode] = useState(url.path)
  const [toolTipText, setToolTipText] = useState('Copy-to-clipboard')
  const [isEditing, setIsEditing] = useState(false)
  let direction = useSelector((state) => state.main.direction)

  useEffect(() => {
    setCode(url.path)
  }, [url.path])

  const handleCopy = () => {
    setToolTipText('Copied')
    setTimeout(() => {
      setToolTipText('Copy-to-clipboard')
    }, 2000)
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing)
    if (isEditing) {
      const newPath = code.trim() === '' ? '' : code
      const isEnabled = newPath !== ''
      onUrlChange(newPath, isEnabled) // Notify parent component with newPath and isEnabled
    }
  }

  const handlePathChange = (e) => {
    setCode(e.target.value)
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
          {isEditing ? (
            <input
              type="text"
              value={code}
              onChange={handlePathChange}
              className="form-control url-input"
            />
          ) : (
            <span className="url">{code}</span>
          )}
        </div>
        <span className="relative">
          {url.method !== 'DISABLED' ? (
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
                <CopyToClipboard
                  text={code}
                  onCopy={handleCopy}
                  disabled={url.method === 'DISABLED'}
                >
                  <span
                    className={`copyItem ml-1 ${
                      url.method === 'DISABLED' ? 'disabled' : 'enabled'
                    }`}
                    style={{
                      cursor:
                        url.method === 'DISABLED' ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <AiFillCopy />
                  </span>
                </CopyToClipboard>
              </span>
            </OverlayTrigger>
          ) : (
            <span
              className="copyItem ml-1 disabled"
              style={{
                cursor: 'not-allowed',
              }}
            >
              <AiFillCopy />
            </span>
          )}
          <OverlayTrigger
            trigger={['hover', 'focus']}
            placement="top"
            overlay={
              <Tooltip>
                <div>
                  {isEditing ? (
                    <SafeFormatMessage id="Save" />
                  ) : (
                    <SafeFormatMessage id="Edit" />
                  )}
                </div>
              </Tooltip>
            }
          >
            <Button
              variant="link"
              onClick={handleEditToggle}
              className="ml-1 p-0 edit-button enabled"
              style={{
                color: 'var(--second-color)',
              }}
            >
              {isEditing ? <AiOutlineSave /> : <AiOutlineEdit />}
            </Button>
          </OverlayTrigger>
        </span>
      </div>
    </Wrapper>
  )
}

export default UrlItem
