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

const useRequest = () => {
  const { signIn, userData, logOut } = useUserReq()
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
  } = useTenantReq()
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
  } = useSubManagementReq()

  const {
    createProductRequest,
    editProductRequest,
    getProduct,
    getProductList,
    deleteProductReq,
  } = useProductReq()

  const {
    getProductPlans,
    createPlanRequest,
    publishPlan,
    editPlanRequest,
    deletePlanReq,
  } = usePlanReq()
  const {
    getProductSpecification,
    createSpecificationRequest,
    publishSpecification,
    editSpecificationRequest,
    deleteSpecificationReq,
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
  } = usePlanPriceReq()

  const {
    getFeaturePlanList,
    createFeaturePlanRequest,
    editFeaturePlanRequest,
    getFeaturePlan,
    deleteFeaturePlanReq,
  } = usePlanFeatureReq()

  const {
    getHeathCheckSettings,
    putHeathCheckSettings,
    getSubscriptionsSettings,
    putSubscriptionsSettings,
    getProductWarningsSettings,
    putProductWarningsSettings,
  } = useSettingsReq()

  return {
    signIn,
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
  }
}
export default useRequest
