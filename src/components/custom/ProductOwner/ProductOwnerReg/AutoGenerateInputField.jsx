import React, { useEffect } from 'react'
import { Field, useField } from 'formik'

const AutoGenerateInputField = ({
  label,
  name,
  sourceValue,
  onGenerateUniqueName,
  disabled,
}) => {
  const [, , helpers] = useField(name)

  useEffect(() => {
    let uniqueNameTitle =
      sourceValue &&
      sourceValue
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9_-]/g, '')
    if (uniqueNameTitle) {
      const trimmedValue = uniqueNameTitle.replace(/^-+|-+$/g, '')
      onGenerateUniqueName(trimmedValue)
    }
  }, [sourceValue])

  const RandomName = () => {
    onGenerateUniqueName(generateRandomUniqueName())
  }

  function generateRandomUniqueName() {
    const randomString = Math.random().toString(36).substring(2, 20)
    return randomString
  }

  return (
    <div className="inputContainer">
      <div className="inputContainerWithIcon">
        <Field
          type="text"
          id={name}
          name={name}
          onChange={(e) => {
            helpers.setValue(e.target.value)
          }}
          disabled={disabled}
        />
      </div>
    </div>
  )
}

export default AutoGenerateInputField
