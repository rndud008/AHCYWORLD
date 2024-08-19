import React, { useContext, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import "./Menu.css";
import axios from "axios";
import { HompyAction } from "../../../redux/actions/HompyAction";
import { useDispatch, useSelector } from "react-redux";
import {LoginContext} from "../../../webpage/components/login/context/LoginContextProvider"

const Menu = () => {
  const { hompyId } = useParams();
  const {hompyInfo} = useContext(LoginContext);
  const [menuColor, setMenuColor] = useState("#147DAF");
  const [textColor, setTextColor] = useState("#fff");
  const [borderColor, setBorderColor] = useState("#000000");
  const [menuStatus, setMenuStatus] = useState({
    photo: "visible",
    board: "visible",
    video: "visible",
    guestbook: "visible",
  });

  const dispatch = useDispatch();
  const hompy = useSelector((state) => state.hompy.hompy);

  // 메뉴 설정 가져오기
  useEffect(() => {
    axios
      .get(`http://localhost:8070/hompy/${hompyId}/menu-settings`)
      .then((response) => {
        setMenuColor(response.data.menuColor || "#FFFFFF");
        setTextColor(response.data.menuText || "#000000");
        setBorderColor(response.data.menuBorder || "#CCCCCC");

        if (response.data.menuStatus) {
          const statusArray = response.data.menuStatus.split(",");
          const statusObject = {
            photo: statusArray[0] || "visible",
            board: statusArray[1] || "visible",
            video: statusArray[2] || "visible",
            guestbook: statusArray[3] || "visible",
          };
          setMenuStatus(statusObject);
          dispatch(HompyAction.findByHompyIdAxios(hompyId));
        }
      })
      .catch((error) => {
        console.error("설정 불러오기 오류: ", error);
      });
  }, [hompyId, dispatch]);

  return (
    <>
      <nav className="menu-nav">
        <ul>
          <li>
            <NavLink
              to={`/hompy/${hompyId}`}
              end
              className={({ isActive }) => (isActive ? "menu-link selected" : "menu-link")}
              style={({ isActive }) => ({
                backgroundColor: isActive ? "#fff" : hompy.menuColor,
                color: isActive ? "#000000" : hompy.menuText,
                border: `2px solid ${hompy.menuBorder}`,
              })}
            >
              홈
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/hompy/${hompyId}/profile`}
              className={({ isActive }) => (isActive ? "menu-link selected" : "menu-link")}
              style={({ isActive }) => ({
                backgroundColor: isActive ? "#fff" : hompy.menuColor,
                color: isActive ? "#000000" : hompy.menuText,
                border: `2px solid ${hompy.menuBorder}`,
              })}
            >
              프로필
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/hompy/${hompyId}/diary`}
              className={({ isActive }) => (isActive ? "menu-link selected" : "menu-link")}
              style={({ isActive }) => ({
                backgroundColor: isActive ? "#fff" : hompy.menuColor,
                color: isActive ? "#000000" : hompy.menuText,
                border: `2px solid ${hompy.menuBorder}`,
              })}
            >
              다이어리
            </NavLink>
          </li>
          {hompy.menuStatus?.split(",")[0] === "visible" && (
            <li>
              <NavLink
                to={`/hompy/${hompyId}/${`photo`}`}
                className={({ isActive }) => (isActive ? "menu-link selected" : "menu-link")}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? "#fff" : hompy.menuColor,
                  color: isActive ? "#000000" : hompy.menuText,
                  border: `2px solid ${hompy.menuBorder}`,
                })}
              >
                사진첩
              </NavLink>
            </li>
          )}

          {hompy.menuStatus?.split(",")[1] === "visible" && (
            <li>
              <NavLink
                to={`/hompy/${hompyId}/${`board`}`}
                className={({ isActive }) => (isActive ? "menu-link selected" : "menu-link")}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? "#fff" : hompy.menuColor,
                  color: isActive ? "#000000" : hompy.menuText,
                  border: `2px solid ${hompy.menuBorder}`,
                })}
              >
                게시판
              </NavLink>
            </li>
          )}

          {hompy.menuStatus?.split(",")[2] === "visible" && (
            <li>
              <NavLink
                to={`/hompy/${hompyId}/${`video`}`}
                className={({ isActive }) => (isActive ? "menu-link selected" : "menu-link")}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? "#fff" : hompy.menuColor,
                  color: isActive ? "#000000" : hompy.menuText,
                  border: `2px solid ${hompy.menuBorder}`,
                })}
              >
                동영상
              </NavLink>
            </li>
          )}

          {hompy.menuStatus?.split(",")[3] === "visible" && (
            <li>
              <NavLink
                to={`/hompy/${hompyId}/guestbook`}
                className={({ isActive }) => (isActive ? "menu-link selected" : "menu-link")}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? "#fff" : hompy.menuColor,
                  color: isActive ? "#000000" : hompy.menuText,
                  border: `2px solid ${hompy.menuBorder}`,
                })}
              >
                방명록
              </NavLink>
            </li>
          )}
          {hompyInfo.id === parseInt(hompyId) &&
          
          <li>
            <NavLink
              to={`/hompy/${hompyId}/setting`}
              className={({ isActive }) => (isActive ? "menu-link selected" : "menu-link")}
              style={({ isActive }) => ({
                backgroundColor: isActive ? "#fff" : hompy.menuColor,
                color: isActive ? "#000000" : hompy.menuText,
                border: `2px solid ${hompy.menuBorder}`,
              })}
            >
              관리
            </NavLink>
          </li>
          }
        </ul>
      </nav>
      {/* <BgmPlayer /> */}
      {/* <Outlet /> */}
    </>
  );
};

export default Menu;
