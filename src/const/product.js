import {
  BsFillCheckCircleFill,
  BsFillExclamationCircleFill,
} from 'react-icons/bs'
import {
  MdOutlineUnpublished,
  MdOutlinePublishedWithChanges,
  MdPayments,
  MdOutlinePayments,
} from 'react-icons/md'
import { FormattedMessage } from 'react-intl'

export const Product_id = '88e67328-3b20-413e-b6e1-010b48fa7bc9'
export const Product_Client_id = '88283b02-e969-485a-a5a3-9e5d1d0d3337'
export const Client_id = 'spa_rosas_admin_panel'

export const HealthStatus = {
  true: {
    background: '#eff9f6',
    value: <FormattedMessage id="Healthy" />,
    color: '#00a675',
    icon: <BsFillCheckCircleFill />,
  },
  false: {
    background: '#f5e8e4',
    value: <FormattedMessage id="Unavailable" />,
    color: '#d26b4e',
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
    background: '#eff9f6',
    value: <FormattedMessage id="Published" />,
    color: '#00a675',
    icon: <MdOutlinePublishedWithChanges />,
  },
  false: {
    background: '#f5e8e4',
    value: <FormattedMessage id="Unpublished" />,
    color: '#d26b4e',
    icon: <MdOutlineUnpublished />,
  },
}
export const subscriptionStatus = {
  true: {
    background: '#eff9f6',
    value: <FormattedMessage id="Active" />,
    color: '#00a675',
  },
  false: {
    background: '#f5e8e4',
    value: <FormattedMessage id="Inactive" />,
    color: '#d26b4e',
  },
}
export const expirationStatus = {
  true: {
    background: '#eff9f6',
    value: <FormattedMessage id="Valid" />,
    color: '#00a675',
  },
  false: {
    background: '#f5e8e4',
    value: <FormattedMessage id="Expired" />,
    color: '#d26b4e',
  },
}
export const isMajorStatus = {
  true: {
    background: '#eff9f6',
    value: <FormattedMessage id="true" />,
    color: '#00a675',
  },
  false: {
    background: '#f5e8e4',
    value: <FormattedMessage id="false" />,
    color: '#d26b4e',
  },
}

export const cycle = {
  2: 'Week',
  3: 'Month',
  4: 'Year',
  5: 'One-Day',
  6: 'Three-Day',
}

export const urlIsOverridden = {
  true: { background: '#eee5ff', value: 'Yes' },
  false: { background: '#e1f0ff', value: 'No' },
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
export const activeTab = {
  details: 0,
  clientCredintials: 1,
  customSpecification: 2,
  plans: 3,
  features: 4,
  plansFeatures: 5,
  plansPrice: 6,
  subscriptions: 7,
}
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
}

export const countriesArray = [
  { code: 'AF', name: 'Afghanistan' },
  { code: 'AL', name: 'Albania' },
  { code: 'DZ', name: 'Algeria' },
  { code: 'AR', name: 'Argentina' },
  { code: 'AU', name: 'Australia' },
  { code: 'AT', name: 'Austria' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'BR', name: 'Brazil' },
  { code: 'CA', name: 'Canada' },
  { code: 'CN', name: 'China' },
  { code: 'CO', name: 'Colombia' },
  { code: 'EG', name: 'Egypt' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'IN', name: 'India' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'IT', name: 'Italy' },
  { code: 'JP', name: 'Japan' },
  { code: 'MX', name: 'Mexico' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'RU', name: 'Russia' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'ES', name: 'Spain' },
  { code: 'SE', name: 'Sweden' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'TR', name: 'Turkey' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
  { code: 'UY', name: 'Uruguay' },
  { code: 'VE', name: 'Venezuela' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'ZA', name: 'Zambia' },
  { code: 'ZW', name: 'Zimbabwe' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'EG', name: 'Egypt' },
  { code: 'IQ', name: 'Iraq' },
  { code: 'JO', name: 'Jordan' },
  { code: 'LB', name: 'Lebanon' },
  { code: 'MA', name: 'Morocco' },
  { code: 'OM', name: 'Oman' },
  { code: 'PS', name: 'Palestine' },
  { code: 'QA', name: 'Qatar' },
  { code: 'SY', name: 'Syria' },
  { code: 'TN', name: 'Tunisia' },
  { code: 'YE', name: 'Yemen' },
]
