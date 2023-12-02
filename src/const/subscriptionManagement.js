import { AiFillPayCircle, AiOutlinePayCircle } from 'react-icons/ai'
import { MdHourglassEmpty } from 'react-icons/md'
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

export const paymentStatus = {
  1: {
    background: '#5cb85c40',
    value: <FormattedMessage id="Paid-successfully" />,
    icon: <MdHourglassEmpty />,
    color: '#00a675',
  },
  2: {
    background: '#ffa50040',
    value: <FormattedMessage id="Payment-Failed" />,
    icon: <AiOutlinePayCircle />,
    color: '#d26b4e',
  },
  3: {
    background: '#d9534f40',
    value: <FormattedMessage id="Unpaid" />,
    icon: <MdHourglassEmpty />,
    color: '#5c472e',
  },
  4: {
    background: 'var(--primary-color)',
    value: <FormattedMessage id="Pay-Now" />,
    color: '#fff',
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
