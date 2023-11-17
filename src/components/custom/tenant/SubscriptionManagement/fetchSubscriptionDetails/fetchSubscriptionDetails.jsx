import { featureResetMap, featureUnitMap } from '../../../../../const'
import { subscriptionStatus } from '../../../../../const/subscriptionManagement'

export const fetchSubscriptionDetails = async (data) => {
  const {
    currentProduct,
    intl,
    tenantId,
    setFormattedSubscriptionData,
    formattedSubscriptionData,
    subscriptionDetails,
  } = data

  try {
    const response = await subscriptionDetails(currentProduct, tenantId)
    const formattedData = {
      subscriptionCycles: response.data.data.subscriptionCycles.map(
        (cycle) => ({
          startDate: cycle.startDate,
          endDate: cycle.endDate,
          subscriptionCycleId: cycle.id,
        })
      ),
      //plan Info
      planName: response.data.data.plan.title,
      planId: response.data.data.plan.id,
      planPrice: response.data.data.planPrice.price,
      planCycle: response.data.data.planPrice.cycle,

      startDate: response.data.data.startDate,
      endDate: response.data.data.endDate,

      currentSubscriptionCycleId: response.data.data.currentSubscriptionCycleId,
      subscriptionId: response.data.data.subscriptionId,
      lastLimitsResetDate: response.data.data.lastLimitsResetDate,
      autoRenewal: response.data.data.autoRenewal,
      hasSubscriptionFeaturesLimitsResettable:
        response.data.data.hasSubscriptionFeaturesLimitsResettable,
      //subscription up-downgrade
      subscriptionPlanChange: response.data.data.subscriptionPlanChange,
      subscriptionPlanChangeStatus:
        response.data.data.subscriptionPlanChangeStatus,
      subscriptionStatus: response.data.data.isActive,
      //subscription reset
      subscriptionReset: {
        subscriptionResetStatus: response.data.data.subscriptionResetStatus,
        lastResetDate: response.data.data.lastResetDate,
        isResettableAllowed: response.data.data.isResettableAllowed,
      },
    }
    setFormattedSubscriptionData(formattedData)
    console.log({ formattedData })
    return formattedSubscriptionData
  } catch (error) {
    console.error('Error fetching subscription details:', error)
  }
}
