import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import AppLogin from "./webpage/login/AppLogin";
import "bootstrap/dist/css/bootstrap.min.css";

import { Provider } from "react-redux";
import store from "./redux/store";
import Apphompy from "./minihompy/Apphompy";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <Provider store={store}>
        {/* 라우트 구조  */}
        {/* <BrowserRouter>
        <LoginContextProvider>
        <Routes>
        1. 웹페이지 해당 라우트 각 상위페이지 에서 <OUTLET/> 적용-> 자손들을 보여주는기능.
            <Route path='/' element={<Header />}>
              <Route index element={<Home />} />
              <Route path='login' element={<Login />} />
              <Route path='join' element={<Join />} />
              <Route path='member' element={<Member />} />
              <Route path='admin' element={<Admin />} />
            </Route>
        2. 미니홈피 페이지
            <Route path='/hompy' element={<Layout/>}>
              <Route index element={<Menu userId={userId} /> <BgmPlayer />}>
              <Route path=':userId' element={<Menu userId={userId} /> <BgmPlayer /> <Home setUserId={setUserId} />} />
              <Route path='profile' element={<Menu userId={userId} /> <BgmPlayer /> <Profile />} />
            </Route>
            <Route>
                3. 어드민 페이지
            </Route>
        </Routes>
        </LoginContextProvider>
        </BrowserRouter> */}
      {/* <React.StrictMode> */}
      {/* <MusicApi /> */} {/* 혹시 노래데이터 받을 때 필요! */}
      <AppLogin />
      <Apphompy />
      {/* <AhcyworldApp /> */}
      {/* <AppGuestBook /> */}
      {/* </React.StrictMode> */}
    </Provider>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
