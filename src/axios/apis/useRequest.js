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
  const {
    SignInTenantAdminAsync,
    SignInProductOwnerAsync,
    userData,
    logOut,
    getAuditsList,
    getAditsActionListLookup,
    getLogsList,
    getLogById,
    deleteLogBeforeDate,
    getAuditById,
    signUp,
    signUpPOwner,
    SignInAdminAsync,
    confirmEmail,
    requestPasswordReset,
    resetPassword,
    getEnvironment,
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
    linkEntitiesbyDiscountId,
    discountEntityLinks,
    deleteDiscountLinkedEntityId,
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
    getCurrenciesPublishList,
    createCurrency,
    editCurrency,
    deleteCurrency,
    getCurrencyById,
    publishCurrency,
    markAsPrimaryCurrency,
    markAsPrimaryExchangeRateCurrency,
    markAsPrimaryCurrencyForProductOwner,
    markAsPrimaryExchangeRateCurrencyForProductOwner,
    getCurrenciesProductOwnerList,
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
    cancelSubscriptionRequest,
    suspendSubscriptionRequest,
    activateSubscriptionRequest,
    subscriptionFilteredList,
    subscriptionCanceledFilteredList,
  } = useSubManagementReq()

  const {
    getStatisticsDetailsList,
    getStatisticsDetailsListByProductId,
    getStatisticsCountsList,
    getStatisticsCountsListByProductId,
  } = useStatisticsReq()

  const {
    createTenantAdmin,
    createProductAdmin,
    createClientAdmin,
    clientsLookup,
    getUserById,
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
    visibleProduct,
    getProductsLookup,
    updateCompositeTemplateRequest,
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
    visiblePlan,
    getPlanFilteredList,
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
    checkOrderCurrencyChange,
    getPaymentStripeDataBySubId,
  } = usePaymentReq()
  const {
    createPORequest,
    editPORequest,
    getProductOwnersList,
    getProductOwner,
    deleteProductOwnerReq,
    isProductOwnerRegistered,
    GetCurrentProductOwnerByUserId,
    ProductOwnerLimits,
    getProductOwnerLookupList,
  } = usePOReq()
  const {
    getPaginationContactMessagesList,
    getContactMessageById,
    deleteContactMessageById,
    replayContactMessageById,
  } = useContactReq()

  return {
    // Authentication and User Management
    SignInTenantAdminAsync,
    SignInProductOwnerAsync,
    SignInAdminAsync,
    signUp,
    signUpPOwner,
    isProductOwnerRegistered,
    GetCurrentProductOwnerByUserId,
    confirmEmail,
    validateEmail,
    requestPasswordReset,
    resetPassword,
    updateProfile,
    getCurrentProfile,
    changePassword,
    logOut,
    createTenantAdmin,
    createProductAdmin,
    userData,

    // Tenant Management
    createTenantRequest,
    editTenantRequest,
    getTenant,
    getTenantList,
    getProductTenants,
    editTenantStatus,
    deleteTenantReq,
    createTenantRequestPublic,
    editTenantSpecificationRequest,

    // Product Management
    createProductRequest,
    editProductRequest,
    getProduct,
    getProductList,
    getProductListPublic,
    publishProduct,
    deleteProductReq,
    getProductsLookup,
    getEnvironment,
    visibleProduct,
    changeProductTrialType,

    // Plan Management
    createPlanRequest,
    editPlanRequest,
    deletePlanReq,
    getProductPlans,
    getPlanFilteredList,
    getProductPlansPublic,
    getProductPlanPriceList,
    getProductPlanPriceListPublic,
    getProductPlanPricePublic,
    getProductPlanPricePublicbyId,
    PlansPricePublishedReq,
    createPlanPriceRequest,
    editPlanPriceRequest,
    deletePlanPriceReq,
    publishPlan,
    visiblePlan,

    // Feature Management
    getProductFeatures,
    createFeatureRequest,
    editFeatureRequest,
    deleteFeatureReq,
    getFeaturePlanList,
    createFeaturePlanRequest,
    editFeaturePlanRequest,
    getFeaturePlan,
    deleteFeaturePlanReq,
    getFeaturePlanPublic,
    getFeaturePlanListPublic,

    // Specification Management
    getProductSpecification,
    createSpecificationRequest,
    editSpecificationRequest,
    deleteSpecificationReq,
    publicSpecificationByProductName,
    publishSpecification,

    // Subscription Management
    subscriptionDetails,
    subscriptionDetailsRenew,
    subscriptionDetailsResetSub,
    subscriptionDetailsLimitReset,
    setAutoRenewal,
    cancelAutoRenewal,
    activateSubscriptionRequest,
    cancelSubscriptionRequest,
    suspendSubscriptionRequest,
    subscriptionFilteredList,
    subscriptionCanceledFilteredList,
    upgradeSubscription,
    downgradeSubscription,
    subscriptionCycleById,
    subscriptionFeturesList,
    getSubscriptionsList,
    getAutoRenewalList,

    // Payment and Orders
    paymentCheckout,
    paymentSuccess,
    paymentFailed,
    getOrderById,
    getOrderByIdPublic,
    getOrdersListByTenantId,
    changeOrderPlan,
    getPaymentCardsList,
    detachPaymentMethodCard,
    attachPaymentMethodCard,
    markCardAsDefault,
    fetchPaymentIntent,
    getPaymentStripeDataBySubId,
    getInvoicesList,

    // Discount Management
    getDiscounts,
    createDiscount,
    activeDiscount,
    editDiscountRequest,
    deleteDiscount,
    getDiscountById,
    deleteDiscountUsageHistoriesById,
    getDiscountUsageHistoriesByDiscountId,
    linkEntitiesbyDiscountId,
    discountEntityLinks,
    deleteDiscountLinkedEntityId,

    // Currency Management
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
    getCurrenciesPublishList,
    getCurrenciesProductOwnerList,
    checkOrderCurrencyChange,

    // Admin Privileges
    tenantAdminPrivileges,
    productAdminPrivileges,
    clientAdminPrivileges,
    EntityAdminPrivileges,
    deleteAdminPrivileges,

    // Client Management
    getClientsListByProduct,
    createClient,
    updateClient,
    deleteClient,
    activateClient,
    createClientAdmin,
    createClientSecret,
    getClientSecrets,
    DeleteClientSecret,
    regenerateClientSecret,
    editClientSecret,
    getClientId,

    // Product Owner Management
    createPORequest,
    editPORequest,
    getProductOwnersList,
    getProductOwner,
    deleteProductOwnerReq,

    // Timeline and Statistics
    getTimeLine,
    getStatisticsDetailsList,
    getStatisticsDetailsListByProductId,
    getStatisticsCountsList,
    getStatisticsCountsListByProductId,

    // Warnings and Settings
    getProductWarningsSettings,
    putProductWarningsSettings,
    getProductWarnings,
    getHeathCheckSettings,
    putHeathCheckSettings,
    getSubscriptionsSettings,
    putSubscriptionsSettings,
    getConfig,

    // Webhook Management
    getWebhookEndpointsList,
    getWebhookEndpointbyId,
    createWebhookEndpoint,
    activateWebhookEndpoint,
    editWebhookEndpoint,
    deleteWebhookEndpoint,

    // Audits and Logs
    getAuditsList,
    getAuditById,
    getLogsList,
    getLogById,
    deleteLogBeforeDate,
    getAditsActionListLookup,

    // Contact Messages
    getPaginationContactMessagesList,
    getContactMessageById,
    deleteContactMessageById,
    replayContactMessageById,

    // Miscellaneous
    updateCompositeTemplateRequest,
    ProductOwnerLimits,
    getUserById,
    getProductOwnerLookupList,
    clientsLookup,
  }
}
export default useRequest
