const Product_id = "88e67328-3b20-413e-b6e1-010b48fa7bc9";
const Product_Client_id = "88283b02-e969-485a-a5a3-9e5d1d0d3337";
const Client_id = "spa_rosas_admin_panel";
const Owner = {
  1: "Super Admin",
  101: "External System",
};

const statusConst = {
  1: {
    string: "Rosas resource created",
    opacity: "35",
    color: "#155dd7",
    icon: "pi-user-plus",
  },
  2: {
    string: "Create request is sent",
    opacity: "10",
    color: "#155dd7",
    icon: "pi-user-plus",
  },
  3: {
    string: "Creating",
    opacity: "15",
    color: "#155dd7",
    icon: "pi-user-plus",
  },
  4: {
    string: "Created As Active",
    opacity: "35",
    color: "#00a675",
    icon: "pi-check-circle",
  },
  5: {
    string: "Pre-Activating",
    opacity: "10",
    color: "#00a675",
    icon: "pi-check-circle",
  },
  6: {
    string: "Activating",
    opacity: "15",
    color: "#00a675",
    icon: "pi-check-circle",
  },
  7: {
    string: "Active",
    opacity: "35",
    color: "#00a675",
    icon: "pi-check-circle",
  },
  8: {
    string: "Pre-Deactivating",
    opacity: "10",
    color: "#eda100",
    icon: "pi-exclamation-triangle",
  },
  9: {
    string: "Deactivating",
    opacity: "15",
    color: "#eda100",
    icon: "pi-exclamation-triangle",
  },
  10: {
    string: "Deactivate",
    opacity: "35",
    color: "#eda100",
    icon: "pi-exclamation-triangle",
  },
  11: {
    string: "Pre-Deleting",
    opacity: "10",
    color: "#ff0f5f",
    icon: "pi-trash",
  },
  12: {
    string: "Deleting",
    string: "Deleting",
    opacity: "15",
    color: "#ff0f5f",
    icon: "pi-trash",
  },
  13: {
    string: "Deleted",
    opacity: "35",
    color: "#ff0f5f",
    icon: "pi-trash",
  },
};

const urlStyle = {
  GET: {
    method: "GET",
    darkColor: "#61affe",
    lightColor: "#ebf3fb",
  },
  POST: {
    method: "POST",
    darkColor: "#49cc90",
    lightColor: "#e8f6f0",
  },
  PUT: {
    method: "PUT",
    darkColor: "#fca130",
    lightColor: "#fbf1e6",
  },
  DELETE: {
    method: "DELETE",
    darkColor: "#f93e3e",
    lightColor: "#fae7e7",
  },
};

const breadcrumbConst = {
  ProductList: {
    title: "Product Management", 
    name: "Products",
    navigation: "/product", 
    active:"Products",
    icon: {},
  },
  ProductDetails: {
    title: "Product Management", 
    name: "Product Details",
    active:"Product Details",
    navigation: "/product",  
    parent: "Products", 
    parentNavigation: "/product", 
    icon: {},
  },
  TenantList: {
    title: "Tenant Management", 
    name: "Tenants",
    navigation: "/tnant", 
    active:"Tenants",
    icon: {},
  },
  TenantDetails: {
    title: "Tenant Management", 
    name: "Tenant Details",
    active:"Tenant Details",
    navigation: "/tenant",  
    parent: "Tenants", 
    parentNavigation: "/tenant", 
    icon: {},
  },
};
export {
  Product_id,
  Client_id,
  statusConst,
  Owner,
  urlStyle,
  Product_Client_id,
  breadcrumbConst
};
