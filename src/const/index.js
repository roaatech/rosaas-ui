import { FormattedMessage } from 'react-intl'

const Product_id = '88e67328-3b20-413e-b6e1-010b48fa7bc9'
const Product_Client_id = '88283b02-e969-485a-a5a3-9e5d1d0d3337'
const Client_id = 'spa_rosas_admin_panel'
const Owner = {
  1: 'Super Admin',
  101: 'External System',
}

const urlIsOverridden = {
  true: { background: '#eee5ff', value: 'Yes' },
  false: { background: '#e1f0ff', value: 'No' },
}
const statusConst = {
  1: {
    string: 'Rosas-resource-created',
    opacity: '35',
    color: '#155dd7',
    icon: 'pi-user-plus',
  },
  2: {
    string: 'Create-request-is-sent',
    opacity: '10',
    color: '#155dd7',
    icon: 'pi-user-plus',
  },
  3: {
    string: 'Creating',
    opacity: '15',
    color: '#155dd7',
    icon: 'pi-user-plus',
  },
  4: {
    string: 'Created-As-Active',
    opacity: '35',
    color: '#00a675',
    icon: 'pi-check-circle',
  },
  5: {
    string: 'Active-request-is-sent',
    opacity: '10',
    color: '#00a675',
    icon: 'pi-check-circle',
  },
  6: {
    string: 'Activating',
    opacity: '15',
    color: '#00a675',
    icon: 'pi-check-circle',
  },
  7: {
    string: 'Active',
    opacity: '35',
    color: '#00a675',
    icon: 'pi-check-circle',
  },
  8: {
    string: 'Deactivate-request-is-sent',
    opacity: '10',
    color: '#eda100',
    icon: 'pi-exclamation-triangle',
  },
  9: {
    string: 'Deactivating',
    opacity: '15',
    color: '#eda100',
    icon: 'pi-exclamation-triangle',
  },
  10: {
    string: 'Inactive',
    opacity: '35',
    color: '#eda100',
    icon: 'pi-exclamation-triangle',
  },
  11: {
    string: 'Delete-request-is-sent',
    opacity: '10',
    color: '#FF6868',
    icon: 'pi-trash',
  },
  12: {
    string: 'Deleting',
    opacity: '15',
    color: '#FF6868',
    icon: 'pi-trash',
  },
  13: {
    string: 'Deleted',
    opacity: '35',
    color: '#FF6868',
    icon: 'pi-trash',
  },
}

const urlStyle = {
  GET: {
    method: 'GET',
    darkColor: '#61affe',
    lightColor: '#ebf3fb',
  },
  POST: {
    method: 'POST',
    darkColor: '#49cc90',
    lightColor: '#e8f6f0',
  },
  PUT: {
    method: 'PUT',
    darkColor: '#fca130',
    lightColor: '#fbf1e6',
  },
  DELETE: {
    method: 'DELETE',
    darkColor: '#f93e3e',
    lightColor: '#fae7e7',
  },
}

const breadcrumbConst = {
  HealthCheck: {
    title: 'Settings',
    name: 'Health-Check-Settings',
    navigation: '/settings/health-check',
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
  FeatureList: {
    title: 'Feature-Management',
    name: 'Features',
    navigation: '/features',
    active: 'features',
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
  TenantList: {
    title: 'Tenant-Management',
    name: 'Tenants',
    navigation: '/tenants',
    active: 'Tenants',
    icon: {},
  },
  TenantDetails: {
    title: 'Tenant-Management',
    name: 'Tenant-Details',
    active: 'Tenant-Details',
    navigation: '/tenant',
    parent: 'Tenants',
    parentNavigation: '/tenant',
    icon: {},
  },
}
export {
  Product_id,
  Client_id,
  statusConst,
  Owner,
  urlStyle,
  Product_Client_id,
  breadcrumbConst,
  urlIsOverridden,
}
