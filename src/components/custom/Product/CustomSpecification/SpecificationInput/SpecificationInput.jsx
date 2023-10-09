import React, { useState } from 'react'

const TextInput = ({ value, onChange, className }) => (
  <input type="text" value={value} onChange={onChange} className={className} />
)

const NumberInput = ({ value, onChange, className }) => (
  <input
    type="number"
    value={value}
    onChange={onChange}
    className={className}
  />
)

const DateInput = ({ value, onChange, className }) => (
  <input type="date" value={value} onChange={onChange} className={className} />
)

function getInputComponent(dataType) {
  switch (dataType) {
    case 1:
      return TextInput
    case 2:
      return NumberInput
    case 3:
      return DateInput
    default:
      return TextInput
  }
}

const SpecificationInput = ({
  dataType,
  value,
  onChange,
  displayName,
  className,
  regularExpression,
  validationFailureDescription,
  isRequired,
}) => {
  const sanitizedValue = String(value)
  const InputComponent = getInputComponent(dataType)
  const [error, setError] = useState(null)

  const validate = (inputValue) => {
    if (isRequired && inputValue.trim() === '') {
      setError('This field is required.')
    } else if (
      regularExpression &&
      !new RegExp(regularExpression).test(inputValue)
    ) {
      setError(validationFailureDescription || 'Invalid input.')
    } else {
      setError(null)
    }
  }

  const handleChange = (event) => {
    const inputValue = event.target.value
    validate(inputValue)
    onChange(event)
  }

  return (
    <div className={`form-group`}>
      <div>
        <InputComponent
          value={sanitizedValue}
          className={className}
          onChange={handleChange}
        />
        {error && <div className="text-danger">{error}</div>}
      </div>
    </div>
  )
}

export default SpecificationInput
