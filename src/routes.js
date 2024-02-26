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
import CheckoutPage from './components/custom/CheckoutStep/CheckoutStep'
import PaymentSuccess from './pages/PaymentSuccess/paymentSuccess'
import TwoStepProcessPage from './pages/TwoStepPage/TwoStepPage'
import CreatedSuccess from './pages/CreatedSuccess/CreatedSuccess'
import PaymentFailed from './pages/PaymentFailed/PaymentFailed'
import CardPaymentManagement from './pages/Settings/CardPaymentManagement/CardPaymentManagement'
import TenantWelcomePage from './pages/TenantWelcomePage/TenantWelcomePage'
export const Routes = {
  Dashboard: {
    path: '/Dashboard',
    component: Dashboard,
    roles: ['superAdmin', 'productAdmin', 'clientAdmin', 'tenantAdmin'],
  },
  products: {
    path: '/products',
    component: Product,
    roles: ['superAdmin', 'productAdmin', 'clientAdmin'],
  },
  productsList: {
    path: '/',
    component: ProductListPage,
    roles: ['notAuth', 'tenantAdmin', 'productAdmin', 'superAdmin'],
    type: 'noSidebar',
  },

  Tenant: {
    path: '/tenants',
    component: Tenant,
    roles: ['superAdmin', 'productAdmin', 'clientAdmin', 'tenantAdmin'],
  },
  TenantDetails: {
    path: '/tenants/:id',
    component: TenantDetails,
    roles: ['superAdmin', 'tenantAdmin', 'productAdmin', 'clientAdmin'],
  },
  SubscriptionManagement: {
    path: '/tenants/:id/Subscription-Management',
    component: SubscriptionManagement,
    roles: ['superAdmin', 'tenantAdmin', 'productAdmin', 'clientAdmin'],
  },
  ProductDetails: {
    path: '/products/:id',
    component: ProductDetails,
    roles: ['superAdmin', 'productAdmin', 'clientAdmin'],
  },
  Settings: {
    path: '/settings/health-check',
    component: HealthCheckSettings,
    roles: ['superAdmin'],
  },
  CardSettings: {
    path: '/settings/cards-management',
    component: CardPaymentManagement,
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
    path: '/signin',
    component: signIn,
    roles: ['notAuth'],
    type: 'noSidebar',
  },
  CheckOut: {
    path: '/checkout/product/:systemName/plan-price/:priceName',
    component: TwoStepProcessPage,
    roles: ['notAuth', 'superAdmin', 'tenantAdmin'],
    type: 'noSidebar',
  },
  CheckOutOrder: {
    path: '/checkout/product/:systemName/plan-price/:priceName/order/:orderIDParam',
    component: TwoStepProcessPage,
    roles: ['superAdmin', 'tenantAdmin', 'notAuth'],
    type: 'noSidebar',
  },
  SignUp: {
    path: '/sign-up',
    component: SignUpPage,
    roles: ['notAuth'],
    type: 'noSidebar',
  },
  Pricing: {
    path: '/products-list/:systemName',
    component: PricingPage,
    roles: ['notAuth', 'superAdmin', 'tenantAdmin'],
    type: 'noSidebar',
  },
  PaymentSuccess: {
    path: '/success',
    component: PaymentSuccess,
    roles: ['tenantAdmin', 'superAdmin', 'notAuth'],
    type: 'noSidebar',
  },
  PaymentFailed: {
    path: '/failed',
    component: PaymentFailed,
    roles: ['tenantAdmin', 'superAdmin', 'notAuth'],
    type: 'noSidebar',
  },
  CreatedSuccess: {
    path: '/created-successfully',
    component: CreatedSuccess,
    roles: ['tenantAdmin', 'superAdmin', 'notAuth'],
    type: 'noSidebar',
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
  TenantDashboard: {
    path: '/welcome',
    component: TenantWelcomePage,
    roles: ['tenantAdmin', 'superAdmin', 'notAuth'],
    type: 'noSidebar',
  },
}
