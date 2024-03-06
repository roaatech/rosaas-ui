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
import MainPage from './pages/MainPage/MainPage'
import PricingPage from './pages/PricingPage/PricingPage'
import CheckoutPage from './components/custom/CheckoutStep/CheckoutStep'
import PaymentSuccess from './pages/PaymentSuccess/paymentSuccess'
import TwoStepProcessPage from './pages/TwoStepPage/TwoStepPage'
import CreatedSuccess from './pages/CreatedSuccess/CreatedSuccess'
import PaymentFailed from './pages/PaymentFailed/PaymentFailed'
import CardPaymentManagement from './pages/Settings/CardPaymentManagement/CardPaymentManagement'
import TenantWelcomePage from './pages/TenantWelcomePage/TenantWelcomePage'
import Marketplace from './pages/Marketplace/Marketplace'
const adminPanel = '/admin-panel'
export const Routes = {
  Dashboard: {
    path: `${adminPanel}/dashboard`,
    component: Dashboard,
    roles: ['superAdmin', 'productAdmin', 'clientAdmin', 'tenantAdmin'],
  },
  products: {
    path: `${adminPanel}/products`,
    component: Product,
    roles: ['superAdmin', 'productAdmin', 'clientAdmin'],
  },
  mainPage: {
    path: '/',
    component: MainPage,
    roles: '*',
    type: 'noSidebar',
  },
  marketPlacePage: {
    path: '/marketplace',
    component: Marketplace,
    roles: ['notAuth', 'tenantAdmin', 'productAdmin', 'superAdmin'],
    type: 'noSidebar',
  },

  Tenant: {
    path: `${adminPanel}/tenants`,
    component: Tenant,
    roles: ['superAdmin', 'productAdmin', 'clientAdmin', 'tenantAdmin'],
  },

  Settings: {
    path: `${adminPanel}/settings/health-check`,
    component: HealthCheckSettings,
    roles: ['superAdmin'],
  },

  CardSettings: {
    path: `${adminPanel}/settings/cards-management`,
    component: CardPaymentManagement,
    roles: ['superAdmin'],
  },

  SubscriptionsSettings: {
    path: `${adminPanel}/settings/subscriptions`,
    component: SubscriptionsSettings,
    roles: ['superAdmin'],
  },

  ProductWarningsSettings: {
    path: `${adminPanel}/settings/product-warnings`,
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
    path: `/:systemName`,
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

  workSpace: {
    path: '/work-space',
    component: TenantWelcomePage,
    roles: ['tenantAdmin', 'superAdmin'],
    type: 'noSidebar',
  },
}
Routes.ProductDetails = {
  path: `${Routes.products.path}/:id`,
  component: ProductDetails,
  roles: ['superAdmin', 'productAdmin', 'clientAdmin'],
}
Routes.Pricing = {
  path: `${Routes.Pricing.path}/:systemName`,
  component: PricingPage,
  roles: ['notAuth', 'superAdmin', 'tenantAdmin'],
  type: 'noSidebar',
}
Routes.SubscriptionManagement = {
  path: `${Routes.Tenant.path}/:id/Subscription-Management`,
  component: SubscriptionManagement,
  roles: ['superAdmin', 'tenantAdmin', 'productAdmin', 'clientAdmin'],
}
Routes.TenantDetails = {
  path: `${Routes.Tenant.path}/:id`,
  component: TenantDetails,
  roles: ['superAdmin', 'tenantAdmin', 'productAdmin', 'clientAdmin'],
}
