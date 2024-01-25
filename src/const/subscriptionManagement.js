import { AiFillPayCircle, AiOutlinePayCircle } from 'react-icons/ai'
import { MdHourglassEmpty } from 'react-icons/md'
import { FormattedMessage } from 'react-intl'

export const PlanChangingType = {
  1: 'Upgrade',
  2: ' Downgrade',
}
export const SubscriptionPlanChangeStatus = {
  1: {
    background: 'var(--misty-blue)',
    value: <FormattedMessage id="Pending" />,
    color: 'var(--midnight-blue)',
  },
  2: {
    background: 'rgba(255, 201, 102, 0.4)',
    value: <FormattedMessage id="In-Progress" />,
    color: '#5c472e',
  },
  3: {
    background: 'var(--green2)',
    value: <FormattedMessage id="Done" />,
    color: 'var(--teal-green)',
  },
  4: {
    background: 'var(--green2)',
    value: <FormattedMessage id="Failure" />,
    color: 'var(--orange-brown)',
  },
}

export const SubscriptionResetStatus = {
  1: {
    background: 'var(--misty-blue)',
    value: <FormattedMessage id="Pending" />,
    color: 'var(--midnight-blue)',
  },
  2: {
    background: 'rgba(255, 201, 102, 0.4)',
    value: <FormattedMessage id="In-Progress" />,
    color: '#5c472e',
  },
  3: {
    background: 'var(--green2)',
    value: <FormattedMessage id="Done" />,
    color: 'var(--teal-green)',
  },
  4: {
    background: 'var(--green2)',
    value: <FormattedMessage id="Failure" />,
    color: 'var(--orange-brown)',
  },
}

export const paymentStatus = {
  1: {
    background: '#5cb85c40',
    value: <FormattedMessage id="Paid-successfully" />,
    icon: <MdHourglassEmpty />,
    color: 'var(--teal-green)',
  },
  2: {
    background: '#ffa50040',
    value: <FormattedMessage id="Payment-Failed" />,
    icon: <AiOutlinePayCircle />,
    color: 'var(--orange-brown)',
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
    background: 'var(--green2)',
    value: <FormattedMessage id="Active" />,
    color: 'var(--teal-green)',
    // icon: <MdPayments />,
  },
  false: {
    background: '#f5e8e4',
    value: <FormattedMessage id="Inactive" />,
    color: 'var(--orange-brown)',
    // icon: <MdOutlinePayments />,
  },
}
