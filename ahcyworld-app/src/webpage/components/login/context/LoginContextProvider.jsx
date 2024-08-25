import Cookies from "js-cookie";
import React, { createContext, useEffect, useState } from "react";

import * as Swal from "../../../../apis/alert";
import * as auth from "../../../../apis/auth";

import { useNavigate } from "react-router-dom";
import api from "../../../../apis/api";
import { useDispatch } from "react-redux";
import { HompyAction } from "../../../../redux/actions/HompyAction";

export const LoginContext = createContext();
LoginContext.displayName = "LoginContextName";

const LoginContextProvider = ({ children }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem("userInfo")) || {});

    const [isLogin, setIsLogin] = useState(JSON.parse(localStorage.getItem("isLogin")) || false);

    const [roles, setRoles] = useState(
        JSON.parse(localStorage.getItem("roles")) || { isMember: false, isAdmin: false }
    );

    const [hompyInfo, setHompyInfo] = useState(JSON.parse(localStorage.getItem("hompyInfo")) || {});

    const loginCheck = async (isAuthPage = false) => {
        const accessToken = Cookies.get("accessToken");

        let response;
        let data;

        // JWT이 없으면
        if (!accessToken) {
            logoutSetting();
            if (!accessToken && isAuthPage) {
                // JWT이 없는데, 인증이 필요한 페이지라면? -> 로그인 페이지로 이동
                navigate("/login");
            }
            return;
        }

        // JWT이 있으면
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

        try {
            response = await auth.userInfo();

            // JWT 만료 또는 인증 실패 처리
            if (response.status === 401 || response.data === "UNAUTHORIZED") {
                console.log("JWT(accessToken)이 만료되었거나 인증에 실패했습니다.");
                logoutSetting();
                if (isAuthPage) navigate("/");
                return;
            }
        } catch (error) {
            return;
        }

        // 응답 실패시
        if (!response) return;

        data = response.data;

        // 인증 실패
        if (data === "UNAUTHORIZED" || response.status === 401) {
            return;
        }

        // 인증성공
        loginSetting(data, accessToken);
            data = response.data;
            loginSetting(data, accessToken);

        try {
            response = await auth.getHompyInfo();
            data = response.data;
            setHompyInfo(data);

            // dispatch(HompyAction.findByHompyIdAxios(data.id))
            
            localStorage.setItem("hompyInfo", JSON.stringify(data));
        } catch (error) {
            console.error("HompyInfo Error: ", error);
        }
    };

    useEffect(() => {
        loginCheck();
    }, []);

    const login = async (username, password, rememberId) => {
        // username 저장
        if (rememberId) Cookies.set("rememberId", username);
        else Cookies.remove("rememberId");

        try {
            const response = await auth.login(username, password);

            const { data, status, headers } = response;
            const authorization = headers.authorization;
            const accessToken = authorization.replace("Bearer ", "");

            if (status === 200) {
                Cookies.set("accessToken", accessToken);

                loginCheck();

                Swal.alert("로그인 성공", "메인화면으로 이동합니다.", "success", () => {
                    navigate("/");
                });
            }
        } catch (error) {
            Swal.alert("로그인 실패", "아이디 또는 비밀번호가 일치하지 않습니다.", "error");
            logoutSetting();
        }
    };

    const adminLogin = async (username, password, rememberId) => {
        // username 저장
        if (rememberId) Cookies.set("rememberId", username);
        else Cookies.remove("rememberId");

        try {
            const response = await auth.login(username, password);

            const { data, status, headers } = response;
            const authorization = headers.authorization;
            const accessToken = authorization.replace("Bearer ", "");

            if (status === 200) {
                Cookies.set("accessToken", accessToken);

                loginSetting(data, accessToken);

                Swal.alert("로그인 성공", "관리자페이지로 이동합니다.", "success", () => {
                    navigate("/admin");
                });
            }
        } catch (error) {
            Swal.alert("로그인 실패", "아이디 또는 비밀번호가 일치하지 않습니다.", "error");
            logoutSetting();
        }
    };

    const logout = (force = false) => {
        // confirm 없이 강제 로그아웃
        if (force) {
            logoutSetting();

            navigate("/");
            return;
        }

        Swal.confirm("로그아웃 하시겠습니까?", "로그아웃을 진행합니다.", "warning", (result) => {
            if (result.isConfirmed) {
                logoutSetting(); // 로그아웃 세팅
                navigate("/");
            }
        });
    };

    const adminLogout = (force = false) => {
        // confirm 없이 강제 로그아웃
        if (force) {
            logoutSetting();

            navigate("/admin/login");
            return;
        }

        Swal.confirm("로그아웃 하시겠습니까?", "로그아웃을 진행합니다.", "warning", (result) => {
            if (result.isConfirmed) {
                logoutSetting(); // 로그아웃 세팅
                navigate("/admin/login");
            }
        });
    };

    const loginSetting = (userData, accessToken) => {
        const { id, username, role, name, acorn } = userData;

        // JWT 토큰을 header에 저장
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

        // 로그인 여부
        setIsLogin(true);

        // 유저 정보 세팅
        setUserInfo({ id, username, role, name, acorn });

        const updatedUserInfo = { id, username, role, name, acorn };
        setUserInfo(updatedUserInfo);

        // 권한 정보 세팅
        const updatedRoles = { isMember: false, isAdmin: false };
        role.split(",").forEach((role) => {
            role === "ROLE_MEMBER" && (updatedRoles.isMember = true);
            role === "ROLE_ADMIN" && (updatedRoles.isAdmin = true);
        });
        setRoles(updatedRoles);

        localStorage.setItem("isLogin", "true");
        localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
        localStorage.setItem("roles", JSON.stringify(updatedRoles));
    };

    const logoutSetting = () => {
        setIsLogin(false);
        setUserInfo(null);
        setRoles(null);

        Cookies.remove("accessToken");

        api.defaults.headers.common.Authorization = undefined;

        localStorage.removeItem("isLogin");
        localStorage.removeItem("userInfo");
        localStorage.removeItem("roles");
        localStorage.removeItem("hompyInfo");
    };

    return (
        <LoginContext.Provider
            value={{
                isLogin,
                userInfo,
                setUserInfo,
                roles,
                hompyInfo,
                setHompyInfo,
                loginCheck,
                login,
                adminLogin,
                adminLogout,
                logout,
            }}
        >
            {children}
        </LoginContext.Provider>
    );
};

export default LoginContextProvider;
