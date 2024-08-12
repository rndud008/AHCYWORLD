import React, { useContext } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { Link, Outlet } from "react-router-dom";
import backgroundImg from "../../../upload/배경1.png";
import logo from "../../../upload/LOGO2.png";
import styled from "styled-components";
import "./Header.css";
import { LoginContext } from "../login/context/LoginContextProvider";
import SlideImg from "../slideImg/SlideImg";
import News from "../news/News";


const Header = () => {
    const { isLogin, logout, userInfo, hompyInfo } = useContext(LoginContext);
    // console.log("isLogin: ", isLogin);
    // console.log("logout: ", logout);
    // console.log("userInfo: ", userInfo);

    // console.log("hompyInfo", hompyInfo);
    // console.log("userInfo", userInfo);

    return (
        <>
            <div className="header-container">
                <div className='header-box'>
                    <div className='logo-box'>
                        <img src={logo} alt='Acyworld LOGO' />
                    </div>
                    <div className='search-select'>
                        <select>
                            <option>전체검색</option>
                            <option>사람검색</option>
                            <option>아이템검색</option>
                        </select>
                        <input />
                        <button className='search-btn'>검색</button>
                    </div>
                </div>

                <Nav className='navbar'>
                    <button>전체</button>
                    <button>배경음악</button>
                    <button>스킨</button>
                    <button>글꼴</button>
                    <button>미니미</button>
                    <button>미니룸</button>

                    {/* 로그인 여부에 따라 조건부 렌더링 */}
                    {/* {!isLogin ? (
                        <>
                            <Link className='nav-link' to='/login'>
                                로그인
                            </Link>
                            <Link className='nav-link' to='/join'>
                                회원가입
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to='/member'>Member</Link>
                            <Link to='/admin'>Admin</Link>
                            <Link to={`/post/${hompyInfo?.id}/board`}>Post</Link>
                            <Link to={`/hompy/${hompyInfo?.id}`}>미니홈피</Link>
                            <Link variant='primary' onClick={() => logout()}>
                                로그아웃
                            </Link>
                        </>
                    )} */}
                </Nav>
            </div>

            <Outlet />
        </>
    );
};

export default Header;
