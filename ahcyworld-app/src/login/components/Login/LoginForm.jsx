import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";
import { LoginContext } from "../../context/LoginContextProvider";
import "./LoginForm.css";

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

    return (
        <div className='form'>
            <h2 className='login-title'>AhcyWorld</h2>

            <form className='login-form' onSubmit={(e) => onLogin(e)}>
                <div>
                    <label htmlFor='name'>username</label>
                    <input
                        id='username'
                        type='text'
                        placeholder='username'
                        name='username'
                        autoComplete='username'
                        required
                        defaultValue={rememberUserId ? Cookies.get("username") : ""}
                    />
                </div>
                <div>
                    <label htmlFor='password'>password </label>
                    <input
                        id='password'
                        type='password'
                        placeholder='password'
                        name='password'
                        autoComplete='current-password'
                        required
                    />
                </div>
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

                <button className='btn-login' value='Login' type='submit'>
                    Login
                </button>
            </form>
        </div>
    );
};

export default LoginForm;
