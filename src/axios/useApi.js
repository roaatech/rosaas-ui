import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { logOut } from "../store/slices/auth";
import { changePreloader } from "../store/slices/main";
import { addUserInfo } from "../store/slices/auth";
import { Client_id } from "../const";
const useApi = () => {
  let axiosObject = {
    baseURL: "https://dev.rosas.roaa.tech/api/",
  };

  const mainInstance = axios.create(axiosObject);

  const dispatch = useDispatch();

  mainInstance.interceptors.request.use(
    function (config) {
      dispatch(changePreloader(true));
      const noAuthRoutes = ["identity/management/v1/Auth/Signin"];
      //* add auth
      console.log({ ddd: config.url });
      if (!noAuthRoutes.includes(config.url)) {
        const localStorageToken = localStorage.getItem("token");
        config.headers.Authorization = localStorageToken
          ? `Bearer ${localStorageToken}`
          : "";
      } else {
        config.headers["Client-Id"] = Client_id;
      }
      //* end auth
      return config;
    },
    (error) => {
      //if err don't do any thing and i will handel it in my global handel error
      return Promise.reject(error);
    }
  );

  mainInstance.interceptors.response.use(
    async (res) => {
      dispatch(changePreloader(false));
      res.data?.data?.token?.accessToken &&
        localStorage.setItem("token", res.data?.data?.token?.accessToken);
      const roles = ["", "superAdmin"];
      console.log(res.data, "oooooooo");
      if (res.data?.data?.userAccount?.email) {
        dispatch(
          addUserInfo({
            email: res.data?.data?.userAccount?.email,
            role: roles[res.data?.data?.userAccount?.userType],
          })
        );
      }
      return res;
    },
    async (err) => {
      dispatch(changePreloader(false));
      if (err?.response?.data?.metadata) {
        //when the Access Token is expired
        if (err?.response?.data?.metadata.errors[0].sysCode === "2001") {
          toast.error(err.response.data.metadata.errors[0].message, {
            position: toast.POSITION.TOP_CENTER,
          });
          dispatch(logOut());
          return Promise.reject(err);
        } else {
          err.response.data.metadata.errors.map((element) => {
            toast.error(element.message, {
              position: toast.POSITION.TOP_CENTER,
            });
          });
        }
      }
      return Promise.reject(err);
    }
  );
  return mainInstance;
};

export default useApi;
