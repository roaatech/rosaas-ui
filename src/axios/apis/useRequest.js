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

  return {
    signIn,
    logOut,
  };
};
export default useRequest;
