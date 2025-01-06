import { MdAttachMoney, MdMoneyOff, MdStar, MdStarBorder } from 'react-icons/md'
import { FormattedMessage } from 'react-intl'
import SafeFormatMessage from '../components/custom/Shared/SafeFormatMessage/SafeFormatMessage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEnvelope,
  faEnvelopeOpen,
  faReply,
} from '@fortawesome/free-solid-svg-icons'

export const entityTypes = {
  User: 1,
  ProductOwner: 2,
  Product: 3,
  Tenant: 4,
  Feature: 5,
  Subscription: 7,
  SubscriptionAutoRenewal: 8,
  SubscriptionPlanChanging: 9,
  SubscriptionRenewal: 10,
  Membership: 11,
  Order: 12,
  Plan: 13,
  PlanPrice: 14,
}
export const discountLimitations = {
  unlimited: 1,
  nTimesOnly: 2,
  nTimesPerCustomer: 3,
}
export const discountTypes = {
  assignedToPlans: 1,
  assignedToProducts: 2,
  assignedToProductOwners: 3,
  assignedToOrderTotal: 4,
  assignedToOrderSubTotal: 5,
}

export const labelYesNoStyle = {
  true: {
    background: 'var(--green2)',
    color: 'var(--teal-green)',
    value: 'Yes',
  },
  false: {
    background: 'var(--red2)',
    color: 'var(--red)',
    value: 'No',
  },
}
export const PrimaryCurrencyStatus = {
  true: {
    background: 'var(--green2)',
    value: <SafeFormatMessage id="Primary-Currency" />,
    color: 'var(--teal-green)',
    icon: <MdStar />,
  },
  false: {
    background: 'var(--red2)',
    value: <SafeFormatMessage id="Not-Primary-Currency" />,
    color: 'var(--red)',
    icon: <MdStarBorder />,
  },
}
export const dynamicButtonsLanguages = {
  en: 'English',
  ar: 'Arabic',
}
export const roles = [
  'superAdmin',
  'clientAdmin',
  'ProductAdmin',
  'tenantAdmin',
]
export const logLevels = [
  'Trace',
  'Debug',
  'Information',
  'Warning',
  'Error',
  'Critical',
]
export const PrimaryExchangeRateCurrencyStatus = {
  true: {
    background: 'var(--green2)',
    value: <SafeFormatMessage id="Primary-Exchange-Rate-Currency" />,
    color: 'var(--teal-green)',
    icon: <MdAttachMoney />,
  },
  false: {
    background: 'var(--red2)',
    value: <SafeFormatMessage id="Not-Primary-Exchange-Rate-Currency" />,
    color: 'var(--red)',
    icon: <MdMoneyOff />,
  },
}
export const roundingTypeOptions = {
  10: 'rounding-type-default',
  20: 'rounding-type-up-0.05',
  30: 'rounding-type-down-0.05',
  40: 'rounding-type-up-0.10',
  50: 'rounding-type-down-0.10',
  60: 'rounding-type-0.50',
  70: 'rounding-type-1.00',
  80: 'rounding-type-up-1.00',
}
export const LimitType = {
  10: <SafeFormatMessage id="Max-Products-Limit" />,
}

export const ContactFormStatus = {
  1: {
    background: 'var(--light-blue)',
    value: <SafeFormatMessage id="New" />,
    color: 'var(--blue-2)',
    icon: <FontAwesomeIcon icon={faEnvelope} />,
  },
  2: {
    background: 'var(--yellow-light)',
    value: <SafeFormatMessage id="Read" />,
    color: 'var( --yellow2)',
    icon: <FontAwesomeIcon icon={faEnvelopeOpen} />,
  },
  3: {
    background: 'var(--second-color-2)',
    value: <SafeFormatMessage id="Replied" />,
    color: 'var(--second-color)',
    icon: <FontAwesomeIcon icon={faReply} />,
  },
}
