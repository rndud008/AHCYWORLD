import logo from "./logo.svg";
import "./App.css";
import { Outlet, Route, Routes } from "react-router-dom";
import Header from "./webpage/components/Header/Header";
import Home from "./webpage/pages/Home";
import MiniHome from "./minihompy/pages/Home";
import Login from "./webpage/pages/Login";
import Join from "./webpage/pages/Join";
import Member from "./webpage/pages/Member";
import Admin from "./webpage/pages/Admin";
import Layout from "./minihompy/components/Layout/Layout";
import Menu from "./minihompy/components/menu/Menu";
import BgmPlayer from "./minihompy/components/musicPlayer/BgmPlayer";
import { useContext, useState } from "react";
import Profile from "./minihompy/pages/Profile";
import { LoginContext } from "./webpage/login/context/LoginContextProvider";

function App() {
  const [userId, setUserId] = useState(null);

  const { userInfo, hompyInfo } = useContext(LoginContext);
  console.log("userInfo: ", userInfo);
  console.log("hompyInfo: ", hompyInfo);

  return (
    <div>
      {/* 1. 웹페이지 해당 라우트 각 상위페이지 에서 <OUTLET/> 적용-> 자손들을 보여주는기능. */}
      <Routes>
        <Route path="/" element={<Header />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="join" element={<Join />} />
          <Route path="member" element={<Member />} />
          <Route path="admin" element={<Admin />} />
        </Route>
        {/* 2. 미니홈피 페이지 */}
        {hompyInfo && (
          <Route path="/hompy/:userId" element={<> <Menu userId={hompyInfo.id} /> </>}>
            <Route index element={<MiniHome setUserId={setUserId}/>}/>
            <Route path="profile" element={<Profile setUserId={setUserId} />}/>
          </Route>
        )}

        {/* 3. 어드민 페이지 */}
        <Route></Route>
      </Routes>
    </div>
  );
}

export default App;
