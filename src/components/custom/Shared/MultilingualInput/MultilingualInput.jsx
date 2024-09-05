import { Form, OverlayTrigger, Tooltip } from '@themesberg/react-bootstrap'
import { TabPanel, TabView } from 'primereact/tabview'
import { BsFillQuestionCircleFill } from 'react-icons/bs'
import { FormattedMessage, useIntl } from 'react-intl'
import TextareaAndCounter from '../TextareaAndCounter/TextareaAndCounter'
import { Wrapper } from './MultilingualInput.style'

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
}) => {
  const intl = useIntl()
  console.log({
    languages,
    inputIds,
    tooltipMessageId,
    values,
    onChange,
    isRequired,
    inputType,
    maxLength,
    errors,
    touched,
    inputLabel,
    placeholder,
  })

  return (
    <Wrapper>
      <Form.Group>
        <Form.Label>
          <FormattedMessage id={inputLabel} />
          {isRequired && <span style={{ color: 'red' }}>*</span>}
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
        </Form.Label>
        <TabView>
          {languages.map((lang) => (
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
                  />
                ) : (
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
