// =========================================================
// * Volt React Dashboard
// =========================================================

// * Product Page: https://themesberg.com/product/dashboard/volt-react
// * Copyright 2021 Themesberg (https://www.themesberg.com)
// * License: MIT License (https://themesberg.com/licensing)

// * Designed and coded by https://themesberg.com

// =========================================================

// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. Please contact us to request a removal.

import React from 'react'
import * as ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

// core styles

// vendor styles
import 'react-datetime/css/react-datetime.css'
import HomePage from './pages/HomePage'
import ScrollToTop from './components/ScrollToTop'
import AppWrapper from './components/custom/global/AppWrapper'
import { Provider } from 'react-redux'
import store from './store/store'

fetch(`${process.env.PUBLIC_URL}/config.json`)
  .then((res) => res.json())
  .then((data) => {
    window.localStorage.setItem('url', data.url)
    const root = ReactDOM.createRoot(document.getElementById('root'))
    root.render(
      <Provider store={store}>
        <AppWrapper>
          <BrowserRouter basename={data.baseHref}>
            <ScrollToTop />
            <HomePage />
          </BrowserRouter>
        </AppWrapper>
      </Provider>
    )
  })
