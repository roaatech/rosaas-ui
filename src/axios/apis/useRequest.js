import useApi from "../useApi";
import { useDispatch } from "react-redux";
import { logOut as logOutRequest } from "../../store/slices/auth";
const useRequest = () => {
  const dispatch = useDispatch();
  const Request = useApi();

  const logOut = async () => {
    dispatch(logOutRequest());
    return await Request.get(`logout`);
  };

  const signIn = async (data) => {
    return await Request.post("identity/admin/v1/Account/Signin", data);
  };
  const createTenantRequest = async (data) => {
    return await Request.post("main/management/v1/Tenant/Create", data);
  };
  const editTenantRequest = async (data) => {
    return await Request.put("main/management/v1/Tenant/Update", data);
  };
  const getTenant = async (id) => {
    return await Request.get(`main/management/v1/Tenant/GetById?id=${id}`);
  };
  const getTenantList = async (params) => {
    return await Request.get(
      `main/management/v1/Tenant/GetPaginatedList${params}`
    );
  };
  const editTenantStatus = async (data) => {
    return await Request.put("main/management/v1/Tenant/Status", data);
  };

  return {
    signIn,
    logOut,
    createTenantRequest,
    editTenantRequest,
    getTenant,
    getTenantList,
    editTenantStatus,
  };
};
export default useRequest;
