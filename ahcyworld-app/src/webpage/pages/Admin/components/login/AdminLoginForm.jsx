import React, { useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import "../../css/AdminLoginForm.css";
import * as Swal from "../../../../../apis/alert";

import { LoginContext } from "../../../../components/login/context/LoginContextProvider";
import { useNavigate } from "react-router-dom";

const AdminLoginForm = () => {
    const navigate = useNavigate();
    const { isLogin, adminLogin, roles } = useContext(LoginContext);
    const [rememberUserId, setRememberUserId] = useState(true);
    const [loading, setLoading] = useState(true); // 관리자 권한이 없는경우 로딩 상태체크를 위함

    const onLogin = async(e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;
        const rememberId = e.target.rememberId.checked;

        if (username !== "admin1") {
            Swal.alert("접근할 수 없는 아이디입니다.", "관리자 아이디로 로그인하세요.", "warning", () => {});
            return;
        }

        Cookies.set("rememberId", rememberId ? "true" : "false");

        await adminLogin(username, password, rememberId);
    };

    useEffect(() => {
        const rememberId = Cookies.get("rememberId");
        if (rememberId === "true") {
            const savedUsername = Cookies.get("username");
            if (savedUsername) {
                document.getElementById("username").value = savedUsername;
            }
        }
    }, []);

    useEffect(() => {
        const checkAccess = async () => {
            if (!isLogin) {
                setLoading(false);
                navigate("/admin/login");
                return;
            }
            // console.log(roles);
            if (!roles.isAdmin) {
                Swal.alert("접근권한이 없습니다.", "", "warning", () => {
                    navigate("/");
                });
                return;
            } else if (roles.isAdmin) {
                navigate("/admin");
            }
            setLoading(false);
        };
        checkAccess();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // 로딩 중 표시
    }

    return (
        <div className='admin-login-container'>
            <form className='admin-login-form' onSubmit={onLogin}>
                <h2 className='form-title'>관리자 로그인</h2>
                <div className='input-box'>
                    <label htmlFor='username'>아이디</label>
                    <input
                        className='admin-login-input'
                        id='username'
                        type='text'
                        placeholder='아이디를 입력하세요'
                        name='username'
                        autoComplete='username'
                        required
                    />
                    <label htmlFor='password'>비밀번호</label>
                    <input
                        className='admin-login-input'
                        id='password'
                        type='password'
                        placeholder='비밀번호를 입력하세요'
                        name='password'
                        autoComplete='current-password'
                        required
                    />
                </div>
                <div className='remember-me'>
                    <input
                        id='rememberId'
                        type='checkbox'
                        name='rememberId'
                        checked={rememberUserId}
                        onChange={(e) => setRememberUserId(e.target.checked)}
                    />
                    <label htmlFor='rememberId' className='check-label'>
                        아이디 저장
                    </label>
                </div>
                <button className='admin-login-btn' type='submit'>
                    로그인
                </button>
            </form>
        </div>
    );
};

export default AdminLoginForm;
