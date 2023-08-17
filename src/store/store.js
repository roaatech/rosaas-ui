import { configureStore } from '@reduxjs/toolkit'
import mainReducer from './slices/main'
import authReducer from './slices/auth'
import tenantsReducer from './slices/tenants'
import productsReducer from './slices/products'
import featuresReducer from './slices/features'

export default configureStore({
  reducer: {
    main: mainReducer,
    auth: authReducer,
    products: productsReducer,
    features: featuresReducer,
    tenants: tenantsReducer,
  },
})
