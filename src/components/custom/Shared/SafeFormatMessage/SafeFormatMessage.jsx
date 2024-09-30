import { FormattedMessage } from 'react-intl'

const SafeFormatMessage = ({
  id,
  values,
  defaultMessage = 'No translation available',
  boldValue,
}) => {
  if (!id) {
    return defaultMessage ? defaultMessage : ''
  }

  // Create a copy of the values object to modify
  const formattedValues = { ...values }

  // Wrap the specified value in bold tags if boldValue is provided
  if (boldValue && formattedValues[boldValue]) {
    formattedValues[boldValue] = <strong>{formattedValues[boldValue]}</strong>
  }

  return values ? (
    <FormattedMessage values={formattedValues} id={id} />
  ) : (
    <FormattedMessage id={id} />
  )
}

export default SafeFormatMessage
