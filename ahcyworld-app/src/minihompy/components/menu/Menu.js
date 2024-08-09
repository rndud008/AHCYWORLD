import React, { useContext } from 'react';
import { NavLink, Outlet, useParams } from 'react-router-dom';
import './Menu.css';
import { LoginContext } from '../../../webpage/login/context/LoginContextProvider';
import BgmPlayer from '../musicPlayer/BgmPlayer';

const Menu = () => {
  //
  // console.log("id:", userId);

  const {userInfo,hompyInfo} = useContext(LoginContext);

  const{hompyId} = useParams();
  return (
    <>
    <nav className="menu-nav">
      <ul>
        <li>
          <NavLink to={`/hompy/${hompyId}`} end className={({ isActive }) => isActive ? "menu-link selected" : "menu-link"}>
            홈
          </NavLink>
        </li>
        <li>
          <NavLink to={`/hompy/${hompyId}/profile`} className={({ isActive }) => isActive ? "menu-link selected" : "menu-link"}>
            프로필
          </NavLink>
        </li>
        <li>
          <NavLink to={`/hompy/${hompyId}/diary`} className={({ isActive }) => isActive ? "menu-link selected" : "menu-link"}>
            다이어리
          </NavLink>
        </li>
        <li>
          <NavLink to={`/hompy/${hompyId}/${`photo`}`} className={({ isActive }) => isActive ? "menu-link selected" : "menu-link"}>
            사진첩
          </NavLink>
        </li>
        <li>
          <NavLink to={`/hompy/${hompyId}/${`board`}`} className={({ isActive }) => isActive ? "menu-link selected" : "menu-link"}>
            게시판
          </NavLink>
        </li>
        <li>
          <NavLink to={`/hompy/${hompyId}/${`video`}`} className={({ isActive }) => isActive ? "menu-link selected" : "menu-link"}>
            동영상
          </NavLink>
        </li>
        <li>
          <NavLink to={`/hompy/${hompyId}/guestbook`} className={({ isActive }) => isActive ? "menu-link selected" : "menu-link"}>
            방명록
          </NavLink>
        </li>
        <li>
          <NavLink to={`/hompy/${hompyId}/${'setting'}`} className={({ isActive }) => isActive ? "menu-link selected" : "menu-link"}>
            관리
          </NavLink>
        </li>
      </ul>
    </nav>
    <BgmPlayer />
    <Outlet />
    </>
  );
};

export default Menu;
