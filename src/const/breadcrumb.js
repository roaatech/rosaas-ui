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
    DiscountsList: {
      title: 'Settings',
      name: 'Discounts-List',
      navigation: '/settings/DiscountsList',
      active: 'Settings',
      icon: {},
    },
    DiscountDetails: {
      title: 'Discounts',
      name: 'Discounts-Management',
      active: 'Discounts Management',
      parentNavigation: Routes.DiscountsPage.path,
      parent: data?.name,
      changableParent: true,
      icon: {},
    },
    Profile: {
      title: 'Settings',
      name: 'Profile',
      navigation: Routes.Profile.path,
      active: 'Settings',
      icon: {},
    },
    CardManagement: {
      title: 'Settings',
      name: 'Card-Management',
      navigation: '/settings/Card-Management',
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
      title: 'Products',
      name: 'Product-Management',
      navigation: Routes.products.path,
      active: 'Products',
      icon: {},
    },
    ProductsOwnersList: {
      title: 'Products-Owners',
      name: 'Products-Owners-Management',
      navigation: Routes.productsOwners.path,
      active: 'Products',
      icon: {},
    },
    ProductsOwnersDetails: {
      title: 'Product-Owner-Details',
      name: 'Products-Owners-Management',
      navigation: Routes.productsOwners.path,
      active: 'Products',
      icon: {},
    },

    ProductListPublic: {
      name: 'Products-List',
      navigation: Routes.products.path,
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
      navigation: `${Routes.Tenant.path}/${id}/Subscription-Management`,
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
      navigation: `/products/${id}`,
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
      changableParent: true,
      icon: {},
    },
  }
}
