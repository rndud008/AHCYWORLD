import Cookies from "js-cookie";
import React, { createContext, useEffect, useState } from "react";

import * as Swal from "../../../../apis/alert";
import * as auth from "../../../../apis/auth";

import { useNavigate } from "react-router-dom";
import api from "../../../../apis/api";

export const LoginContext = createContext();
LoginContext.displayName = "LoginContextName";

const LoginContextProvider = ({ children }) => {
    const navigate = useNavigate();

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
            // console.log("쿠키에 JWT(accessToken)이 없습니다.");
            logoutSetting();
            return;
        }

        // JWT이 없는데, 인증이 필요한 페이지라면? -> 로그인 페이지로 이동
        if (!accessToken && isAuthPage) {
            navigate("/login");
        }

        // JWT이 있으면
        // console.log("쿠키에 JWT(accessToken)이 저장되어 있습니다.");
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

        try {
            response = await auth.userInfo();
        } catch (error) {
            // console.log(`error: ${error}`);
            // console.log(`status: ${response.status}`);
            return;
        }

        // 응답 실패시
        if (!response) return;

        // console.log("JWT (accessToken)으로 사용자 인증 정보 요청 성공");

        data = response.data;
        // console.log(`data: ${data}`);

        // 인증 실패
        if (data === "UNAUTHORIZED" || response.status === 401) {
            // console.log("JWT(accessToken)이 만료되었거나 인증에 실패했습니다.");
            return;
        }

        // 인증성공
        loginSetting(data, accessToken);

        try {
            response = await auth.hompyInfo();
            data = response.data;

            setHompyInfo(data);
            localStorage.setItem("hompyInfo", JSON.stringify(data));
        } catch (error) {
            console.error("HompyInfo Error: ", error);
        }
    };

    useEffect(() => {
        loginCheck();
    }, [userInfo]);

    const login = async (username, password, rememberId) => {
        // console.log(`
        //     로그인 요청
        //     login(username:${username}, password:${password}, rememberId:${rememberId});
        //     `);

        // username 저장
        if (rememberId) Cookies.set("rememberId", username);
        else Cookies.remove("rememberId");

        try {
            const response = await auth.login(username, password);

            const { data, status, headers } = response;
            const authorization = headers.authorization;
            const accessToken = authorization.replace("Bearer ", "");

            // console.log(`
            //     -- login 요청응답 --
            //       data : ${data}
            //       status : ${status}
            //       headers : ${headers}
            //       jwt : ${accessToken}
            //     `);

            if (status === 200) {
                Cookies.set("accessToken", accessToken);

                loginCheck();

                Swal.alert("로그인 성공", "메인화면으로 이동합니다.", "success", () => {
                    navigate("/");
                });
            }
        } catch (error) {
            // console.log(`로그인 error: ${error}`);
            Swal.alert("로그인 실패", "아이디 또는 비밀번호가 일치하지 않습니다.", "error");
            logoutSetting();
        }
    };

    const adminLogin = async (username, password, rememberId) => {
        // console.log(`
        //     로그인 요청
        //     login(username:${username}, password:${password}, rememberId:${rememberId});
        //     `);

        // username 저장
        if (rememberId) Cookies.set("rememberId", username);
        else Cookies.remove("rememberId");

        try {
            const response = await auth.login(username, password);

            const { data, status, headers } = response;
            const authorization = headers.authorization;
            const accessToken = authorization.replace("Bearer ", "");

            // console.log(`
            //     -- login 요청응답 --
            //       data : ${data}
            //       status : ${status}
            //       headers : ${headers}
            //       jwt : ${accessToken}
            //     `);

            if (status === 200) {
                Cookies.set("accessToken", accessToken);

                loginCheck();

                Swal.alert("로그인 성공", "관리자페이지로 이동합니다.", "success", () => {
                    navigate("/admin");
                });
            }
        } catch (error) {
            // console.log(`로그인 error: ${error}`);
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
        // console.log("userdata: ", userData);

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
        // console.log("updatedRoles: ", updatedRoles);
        setRoles(updatedRoles);

        // console.log("유저 정보: ", updatedUserInfo);

        localStorage.setItem("isLogin", "true");
        localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
        localStorage.setItem("roles", JSON.stringify(updatedRoles));
    };

    const logoutSetting = () => {
        setIsLogin(false);
        setUserInfo(null);
        setRoles(null);

        Cookies.remove("accessToken");
        // Cookies.remove("rememberId");

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
                roles,
                hompyInfo,
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
