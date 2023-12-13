export const breadcrumbFun = (routeParams, data) => {
  const { id } = routeParams
  return {
    HealthCheck: {
      title: 'Settings',
      name: 'Health-Check-Settings',
      navigation: '/settings/health-check',
      active: 'Settings',
      icon: {},
    },
    SubscriptionSettings: {
      title: 'Settings',
      name: 'Subscriptions',
      navigation: '/settings/Subscriptions',
      active: 'Settings',
      icon: {},
    },
    ProductWarningsSettings: {
      title: 'Settings',
      name: 'Product-Warnings',
      navigation: '/settings/Product-Warnings',
      active: 'Settings',
      icon: {},
    },
    Dashboard: {
      title: 'Dashboard',
      navigation: '/',
    },
    ProductList: {
      title: 'Product-Management',
      name: 'Products',
      navigation: '/products',
      active: 'Products',
      icon: {},
    },
    ProductListPublic: {
      name: 'Products List',
      navigation: '/products',
      active: 'Products List',
      icon: {},
    },
    ProductPricing: {
      name: 'Subscription Options',
      parent: 'Products List',
      parentNavigation: `./`,
      active: 'Subscription Options',
      icon: {},
    },
    TenantManagement: {
      title: 'Tenants',
      name: 'Subscription-Management',
      active: 'Subscription-Management',
      navigation: `/tenants/${id}/Subscription-Management`,
      parent: data?.name,
      parentNavigation: `/tenants/${id}`,
      icon: {},
    },
    PlanList: {
      title: 'Plan-Management',
      name: 'Plans',
      navigation: '/plans',
      active: 'Plans',

      icon: {},
    },
    ProductDetails: {
      title: 'Product-Management',
      name: 'Product-Details',
      active: 'Product Details',
      navigation: '/products',
      parent: 'Products',
      parentNavigation: '/products',
      icon: {},
    },
    // FeatureDetails: {
    //   title: 'Product-Management',
    //   name: 'Feature-Details',
    //   active: 'Product Details',
    //   navigation: '/products',
    //   parent: 'Products',
    //   parentNavigation: '/products',
    //   icon: {},
    // },
    PlanDetails: {
      title: 'Plan-Management',
      name: 'Plan-Details',
      active: 'Plan Details',
      navigation: '/plans',
      parent: 'Plans',
      parentNavigation: '/plans',
      icon: {},
    },
    TenantList: {
      title: 'Tenant-Management',
      name: 'Tenants',
      navigation: '/tenants',
      active: 'Tenants',
      icon: {},
    },
    TenantDetails: {
      title: 'Tenants',
      name: 'Tenant-Management',
      active: 'Tenant Management',
      navigation: `/tenants/${id}`,
      parent: data?.name,
      // parentNavigation: '/tenant',
      icon: {},
    },
  }
}
