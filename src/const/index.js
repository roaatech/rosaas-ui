const Product_id = "88e67328-3b20-413e-b6e1-010b48fa7bc9";
const Client_id = "spa_rosas_admin_panel";
const Owner = {
  1: "Super Admin",
  101: "External System",
};

const statusConst = {
  1: {
    string: "Created in db",
    opacity: "35",
    color: "#155dd7",
    icon: "pi-user-plus",
  },
  2: {
    string: "Pre-Creating",

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
export { Product_id, Client_id, statusConst, Owner };
