import {
  AiFillDollarCircle,
  AiFillPayCircle,
  AiOutlineCheckCircle,
  AiOutlineIssuesClose,
  AiOutlinePayCircle,
} from 'react-icons/ai'
import { MdHourglassEmpty, MdPayment, MdUndo } from 'react-icons/md'
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
    background: 'var(--orange-yellow-blend)',
    value: <FormattedMessage id="In-Progress" />,
    color: 'var(--mocha-brown)',
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
    background: 'var(--orange-yellow-blend)',
    value: <FormattedMessage id="In-Progress" />,
    color: 'var(--mocha-brown)',
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
  100: {
    background: 'var(--primary-color)',
    value: <FormattedMessage id="Initial" />,
    icon: <MdHourglassEmpty />,
    color: '#fff',
  },
  150: {
    background: 'var(--primary-color)',
    value: <FormattedMessage id="Pending-To-Pay" />,
    icon: <MdHourglassEmpty />,
    color: '#fff',
  },
  200: {
    background: 'var(--orange-brown)',
    value: <FormattedMessage id="Authorized" />,
    icon: <MdPayment />,
    color: 'var(--orange-brown)',
  },
  300: {
    background: 'var(--green2)',
    value: <FormattedMessage id="Paid" />,
    icon: <AiFillDollarCircle />,
    color: 'var(--teal-green)',
  },
  400: {
    background: 'var(--red2)',
    value: <FormattedMessage id="Refunded" />,
    icon: <MdUndo />,
    color: 'var(--mocha-brown)',
  },
  500: {
    background: 'var(--primary-color)',
    value: <FormattedMessage id="Voided" />,
    icon: <AiOutlineIssuesClose />,
    color: '#fff',
  },
  600: {
    background: 'var(--primary-color)',
    value: <FormattedMessage id="Partially-Refunded" />,
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
    color: 'var(--orange-brown)',
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
    value: <FormattedMessage id="Active" />,
    color: 'var(--teal-green)',
    // icon: <MdPayments />,
  },
  false: {
    background: 'var(--red2)',
    value: <FormattedMessage id="Inactive" />,
    color: 'var(--orange-brown)',
    // icon: <MdOutlinePayments />,
  },
}
