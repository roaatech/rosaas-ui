import { Routes } from '../routes'

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
    EnvironmentInfo: {
      title: 'Settings',
      name: 'Environment Info',
      navigation: '/settings/environment-info',
      active: 'Settings',
      icon: {},
    },
    DiscountsList: {
      title: 'Settings',
      name: 'Discounts-List',
      navigation: '/settings/DiscountsList',
      active: 'Settings',
      icon: {},
    },
    CurrenciesList: {
      title: 'Settings',
      name: 'Currencies-List',
      navigation: Routes && Routes?.CurrenciesPage?.path,
      active: 'Settings',
      icon: {},
    },
    DiscountDetails: {
      title: 'Discounts',
      name: 'Discounts-Management',
      active: 'Discounts Management',
      parentNavigation: Routes && Routes?.DiscountsPage?.path,
      parent: data?.name,
      changableParent: true,
      icon: {},
    },
    Profile: {
      title: 'Settings',
      name: 'Profile',
      navigation: Routes && Routes?.Profile?.path,
      active: 'Settings',
      icon: {},
    },
    CardManagement: {
      title: 'Settings',
      name: 'Card-Management',
      navigation: Routes && Routes?.CardSettings?.path,
      active: 'Card-Management',
      icon: {},
    },
    Home: {
      title: 'Home',

      active: 'Home',
      icon: {},
    },
    SubscriptionSettings: {
      title: 'Settings',
      name: 'Subscriptions',
      navigation: Routes && Routes?.SubscriptionsSettings?.path,
      active: 'Settings',
      icon: {},
    },
    ProductWarningsSettings: {
      title: 'Settings',
      name: 'Product-Warnings',
      navigation: Routes && Routes?.ProductWarningsSettings?.path,
      active: 'Settings',
      icon: {},
    },
    Dashboard: {
      title: 'Dashboard',
      navigation: Routes && Routes?.Dashboard?.path,
    },
    ProductList: {
      title: 'Products',
      name: 'Product-Management',
      navigation: Routes && Routes?.products?.path,
      active: 'Products',
      icon: {},
    },
    ProductsOwnersList: {
      title: 'Products-Owners',
      name: 'Products-Owners-Management',
      navigation: Routes && Routes?.productsOwners?.path,
      active: 'Products',
      icon: {},
    },
    ProductsOwnersDetails: {
      title: 'Product-Owner-Details',
      name: 'Products-Owners-Management',
      navigation: Routes && Routes?.productsOwners?.path,
      active: 'Products',
      icon: {},
    },

    ProductListPublic: {
      name: 'Products-List',
      navigation: Routes && Routes?.products?.path,
      active: 'Products-List',
      icon: {},
    },
    ProductPricing: {
      name: 'Subscription-Options',
      parent: 'Products-List',
      parentNavigation: `./`,
      active: 'Subscription-Options',
      icon: {},
    },
    TenantManagement: {
      title: 'Tenants',
      name: 'Subscription-Management',
      active: 'Subscription-Management',
      navigation:
        Routes && `${Routes?.Tenant?.path}/${id}/Subscription-Management`,
      parent: data?.name,
      changableParent: true,
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
      title: 'Products',
      name: 'Product-Management',
      active: 'Product-Management',
      navigation: `${Routes?.products?.path}/${id}`,
      parent: data?.name,
      changableParent: true,
      icon: {},
    },

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
      navigation: Routes && Routes?.Tenant?.path,
      active: 'Tenants',
      icon: {},
    },
    CanceledTenantList: {
      title: 'Tenant-Management',
      name: 'Canceled-Tenants',
      navigation: Routes && Routes?.CanceledTenantsPage?.path,
      active: 'Canceled-Tenants',
      icon: {},
    },
    TenantDetails: {
      title: 'Tenants',
      name: 'Tenant-Management',
      active: 'Tenant Management',
      navigation: Routes && `${Routes?.Tenant?.path}/${id}`,
      parent: data?.name,
      changableParent: true,
      icon: {},
    },
  }
}
