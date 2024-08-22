import { configureStore } from '@reduxjs/toolkit'
import mainReducer from './slices/main'
import authReducer from './slices/auth'
import tenantsReducer from './slices/tenants'
import workspaceReducer from './slices/workSpace.js'
import productsReducer from './slices/products/productsSlice.js'
import productsOwnersReducer from './slices/productsOwners.js'
import discountsSlice from './slices/discountsSlice.js'
import currenciesSlice from './slices/products/currenciesSlice.js'

export default configureStore({
  reducer: {
    main: mainReducer,
    auth: authReducer,
    products: productsReducer,
    tenants: tenantsReducer,
    workspace: workspaceReducer,
    productsOwners: productsOwnersReducer,
    discountsSlice: discountsSlice,
    currenciesSlice: currenciesSlice,
  },
})
