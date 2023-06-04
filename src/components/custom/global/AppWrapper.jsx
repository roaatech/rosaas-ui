import React from "react";
import { IntlProvider } from "react-intl";
import { useEffect } from "react";
import arFile from "../../../translation/ar.json";
import enFile from "../../../translation/en.json";
import useGlobal from "../../../lib/hocks/global.js";
import { useSelector, useDispatch } from "react-redux";
import GlobalStyles from "./Wrapper.styled.jsx";
import { ToastContainer } from "react-toastify";
import Preloader from "../../Preloader";
import { changePreloader } from "../../../store/slices/main";

const AppWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const { changeDirection } = useGlobal();
  let direction = useSelector((state) => state.main.direction);
  let loaded = useSelector((state) => state.main.preloader);
  useEffect(() => {
    (async () => {
      if (localStorage.getItem("direction") === "ltr") {
        changeDirection("ltr");
      } else {
        changeDirection("rtl");
      }

      const token = localStorage.getItem("token");
      if (token) {
        // send token to get userData then set it in the store
      }

      setTimeout(() => {
        dispatch(changePreloader(false));
      }, 1000);
    })();
  }, []);

  const messages = direction === "rtl" ? arFile : enFile;
  return (
    <>
      <Preloader show={loaded} />
      <ToastContainer />
      <GlobalStyles direction={direction} key={direction} />
      {console.log({ loaded })}

      <IntlProvider
        locale={direction === "rtl" ? "ar" : "en"}
        messages={messages}>
        {children}
      </IntlProvider>
    </>
  );
};

export default AppWrapper;
