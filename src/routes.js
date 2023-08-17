// pages
import Upgrade from './pages/Upgrade'
import DashboardOverview from './pages/dashboard/DashboardOverview'
import Transactions from './pages/Transactions'
import Settings from './pages/Settings/Settings'
import BootstrapTables from './pages/tables/BootstrapTables'
import Signin from './pages/examples/Signin'
import Signup from './pages/examples/Signup'
import ForgotPassword from './pages/examples/ForgotPassword'
import ResetPassword from './pages/examples/ResetPassword'
import Lock from './pages/examples/Lock'
import ServerError from './pages/examples/ServerError'
import Accordions from './pages/components/Accordion'
import Alerts from './pages/components/Alerts'
import Badges from './pages/components/Badges'
import Breadcrumbs from './pages/components/Breadcrumbs'
import Buttons from './pages/components/Buttons'
import Forms from './pages/components/Forms'
import Modals from './pages/components/Modals'
import Navs from './pages/components/Navs'
import Navbars from './pages/components/Navbars'
import Pagination from './pages/components/Pagination'
import Popovers from './pages/components/Popovers'
import Progress from './pages/components/Progress'
import Tables from './pages/components/Tables'
import Tabs from './pages/components/Tabs'
import Tooltips from './pages/components/Tooltips'
import Toasts from './pages/components/Toasts'
import NotFoundPage from './pages/examples/NotFound'
import Tenant from './pages/Tenant/Tenant'
import TenantDetails from './pages/TenantDetails/TenantDetails'
import ProductDetails from './pages/ProductDetails/ProductDetails'
import Redirect from './components/custom/global/Redirect/Redirect'
import Dashboard from './pages/Welcome/Welcome'
import Product from './pages/Product/Product'
import Plan from './pages/Plan/Plan'

export const Routes = {
  // pages
  DashboardOverview: {
    path: '/DashboardOverview',
    component: DashboardOverview,
    roles: ['superAdmin'],
  },
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
  Plan: {
    path: '/plans',
    component: Plan,
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
  Transactions: {
    path: '/transactions',
    component: Transactions,
    roles: ['superAdmin'],
  },
  Settings: {
    path: '/settings/health-check',
    component: Settings,
    roles: ['superAdmin'],
  },
  Upgrade: { path: '/upgrade', component: Upgrade, roles: ['superAdmin'] },
  BootstrapTables: {
    path: '/tables/bootstrap-tables',
    component: BootstrapTables,
    roles: ['superAdmin'],
  },
  Signin: {
    path: '/',
    component: Signin,
    roles: ['notAuth'],
    type: 'noSidebar',
  },
  Signup: {
    path: '/examples/sign-up',
    component: Signup,
    roles: ['notAuth'],
  },
  ForgotPassword: {
    path: '/examples/forgot-password',
    component: ForgotPassword,
    type: 'noSidebar',
    roles: ['notAuth'],
  },
  ResetPassword: {
    path: '/examples/reset-password',
    component: ResetPassword,
    type: 'noSidebar',
    roles: ['notAuth'],
  },
  Lock: {
    path: '/examples/lock',
    component: Lock,
    type: 'noSidebar',
    roles: '*',
  },
  ServerError: {
    path: '/examples/500',
    component: ServerError,
    type: 'noSidebar',
    roles: '*',
  },

  Accordions: {
    path: '/components/accordions',
    component: Accordions,
    roles: ['superAdmin'],
  },
  Alerts: {
    path: '/components/alerts',
    component: Alerts,
    roles: ['superAdmin'],
  },
  Badges: {
    path: '/components/badges',
    component: Badges,
    roles: ['superAdmin'],
  },
  Breadcrumbs: {
    path: '/components/breadcrumbs',
    component: Breadcrumbs,
    roles: ['superAdmin'],
  },
  Buttons: {
    path: '/components/buttons',
    component: Buttons,
    roles: ['superAdmin'],
  },
  Forms: { path: '/components/forms', component: Forms, roles: ['superAdmin'] },
  Modals: {
    path: '/components/modals',
    component: Modals,
    roles: ['superAdmin'],
  },
  Navs: { path: '/components/navs', component: Navs, roles: ['superAdmin'] },
  Navbars: {
    path: '/components/navbars',
    component: Navbars,
    roles: ['superAdmin'],
  },
  Pagination: {
    path: '/components/pagination',
    component: Pagination,
    roles: ['superAdmin'],
  },
  Popovers: {
    path: '/components/popovers',
    component: Popovers,
    roles: ['superAdmin'],
  },
  Progress: {
    path: '/components/progress',
    component: Progress,
    roles: ['superAdmin'],
  },
  Tables: {
    path: '/components/tables',
    component: Tables,
    roles: ['superAdmin'],
  },
  Tabs: { path: '/components/tabs', component: Tabs, roles: ['superAdmin'] },
  Tooltips: {
    path: '/components/tooltips',
    component: Tooltips,
    roles: ['superAdmin'],
  },
  Toasts: {
    path: '/components/toasts',
    component: Toasts,
    roles: ['superAdmin'],
  },
  NotFound: {
    path: '/404',
    roles: '*',
    component: NotFoundPage,
    type: 'noSidebar',
  },
  redirect: {
    path: '*',
    component: Redirect,
    roles: '*',
  },
}
