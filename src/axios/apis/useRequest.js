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
import usePaymentReq from './Payment/Payment'
import useUsersManagementReq from './UsersManagement/useUsersManagementReq'
import useAdminPrivileges from './UsersManagement/useAdminPrivileges'
import useAccountReq from './Account/Account'
import useWebhookEndpointReq from './Product/webhookEndpoint/useWebhookEndpointReq'
import usePOReq from './ProductOwner/usePOReq'
import useDiscountReq from './Setting/discount/useDiscountReq'
import useCurrencyReq from './Setting/currency/useCurrencyReq'

const useRequest = () => {
  const {
    SignInTenantAdminAsync,
    SignInProductOwnerAsync,
    userData,
    logOut,
    signUp,
    signUpPOwner,
    SignInAdminAsync,
    confirmEmail,
    requestPasswordReset,
    resetPassword,
  } = useUserReq()
  const {
    getDiscounts,
    createDiscount,
    activeDiscount,
    editDiscountRequest,
    deleteDiscount,
    getDiscountById,
    deleteDiscountUsageHistoriesById,
    getDiscountUsageHistoriesByDiscountId,
  } = useDiscountReq()
  const {
    createTenantRequest,
    editTenantRequest,
    editTenantSpecificationRequest,
    getTenant,
    getTenantList,
    deleteTenantReq,
    getProductTenants,
    editTenantStatus,
    getTimeLine,
    createTenantRequestPublic,
  } = useTenantReq()
  const { updateProfile, getCurrentProfile, changePassword } = useAccountReq()
  const {
    getCurrencies,
    createCurrency,
    editCurrency,
    deleteCurrency,
    getCurrencyById,
    publishCurrency,
    markAsPrimaryCurrency,
    markAsPrimaryExchangeRateCurrency,
    markAsPrimaryCurrencyForProductOwner,
    markAsPrimaryExchangeRateCurrencyForProductOwner,
  } = useCurrencyReq()
  const {
    getWebhookEndpointsList,
    getWebhookEndpointbyId,
    createWebhookEndpoint,
    activateWebhookEndpoint,
    editWebhookEndpoint,
    deleteWebhookEndpoint,
  } = useWebhookEndpointReq()
  const {
    subscriptionDetails,
    subscriptionDetailsRenew,
    subscriptionDetailsResetSub,
    subscriptionDetailsLimitReset,
    setAutoRenewal,
    cancelAutoRenewal,
    upgradeSubscription,
    downgradeSubscription,
    subscriptionFeturesList,
    subscriptionCycleById,
    getSubscriptionsList,
    getAutoRenewalList,
  } = useSubManagementReq()

  const {
    createTenantAdmin,
    createProductAdmin,
    createClientAdmin,
    validateEmail,
  } = useUsersManagementReq()
  const {
    tenantAdminPrivileges,
    productAdminPrivileges,
    clientAdminPrivileges,
    EntityAdminPrivileges,
    deleteAdminPrivileges,
  } = useAdminPrivileges()
  const {
    createProductRequest,
    editProductRequest,
    getProduct,
    getProductList,
    deleteProductReq,
    getProductWarnings,
    getProductListPublic,
    changeProductTrialType,
    publishProduct,
  } = useProductReq()

  const {
    getClientsListByProduct,
    createClient,
    updateClient,
    deleteClient,
    activateClient,
    createClientSecret,
    getClientSecrets,
    DeleteClientSecret,
    regenerateClientSecret,
    editClientSecret,
    getClientId,
  } = useClientCredentialsReq()

  const {
    getProductPlans,
    createPlanRequest,
    publishPlan,
    editPlanRequest,
    deletePlanReq,
    getProductPlansPublic,
  } = usePlanReq()
  const {
    getProductSpecification,
    createSpecificationRequest,
    publishSpecification,
    editSpecificationRequest,
    deleteSpecificationReq,
    publicSpecificationByProductName,
  } = useSpecificationReq()
  const {
    getProductFeatures,
    createFeatureRequest,
    editFeatureRequest,
    deleteFeatureReq,
  } = useFeatureReq()

  const {
    getProductPlanPriceList,
    createPlanPriceRequest,
    editPlanPriceRequest,
    deletePlanPriceReq,
    PlansPricePublishedReq,
    getProductPlanPriceListPublic,
    getProductPlanPricePublic,
    getProductPlanPricePublicbyId,
  } = usePlanPriceReq()

  const {
    getFeaturePlanList,
    getFeaturePlanListPublic,
    createFeaturePlanRequest,
    editFeaturePlanRequest,
    getFeaturePlan,
    deleteFeaturePlanReq,
    getFeaturePlanPublic,
  } = usePlanFeatureReq()

  const {
    getHeathCheckSettings,
    putHeathCheckSettings,
    getSubscriptionsSettings,
    putSubscriptionsSettings,
    getProductWarningsSettings,
    putProductWarningsSettings,
  } = useSettingsReq()

  const {
    getOrderById,
    getOrdersListByTenantId,
    paymentCheckout,
    paymentSuccess,
    paymentFailed,
    changeOrderPlan,
    getOrderByIdPublic,
    getPaymentCardsList,
    detachPaymentMethodCard,
    attachPaymentMethodCard,
    markCardAsDefault,
    getConfig,
    fetchPaymentIntent,
    getInvoicesList,
  } = usePaymentReq()
  const {
    createPORequest,
    editPORequest,
    getProductOwnersList,
    getProductOwner,
    deleteProductOwnerReq,
    isProductOwnerRegistered,
    GetCurrentProductOwnerByUserId,
  } = usePOReq()
  return {
    SignInTenantAdminAsync,
    SignInProductOwnerAsync,
    signUp,
    userData,
    logOut,
    createTenantRequest,
    editTenantRequest,
    getTenant,
    getTenantList,
    getProductTenants,
    editTenantStatus,
    deleteTenantReq,
    getTimeLine,
    createProductRequest,
    editProductRequest,
    getProduct,
    getProductList,
    deleteProductReq,
    getHeathCheckSettings,
    putHeathCheckSettings,
    createPlanRequest,
    editPlanRequest,
    getProductPlans,
    deletePlanReq,
    getFeaturePlanList,
    createFeaturePlanRequest,
    editFeaturePlanRequest,
    getFeaturePlan,
    deleteFeaturePlanReq,
    getProductFeatures,
    createFeatureRequest,
    editFeatureRequest,
    deleteFeatureReq,
    PlansPricePublishedReq,
    getProductPlanPriceList,
    createPlanPriceRequest,
    editPlanPriceRequest,
    deletePlanPriceReq,
    publishPlan,
    subscriptionDetails,
    getProductSpecification,
    createSpecificationRequest,
    publishSpecification,
    editSpecificationRequest,
    deleteSpecificationReq,
    editTenantSpecificationRequest,
    getSubscriptionsSettings,
    putSubscriptionsSettings,
    subscriptionDetailsRenew,
    subscriptionDetailsResetSub,
    subscriptionDetailsLimitReset,
    setAutoRenewal,
    cancelAutoRenewal,
    upgradeSubscription,
    downgradeSubscription,
    subscriptionFeturesList,
    subscriptionCycleById,
    getProductWarningsSettings,
    putProductWarningsSettings,
    getProductWarnings,
    createClientSecret,
    getClientSecrets,
    DeleteClientSecret,
    regenerateClientSecret,
    editClientSecret,
    getClientId,
    getProductListPublic,
    getFeaturePlanListPublic,
    getProductPlansPublic,
    getProductPlanPriceListPublic,
    getOrderById,
    getOrdersListByTenantId,
    paymentCheckout,
    paymentSuccess,
    paymentFailed,
    createTenantAdmin,
    createProductAdmin,
    createClientAdmin,
    validateEmail,
    tenantAdminPrivileges,
    productAdminPrivileges,
    clientAdminPrivileges,
    EntityAdminPrivileges,
    deleteAdminPrivileges,
    changeProductTrialType,
    publishProduct,
    getClientsListByProduct,
    createClient,
    updateClient,
    deleteClient,
    activateClient,
    changeOrderPlan,
    publicSpecificationByProductName,
    getProductPlanPricePublic,
    getProductPlanPricePublicbyId,
    createTenantRequestPublic,
    getFeaturePlanPublic,
    getOrderByIdPublic,
    getPaymentCardsList,
    detachPaymentMethodCard,
    attachPaymentMethodCard,
    markCardAsDefault,
    getConfig,
    fetchPaymentIntent,
    updateProfile,
    getCurrentProfile,
    changePassword,
    getSubscriptionsList,
    getInvoicesList,
    getAutoRenewalList,
    getWebhookEndpointsList,
    getWebhookEndpointbyId,
    createWebhookEndpoint,
    activateWebhookEndpoint,
    editWebhookEndpoint,
    deleteWebhookEndpoint,
    createPORequest,
    editPORequest,
    getProductOwnersList,
    getProductOwner,
    deleteProductOwnerReq,
    signUpPOwner,
    isProductOwnerRegistered,
    GetCurrentProductOwnerByUserId,
    SignInAdminAsync,
    confirmEmail,
    requestPasswordReset,
    resetPassword,
    getDiscounts,
    createDiscount,
    activeDiscount,
    editDiscountRequest,
    deleteDiscount,
    getDiscountById,
    deleteDiscountUsageHistoriesById,
    getDiscountUsageHistoriesByDiscountId,
    getCurrencies,
    createCurrency,
    editCurrency,
    deleteCurrency,
    getCurrencyById,
    publishCurrency,
    markAsPrimaryCurrency,
    markAsPrimaryExchangeRateCurrency,
    markAsPrimaryCurrencyForProductOwner,
    markAsPrimaryExchangeRateCurrencyForProductOwner,
  }
}
export default useRequest
