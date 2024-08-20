import React, { useContext, useEffect, useState } from "react";
import Nav from "react-bootstrap/Nav";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../../../upload/LOGO2.png";
import "./Header.css";
import { LoginContext } from "../login/context/LoginContextProvider";
import { useDispatch } from "react-redux";
import { SearchAction } from "../../../redux/actions/SearchAction";

const Header = ({ setItemKind }) => {
  const { isLogin, logout, userInfo, hompyInfo } = useContext(LoginContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const actionQuery = params.get("action");
  const searchQuery = params.get("search");

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

  useEffect(()=>{
    if(searchQuery && actionQuery){
      setSearchValue({
        action: actionQuery,
        search: searchQuery,
      })
    }else{
      setSearchValue({
        action: 'all',
        search: '',
      })
    }
  },[actionQuery,searchQuery])
  
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
      return false;
    }
    return true;
  };

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
