import React from "react";
import { IntlProvider } from "react-intl";
import { useEffect } from "react";
import arFile from "../../../translation/ar.json";
import enFile from "../../../translation/en.json";
import useGlobal from "../../../lib/hocks/global.js";
import { useSelector, useDispatch } from "react-redux";
import GlobalStyles from "./Wrapper.styled.jsx";
import { ToastContainer } from "react-toastify";
import Preloader from "../../../components/custom/global/Preloader/Preloader";
import { changeMode, changePreloader } from "../../../store/slices/main";
import useRequest from "../../../axios/apis/useRequest";
// import "../../../../node_modules/primeflex/primeflex.css";

const AppWrapper = ({ children }) => {
  const { userData } = useRequest();
  const dispatch = useDispatch();
  const { changeDirection } = useGlobal();
  let direction = useSelector((state) => state.main.direction);
  let darkMode = useSelector((state) => state.main.darkMode);
  let loaded = useSelector((state) => state.main.preloader);
  useEffect(() => {
    (async () => {
      // if (localStorage.getItem("direction") === "ltr") {
      //   changeDirection("ltr");
      // } else {
      //   changeDirection("rtl");
      // }
      if (localStorage.getItem("dark") == "true") {
        dispatch(changeMode(true));
      } else {
        dispatch(changeMode(false));
      }

      const token = localStorage.getItem("token");
      if (token) {
        await userData();
        // send token to get userData then set it in the store
      }

      dispatch(changePreloader(false));
    })();
  }, []);

  const messages = direction === "rtl" ? arFile : enFile;
  return (
    <>
      <Preloader show={loaded} />
      <ToastContainer />
      <GlobalStyles direction={direction} key={direction} darkMode={darkMode} />
      <IntlProvider
        locale={direction === "rtl" ? "ar" : "en"}
        messages={messages}>
        {children}
      </IntlProvider>
    </>
  );
};

export default AppWrapper;
