// pages
import Tenant from './pages/Tenant/Tenant'
import TenantDetails from './pages/TenantDetails/TenantDetails'
import ProductDetails from './pages/ProductDetails/ProductDetails'
import Redirect from './components/custom/global/Redirect/Redirect'
import Dashboard from './pages/Welcome/Welcome'
import Product from './pages/Product/Product'
import signIn from './pages/signIn/signIn'
import Settings from './pages/Settings/Settings'
export const Routes = {
  Dashboard: {
    path: '/Dashboard',
    component: Dashboard,
    roles: ['superAdmin'],
  },
  products: {
    path: '/products',
    component: Product,
    roles: ['superAdmin'],
  },

  Tenant: {
    path: '/tenants',
    component: Tenant,
    roles: ['superAdmin'],
  },
  TenantDetails: {
    path: '/tenants/:id',
    component: TenantDetails,
    roles: ['superAdmin'],
  },
  ProductDetails: {
    path: '/products/:id',
    component: ProductDetails,
    roles: ['superAdmin'],
  },
  Settings: {
    path: '/settings/health-check',
    component: Settings,
    roles: ['superAdmin'],
  },
  Signin: {
    path: '/',
    component: signIn,
    roles: ['notAuth'],
    type: 'noSidebar',
  },

  redirect: {
    path: '*',
    component: Redirect,
    roles: '*',
  },
}
