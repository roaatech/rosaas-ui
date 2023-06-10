// =========================================================
// * Volt React Dashboard
// =========================================================

// * Product Page: https://themesberg.com/product/dashboard/volt-react
// * Copyright 2021 Themesberg (https://www.themesberg.com)
// * License: MIT License (https://themesberg.com/licensing)

// * Designed and coded by https://themesberg.com

// =========================================================

// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. Please contact us to request a removal.

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

// core styles

// vendor styles
import "react-datetime/css/react-datetime.css";

import HomePage from "./pages/HomePage";
import ScrollToTop from "./components/ScrollToTop";
import AppWrapper from "./components/custom/global/AppWrapper";
import { Provider } from "react-redux";
import store from "./store/store";

ReactDOM.render(
  <Provider store={store}>
    <AppWrapper>
      <BrowserRouter>
        <ScrollToTop />
        <HomePage />
      </BrowserRouter>
    </AppWrapper>
  </Provider>,
  document.getElementById("root")
);
