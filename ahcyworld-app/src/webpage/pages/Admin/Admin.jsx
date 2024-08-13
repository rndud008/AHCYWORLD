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
import PostHistory from "./components/PostHistory";
import Items from "./components/Items";
import { FaUser } from "react-icons/fa";
import { RiGameLine } from "react-icons/ri";
import { BsPostcard } from "react-icons/bs";
import { GrHomeRounded } from "react-icons/gr";
import ItemUpload from "./components/ItemUpload";

const Admin = () => {
    const { isLogin, roles } = useContext(LoginContext);
    const navigate = useNavigate();
    const [openMenu, setOpenMenu] = useState(null);
    const [subMenu, setSubMenu] = useState(null);

    const toggleMenu = (menu) => {
        // console.log(menu);
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

    const handleSubMenuClick = (menu) => {
        setSubMenu(menu);
    };

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
                            <li onClick={() => navigate("/admin")}>
                                <GrHomeRounded />
                                &nbsp;메인
                            </li>
                            <br />
                            <li>
                                <div onClick={() => toggleMenu("userManagement")}>
                                    <FaUser />
                                    &nbsp;사용자관리
                                </div>
                                {openMenu === "userManagement" && (
                                    <ul>
                                        <li onClick={() => handleSubMenuClick("userList")}>사용자목록</li>
                                        <li onClick={() => handleSubMenuClick("paymentHistory")}>구매내역</li>
                                        <li onClick={() => handleSubMenuClick("statistics")}>통계</li>
                                    </ul>
                                )}
                            </li>
                            <li>
                                <div onClick={() => toggleMenu("itemManagement")}>
                                    <RiGameLine />
                                    &nbsp;아이템관리
                                </div>
                                {openMenu === "itemManagement" && (
                                    <ul>
                                        <li onClick={() => handleSubMenuClick("itemList")}>아이템리스트</li>
                                        <li onClick={() => handleSubMenuClick("itemUpload")}>아이템추가</li>
                                    </ul>
                                )}
                            </li>
                            <li>
                                <div onClick={() => toggleMenu("postManagement")}>
                                    <BsPostcard />
                                    &nbsp;게시물관리
                                </div>
                                {openMenu === "postManagement" && (
                                    <ul>
                                        <li onClick={() => handleSubMenuClick("post")}>게시글목록</li>
                                    </ul>
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
                <div className='main-container'>
                    <div className='headline'>헤드라인</div>
                    <div className='showbox'>
                        {subMenu === "userList" && <Users />}
                        {subMenu === "paymentHistory" && <PaymentHistory />}
                        {subMenu === "statistics" && (
                            <>
                                <UserStatistics />
                                <PaymentStatistics />
                            </>
                        )}
                        {subMenu === "itemList" && <Items />}
                        {subMenu === "itemUpload" && <ItemUpload />}
                        {subMenu === "post" && <PostHistory />}
                    </div>
                </div>
            </div>
            {/* )} */}
        </>
    );
};

export default Admin;
