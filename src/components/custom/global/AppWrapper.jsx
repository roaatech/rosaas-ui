import React from "react";
import { IntlProvider } from "react-intl";
import { useEffect } from "react";
import arFile from "../../../translation/ar.json";
import enFile from "../../../translation/en.json";
import useGlobal from "../../../lib/hocks/global.js";
import { useSelector } from "react-redux";
import GlobalStyles from "./Wrapper.styled.jsx";
import { ToastContainer, toast } from "react-toastify";

const AppWrapper = ({ children }) => {
  const { changeDirection } = useGlobal();
  let direction = useSelector((state) => state.main.direction);
  useEffect(() => {
    (async () => {
      if (localStorage.getItem("direction") === "ltr") {
        changeDirection("ltr");
      } else {
        changeDirection("rtl");
      }
    })();
  }, [direction]);

  const messages = direction === "rtl" ? arFile : enFile;
  return (
    <>
      <ToastContainer />
      <GlobalStyles direction={direction} key={direction} />
      <IntlProvider
        locale={direction === "rtl" ? "ar" : "en"}
        messages={messages}>
        {children}
      </IntlProvider>
    </>
  );
};

export default AppWrapper;
