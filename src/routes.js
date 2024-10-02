// pages
import Tenant from './pages/Tenant/Tenant'
import TenantDetails from './pages/TenantDetails/TenantDetails'
import ProductDetails from './pages/ProductDetails/ProductDetails'
import Redirect from './components/custom/global/Redirect/Redirect'
import Dashboard from './pages/Welcome/Welcome'
import Product from './pages/Product/Product'
import HealthCheckSettings from './pages/Settings/HealthCheckSettings/HealthCheckSettings'
import SubscriptionsSettings from './pages/Settings/SubscriptionsSettings/SubscriptionsSettings'
import SubscriptionManagement from './pages/SubscriptionManagement/SubscriptionManagement'
import ProductWarningsSettings from './pages/Settings/ProductWarningsSettings/ProductWarningsSettings'
import NotFound from './pages/NotFoundPage/NotFoundPage'
import SignUpPage from './pages/SignUpPage/SignUpPage'
import MainPage from './pages/MainPage/MainPage'
import PricingPage from './pages/PricingPage/PricingPage'
import PaymentSuccess from './pages/PaymentSuccess/paymentSuccess'
import TwoStepProcessPage from './pages/TwoStepPage/TwoStepPage'
import CreatedSuccess from './pages/CreatedSuccess/CreatedSuccess'
import PaymentFailed from './pages/PaymentFailed/PaymentFailed'
import CardPaymentManagement from './pages/Settings/CardPaymentManagement/CardPaymentManagement'
import TenantWelcomePage from './pages/WorkspacePage/WorkspacePage'
import Marketplace from './pages/Marketplace/Marketplace'
import Profile from './components/custom/DashboardTenant/Profile/Profile'
import ProductsOwners from './pages/ProductsOwners/ProductsOwners'
import ProductOwnerDetails from './components/custom/ProductOwner/ProdcutOwnerDetailsTab/ProdcutOwnerDetailsTab'
import POwnerChecker from './routes/ProtectedRoutes'
import EmailConfirmationPage from './pages/EmailConfirmationPage/EmailConfirmationPage'
import ConfirmAccountPage from './pages/ConfirmAccountPage/ConfirmAccountPage'
import ResetPasswordPage from './pages/ResetPasswordPage/ResetPasswordPage'
import ProductManagementSignInPage from './pages/ProductManagementSignInPage/ProductManagementSignInPage'
import ProductManagementSignUpPage from './pages/ProductManagementSignUpPage/ProductManagementSignUpPage'
import DiscountsPage from './pages/DiscountsPage/DiscountsPage'
import DiscountDetails from './components/custom/Discounts/DiscountDetails'
import CurrenciesPage from './pages/CurrenciesPage/CurrenciesPage'
import SignInPage from './pages/signIn/signIn'
import ExchangeRateProvidersSettings from './pages/Settings/ExchangeRateProvidersSettings/ExchangeRateProvidersSettings'
import UpdatedTenantsPage from './pages/UpdatedTenantsPage/UpdatedTenantsPage'
import EnvironmentInfo from './pages/Settings/EnvironmentInfo/EnvironmentInfo'
import CanceledTenant from './pages/CanceledTenants/CanceledTenants'
import Audits from './pages/Audits/Audits'
import Logs from './pages/Logs/Logs'
import ProcessFailed from './pages/ProcessFailed/ProcessFailed'
import CanceledAccount from './pages/CanceledAccount/CanceledAccount'

export const adminPanel = '/admin-panel'

export const Routes = {
  Dashboard: {
    path: `${adminPanel}/dashboard`,
    component: () => <POwnerChecker page={<Dashboard />} />,

    roles: ['superAdmin', 'productAdmin', 'clientAdmin'],
  },
  Logs: {
    path: `${adminPanel}/system/logs`,
    component: () => <POwnerChecker page={<Logs />} />,

    roles: ['superAdmin', 'productAdmin', 'clientAdmin'],
  },
  products: {
    path: `${adminPanel}/products`,
    component: () => <POwnerChecker page={<Product />} />,

    roles: ['superAdmin', 'productAdmin', 'clientAdmin'],
  },
  productsOwners: {
    path: `${adminPanel}/products-owners`,
    component: () => <POwnerChecker page={<ProductsOwners />} />,
    roles: ['superAdmin'],
  },
  audits: {
    path: `${adminPanel}/system/audits`,
    component: () => <POwnerChecker page={<Audits />} />,
    roles: ['superAdmin'],
  },
  EmailConfirmationPage: {
    path: `/email-confirmation`,
    component: EmailConfirmationPage,
    roles: '*',
    type: 'noSidebar',
  },

  ResetPasswordConfirmPage: {
    path: `/Reset-Password-confirmation`,
    component: ResetPasswordPage,
    roles: '*',
    type: 'noSidebar',
  },
  mainPage: {
    path: '/',
    component: () => <POwnerChecker page={<MainPage />} />,
    roles: '*',
    type: 'noSidebar',
  },
  marketPlacePage: {
    path: '/marketplace',
    component: () => <POwnerChecker page={<Marketplace />} />,
    roles: '*',
    type: 'noSidebar',
  },
  ConfirmAccount: {
    path: '/auth/confirm-account',
    component: ConfirmAccountPage,
    roles: ['notAuth'],
    type: 'noSidebar',
  },
  ConfirmAccountByPassword: {
    path: '/auth/password-setup-complete',
    component: ConfirmAccountPage,
    roles: ['notAuth'],
    type: 'noSidebar',
  },

  Tenant: {
    path: `${adminPanel}/tenants`,
    component: () => <POwnerChecker page={<UpdatedTenantsPage />} />,
    roles: ['superAdmin', 'productAdmin', 'clientAdmin'],
  },

  UpdatedTenantsPage: {
    path: `${adminPanel}/old-tenants`,
    component: () => <POwnerChecker page={<Tenant />} />,
    roles: ['superAdmin', 'productAdmin', 'clientAdmin'],
  },

  Settings: {
    path: `${adminPanel}/settings/health-check`,
    component: HealthCheckSettings,
    roles: ['superAdmin'],
  },
  Profile: {
    path: `${adminPanel}/settings/profile`,
    component: Profile,
    roles: ['superAdmin', 'clientAdmin'],
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
  ExchangeRateProvidersSettings: {
    path: `${adminPanel}/settings/exchange-rate-providers`,
    component: ExchangeRateProvidersSettings,
    roles: ['superAdmin'],
  },
  EnvironmentInfo: {
    path: `${adminPanel}/system/environment-info`,
    component: EnvironmentInfo,
    roles: ['superAdmin'],
  },

  ProductWarningsSettings: {
    path: `${adminPanel}/settings/product-warnings`,
    component: ProductWarningsSettings,
    roles: ['superAdmin'],
  },
  DiscountsPage: {
    path: `${adminPanel}/settings/discounts`,

    component: () => <POwnerChecker page={<DiscountsPage />} />,

    roles: ['superAdmin', 'clientAdmin'],
  },
  CurrenciesPage: {
    path: `${adminPanel}/settings/currencies`,

    component: () => <POwnerChecker page={<CurrenciesPage />} />,

    roles: ['superAdmin', 'clientAdmin'],
  },

  SignInTenantAdmin: {
    path: '/workspace/sign-in',
    component: () => <POwnerChecker page={<SignInPage />} />,

    roles: ['notAuth'],
    type: 'noSidebar',
  },
  SignInSuperAdmin: {
    path: `${adminPanel}/sign-in`,
    component: () => <POwnerChecker page={<SignInPage />} />,
    roles: ['notAuth'],
    type: 'noSidebar',
  },
  ProductManagementSignIn: {
    path: '/product-management/sign-in',
    component: () => <POwnerChecker page={<ProductManagementSignInPage />} />,
    roles: ['notAuth'],
    type: 'noSidebar',
  },

  CheckOut: {
    path: '/checkout/:productOwnerSystemName/:productSystemName/plan-price/:priceName',
    component: () => <POwnerChecker page={<TwoStepProcessPage />} />,
    roles: '*',
    type: 'noSidebar',
  },

  CheckOutOrder: {
    path: '/checkout/:productOwnerSystemName/:productSystemName/plan-price/:priceName/order/:orderIDParam',
    component: () => <POwnerChecker page={<TwoStepProcessPage />} />,
    roles: '*',
    type: 'noSidebar',
  },

  SignUp: {
    path: '/workspace/sign-up',
    component: () => <POwnerChecker page={<SignUpPage />} />,
    roles: ['notAuth'],
    type: 'noSidebar',
  },
  ResetPasswordRequest: {
    path: '/reset-password-request',
    component: () => <POwnerChecker page={<SignInPage />} />,
    roles: ['notAuth'],
    type: 'noSidebar',
  },

  ResetPasswordConfirm: {
    path: '/auth/reset-password',
    component: () => <POwnerChecker page={<SignInPage />} />,
    roles: ['notAuth'],
    type: 'noSidebar',
  },
  setPassword: {
    path: '/auth/set-password',
    component: () => <POwnerChecker page={<SignInPage />} />,
    roles: ['notAuth'],
    type: 'noSidebar',
  },
  POwnerSignUp: {
    path: '/product-management/sign-up',
    component: () => <POwnerChecker page={<ProductManagementSignUpPage />} />,
    roles: ['notAuth'],
    type: 'noSidebar',
  },
  productsOwnerReg: {
    path: '/product-management/reg',
    component: SignUpPage,
    roles: ['superAdmin', 'productAdmin', 'clientAdmin'],
    type: 'noSidebar',
  },

  PaymentSuccess: {
    path: '/payment/success',
    component: () => <POwnerChecker page={<PaymentSuccess />} />,
    roles: ['tenantAdmin', 'superAdmin', 'notAuth', 'clientAdmin'],
    type: 'noSidebar',
  },
  successRegistrationPayment: {
    path: '/payment/product-owner/success',
    component: () => <POwnerChecker page={<PaymentSuccess />} />,
    roles: ['tenantAdmin', 'superAdmin', 'notAuth', 'clientAdmin'],
    type: 'noSidebar',
  },

  PaymentFailed: {
    path: '/payment/failed',
    component: () => <POwnerChecker page={<PaymentFailed />} />,
    roles: ['tenantAdmin', 'superAdmin', 'notAuth', 'clientAdmin'],
    type: 'noSidebar',
  },
  ProcessFailed: {
    path: '/process-failed',
    component: () => <POwnerChecker page={<ProcessFailed />} />,
    roles: ['tenantAdmin', 'superAdmin', 'notAuth', 'clientAdmin'],
    type: 'noSidebar',
  },
  CanceledAccount: {
    path: '/product-owner/canceled-account',
    component: () => <POwnerChecker page={<CanceledAccount />} />,
    roles: ['superAdmin', 'clientAdmin'],
    type: 'noSidebar',
  },
  CreatedSuccess: {
    path: '/created-successfully',
    component: CreatedSuccess,
    roles: ['tenantAdmin', 'superAdmin', 'notAuth', 'clientAdmin'],
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
    roles: '*' || ['notAuth'],
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
Routes.CanceledTenantsPage = {
  path: `${Routes.Tenant.path}/canceled`,
  component: () => <POwnerChecker page={<CanceledTenant />} />,
  roles: ['superAdmin', 'productAdmin', 'clientAdmin'],
}

Routes.Pricing = {
  path: `${Routes.marketPlacePage.path}/:productOwnerSystemName/:productSystemName`,
  component: () => <POwnerChecker page={<PricingPage />} />,
  roles: '*' || ['notAuth'],
  type: 'noSidebar',
}
Routes.SubscriptionManagement = {
  path: `${Routes.Tenant.path}/:id/Subscription-Management`,
  component: SubscriptionManagement,
  roles: ['superAdmin', 'productAdmin', 'clientAdmin'],
}
Routes.TenantDetails = {
  path: `${Routes.Tenant.path}/:id`,
  component: TenantDetails,
  roles: ['superAdmin', 'productAdmin', 'clientAdmin'],
}
Routes.DiscountDetails = {
  path: `${Routes.DiscountsPage.path}/:id`,
  component: DiscountDetails,
  roles: ['superAdmin', 'clientAdmin'],
}
Routes.ProductsOwnersDetails = {
  path: `${Routes.productsOwners.path}/:id`,
  component: () => <POwnerChecker page={<ProductOwnerDetails />} />,
  roles: ['superAdmin', 'productAdmin', 'clientAdmin'],
}
