import useApi from "../useApi";

const useRequest = () => {
  const Request = useApi();

  const logOut = async () => {
    return await Request.get(`logout`);
  };

  const signIn = async (data) => {
    return await Request.post("auth", data);
  };

  return {
    signIn,
    logOut,
  };
};
export default useRequest;
