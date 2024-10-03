import {
  AiFillDollarCircle,
  AiFillPayCircle,
  AiOutlineCheckCircle,
  AiOutlineIssuesClose,
  AiOutlinePayCircle,
} from 'react-icons/ai'
import { MdHourglassEmpty, MdPayment, MdUndo } from 'react-icons/md'
import { FormattedMessage } from 'react-intl'
import SafeFormatMessage from '../components/custom/Shared/SafeFormatMessage/SafeFormatMessage'

export const PlanChangingType = {
  1: 'Upgrade',
  2: ' Downgrade',
}
export const SubscriptionPlanChangeStatus = {
  1: {
    background: 'var(--misty-blue)',
    value: <SafeFormatMessage id="Pending" />,
    color: 'var(--midnight-blue)',
  },
  2: {
    background: 'var(--orange-yellow-blend)',
    value: <SafeFormatMessage id="In-Progress" />,
    color: 'var(--mocha-brown)',
  },
  3: {
    background: 'var(--green2)',
    value: <SafeFormatMessage id="Done" />,
    color: 'var(--teal-green)',
  },
  4: {
    background: 'var(--green2)',
    value: <SafeFormatMessage id="Failure" />,
    color: 'var(--red)',
  },
}

export const SubscriptionResetStatus = {
  1: {
    background: 'var(--misty-blue)',
    value: <SafeFormatMessage id="Pending" />,
    color: 'var(--midnight-blue)',
  },
  2: {
    background: 'var(--orange-yellow-blend)',
    value: <SafeFormatMessage id="In-Progress" />,
    color: 'var(--mocha-brown)',
  },
  3: {
    background: 'var(--green2)',
    value: <SafeFormatMessage id="Done" />,
    color: 'var(--teal-green)',
  },
  4: {
    background: 'var(--green2)',
    value: <SafeFormatMessage id="Failure" />,
    color: 'var(--red)',
  },
}

export const paymentStatus = {
  100: {
    background: 'var(--primary-color)',
    value: <SafeFormatMessage id="Initial" />,
    icon: <MdHourglassEmpty />,
    color: '#fff',
  },
  150: {
    background: 'var(--primary-color)',
    value: <SafeFormatMessage id="Pending-To-Pay" />,
    icon: <MdHourglassEmpty />,
    color: '#fff',
  },
  200: {
    background: 'var(--green2)',
    value: <SafeFormatMessage id="Paid" />,
    icon: <AiFillDollarCircle />,
    color: 'var(--teal-green)',
  },
  300: {
    background: 'var(--green2)',
    value: <SafeFormatMessage id="Authorized" />,
    icon: <MdPayment />,
    color: 'var(--teal-green)',
  },
  400: {
    background: 'var(--red2)',
    value: <SafeFormatMessage id="Refunded" />,
    icon: <MdUndo />,
    color: 'var(--mocha-brown)',
  },
  500: {
    background: 'var(--primary-color)',
    value: <SafeFormatMessage id="Failed" />,
    icon: <AiOutlineIssuesClose />,
    color: 'var(--red)',
  },
  600: {
    background: 'var(--primary-color)',
    value: <SafeFormatMessage id="Voided" />,
    icon: <AiOutlineIssuesClose />,
    color: '#fff',
  },
  700: {
    background: 'var(--primary-color)',
    value: <SafeFormatMessage id="Partially-Refunded" />,
    icon: <AiOutlineCheckCircle />,
    color: '#fff',
  },
}
export const orderStatus = {
  1: {
    value: 'Initial',
    color: 'var(--second-color)',
  },
  2: {
    value: 'Pending-To-Pay',
    color: 'var(--red)',
  },
  3: {
    value: 'Complete',
    color: 'var(--teal-green)',
  },
  4: {
    value: 'Cancelled',
    color: 'var(--mocha-brown)',
  },
}

export const subscriptionStatus = {
  true: {
    background: 'var(--green2)',
    value: <SafeFormatMessage id="Active" />,
    color: 'var(--teal-green)',
    // icon: <MdPayments />,
  },
  false: {
    background: 'var(--red2)',
    value: <SafeFormatMessage id="Inactive" />,
    color: 'var(--red)',
    // icon: <MdOutlinePayments />,
  },
}
