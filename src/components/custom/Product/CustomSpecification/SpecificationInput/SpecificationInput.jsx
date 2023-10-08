import React from 'react'

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
}) => {
  const sanitizedValue = String(value)
  console.log('dataType:', dataType)
  console.log('value:', value) // Check the type and value here
  const InputComponent = getInputComponent(dataType)

  return (
    <div className={`form-group`}>
      <div>
        <InputComponent
          value={sanitizedValue}
          className={className}
          onChange={onChange}
        />
      </div>
    </div>
  )
}

export default SpecificationInput
