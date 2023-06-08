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
    return await Request.post("identity/management/v1/Auth/Signin", data);
  };
  const userData = async () => {
    return await Request.get("identity/management/v1/Account");
  };
  const createTenantRequest = async (data) => {
    return await Request.post("main/management/v1/Tenant", data);
  };
  const editTenantRequest = async (data) => {
    return await Request.put("main/management/v1/Tenant", data);
  };
  const getTenant = async (id) => {
    return await Request.get(`main/management/v1/Tenant/${id}`);
  };
  const getTenantList = async (params) => {
    return await Request.get(`main/management/v1/Tenant${params}`);
  };
  const editTenantStatus = async (data) => {
    return await Request.put("main/management/v1/Tenant/Status", data);
  };
  const deleteTenantReq = async (data) => {
    return await Request.delete(`main/management/v1/Tenant`, { data });
  };

  return {
    signIn,
    userData,
    logOut,
    createTenantRequest,
    editTenantRequest,
    getTenant,
    getTenantList,
    editTenantStatus,
    deleteTenantReq,
  };
};
export default useRequest;
