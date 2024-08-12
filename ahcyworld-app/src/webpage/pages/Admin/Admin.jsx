import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Swal from "../../../apis/alert";
import Header from "../../components/Header/Header";
import { LoginContext } from "../../components/login/context/LoginContextProvider";
import "./css/Admin.css";
import logo from "../../../upload/LOGO2.png";
import Users from "./components/Users";
import PaymentHistory from "./components/PaymentHistory";
import UserStatistics from "./components/UserStatistics";
import PaymentStatistics from "./components/PaymentStatistics";

const Admin = () => {
    const { isLogin, roles } = useContext(LoginContext);
    const navigate = useNavigate();
    const [openMenu, setOpenMenu] = useState(null);

    const toggleMenu = (menu) => {
        setOpenMenu(openMenu === menu ? null : menu);
    };

    useEffect(() => {
        // if (!isLogin) {
        //     Swal.alert("로그인이 필요합니다.", "로그인 화면으로 이동합니다.", "warning", () => {
        //         navigate("/");
        //     });
        //     return;
        // }
        // // console.log(roles);
        // if (!roles.isAdmin) {
        //     Swal.alert("권한이 없습니다.", "이전 화면으로 이동합니다.", "warning", () => {
        //         navigate(-1);
        //     });
        //     return;
        // }
        // console.log(roles);
    }, []);

    return (
        <>
            {/* {isLogin && roles.isAdmin && ( */}
            <div className='admin-container'>
                <div className='menu-container'>
                    <div className='logo-box'>
                        <img
                            src={logo}
                            onClick={() => {
                                navigate("/");
                            }}
                            alt=''
                        />
                    </div>
                    <div className='menu-box'>
                        <ul>
                            <li onClick={() => navigate("/admin")}>▶ 메인</li>
                            <li>
                                <div onClick={() => toggleMenu("userManagement")}>▶ 사용자관리</div>
                                {openMenu === "userManagement" && (
                                    <ul>
                                        <li>사용자목록</li>
                                        <li>구매내역</li>
                                        <li>통계</li>
                                    </ul>
                                )}
                            </li>
                            <li>
                                <div onClick={() => toggleMenu("itemManagement")}>▶ 아이템관리</div>
                                {openMenu === "itemManagement" && (
                                    <ul>
                                        <li>아이템리스트</li>
                                        <li>아이템추가</li>
                                    </ul>
                                )}
                            </li>
                            <li>
                                <div onClick={() => toggleMenu("postManagement")}>▶ 게시물관리</div>
                                {openMenu === "postManagement" && (
                                    <ul>
                                        <li>게시글</li>
                                        <li>게시물</li>
                                    </ul>
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
                <div className='main-container'>
                    <div className='headline'>헤드라인</div>
                    <div className='showbox'>
                        {/* <Users /> */}
                        {/* <PaymentHistory/> */}
                        <UserStatistics />
                        <PaymentStatistics/>
                    </div>
                </div>
            </div>
            {/* )} */}
        </>
    );
};

export default Admin;
