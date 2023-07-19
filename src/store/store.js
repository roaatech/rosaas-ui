import { configureStore } from "@reduxjs/toolkit";
import mainReducer from "./slices/main";
import authReducer from "./slices/auth";
import tenantsReducer from "./slices/tenants";

export default configureStore({
  reducer: {
    main: mainReducer,
    auth: authReducer,
    tenants: tenantsReducer,
  },
});
