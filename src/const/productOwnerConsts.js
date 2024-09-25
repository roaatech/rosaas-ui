import SafeFormatMessage from '../components/custom/Shared/SafeFormatMessage/SafeFormatMessage'

export const ProductOwnerStatus = {
  1: {
    background: 'var(--green2)',
    value: <SafeFormatMessage id="Active" />,
    color: 'var(--teal-green)',
  },
  2: {
    background: 'var(--yellow-light)',
    value: <SafeFormatMessage id="Inactive" />,
    color: 'var(--yellow2)',
  },
  3: {
    background: 'var(--red2)',
    value: <SafeFormatMessage id="Canceled" />,
    color: 'var(--orange-brown)',
  },
}
