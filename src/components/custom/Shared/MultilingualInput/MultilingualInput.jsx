import { Form, OverlayTrigger, Tooltip } from '@themesberg/react-bootstrap'
import { TabPanel, TabView } from 'primereact/tabview'
import { BsFillQuestionCircleFill } from 'react-icons/bs'
import { FormattedMessage, useIntl } from 'react-intl'
import TextareaAndCounter from '../TextareaAndCounter/TextareaAndCounter'
import { Wrapper } from './MultilingualInput.style'
import SafeFormatMessage from '../SafeFormatMessage/SafeFormatMessage'

const MultilingualInput = ({
  languages,
  inputIds,
  tooltipMessageId,
  values,
  onChange,
  isRequired = false,
  inputType = 'input',
  maxLength,
  errors,
  touched,
  inputLabel,
  placeholder,
  onDrop,
  onDragOver,
  textareaApperance,
  onDragLeave,
  onDragStart,
}) => {
  const intl = useIntl()

  return (
    <Wrapper>
      <Form.Group>
        <Form.Label>
          <SafeFormatMessage id={inputLabel} />
          {isRequired && <span style={{ color: 'red' }}>*</span>}
          {tooltipMessageId && (
            <span className="fw-normal">
              <OverlayTrigger
                trigger={['hover', 'focus']}
                overlay={
                  <Tooltip>
                    {intl.formatMessage({
                      id: tooltipMessageId,
                    })}
                  </Tooltip>
                }
              >
                <span>
                  {'  '} <BsFillQuestionCircleFill />
                </span>
              </OverlayTrigger>
            </span>
          )}
        </Form.Label>
        <TabView>
          {languages?.map((lang) => (
            <TabPanel key={lang.code} header={lang.name}>
              <div className="form-group mt-3">
                {inputType === 'input' ? (
                  <input
                    type="text"
                    className="form-control"
                    id={inputIds?.[lang.code]}
                    name={inputIds?.[lang.code]}
                    onChange={onChange}
                    value={values?.[lang.code]}
                    placeholder={
                      placeholder?.[lang.code]
                        ? intl.formatMessage({
                            id: `${placeholder?.[lang.code]}`,
                          })
                        : ''
                    }
                    style={{
                      direction: lang.code === 'ar' ? 'rtl' : 'ltr',
                    }}
                    onDrop={onDrop && onDrop}
                    onDragOver={onDragOver && onDragOver}
                    onDragLeave={onDragLeave && onDragLeave}
                    onDragStart={onDragStart && onDragStart}
                  />
                ) : !textareaApperance ? (
                  <TextareaAndCounter
                    addTextarea={(field, value) =>
                      onChange({ target: { name: field, value } })
                    }
                    maxLength={maxLength}
                    showCharCount
                    inputValue={values?.[lang.code]}
                    placeholder={
                      placeholder?.[lang.code]
                        ? intl.formatMessage({
                            id: `${placeholder?.[lang.code]}`,
                          })
                        : ''
                    }
                    id={inputIds?.[lang.code]}
                    name={inputIds?.[lang.code]}
                    onChange={onChange}
                    disableMainClass={true}
                    style={{
                      direction: lang.code === 'ar' ? 'rtl' : 'ltr',
                    }}
                    onDrop={onDrop && onDrop}
                    onDragOver={onDragOver && onDragOver}
                  />
                ) : (
                  <textarea
                    className={'form-control'}
                    value={values?.[lang.code] || ''}
                    onChange={(e) =>
                      onChange({
                        target: {
                          name: inputIds?.[lang.code],
                          value: e.target.value,
                        },
                      })
                    }
                    maxLength={maxLength}
                    placeholder={
                      placeholder?.[lang.code]
                        ? intl.formatMessage({ id: placeholder?.[lang.code] })
                        : ''
                    }
                    id={inputIds?.[lang.code]}
                    name={inputIds?.[lang.code]}
                    style={{
                      direction: lang.code === 'ar' ? 'rtl' : 'ltr',
                    }}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDragStart={onDragStart && onDragStart}
                  />
                )}
              </div>
              {touched?.[lang.code] && errors?.[lang.code] && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: 'block' }}
                >
                  {errors?.[lang.code]}
                </Form.Control.Feedback>
              )}
            </TabPanel>
          ))}
        </TabView>
      </Form.Group>
    </Wrapper>
  )
}

export default MultilingualInput
