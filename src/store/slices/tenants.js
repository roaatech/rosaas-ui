import { createSlice } from "@reduxjs/toolkit";

export const tenantsSlice = createSlice({
  name: "tenants",
  initialState: {
    tenants: {
      // id: {
      //   details: {},
      //   products: {
      //       id: {},
      //     },
      // },
    },
  },

  // Tenant // id, details, products
  // TenantDetails // id, details
  // TenantProduct // id, products
  // removeTenant // id
  // removeProduct // id

  reducers: {
    Tenant: (state, action) => {
      state.Tenant = action.payload;
    },
    TenantDetails: (state, action) => {
      state.Tenant = action.payload;
    },
    TenantProduct: (state, action) => {
      state.Tenant = action.payload;
    },
    removeTenant: (state, action) => {
      state.Tenant = action.payload;
    },
    removeProduct: (state, action) => {
      state.Tenant = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  Tenant,
  TenantDetails,
  TenantProduct,
  removeTenant,
  removeProduct,
} = tenantsSlice.actions;
export default tenantsSlice.reducer;
