import { MdAttachMoney, MdMoneyOff, MdStar, MdStarBorder } from 'react-icons/md'
import { FormattedMessage } from 'react-intl'
import SafeFormatMessage from '../components/custom/Shared/SafeFormatMessage/SafeFormatMessage'

export const labelYesNoStyle = {
  true: {
    background: 'var(--green2)',
    color: 'var(--teal-green)',
    value: 'Yes',
  },
  false: {
    background: 'var(--red2)',
    color: 'var(--orange-brown)',
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
    color: 'var(--orange-brown)',
    icon: <MdStarBorder />,
  },
}
export const dynamicButtonsLanguages = {
  en: 'English',
  ar: 'Arabic',
}

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
    color: 'var(--orange-brown)',
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
