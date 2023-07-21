import { createSlice, current } from "@reduxjs/toolkit";

export const tenantsSlice = createSlice({
  name: "tenants",
  initialState: {
    tenants: {},
  },

  reducers: {
    setAllTenant: (state, action) => {
      const allTenant = {};
      action.payload.map((item) => {
        if (!{ ...current(state.tenants) }[item.id]) {
          allTenant[item.id] = item;
        } else {
          allTenant[item.id] = { ...current(state.tenants) }[item.id];
        }
      });
      console.log(Object.values(allTenant), "9999");
      state.tenants = allTenant;
    },
    tenantInfo: (state, action) => {
      const currentTenants = { ...current(state.tenants) };
      currentTenants[action.payload.id] = action.payload;
      state.tenants = currentTenants;
    },
    removeTenant: (state, action) => {
      const currentTenants = { ...current(state.tenants) };
      delete currentTenants[action.payload];
      state.tenants = currentTenants;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setAllTenant, tenantInfo, removeTenant } = tenantsSlice.actions;
export default tenantsSlice.reducer;
