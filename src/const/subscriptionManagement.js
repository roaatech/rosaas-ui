import { FormattedMessage } from 'react-intl'

export const PlanChangingType = {
  1: 'Upgrade',
  2: ' Downgrade',
}
export const SubscriptionPlanChangeStatus = {
  1: {
    background: '#f0f8ff',
    value: <FormattedMessage id="Pending" />,
    color: '#336699',
  },
  2: {
    background: 'rgba(255, 201, 102, 0.4)',
    value: <FormattedMessage id="In-Progress" />,
    color: '#5c472e',
  },
  3: {
    background: '#eff9f6',
    value: <FormattedMessage id="Done" />,
    color: '#00a675',
  },
  4: {
    background: '#eff9f6',
    value: <FormattedMessage id="Failure" />,
    color: '#d26b4e',
  },
}

export const SubscriptionResetStatus = {
  1: {
    background: '#f0f8ff',
    value: <FormattedMessage id="Pending" />,
    color: '#336699',
  },
  2: {
    background: 'rgba(255, 201, 102, 0.4)',
    value: <FormattedMessage id="In-Progress" />,
    color: '#5c472e',
  },
  3: {
    background: '#eff9f6',
    value: <FormattedMessage id="Done" />,
    color: '#00a675',
  },
  4: {
    background: '#eff9f6',
    value: <FormattedMessage id="Failure" />,
    color: '#d26b4e',
  },
}
export const subscriptionStatus = {
  true: {
    background: '#eff9f6',
    value: <FormattedMessage id="Active" />,
    color: '#00a675',
    // icon: <MdPayments />,
  },
  false: {
    background: '#f5e8e4',
    value: <FormattedMessage id="Inactive" />,
    color: '#d26b4e',
    // icon: <MdOutlinePayments />,
  },
}
