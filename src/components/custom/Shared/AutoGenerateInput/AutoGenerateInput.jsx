import React, { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons'
import { Form } from 'formik'
import {
  Modal,
  Button,
  OverlayTrigger,
  Tooltip,
} from '@themesberg/react-bootstrap'
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
}) => {
  useEffect(() => {
    let uniqueNameTitle = value
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
        <strong> {label}</strong> <span style={{ color: 'red' }}>*</span>
        <div className="inputIcon">
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
          />
        </div>
      </div>
    </Wrapper>
  )
}

export default AutoGenerateInput
