import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import store from "./redux/store";
import { BrowserRouter } from "react-router-dom";
import LoginContextProvider from "./webpage/components/login/context/LoginContextProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    {/* 라우트 구조  */}
    <BrowserRouter>
      <Provider store={store}>
        <LoginContextProvider>
          <App />
        </LoginContextProvider>
      </Provider>
    </BrowserRouter>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
