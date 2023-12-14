import React, { useEffect } from 'react'
import { OverlayTrigger, Tooltip } from '@themesberg/react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi'
import { Wrapper } from './AutoGenerateInput.styled'

const AutoGenerateInput = ({
  label,
  value,
  onChange,
  id,
  name,
  onGenerateUniqueName,
  disabled,
}) => {
  useEffect(() => {
    let uniqueNameTitle =
      value &&
      value
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9_-]/g, '')
    if (uniqueNameTitle) {
      const trimmedValue = uniqueNameTitle.replace(/^-+|-+$/g, '')
      onGenerateUniqueName(trimmedValue)
    }
  }, [value])
  const RandomName = () => {
    onGenerateUniqueName(generateRandomUniqueName())
  }
  function generateRandomUniqueName() {
    const randomString = Math.random().toString(36).substring(2, 20)
    return randomString
  }

  return (
    <Wrapper>
      <div>
        <strong className="mb-2">
          {' '}
          {label} <span style={{ color: 'red' }}>*</span>
        </strong>
        <div className="inputIcon mt-2">
          <span className="buttonCont">
            <OverlayTrigger
              style={{ minWidth: '150px' }}
              trigger={['hover', 'focus']}
              placement="top"
              overlay={
                <Tooltip>
                  <FormattedMessage id="Random-Name" />
                </Tooltip>
              }
            >
              <button type="button" onClick={RandomName}>
                <GiPerspectiveDiceSixFacesRandom />
              </button>
            </OverlayTrigger>
          </span>
          <input
            className="form-control "
            type="text"
            id={id}
            name={id}
            onChange={onChange}
            value={name}
            disabled={disabled}
          />
        </div>
      </div>
    </Wrapper>
  )
}

export default AutoGenerateInput
