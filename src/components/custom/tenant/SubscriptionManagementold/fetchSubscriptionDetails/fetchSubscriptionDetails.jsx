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
    console.log({ response })
    const formattedData = {
      // data: response?.data.data?.subscriptionFeatures?.map((feature) => ({
      //   featureName: feature.feature.title,
      //   featureReset: intl.formatMessage({
      //     id: featureResetMap[feature.feature.reset],
      //   }),
      //   featureStartDate: feature.startDate,
      //   featureEndDate: feature.endDate,
      //   remindLimit: `${feature.remainingUsage}${
      //     featureUnitMap[feature.feature.unit] != 'unit'
      //       ? featureUnitMap[feature.feature.unit]
      //       : ' '
      //   } / ${feature.feature.limit}${
      //     featureUnitMap[feature.feature.unit] != 'unit'
      //       ? featureUnitMap[feature.feature.unit]
      //       : ' '
      //   } `,
      //   subscriptionFeaturesCycles: feature.subscriptionFeaturesCycles.map(
      //     (cycle) => ({
      //       subscriptionCycleId: cycle.subscriptionCycleId,
      //       featureName: cycle.feature.title ? cycle.feature.title : ' ',
      //       startDate: cycle.startDate,
      //       endDate: cycle.endDate,
      //       type: cycle.type,
      //       reset: cycle.reset,
      //       usage: cycle.limit - cycle.remainingUsage,
      //       limit: cycle.limit,
      //       remindLimit: `${cycle.remainingUsage}${
      //         featureUnitMap[cycle.unit] != 'unit'
      //           ? featureUnitMap[cycle.unit]
      //           : ' '
      //       } / ${cycle.limit}${
      //         featureUnitMap[cycle.unit] != 'unit'
      //           ? featureUnitMap[cycle.unit]
      //           : ' '
      //       } `,
      //     })
      //   ),

      //   usage: feature.feature.limit - feature.remainingUsage,
      // })),
      subscriptionCycles: response.data.data.subscriptionCycles.map(
        (cycle) => ({
          startDate: cycle.startDate,
          endDate: cycle.endDate,
          subscriptionCycleId: cycle.id,
          // plan: cycle.plan.title,
          // price: cycle.price,
          // cycle: cycle.cycle,
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
      //subscription reset
      subscriptionReset: {
        subscriptionResetStatus: response.data.data.subscriptionResetStatus,
        lastResetDate: response.data.data.lastResetDate,
        isResettableAllowed: response.data.data.isResettableAllowed,
      },
    }
    setFormattedSubscriptionData(formattedData)

    return formattedSubscriptionData
  } catch (error) {
    console.error('Error fetching subscription details:', error)
  }
}
export const fetchSubscriptionFeatures = async (data) => {
  const { subscriptionId, intl, subscriptionFeturesList } = data
  try {
    const response = await subscriptionFeturesList(subscriptionId)
    console.log({ responsesssssssssss: response })
    const FeaturesData = {
      data: response?.data.data?.map((feature) => ({
        featureName: feature.feature.title,
        featureReset: featureResetMap[feature.feature.reset],
        // intl.formatMessage({
        //   id: featureResetMap[feature.feature.reset],
        // })
        featureStartDate: feature.startDate,
        featureEndDate: feature.endDate,
        remindLimit: `${feature.remainingUsage}${
          featureUnitMap[feature.feature.unit] != 'unit'
            ? featureUnitMap[feature.feature.unit]
            : ' '
        } / ${feature.feature.limit}${
          featureUnitMap[feature.feature.unit] != 'unit'
            ? featureUnitMap[feature.feature.unit]
            : ' '
        } `,
        // subscriptionFeaturesCycles: feature.subscriptionFeaturesCycles.map(
        //   (cycle) => ({
        //     subscriptionCycleId: cycle.subscriptionCycleId,
        //     featureName: cycle.feature.title ? cycle.feature.title : ' ',
        //     startDate: cycle.startDate,
        //     endDate: cycle.endDate,
        //     type: cycle.type,
        //     reset: cycle.reset,
        //     usage: cycle.limit - cycle.remainingUsage,
        //     limit: cycle.limit,
        //     remindLimit: `${cycle.remainingUsage}${
        //       featureUnitMap[cycle.unit] != 'unit'
        //         ? featureUnitMap[cycle.unit]
        //         : ' '
        //     } / ${cycle.limit}${
        //       featureUnitMap[cycle.unit] != 'unit'
        //         ? featureUnitMap[cycle.unit]
        //         : ' '
        //     } `,
        //   })
        // ),

        //   usage: feature.feature.limit - feature.remainingUsage,
      })),
    }
    console.log({ FeaturesData })
  } catch (error) {
    console.error('Error fetching subscription details:', error)
  }
}
