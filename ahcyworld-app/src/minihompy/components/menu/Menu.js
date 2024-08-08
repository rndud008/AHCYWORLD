import React, { useContext } from 'react';
import { NavLink, Outlet, useParams } from 'react-router-dom';
import './Menu.css';
import { LoginContext } from '../../../webpage/login/context/LoginContextProvider';
import BgmPlayer from '../musicPlayer/BgmPlayer';

const Menu = ({userId}) => {
  //
  // console.log("id:", userId);

  const {userInfo,hompyInfo} = useContext(LoginContext);
  return (
    <>
    <nav className="menu-nav">
      <ul>
        <li>
          <NavLink to={`/hompy/${userId}`} className={({ isActive }) => isActive ? "menu-link selected" : "menu-link"}>
            홈
          </NavLink>
        </li>
        <li>
          <NavLink to={`/hompy/${userId}/${'profile'}`} className={({ isActive }) => isActive ? "menu-link selected" : "menu-link"}>
            프로필
          </NavLink>
        </li>
        <li>
          <NavLink to="/diary" className={({ isActive }) => isActive ? "menu-link selected" : "menu-link"}>
            다이어리
          </NavLink>
        </li>
        <li>
          <NavLink to="/photo" className={({ isActive }) => isActive ? "menu-link selected" : "menu-link"}>
            사진첩
          </NavLink>
        </li>
        <li>
          <NavLink to="/board" className={({ isActive }) => isActive ? "menu-link selected" : "menu-link"}>
            게시판
          </NavLink>
        </li>
        <li>
          <NavLink to="/video" className={({ isActive }) => isActive ? "menu-link selected" : "menu-link"}>
            동영상
          </NavLink>
        </li>
        <li>
          <NavLink to={`/guestbook/${hompyId}`} className={({ isActive }) => isActive ? "menu-link selected" : "menu-link"}>
            방명록
          </NavLink>
        </li>
        <li>
          <NavLink exact to="/manager" className={({ isActive }) => isActive ? "menu-link selected" : "menu-link"}>
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
