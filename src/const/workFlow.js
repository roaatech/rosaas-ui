export const Owner = {
  1: 'Super-Admin',
  2: 'Client-Admin',
  3: 'Product-Admin',
  4: 'Tenant-Admin',
  69: 'Anonymous',
  100: 'Rosas-System',
  101: 'External-System',
  102: 'External-System-Client',
}

export const processType = {
  1: 'Record-Created',
  2: 'Data-Updated',
  3: 'Metadata-Updated',
  4: 'Status-Changed',
  5: 'Healthy',
  6: 'Unhealthy',
  7: 'External-System-Successfully-Informed',
  8: 'Failed-To-Inform-External-System',
  9: 'Subscription-Was-Set-As-Unpaid-For-Non-Renewal',
  10: 'Specifications-Updated',
  /*11: 'Subscription-Reset',
  12: 'Subscription-Reset-Failure',
  13: 'Subscription-Feature-Limit-Reset',*/
  11: 'Subscription-Reset-Prepared',
  12: 'Subscription-Reset-Applied-Done',
  13: 'Subscription-Reset-Application-Failed',
  14: 'Subscription-Feature-Limit-Reset',
  15: 'Subscription-Auto-Renewal-Enabled',
  16: 'Subscription-Auto-Renewal-Canceled',
  17: 'Subscription-Renewed',
  18: 'Subscription-Upgraded-Requested', // تم ترقية خطة الاشتراك في نظام رصاص
  19: 'Subscription-Upgrade-Prepared', // تم التحضير لعملية ترقية الاشتراك
  20: 'Subscription-Upgrade-Being-Applied', //جارٍ تطبيق ترقية الاشتراك
  21: 'Subscription-Upgrade-Application-Failed', // فشل عملية تطبيق ترقية الاشتراك في النظام الخارجي
  22: 'Subscription-Upgrade-Applied-Done', //تم تطبيق ترقية الاشتراك
  23: 'Subscription-Downgraded-Requested', //Requested
  24: 'Subscription-Downgrade-Prepared',
  25: 'Subscription-Downgrade-Being-Applied',
  26: 'Subscription-Downgrade-Application-Failed',
  27: 'Subscription-Downgrade-Applied-Done',
}
