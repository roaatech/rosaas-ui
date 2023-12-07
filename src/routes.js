// pages
import Tenant from './pages/Tenant/Tenant'
import TenantDetails from './pages/TenantDetails/TenantDetails'
import ProductDetails from './pages/ProductDetails/ProductDetails'
import Redirect from './components/custom/global/Redirect/Redirect'
import Dashboard from './pages/Welcome/Welcome'
import Product from './pages/Product/Product'
import signIn from './pages/signIn/signIn'
import HealthCheckSettings from './pages/Settings/HealthCheckSettings/HealthCheckSettings'
import SubscriptionsSettings from './pages/Settings/SubscriptionsSettings/SubscriptionsSettings'
import SubscriptionManagement from './pages/SubscriptionManagement/SubscriptionManagement'
import ProductWarningsSettings from './pages/Settings/ProductWarningsSettings/ProductWarningsSettings'
import NotFound from './pages/NotFoundPage/NotFoundPage'
import SignUpPage from './pages/SignUpPage/SignUpPage'
import ProductListPage from './pages/ProductListPage/ProductListPage'
import PricingPage from './pages/PricingPage/PricingPage'
import CheckoutPage from './pages/CheckoutPagePage/CheckoutPage'
import PaymentSuccess from './pages/PaymentSuccess/paymentSuccess'
export const Routes = {
  Dashboard: {
    path: '/Dashboard',
    component: Dashboard,
    roles: ['superAdmin', 'productOwner', 'tenantOwner'],
  },
  products: {
    path: '/products',
    component: Product,
    roles: ['superAdmin', 'productOwner'],
  },
  productsList: {
    path: '/products-list',
    component: ProductListPage,
    roles: ['notAuth', 'tenantOwner', 'superAdmin'],
    type: 'noSidebar',
  },

  Tenant: {
    path: '/tenants',
    component: Tenant,
    roles: ['superAdmin', 'productOwner', 'tenantOwner'],
  },
  TenantDetails: {
    path: '/tenants/:id',
    component: TenantDetails,
    roles: ['superAdmin', 'tenantOwner', 'productOwner'],
  },
  SubscriptionManagement: {
    path: '/tenants/:id/Subscription-Management',
    component: SubscriptionManagement,
    roles: ['superAdmin', 'tenantOwner', 'productOwner'],
  },
  ProductDetails: {
    path: '/products/:id',
    component: ProductDetails,
    roles: ['superAdmin', 'productOwner'],
  },
  Settings: {
    path: '/settings/health-check',
    component: HealthCheckSettings,
    roles: ['superAdmin'],
  },
  SubscriptionsSettings: {
    path: '/settings/subscriptions',
    component: SubscriptionsSettings,
    roles: ['superAdmin'],
  },
  ProductWarningsSettings: {
    path: '/settings/product-warnings',
    component: ProductWarningsSettings,
    roles: ['superAdmin'],
  },
  Signin: {
    path: '/',
    component: signIn,
    roles: ['notAuth'],
    type: 'noSidebar',
  },
  CheckOut: {
    path: '/checkout/:productId/subscribtion/:subscribtionId',
    component: CheckoutPage,
    roles: ['notAuth', 'superAdmin'],
    // type: 'noSidebar',
  },
  SignUp: {
    path: '/sign-up',
    component: SignUpPage,
    roles: ['notAuth'],
    type: 'noSidebar',
  },
  Pricing: {
    path: '/products-list/:id',
    component: PricingPage,
    roles: ['notAuth', 'superAdmin'],
    type: 'noSidebar',
  },
  PaymentSuccess: {
    path: '/success',
    component: PaymentSuccess,
    roles: ['tenantOwner', 'superAdmin'],
  },
  redirect: {
    path: '*',
    component: Redirect,
    roles: '*',
  },
  NotFound: {
    path: '/not-found',
    component: NotFound,
    roles: '*',
    type: 'noSidebar',
  },
}
