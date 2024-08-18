import React, { useContext, useState } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { Link, Outlet, useNavigate } from "react-router-dom";
import backgroundImg from "../../../upload/배경1.png";
import logo from "../../../upload/LOGO2.png";
import styled from "styled-components";
import "./Header.css";
import { LoginContext } from "../login/context/LoginContextProvider";
import SlideImg from "../slideImg/SlideImg";
import News from "../news/News";
import { BsSearch } from "react-icons/bs";
import api, { SERVER_HOST } from "../../../apis/api";
import { useDispatch } from "react-redux";
import { SearchAction } from "../../../redux/actions/SearchAction";

const Header = ({ setItemKind }) => {
  const { isLogin, logout, userInfo, hompyInfo } = useContext(LoginContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchValue, setSearchValue] = useState({
    action: "all",
    search: "",
  });

  const searchChangeValue = (e) => {
    const { name, value } = e.target;

    if (name.includes("search")) {
      setSearchValue({ ...searchValue, search: value });
    }

    if (name.includes("action")) {
      setSearchValue({ ...searchValue, action: value });
    }
  };

  const searchEnter = async (e) => {
    if (e.key === "Enter") {
      const valid = searchValidation();

      if (!valid) return;
      // console.log("엔터 쳤지롱");
      // console.log("엔터 check", searchValue);

      try {
        await dispatch(
          SearchAction.searchListAxios(searchValue.search, searchValue.action,navigate)
        );
      } catch (e) {
        // return alert(e);
        return alert(e.response.data);
      }
    }
  };
  
  const searchListAxios = async () => {
    try {
      await dispatch(
        SearchAction.searchListAxios(searchValue.search, searchValue.action,navigate)
      );
    } catch (e) {
      // return alert(e);
      return alert(e.response.data);
    }
  };

  const searchValidation = () => {
    if (!searchValue.search && searchValue.search.trim() === "") {
      // console.log("searchValidation");
      return false;
    }
    return true;
  };

  // console.log("check", searchValue);

  return (
    <>
      <div className="header-container">
        <div className="header-box">
          <div className="logo-container" onClick={() => navigate("/")}>
            <img src={logo} alt="Acyworld LOGO" />
          </div>
          <div className="search-select">
            <select name="action" value={searchValue.action} onChange={(e) => searchChangeValue(e)}>
              <option value={"all"}
              selected={searchValue.action.includes("all")}
              >
                전체검색
              </option>
              <option
                value={"people"}
                selected={searchValue.action.includes("people")}
              >
                사람검색
              </option>
              <option value={"item"}
              selected={searchValue.action.includes("item")}
              >
                아이템검색
              </option>
            </select>
            <input
              onKeyDown={searchEnter}
              name="search"
              value={searchValue.search}
              onChange={(e) => searchChangeValue(e)}
              type="text"
            />
            <button onClick={searchListAxios} className="search-btn">
              검색
            </button>
          </div>
        </div>

                <Nav className='navbar'>
                    <button
                        onClick={() => {
                            navigate("/item");
                            setItemKind("all");
                        }}
                    >
                        전체
                    </button>
                    <button
                        onClick={() => {
                            navigate("/item");
                            setItemKind("배경음악");
                        }}
                    >
                        배경음악
                    </button>
                    <button
                        onClick={() => {
                            navigate("/item");
                            setItemKind("글꼴");
                        }}
                    >
                        글꼴
                    </button>
                    <button
                        onClick={() => {
                            navigate("/item");
                            setItemKind("스킨");
                        }}
                    >
                        스킨
                    </button>
                    <button
                        onClick={() => {
                            navigate("/item");
                            setItemKind("미니미");
                        }}
                    >
                        미니미
                    </button>
                    <button
                        onClick={() => {
                            navigate("/item");
                            setItemKind("스토리룸");
                        }}
                    >
                        미니룸
                    </button>
                </Nav>
            </div>

            <Outlet />
        </>
    );
};

export default Header;
