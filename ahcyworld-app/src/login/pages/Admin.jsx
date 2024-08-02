import React, { useContext, useEffect } from "react";
import { LoginContext } from "../context/LoginContextProvider";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../components/Header/Header";

const Admin = () => {
    const { isLogin, roles } = useContext(LoginContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLogin) {
            Swal.alert("로그인이 필요합니다.", "로그인 화면으로 이동합니다.", "warning", () => {
                navigate("/login");
            });
            return;
        }
        console.log(roles);
        if (!roles.isAdmin) {
            Swal.alert("권한이 없습니다.", "이전 화면으로 이동합니다.", "warning", () => {
                navigate(-1);
            });
            return;
        }
        console.log(roles);
    }, []);

    return (
        <>
            {isLogin && roles.isAdmin && (
                <>
                    <Header />
                    <h1>Admin</h1>
                </>
            )}
        </>
    );
};

export default Admin;
