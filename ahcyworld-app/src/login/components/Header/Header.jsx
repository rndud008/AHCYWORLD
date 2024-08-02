import React, { useContext } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { LoginContext } from "../../context/LoginContextProvider";

const Header = () => {
    const { isLogin, logout, userInfo } = useContext(LoginContext);
    // console.log("isLogin: ", isLogin);
    // console.log("logout: ", logout);
    // console.log("userInfo: ", userInfo);

    return (
        <>
            <Navbar bg='primary' data-bs-theme='dark'>
                <Navbar.Brand>
                    <Link className='nav-link' to='/'>
                        Home
                    </Link>
                </Navbar.Brand>
                <Nav className='me-auto'>
                    {/* 로그인 여부에 따라 조건부 렌더링 */}
                    {!isLogin ? (
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
                            <Link className='nav-link' to='/member'>
                                Member
                            </Link>
                            <Link className='nav-link' to='/admin'>
                                Admin
                            </Link>
                            <Button variant='primary' onClick={() => logout()}>
                                로그아웃
                            </Button>
                        </>
                    )}
                </Nav>
            </Navbar>
        </>
    );
};

export default Header;
