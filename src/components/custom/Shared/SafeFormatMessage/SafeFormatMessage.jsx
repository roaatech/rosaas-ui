import { FormattedMessage } from 'react-intl'

const SafeFormatMessage = ({
  id,
  values,
  defaultMessage = 'No translation available',
}) => {
  if (!id) {
    return defaultMessage ? defaultMessage : ''
  }

  return values ? (
    <FormattedMessage values={values} id={id} />
  ) : (
    <FormattedMessage id={id} />
  )
}

export default SafeFormatMessage
