import 'core-js/es/map';
import 'core-js/es/set';
import "core-js/stable";
import "regenerator-runtime/runtime";
import 'raf/polyfill';

if (process.env.REACT_APP_ENV === 'production') {
  console.log = () => {}
  console.error = () => {}
  console.debug = () => {}
  console.warn = () => {}
}

import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import * as serviceWorker from "./serviceWorker"
import { BrowserRouter } from "react-router-dom"
import "./i18n"
import { Provider } from "react-redux"
import store from "./store"


    
const app = (
  <Provider store={store}>
    <BrowserRouter>
      <App store={store} />
    </BrowserRouter>
  </Provider>
)

ReactDOM.render(app, document.getElementById("root"))

  


serviceWorker.unregister()
