import SafeFormatMessage from '../components/custom/Shared/SafeFormatMessage/SafeFormatMessage'

export const cancellationOrSuspensionReasons = {
  1: {
    displayName: 'Unpaid',
    background: 'var(--red2)',
    value: <SafeFormatMessage id="Unpaid" />,
    color: 'var(--red)',
  },
  2: {
    displayName: 'Super-Admin-Request',
    background: 'var(--light-blue)',
    value: <SafeFormatMessage id="SuperAdminRequest" />,
    color: 'var(--blue-2)',
  },
  3: {
    displayName: 'External-System-Request',
    background: 'var(--yellow-light)',
    value: <SafeFormatMessage id="ExternalSystemRequest" />,
    color: 'var(--yellow2)',
  },
  4: {
    displayName: 'Product-Owner-Request',
    background: 'var(--green2)',
    value: <SafeFormatMessage id="ProductOwnerRequest" />,
    color: 'var(--green)',
  },
  5: {
    displayName: 'Subscriber-Request',
    background: 'var(--pale-moonlight-gray)',
    value: <SafeFormatMessage id="SubscriberRequest" />,
    color: 'var(--primary5)',
  },
  10: {
    displayName: 'Other',
    background: 'var(--silver-gray)',
    value: <SafeFormatMessage id="Other" />,
    color: 'var(--primary7)',
  },
}
