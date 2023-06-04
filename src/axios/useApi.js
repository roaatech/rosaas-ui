import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { logOut } from "../store/slices/auth";
import { changePreloader } from "../store/slices/main";
import { addUserInfo } from "../store/slices/auth";

const useApi = () => {
  let axiosObject = {
    baseURL: "https://localhost:44359/api/",
  };

  const mainInstance = axios.create(axiosObject);

  const dispatch = useDispatch();

  mainInstance.interceptors.request.use(
    function (config) {
      dispatch(changePreloader(true));
      const noAuthRoutes = ["dentity/admin/v1/Account/Signin"];
      config.headers["Client-Id"] = "SPA.Rosas.Admin.Panel.Client";
      //* add auth
      if (!noAuthRoutes.includes(config.url)) {
        const localStorageToken = localStorage.getItem("token");
        config.headers.Authorization = localStorageToken
          ? `Bearer ${localStorageToken}`
          : "";
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
      res.headers.get("token") &&
        localStorage.setItem("token", res.headers.get("token"));
      const roles = ["superAdmin"];
      dispatch(
        addUserInfo({
          email: res.data.userAccount.email,
          role: roles[res.data.userAccount.userType],
        })
      );
      return res;
    },
    async (err) => {
      dispatch(changePreloader(false));
      if (err.response) {
        //when the Access Token is expired
        if (err.response.metadata.errors[0].sysCode === 401) {
          toast.error(err.response.metadata.errors[0].message, {
            position: toast.POSITION.TOP_CENTER,
          });
          dispatch(logOut());
          return Promise.reject(err);
        } else {
          err.response.metadata.errors.map((element) => {
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
