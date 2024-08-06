import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import Apphompy from "./hompy/Apphompy";
import AhcyworldApp from "./AhcyworldApp";
import AppLogin from "./login/AppLogin";
import MusicApi from "./item/api/MusicApi";

import "bootstrap/dist/css/bootstrap.min.css";

import { Provider } from "react-redux";
import store from "./redux/store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <Provider store={store}>
      {/* <React.StrictMode> */}
      {/* <MusicApi /> */} {/* 혹시 노래데이터 받을 때 필요! */}
      {/* <AppLogin /> */}
      {/*    <Apphompy />*/}
      {/* <AhcyworldApp /> */}
      <AppLogin />
      {/* <AhcyworldApp /> */}
      {/* </React.StrictMode> */}
    </Provider>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
