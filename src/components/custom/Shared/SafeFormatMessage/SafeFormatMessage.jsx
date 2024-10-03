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

  const formattedValues = { ...values }

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
