import useApi from '../useApi'
import { useDispatch } from 'react-redux'
import { logOut as logOutRequest } from '../../store/slices/auth'
import useUserReq from '../apis/User/useUserReq'
import useTenantReq from '../apis/Tenant/useTenantReq'
import useProductReq from '../apis/Product/useProductReq'
import usePlanReq from './Product/plan/usePlanReq'
import useFeatureReq from './Product/feature/useFeatureReq'
import usePlanPriceReq from './Product/planPrice/usePlanPriceReq'
import usePlanFeatureReq from './Product/planFeature/usePlanFeatureReq'
import useSettingsReq from './Setting/useSettingReq'
import useSpecificationReq from './Product/specification/useSpecificationReq'
import useSubManagementReq from './Tenant/useSubManagementReq'
import useClientCredentialsReq from './Product/ClientCredentials/useClientCredentialsReq'
import usePaymentReq from './Payment/usePaymentReq'
import useUsersManagementReq from './UsersManagement/useUsersManagementReq'
import useAdminPrivileges from './UsersManagement/useAdminPrivileges'
import useAccountReq from './Account/Account'
import useWebhookEndpointReq from './Product/webhookEndpoint/useWebhookEndpointReq'
import usePOReq from './ProductOwner/usePOReq'
import useDiscountReq from './Setting/discount/useDiscountReq'
import useCurrencyReq from './Setting/currency/useCurrencyReq'
import useContactReq from './Contact/useContactReq'
import useStatisticsReq from './Statistics/useStatisticsReq'

const useRequest = () => {
  // User Management
  const userReq = useUserReq()
  const accountReq = useAccountReq()
  const usersManagementReq = useUsersManagementReq()
  const adminPrivileges = useAdminPrivileges()

  // Tenant and Product Management
  const tenantReq = useTenantReq()
  const productReq = useProductReq()
  const poReq = usePOReq()

  // Plan, Feature, and Specification Management
  const planReq = usePlanReq()
  const featureReq = useFeatureReq()
  const planPriceReq = usePlanPriceReq()
  const planFeatureReq = usePlanFeatureReq()
  const specificationReq = useSpecificationReq()

  // Subscription and Payment Management
  const subManagementReq = useSubManagementReq()
  const clientCredentialsReq = useClientCredentialsReq()
  const paymentReq = usePaymentReq()

  // Settings, Discounts, and Currencies
  const settingsReq = useSettingsReq()
  const discountReq = useDiscountReq()
  const currencyReq = useCurrencyReq()

  // Statistics, Logs, and Webhooks
  const statisticsReq = useStatisticsReq()
  const webhookEndpointReq = useWebhookEndpointReq()

  // Miscellaneous
  const contactReq = useContactReq()

  // Combine and Return All
  return {
    ...userReq,
    ...accountReq,
    ...usersManagementReq,
    ...adminPrivileges,
    ...tenantReq,
    ...productReq,
    ...poReq,
    ...planReq,
    ...featureReq,
    ...planPriceReq,
    ...planFeatureReq,
    ...specificationReq,
    ...subManagementReq,
    ...clientCredentialsReq,
    ...paymentReq,
    ...settingsReq,
    ...discountReq,
    ...currencyReq,
    ...statisticsReq,
    ...webhookEndpointReq,
    ...contactReq,
  }
}
export default useRequest
