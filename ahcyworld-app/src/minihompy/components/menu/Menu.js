import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import './Menu.css';

const Menu = ({userId, hompyId}) => {
  // console.log("id:", userId);
  // console.log("hompyid:", hompyId);
  return (
    <nav className="menu-nav">
      <ul>
        <li>
          <NavLink to={`/hompy/${userId}`} className={({ isActive }) => isActive ? "menu-link selected" : "menu-link"}>
            홈
          </NavLink>
        </li>
        <li>
          <NavLink to={`/profile/${userId}`} className={({ isActive }) => isActive ? "menu-link selected" : "menu-link"}>
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
  );
};

export default Menu;
