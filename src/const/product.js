import {
  BsEye,
  BsEyeSlash,
  BsFillCheckCircleFill,
  BsFillExclamationCircleFill,
  BsFillLockFill,
  BsFillUnlockFill,
} from 'react-icons/bs'
import { FiLock, FiUnlock } from 'react-icons/fi'
import {
  MdOutlineUnpublished,
  MdOutlinePublishedWithChanges,
  MdPayments,
  MdOutlinePayments,
  MdOutlineLock,
  MdMicExternalOff,
  MdMicExternalOn,
  MdCheckBox,
  MdCheckBoxOutlineBlank,
} from 'react-icons/md'
import { FormattedMessage } from 'react-intl'
import SafeFormatMessage from '../components/custom/Shared/SafeFormatMessage/SafeFormatMessage'

export const Product_id = '88e67328-3b20-413e-b6e1-010b48fa7bc9'
export const Product_Client_id = '88283b02-e969-485a-a5a3-9e5d1d0d3337'
export const Client_id = 'spa_rosas_admin_panel'

export const HealthStatus = {
  true: {
    background: 'var(--green2)',
    value: <SafeFormatMessage id="Healthy" />,
    color: 'var(--teal-green)',
    icon: <BsFillCheckCircleFill />,
  },
  false: {
    background: 'var(--red2)',
    value: <SafeFormatMessage id="Unavailable" />,
    color: 'var(--orange-brown)',
    icon: <BsFillExclamationCircleFill />,
  },
}
export const DateStatus = {
  true: {
    label: (date) => `Expired on ${date}`,
    color: 'red',
  },
  false: {
    label: (date) => `Expires on ${date}`,
    color: 'green',
  },
}
export const PublishStatus = {
  true: {
    background: 'var(--green2)',
    value: <SafeFormatMessage id="Active" />,
    color: 'var(--teal-green)',
    icon: <MdOutlinePublishedWithChanges />,
  },
  false: {
    background: 'var(--red2)',
    value: <SafeFormatMessage id="Inactive" />,
    color: 'var(--orange-brown)',
    icon: <MdOutlineUnpublished />,
  },
}
export const SelectabilityStatus = {
  true: {
    background: 'var(--green2)',
    value: <SafeFormatMessage id="Selectable" />,
    color: 'var(--teal-green)',
    icon: <MdCheckBox />,
  },
  false: {
    background: 'var(--red2)',
    value: <SafeFormatMessage id="Unselectable" />,
    color: 'var(--orange-brown)',
    icon: <MdCheckBoxOutlineBlank />,
  },
}
export const systemLockStatus = {
  true: {
    background: 'var(--green2)',
    value: <SafeFormatMessage id="Locked" />,
    color: 'var(--teal-green)',
    icon: <BsFillLockFill />,
  },
  false: {
    background: 'var(--red2)',
    value: <SafeFormatMessage id="Unlocked" />,
    color: 'var(--orange-brown)',
    icon: <BsFillUnlockFill />,
  },
}
export const activeStatus = {
  true: {
    background: 'var(--green2)',
    value: <SafeFormatMessage id="Active" />,
    color: 'var(--teal-green)',
  },
  false: {
    background: 'var(--red2)',
    value: <SafeFormatMessage id="Inactive" />,
    color: 'var(--orange-brown)',
  },
}
export const textLocale = (textLoclizations, selectedLanguage, intl) => {
  return textLoclizations?.[selectedLanguage] || textLoclizations?.[intl.locale]
}
export const subscriptionStatus = {
  1: {
    background: 'var(--green2)',
    value: <SafeFormatMessage id="Active" />,
    color: 'var(--teal-green)',
    displayName: 'Active',
  },
  2: {
    background: 'var(--yellow-light)',
    value: <SafeFormatMessage id="Suspended" />,
    color: 'var(--yellow2)',
    displayName: 'Suspended',
  },
  3: {
    background: 'var(--red2)',
    value: <SafeFormatMessage id="Canceled" />,
    color: 'var(--orange-brown)',
    displayName: 'Canceled',
  },
}
export const actionTypeColors = {
  GET: {
    background: '#61affe', // Light blue for GET
    value: 'GET',
    color: 'var(--white-pure)',
    displayName: 'GET',
  },
  PUT: {
    background: '#fca130', // Orange for PUT
    value: 'PUT',
    color: 'var(--white-pure)',
    displayName: 'PUT',
  },
  POST: {
    background: '#49cc90', // Green for POST
    value: 'POST',
    color: 'var(--white-pure)',
    displayName: 'POST',
  },
  DELETE: {
    background: '#f93e3e', // Red for DELETE
    value: 'DELETE',
    color: 'var(--white-pure)',
    displayName: 'DELETE',
  },
}
export const subscriptionMode = {
  1: {
    background: 'var(--green2)',
    value: <SafeFormatMessage id="Subscription" />,
    color: 'var(--teal-green)',
    displayName: 'Subscription',
  },
  2: {
    background: 'var(--light-blue)',
    value: <SafeFormatMessage id="Trial" />,
    color: 'var(--blue-2)',
    displayName: 'Trial',
  },
  3: {
    background: 'var(--yellow-light)',
    value: <SafeFormatMessage id="Payment" />,
    color: 'var(--yellow2)',
    displayName: 'Payment',
  },
}

export const tenantStep = [
  { id: 1, label: <SafeFormatMessage id="Creation" /> },
  { id: 2, label: <SafeFormatMessage id="Activation" /> },
  { id: 3, label: <SafeFormatMessage id="Deactivation" /> },
  { id: 4, label: <SafeFormatMessage id="Deletion" /> },
]
export const isMajorStatus = {
  true: {
    background: 'var(--green2)',
    value: <SafeFormatMessage id="true" />,
    color: 'var(--teal-green)',
  },
  false: {
    background: 'var(--red2)',
    value: <SafeFormatMessage id="false" />,
    color: 'var(--orange-brown)',
  },
}
export const booleanStatus = {
  true: {
    background: 'var(--green2)',
    value: <SafeFormatMessage id="yes" />,
    color: 'var(--teal-green)',
  },
  false: {
    background: 'var(--red2)',
    value: <SafeFormatMessage id="no" />,
    color: 'var(--orange-brown)',
  },
}

export const visibilityStatus = {
  true: {
    background: 'var(--green2)',
    value: <SafeFormatMessage id="Visible" />,
    color: 'var(--teal-green)',
    icon: <BsEye />,
  },
  false: {
    background: 'var(--red2)',
    value: <SafeFormatMessage id="invisible" />,
    color: 'var(--orange-brown)',
    icon: <BsEyeSlash />,
  },
}
export const clientTypeLable = {
  101: {
    background: 'var(--orange-yellow-blend)',
    value: <SafeFormatMessage id="External-System" />,
    color: 'var(--mocha-brown)',
  },

  102: {
    background: 'var(--misty-blue)',
    value: <SafeFormatMessage id="External-System-Client" />,
    color: 'var(--midnight-blue)',
  },
}

export const cycle = {
  // 2: 'Week',
  3: 'Month',
  4: 'Year',
  // 5: 'One-Day',
  // 6: 'Three-Day',
  10: 'Custom',
  11: 'Unlimited',
}
export const ProductTrialType = {
  1: {
    value: <SafeFormatMessage id="No-Trial" />,
    color: 'var(--primary-color)',
    background: 'var(--primary0)',
  },
  2: {
    value: <SafeFormatMessage id="Product-Has-Trial-Plan" />,
    color: 'var(--orange-brown)',
    background: 'var(--misty-blue)',
  },
  3: {
    value: <SafeFormatMessage id="Each-Plan-Has-Optional-Trial-Period" />,
    color: 'var(--teal-green)',
    background: 'var(--misty-gray)',
  },
}

export const urlIsOverridden = {
  true: { background: '#eee5ff', value: 'Yes' },
  false: { background: '#e1f0ff', value: 'No' },
}
export const tenancyTypeEnum = {
  1: 'Unlimited',
  2: 'Limited',
  3: 'Planned',
}
export const featureTypeMap = {
  1: 'Number',
  2: 'Boolean',
}

export const featureUnitMap = {
  1: 'unit',
  2: 'KB',
  3: 'MB',
  4: 'GB',
}

export const featureResetMap = {
  1: 'Non-Resettable',
  2: 'Weekly',
  3: 'Monthly',
  4: 'Annual',
}

const activeTabKeys = [
  'details',
  'trialPeriod',
  'webhook',
  'clientCredintials',
  'userManagement',
  'customSpecification',
  'plans',
  'features',
  'plansFeatures',
  'plansPrice',
  'subscriptions',
]

export const activeTab = activeTabKeys.reduce((acc, key, index) => {
  acc[key] = index
  return acc
}, {})

export const urlStyle = {
  GET: {
    method: 'GET',
    darkColor: '#61affe',
    lightColor: '#ebf3fb',
  },
  POST: {
    method: 'POST',
    darkColor: '#49cc90',
    lightColor: '#e8f6f0',
  },
  PUT: {
    method: 'PUT',
    darkColor: '#fca130',
    lightColor: '#fbf1e6',
  },
  DELETE: {
    method: 'DELETE',
    darkColor: '#f93e3e',
    lightColor: '#fae7e7',
  },
  DISABLED: {
    method: 'DISABLED',
    darkColor: '#cccccc',
    lightColor: '#f0f0f0',
  },
}
