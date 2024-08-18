import React, { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import * as Swal from "../../../apis/alert";
import Header from "../../components/Header/Header";
import "./css/Admin.css";
import logo from "../../../upload/LOGO2.png";
import Users from "./components/Users";
import PaymentHistory from "./components/PaymentHistory";
import PostHistory from "./components/PostHistory";
import Items from "./components/Items";
import { FaUser } from "react-icons/fa";
import { RiGameLine } from "react-icons/ri";
import { BsPostcard } from "react-icons/bs";
import { GrHomeRounded } from "react-icons/gr";
import ItemUpload from "./components/ItemUpload";
import { LoginContext } from "../../components/login/context/LoginContextProvider";
import AdminMain from "./components/AdminMain";

const Admin = () => {
    const { isLogin, roles, adminLogout } = useContext(LoginContext);
    const navigate = useNavigate();
    const [openMenu, setOpenMenu] = useState(() => {
        return localStorage.getItem("openMenu" || null);
    });
    const [subMenu, setSubMenu] = useState(() => {
        return localStorage.getItem("subMenu" || null);
    });
    const [loading, setLoading] = useState(true); // 관리자 권한이 없는경우 로딩 상태체크를 위함

    const toggleMenu = (menu) => {
        // console.log(menu);
        setOpenMenu(openMenu === menu ? null : menu);
    };

    const setHeadLine = () => {
        switch (subMenu) {
            case "main":
                return "메인";
            case "userList":
                return "사용자 목록";
            case "paymentHistory":
                return "구매 내역";
            case "itemList":
                return "아이템 목록";
            case "itemUpload":
                return "아이템 추가";
            case "post":
                return "게시글 목록";
            default:
                return "관리자페이지";
        }
    };

    useEffect(() => {
        const checkAccess = async () => {
            if (!isLogin) {
                Swal.alert("로그인이 필요합니다.", "로그인 화면으로 이동합니다.", "warning", () => {
                    navigate("/admin/login");
                });
                return;
            }
            // console.log(roles);
            if (!roles.isAdmin) {
                Swal.alert("접근권한이 없습니다.", "메인 화면으로 이동합니다.", "warning", () => {
                    navigate("/");
                });
                return;
            }
            setLoading(false); // 권한이 없으면 로딩 상태 해제
        };
        checkAccess();
        setSubMenu("main");
    }, [roles, navigate]);

    useEffect(() => {
        localStorage.setItem("openMenu", openMenu);
        localStorage.setItem("subMenu", subMenu);
    }, [openMenu, subMenu]);

    if (loading) {
        return <div>Loading...</div>; // 로딩 중 표시
    }

    const handleSubMenuClick = (menu) => {
        if (menu === "main") {
            setOpenMenu(null);
        }
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
                        <button onClick={() => adminLogout()} className='admin-logout'>
                            로그아웃
                        </button>
                        <ul>
                            <li onClick={() => handleSubMenuClick("main")}>
                                <GrHomeRounded />
                                &nbsp; 메인
                            </li>
                            <li>
                                <div onClick={() => toggleMenu("userManagement")}>
                                    <FaUser />
                                    &nbsp; 사용자관리
                                </div>
                                {openMenu === "userManagement" && (
                                    <ul>
                                        <li onClick={() => handleSubMenuClick("userList")}>&nbsp;&nbsp; 사용자목록</li>
                                        <li onClick={() => handleSubMenuClick("paymentHistory")}>
                                            &nbsp;&nbsp; 구매내역
                                        </li>
                                    </ul>
                                )}
                            </li>
                            <li>
                                <div onClick={() => toggleMenu("itemManagement")}>
                                    <RiGameLine />
                                    &nbsp; 아이템관리
                                </div>
                                {openMenu === "itemManagement" && (
                                    <ul>
                                        <li onClick={() => handleSubMenuClick("itemList")}>
                                            &nbsp;&nbsp; 아이템목록
                                        </li>
                                        <li onClick={() => handleSubMenuClick("itemUpload")}>
                                            &nbsp;&nbsp; 아이템추가
                                        </li>
                                    </ul>
                                )}
                            </li>
                            <li>
                                <div onClick={() => toggleMenu("postManagement")}>
                                    <BsPostcard />
                                    &nbsp; 게시물관리
                                </div>
                                {openMenu === "postManagement" && (
                                    <ul>
                                        <li onClick={() => handleSubMenuClick("post")}>&nbsp;&nbsp; 게시글목록</li>
                                    </ul>
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
                <div className='main-container'>
                    <div className='headline'>{setHeadLine()}</div>
                    <div className='showbox'>
                        {subMenu === "main" && <AdminMain />}
                        {subMenu === "userList" && <Users />}
                        {subMenu === "paymentHistory" && <PaymentHistory />}
                        {subMenu === "itemList" && <Items />}
                        {subMenu === "itemUpload" && <ItemUpload setSubMenu={setSubMenu} />}
                        {subMenu === "post" && <PostHistory />}
                    </div>
                </div>
            </div>
            {/* )} */}
        </>
    );
};

export default Admin;
