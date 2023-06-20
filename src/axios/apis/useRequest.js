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
    return await Request.post("identity/sadmin/v1/Auth/Signin", data);
  };
  const userData = async () => {
    return await Request.get("identity/sadmin/v1/Account");
  };
  const createTenantRequest = async (data) => {
    return await Request.post("management/sadmin/v1/Tenants", data);
  };
  const editTenantRequest = async (data) => {
    return await Request.put("management/sadmin/v1/Tenants", data);
  };
  const getTenant = async (id) => {
    return await Request.get(`management/sadmin/v1/Tenants/${id}`);
  };
  const getTenantList = async (params) => {
    return await Request.get(`management/sadmin/v1/Tenants${params}`);
  };
  const editTenantStatus = async (data) => {
    return await Request.put("management/sadmin/v1/Tenants/status", data);
  };
  const deleteTenantReq = async (data) => {
    return await Request.delete(`management/sadmin/v1/Tenants`, { data });
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
