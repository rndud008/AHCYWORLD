import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";
import "./LoginForm.css";
import { LoginContext } from "../context/LoginContextProvider";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import naver from "../../../../upload/네이버버튼.png";
import kakao from "../../../../upload/카카오버튼.png";

const LoginForm = () => {
    const { login } = useContext(LoginContext);
    const [rememberUserId, setRememberUserId] = useState(true);

    const onLogin = (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;
        const rememberId = e.target.rememberId.checked;

        // console.log(e.target.username.value);
        // console.log(e.target.password.value);
        // console.log(e.target.rememberId.checked);

        Cookies.set("rememberId", rememberId ? "true" : "false");

        login(username, password, rememberId); // 로그인 진행!
    };

    useEffect(() => {
        // 쿠키에 저장된 username(아이디) 가져오기
        const rememberId = Cookies.get("rememberId");
        // console.log(`쿠키 rememberId : ${rememberId}`);

        if (rememberId) {
            document.getElementById("username").value = rememberId;
        }
    }, []);

    const onNaverLogin = () => {
        window.location.href = "http://localhost:8070/oauth2/authorization/naver";
    };

    const onKakaoLogin = () => {
        window.location.href =
            "https://kauth.kakao.com/oauth/authorize?client_id=e6a276bbc03eba1dceba18ea7095056c&redirect_uri=http://localhost:8070/oauth2/kakao/callback&response_type=code";
    };

    return (
        <div className='login-container'>
            <form className='login-form' onSubmit={(e) => onLogin(e)}>
                <div className='input-box'>
                    <label htmlFor='name'>아이디</label>
                    <input
                        className='login-input'
                        id='username'
                        type='text'
                        placeholder='username'
                        name='username'
                        autoComplete='username'
                        required
                        defaultValue={rememberUserId ? Cookies.get("username") : ""}
                    />
                    <label htmlFor='password'>비밀번호 </label>
                    <input
                        className='login-input'
                        id='password'
                        type='password'
                        placeholder='password'
                        name='password'
                        autoComplete='current-password'
                        required
                    />
                </div>

                <div className='join-box'>
                    <div className='form-check'>
                        <label className='toggle-btn'>
                            <input
                                type='checkbox'
                                id='remember-id'
                                name='rememberId'
                                checked={rememberUserId}
                                onChange={() => setRememberUserId((prev) => !prev)}
                            />
                            )<span className='slider'></span>
                        </label>
                        <label htmlFor='remember-id' className='check-label'>
                            아이디 저장
                        </label>
                    </div>
                    <Link className='join-btn' to={"/join"}>
                        회원가입
                    </Link>
                </div>

                <div className='btn-box'>
                    <img src={naver} alt='' className='naver-btn' onClick={onNaverLogin} />
                    <img src={kakao} alt='' className='kakao-btn' onClick={onKakaoLogin} />
                    <button className='login-btn' value='Login' type='submit'>
                    로그인
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
